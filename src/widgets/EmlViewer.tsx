/**
 * EmlViewer — the tool's only non-frozen widget.
 *
 * Opens a .eml file chosen from the picker or dropped anywhere on the page (via the
 * frozen GlobalDropZone's `filesDropped` CustomEvent<File[]>), parses it with
 * `emlEngine`, and displays headers, body and attachments. Everything runs in the
 * browser. The HTML body — sanitized by emlEngine — is rendered inside a sandboxed
 * `<iframe srcdoc>` with neither `allow-scripts` nor `allow-same-origin`, so even a
 * sanitizer bypass could not execute script or reach this page. `allow-popups` (only)
 * is set so a normal link in the message can still open as an ordinary new tab.
 *
 * The island receives `locale` as a prop (present during SSR) and reads all strings
 * from the i18n table, so SSR and client render identically.
 */

import { useState, useEffect, useCallback, useMemo } from 'preact/hooks';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { ui } from '@/i18n/ui';
import { validateFile } from '@/utils/fileValidation';
import { parseEmlFile, downloadAttachment, type EmlMessage, type EmlAddress, type EmlAttachment } from '@/utils/emlEngine';
import { resolveErrorMessage } from '@/utils/appError';

type ErrorCode = 'wrongType' | 'other';
type ViewMode = 'html' | 'text';

interface EmlViewerProps {
  locale?: string;
}

function humanSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatAddress(a: EmlAddress | null | undefined): string {
  if (!a || (!a.name && !a.address)) return '';
  return a.name ? `${a.name} <${a.address}>` : a.address;
}

const INTL_LOCALE: Record<string, string> = { zh: 'zh-Hans' };

