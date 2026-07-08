/**
 * Parse a .eml (RFC 822 / MIME) file into a display-ready message, in the browser.
 *
 * postal-mime (MIT-0) does the actual RFC 822 parsing, including MIME encoded-word
 * headers (`=?ISO-2022-JP?B?...?=`) and per-part charset decoding — both rely on the
 * browser's native `TextDecoder`, which implements the WHATWG Encoding Standard and
 * therefore understands legacy Japanese charsets (Shift_JIS, ISO-2022-JP, EUC-JP)
 * natively. No bundled charset table is needed (same mechanism this codebase already
 * uses in zip-filename-fix's `new TextDecoder('shift-jis')`).
 *
 * The HTML body is untrusted (it is someone else's email). It is sanitized with
 * DOMPurify and, on top of that, every `src`/`srcset`/`background`/`style: url(...)`
 * that does not resolve to a `data:` URI or a same-message `cid:` reference is
 * stripped outright — not just left for the sandboxed iframe/CSP to catch. After
 * sanitization the returned HTML string contains no remote URL at all, so there is
 * nothing left for a renderer to fetch (this is what makes the "tracking pixels are
 * blocked" claim structural rather than a promise). Inline images referenced by
 * `cid:` are resolved to `data:` URIs (not `blob:`): the HTML is rendered inside a
 * sandboxed iframe with neither `allow-scripts` nor `allow-same-origin`, which gives
 * the frame an opaque origin — an opaque origin cannot resolve a `blob:` URL minted
 * by the parent page, but a `data:` URI is self-contained and always resolves.
 */

import type { Address, Email as ParsedEmail } from 'postal-mime';
import { AppError } from './appError';

// postal-mime and DOMPurify are only needed once a file is actually opened, so they
// are dynamically imported (kept in their own build chunk — see astro.config.mjs —
// off the tool's initial page-load path) rather than imported at module scope.
async function loadPostalMime() {
  return (await import('postal-mime')).default;
}
async function loadDOMPurify() {
  return (await import('dompurify')).default;
}

export interface EmlAddress {
  name: string;
  address: string;
}

export interface EmlAttachment {
  filename: string;
  mimeType: string;
  size: number;
  /** Normalized (no angle brackets) Content-ID, when the part carries one. */
  contentId: string | null;
  blob: Blob;
}

export interface EmlMessage {
  from: EmlAddress | null;
  to: EmlAddress[];
  cc: EmlAddress[];
  subject: string;
  /** ISO-8601 when the Date header parsed cleanly; the raw header value otherwise. */
  date: string | null;
  /** Sanitized HTML, safe to hand to a sandboxed iframe's `srcdoc`. */
  htmlBody: string | null;
  /** Raw plain-text body (render with `white-space: pre-wrap`, not as HTML). */
  textBody: string | null;
  attachments: EmlAttachment[];
}

function normalizeCid(raw: string): string {
  return raw.trim().replace(/^</, '').replace(/>$/, '');
}

function toUint8(content: ArrayBuffer | Uint8Array | string): Uint8Array {
  if (typeof content === 'string') return new TextEncoder().encode(content);
  if (content instanceof Uint8Array) return content;
  return new Uint8Array(content);
}

/** Chunked base64 encode — avoids a call-stack overflow from spreading huge arrays. */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

function flattenAddresses(input: Address | Address[] | undefined): EmlAddress[] {
  if (!input) return [];
  const list = Array.isArray(input) ? input : [input];
  const out: EmlAddress[] = [];
  for (const a of list) {
    if ('group' in a && a.group) {
      for (const m of a.group) out.push({ name: m.name || '', address: m.address || '' });
    } else if ('address' in a && a.address) {
      out.push({ name: a.name || '', address: a.address });
    }
  }
  return out;
}

/**
 * Resolve one URL-bearing value to something safe to keep, or null to strip it.
 * `data:` is passed through unchanged; `cid:` is resolved against this message's
 * own inline attachments; everything else (http(s), protocol-relative `//`, ftp,
 * unknown schemes) is remote or unverifiable and is dropped.
 */
function resolveUrl(raw: string, cidDataUris: Map<string, string>): string | null {
  const value = raw.trim();
  if (!value) return null;
  if (/^data:/i.test(value)) return value;
  const cidMatch = /^cid:(.+)$/i.exec(value);
  if (cidMatch) return cidDataUris.get(normalizeCid(cidMatch[1])) ?? null;
  return null;
}

/** Same policy as resolveUrl, applied to each candidate in a `srcset` list. */
function resolveSrcset(raw: string, cidDataUris: Map<string, string>): string | null {
  const parts = raw
    .split(',')
    .map((entry) => {
      const trimmed = entry.trim();
      if (!trimmed) return null;
      const spaceIdx = trimmed.search(/\s/);
      const url = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
      const descriptor = spaceIdx === -1 ? '' : trimmed.slice(spaceIdx + 1).trim();
      const resolved = resolveUrl(url, cidDataUris);
      return resolved ? (descriptor ? `${resolved} ${descriptor}` : resolved) : null;
    })
    .filter((x): x is string => !!x);
  return parts.length ? parts.join(', ') : null;
}

