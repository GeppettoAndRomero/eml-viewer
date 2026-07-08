import { type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

function fixtureB64(name: string): string {
  return readFileSync(fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url))).toString(
    'base64'
  );
}

export const PLAIN_B64 = fixtureB64('plain.eml');
export const HTML_REMOTE_IMAGE_B64 = fixtureB64('html-remote-image.eml');
export const JAPANESE_B64 = fixtureB64('japanese.eml');
export const XSS_B64 = fixtureB64('xss.eml');
export const ATTACHMENT_B64 = fixtureB64('attachment.eml');

/** Wait until the island has hydrated and is ready to receive files. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/** Feed a base64-encoded file through the same drop-zone path the UI uses. */
export async function dropFile(page: Page, opts: { b64: string; name: string; type?: string }) {
  await page.evaluate(({ b64, name, type }) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const file = new File([bytes], name, { type: type ?? 'message/rfc822' });
    window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
  }, opts);
}

/** Open a bundled fixture by base64 content and wait until the subject line renders. */
export async function openEml(page: Page, b64: string, name: string) {
  await dropFile(page, { b64, name });
  await page.getByTestId('eml-subject').waitFor();
}

/** Open the plain-text sample and wait for it to render — the smoke-test fixture. */
export async function openSampleEml(page: Page) {
  await openEml(page, PLAIN_B64, 'plain.eml');
}