function formatDate(date: string | null, locale: string): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date; // not parseable — show the raw header value, not nothing
  try {
    return new Intl.DateTimeFormat(INTL_LOCALE[locale] ?? locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

export function EmlViewer({ locale = 'en' }: EmlViewerProps) {
  const t = (ui as any)[locale] ?? ui.en;

  const [fileName, setFileName] = useState<string | null>(null);
  const [message, setMessage] = useState<EmlMessage | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('html');
  const [busy, setBusy] = useState(false);
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null);
  const [errorText, setErrorText] = useState<string>('');

  const finish = useCallback(() => {
    window.dispatchEvent(new CustomEvent('filesProcessed'));
  }, []);

  const reset = useCallback(() => {
    setFileName(null);
    setMessage(null);
    setErrorCode(null);
    setErrorText('');
    const input = document.getElementById('eml-file-input') as HTMLInputElement | null;
    if (input) input.value = '';
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const validation = validateFile(file);
      if (!validation.valid) {
        setMessage(null);
        setErrorCode('wrongType');
        setErrorText(t.errWrongType.replace('{name}', file.name));
        return;
      }
      setBusy(true);
      setErrorCode(null);
      try {
        const parsed = await parseEmlFile(file);
        setMessage(parsed);
        setFileName(file.name);
        setViewMode(parsed.htmlBody ? 'html' : 'text');
      } catch (error) {
        setMessage(null);
        setErrorCode('other');
        setErrorText(resolveErrorMessage(error, t));
      } finally {
        setBusy(false);
      }
    },
    [t]
  );

  const handleFiles = useCallback(
    async (files: File[]) => {
      // A viewer shows one message; take the first if several are dropped.
      if (files.length > 0) await handleFile(files[0]);
      finish();
    },
    [handleFile, finish]
  );

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  useEffect(() => {
    const handler = (e: Event) => void handleFiles((e as CustomEvent<File[]>).detail ?? []);
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const onPick = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    void handleFiles(files);
    input.value = '';
  };

  const handleDownload = (att: EmlAttachment) => {
    try {
      downloadAttachment(att);
    } catch (error) {
      console.error('Attachment download failed:', error);
      alert(t.errDownloadFailed);
    }
  };

  const toValue = useMemo(() => message?.to.map(formatAddress).filter(Boolean).join(', ') ?? '', [message]);
  const ccValue = useMemo(() => message?.cc.map(formatAddress).filter(Boolean).join(', ') ?? '', [message]);

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h3 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h3>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <button
          type="button"
          class="eml-dropzone"
          onClick={() => document.getElementById('eml-file-input')?.click()}
        >
          <span class="eml-dropzone__icon" aria-hidden="true">
            ✉️
          </span>
          <span class="eml-dropzone__title">{t.dropClick}</span>
          <span class="eml-dropzone__hint">{t.dropOr}</span>
          <span class="eml-dropzone__hint">{t.dropSupported}</span>
        </button>
        <input
          id="eml-file-input"
          type="file"
          accept=".eml,message/rfc822"
          onChange={onPick}
          style="display: none;"
        />
      </AppCard>

      {busy && (
        <p style="color: var(--color-subtle); margin-top: var(--space-3);">…</p>
      )}

      {errorCode && (
        <div class="eml-error" role="alert" data-testid="error">
          <span class="eml-error__icon" aria-hidden="true">
            ⚠
          </span>
          <span data-testid="error-message">{errorText}</span>
        </div>
      )}

      {message && (
        <AppCard className="mt-6">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-3); margin-bottom: var(--space-4);">
            <span title={fileName ?? ''} data-testid="file-name" style="font-size: var(--fs-1); color: var(--color-subtle); overflow-wrap: anywhere;">
              {fileName}
            </span>
            <AppButton variant="secondary" onClick={reset}>
              {t.loadAnother}
            </AppButton>
          </div>

          <h2 data-testid="eml-subject" style="margin: 0 0 var(--space-3) 0; font-size: var(--fs-5); font-weight: 700; overflow-wrap: anywhere;">
            {message.subject || t.noSubject}
          </h2>

          <div class="eml-meta" style="display: flex; flex-direction: column; gap: var(--space-1); font-size: var(--fs-2); margin-bottom: var(--space-4);">
            <div><strong>{t.fromLabel}:</strong> <span data-testid="eml-from">{formatAddress(message.from)}</span></div>
            <div><strong>{t.toLabel}:</strong> <span data-testid="eml-to">{toValue}</span></div>
            {ccValue && (
              <div><strong>{t.ccLabel}:</strong> <span data-testid="eml-cc">{ccValue}</span></div>
            )}
            <div><strong>{t.dateLabel}:</strong> <span data-testid="eml-date">{formatDate(message.date, locale)}</span></div>
          </div>

          {message.htmlBody && message.textBody && (
            <div role="tablist" aria-label={t.bodyFrameTitle} style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'html'}
                data-testid="view-html"
                class={`app-button app-button--${viewMode === 'html' ? 'primary' : 'secondary'}`}
                onClick={() => setViewMode('html')}
              >
                {t.viewHtml}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === 'text'}
                data-testid="view-text"
                class={`app-button app-button--${viewMode === 'text' ? 'primary' : 'secondary'}`}
                onClick={() => setViewMode('text')}
              >
                {t.viewText}
              </button>
            </div>
          )}

          {message.htmlBody ? (
            viewMode === 'html' ? (
              <>
                <iframe
                  title={t.bodyFrameTitle}
                  data-testid="body-frame"
                  srcDoc={message.htmlBody}
                  sandbox="allow-popups allow-popups-to-escape-sandbox"
                  referrerpolicy="no-referrer"
                  style="width: 100%; min-height: 420px; height: 420px; resize: vertical; overflow: auto; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: #fff;"
                />
                <p style="font-size: var(--fs-1); color: var(--color-subtle); margin-top: var(--space-2);">
                  {t.remoteBlockedNote}
                </p>
              </>
            ) : (
              <pre data-testid="body-text" style="white-space: pre-wrap; word-break: break-word; font-family: inherit; font-size: var(--fs-2); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--space-3); background: var(--color-bg); max-height: 420px; overflow: auto;">
                {message.textBody}
              </pre>
            )
          ) : message.textBody ? (
            <pre data-testid="body-text" style="white-space: pre-wrap; word-break: break-word; font-family: inherit; font-size: var(--fs-2); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: var(--space-3); background: var(--color-bg); max-height: 420px; overflow: auto;">
              {message.textBody}
            </pre>
          ) : (
            <p style="color: var(--color-subtle);">{t.noBody}</p>
          )}

          {message.attachments.length > 0 && (
            <div style="margin-top: var(--space-5);">
              <h3 style="font-size: var(--fs-3); font-weight: 600; margin-bottom: var(--space-2);">
                {t.attachmentsHeading}
              </h3>
              <div data-testid="attachment-list" style="display: flex; flex-direction: column; gap: 2px;">
                {message.attachments.map((att, i) => (
                  <div
                    key={i}
                    data-testid="attachment-item"
                    style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-3); padding: var(--space-2) var(--space-3); background: var(--color-bg); border: 1px solid var(--color-border); border-radius: var(--radius-xs); font-size: var(--fs-2);"
                  >
                    <span title={att.filename} data-testid="attachment-name" style="flex: 1; min-width: 0; overflow-wrap: anywhere;">
                      📎 {att.filename}
                    </span>
                    <span style="flex-shrink: 0; color: var(--color-subtle);" class="num">
                      {humanSize(att.size)}
                    </span>
                    <AppButton
                      variant="secondary"
                      ariaLabel={`${t.download}: ${att.filename}`}
                      onClick={() => handleDownload(att)}
                    >
                      {t.download}
                    </AppButton>
                  </div>
                ))}
              </div>
            </div>
          )}
        </AppCard>
      )}
    </div>
  );
}