const STYLE_URL = /url\(\s*(['"]?)([\s\S]*?)\1\s*\)/gi;

function rewriteUrlAttr(el: Element, attr: string, cidDataUris: Map<string, string>): void {
  const raw = el.getAttribute(attr);
  if (raw == null) return;
  const resolved = resolveUrl(raw, cidDataUris);
  if (resolved) el.setAttribute(attr, resolved);
  else el.removeAttribute(attr);
}

function rewriteSrcsetAttr(el: Element, cidDataUris: Map<string, string>): void {
  const raw = el.getAttribute('srcset');
  if (raw == null) return;
  const resolved = resolveSrcset(raw, cidDataUris);
  if (resolved) el.setAttribute('srcset', resolved);
  else el.removeAttribute('srcset');
}

function rewriteStyleAttr(el: Element, cidDataUris: Map<string, string>): void {
  const raw = el.getAttribute('style');
  if (raw == null) return;
  el.setAttribute(
    'style',
    raw.replace(STYLE_URL, (_m, q: string, url: string) => {
      const resolved = resolveUrl(url, cidDataUris);
      return resolved ? `url(${q}${resolved}${q})` : 'none';
    })
  );
}

/**
 * Sanitize an email's HTML body.
 *
 * Every remote-content reference (`src`/`srcset`/`poster`/`background`, and
 * `url(...)` inside a `style` attribute) is resolved-or-stripped OURSELVES, on a
 * scratch DOM, before DOMPurify ever sees the markup. This is deliberate: a
 * DOMPurify `uponSanitizeAttribute` hook can only validate-or-discard the attribute
 * it is given — writing a hook-modified *value* back onto the node requires that
 * value to independently pass DOMPurify's own URI-scheme check afterwards, and
 * `forceKeepAttr` keeps the attribute's ORIGINAL value, not the hook's rewritten one
 * (confirmed against DOMPurify's source; an earlier version of this function relied
 * on `forceKeepAttr` and silently left `cid:` references unresolved). Rewriting
 * `cid:` → `data:` ourselves first sidesteps that: by the time DOMPurify runs, every
 * surviving `src`/`srcset` is already a `data:` URI, which DOMPurify allows natively
 * for image elements. `<style>`/`<link>` are dropped entirely (FORBID_TAGS) rather
 * than sanitized: real HTML email overwhelmingly uses inline `style="..."` for
 * client compatibility, so this loses little and removes a whole class of CSS-based
 * remote-content tricks (`@import`, class-selector backgrounds).
 */
async function sanitizeEmailHtml(html: string, cidDataUris: Map<string, string>): Promise<string> {
  const DOMPurify = await loadDOMPurify();

  const doc = new DOMParser().parseFromString(html, 'text/html');
  for (const el of doc.querySelectorAll('[src]')) rewriteUrlAttr(el, 'src', cidDataUris);
  for (const el of doc.querySelectorAll('[poster]')) rewriteUrlAttr(el, 'poster', cidDataUris);
  for (const el of doc.querySelectorAll('[background]')) rewriteUrlAttr(el, 'background', cidDataUris);
  for (const el of doc.querySelectorAll('[srcset]')) rewriteSrcsetAttr(el, cidDataUris);
  for (const el of doc.querySelectorAll('[style]')) rewriteStyleAttr(el, cidDataUris);
  const preprocessed = doc.body.innerHTML;

  const anchorHook = (node: Element) => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      // Untrusted HTML rendered in a sandboxed iframe with `allow-popups`: links still
      // need to open as a normal (unsandboxed) new tab rather than navigate the frame.
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  };

  DOMPurify.addHook('afterSanitizeAttributes', anchorHook);
  try {
    return DOMPurify.sanitize(preprocessed, {
      FORBID_TAGS: ['style', 'link', 'base', 'iframe', 'object', 'embed', 'form', 'meta', 'script', 'title'],
      FORBID_ATTR: ['action', 'formaction'],
    });
  } finally {
    DOMPurify.removeHook('afterSanitizeAttributes');
  }
}

/** Parse a .eml file. Throws AppError on any failure (never a raw/English message). */
export async function parseEmlFile(file: File): Promise<EmlMessage> {
  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    throw new AppError('errUnreadable', { name: file.name });
  }
  if (buffer.byteLength === 0) {
    throw new AppError('errEmpty', { name: file.name });
  }

  let parsed: ParsedEmail;
  try {
    const PostalMime = await loadPostalMime();
    parsed = await new PostalMime().parse(buffer);
  } catch {
    throw new AppError('errParse', { name: file.name });
  }

  const attachments: EmlAttachment[] = [];
  const cidDataUris = new Map<string, string>();

  for (const raw of parsed.attachments) {
    const bytes = toUint8(raw.content);
    const mimeType = raw.mimeType || 'application/octet-stream';
    const blob = new Blob([bytes as BlobPart], { type: mimeType });
    const contentId = raw.contentId ? normalizeCid(raw.contentId) : null;
    if (contentId) {
      cidDataUris.set(contentId, `data:${mimeType};base64,${bytesToBase64(bytes)}`);
    }
    attachments.push({
      filename: raw.filename || 'attachment',
      mimeType,
      size: blob.size,
      contentId,
      blob,
    });
  }

  const htmlBody = parsed.html ? await sanitizeEmailHtml(parsed.html, cidDataUris) : null;

  return {
    from: flattenAddresses(parsed.from)[0] ?? null,
    to: flattenAddresses(parsed.to),
    cc: flattenAddresses(parsed.cc),
    subject: parsed.subject || '',
    date: parsed.date ?? null,
    htmlBody,
    textBody: parsed.text ?? null,
    attachments,
  };
}

/** Trigger a browser download of an attachment's Blob under its own file name. */
export function downloadAttachment(att: EmlAttachment): void {
  const url = URL.createObjectURL(att.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = att.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
