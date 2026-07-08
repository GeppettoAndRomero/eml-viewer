import { test, expect, type Page } from '@playwright/test';
import {
  waitReady,
  openEml,
  openSampleEml,
  dropFile,
  PLAIN_B64,
  HTML_REMOTE_IMAGE_B64,
  JAPANESE_B64,
  XSS_B64,
  ATTACHMENT_B64,
} from './_helpers';

/** Every request the page issues, for asserting nothing fires for a given host. */
function trackRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on('request', (req) => urls.push(req.url()));
  return urls;
}

test.describe('Eml Viewer', () => {
  test('renders headers and plain-text body, with no upload', async ({ page }) => {
    const requests = trackRequests(page);
    await page.goto('/eml-viewer/');
    await waitReady(page);
    await openSampleEml(page);

    await expect(page.getByTestId('eml-subject')).toHaveText('Simple plain text test');
    await expect(page.getByTestId('eml-from')).toContainText('Alice Example');
    await expect(page.getByTestId('eml-from')).toContainText('alice@example.com');
    await expect(page.getByTestId('eml-to')).toContainText('Bob Example');
    await expect(page.getByTestId('eml-date')).not.toHaveText('');
    await expect(page.getByTestId('body-text')).toContainText(
      'This is a simple plain-text test email for eml-viewer.'
    );

    const external = requests.filter(
      (u) => !u.startsWith('http://localhost:4321') && !u.startsWith('data:') && !u.startsWith('blob:')
    );
    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('shows a localized error for an unsupported file type', async ({ page }) => {
    await page.goto('/eml-viewer/');
    await waitReady(page);
    await dropFile(page, { b64: btoa('not an email'), name: 'photo.png', type: 'image/png' });

    const err = page.getByTestId('error');
    await expect(err).toBeVisible();
    await expect(err).toContainText('photo.png');
    await expect(page.getByTestId('eml-subject')).toHaveCount(0);
  });

  test('shows an error for an empty file', async ({ page }) => {
    await page.goto('/eml-viewer/');
    await waitReady(page);
    await dropFile(page, { b64: '', name: 'empty.eml' });

    await expect(page.getByTestId('error')).toBeVisible();
  });

  test('opens another file after closing the current one', async ({ page }) => {
    await page.goto('/eml-viewer/');
    await waitReady(page);
    await openSampleEml(page);
    await page.getByRole('button', { name: 'Open another file' }).click();
    await expect(page.getByTestId('eml-subject')).toHaveCount(0);
  });

  test.describe('remote content in the HTML body is never fetched', () => {
    test('no network request fires for an <img>, srcset, background or CSS url() reference', async ({
      page,
    }) => {
      const requests: string[] = [];
      page.on('request', (req) => requests.push(req.url()));
      page.on('requestfailed', (req) => requests.push(req.url()));

      await page.goto('/eml-viewer/');
      await waitReady(page);
      await openEml(page, HTML_REMOTE_IMAGE_B64, 'html-remote-image.eml');

      // The body renders in the sandboxed iframe (no tabs — this fixture has no
      // separate plain-text part).
      const frame = page.frameLocator('[data-testid="body-frame"]');
      await expect(frame.locator('p[data-marker="remote-image-body-end"]')).toBeVisible();

      // Give any (incorrectly) fired request a moment to show up.
      await page.waitForTimeout(500);

      const toEvilHost = requests.filter((u) => u.includes('example.invalid'));
      expect(toEvilHost, `unexpected requests: ${toEvilHost.join(', ')}`).toHaveLength(0);

      // And structurally: the remote references were actually stripped from the
      // markup, not merely left unfetched by chance.
      await expect(frame.locator('img[src*="example.invalid"]')).toHaveCount(0);
      await expect(frame.locator('[style*="example.invalid"]')).toHaveCount(0);
      await expect(frame.locator('[background*="example.invalid"]')).toHaveCount(0);

      await expect(page.getByText('Remote images and styles are never loaded')).toBeVisible();
    });
  });

  test.describe('Japanese encoding (ISO-2022-JP header, Shift_JIS body)', () => {
    test('decodes the subject and body correctly — not mojibake', async ({ page }) => {
      await page.goto('/eml-viewer/');
      await waitReady(page);
      await openEml(page, JAPANESE_B64, 'japanese.eml');

      await expect(page.getByTestId('eml-subject')).toHaveText('日本語のテストメール');
      await expect(page.getByTestId('eml-from')).toContainText('テスト送信者');
      await expect(page.getByTestId('body-text')).toContainText('これは日本語のテストメールです。');
      await expect(page.getByTestId('body-text')).toContainText(
        '文字化けしていないことを確認してください。'
      );

      // Sanity: none of the mojibake replacement-character patterns leaked through.
      const bodyText = await page.getByTestId('body-text').innerText();
      expect(bodyText).not.toContain('�'); // U+FFFD REPLACEMENT CHARACTER
    });
  });

  test.describe('attachments: inline cid image + downloadable attachment', () => {
    test('renders the inline image as a local data: URI and downloads the attachment intact', async ({
      page,
    }) => {
      await page.goto('/eml-viewer/');
      await waitReady(page);
      await openEml(page, ATTACHMENT_B64, 'attachment.eml');

      // Inline image referenced via cid: is resolved to a self-contained data: URI
      // (never a network fetch).
      const frame = page.frameLocator('[data-testid="body-frame"]');
      const img = frame.locator('img');
      await expect(img).toHaveAttribute('src', /^data:image\/png/);

      // The separate (non-inline) attachment is listed and downloads with its
      // original content intact.
      await expect(page.getByTestId('attachment-list')).toBeVisible();
      const item = page.locator('[data-testid="attachment-item"]', { hasText: 'notes.txt' });
      await expect(item).toBeVisible();

      const downloadPromise = page.waitForEvent('download');
      await item.getByRole('button', { name: /Download/ }).click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('notes.txt');
      const stream = await download.createReadStream();
      const chunks: Buffer[] = [];
      for await (const chunk of stream) chunks.push(chunk as Buffer);
      expect(Buffer.concat(chunks).toString('utf-8')).toBe('hello attachment\n');
    });
  });

  test('produces zero console errors across the full fixture set', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto('/eml-viewer/');
    await waitReady(page);
    for (const [b64, name] of [
      [PLAIN_B64, 'plain.eml'],
      [HTML_REMOTE_IMAGE_B64, 'html-remote-image.eml'],
      [JAPANESE_B64, 'japanese.eml'],
      [ATTACHMENT_B64, 'attachment.eml'],
      [XSS_B64, 'xss.eml'],
    ] as const) {
      await openEml(page, b64, name);
      await page.getByRole('button', { name: 'Open another file' }).click();
    }

    expect(errors, `console/page errors: ${errors.join('\n')}`).toHaveLength(0);
  });

  test.describe('malicious HTML (XSS attempt) is neutralized', () => {
    test('DOMPurify strips dangerous markup and the sandbox blocks any script execution', async ({
      page,
    }) => {
      await page.goto('/eml-viewer/');
      await page.evaluate(() => {
        (window as Record<string, unknown>).__xssFired = false;
      });
      await waitReady(page);
      await openEml(page, XSS_B64, 'xss.eml');

      // The iframe itself must be sandboxed with neither allow-scripts nor
      // allow-same-origin — the structural backstop even if sanitization had a gap.
      const sandbox = await page.getByTestId('body-frame').getAttribute('sandbox');
      expect(sandbox).not.toBeNull();
      expect(sandbox).not.toMatch(/allow-scripts/);
      expect(sandbox).not.toMatch(/allow-same-origin/);

      const frame = page.frameLocator('[data-testid="body-frame"]');
      // The legitimate content survives sanitization…
      await expect(frame.locator('#safe-marker')).toBeVisible();
      // …but every dangerous construct does not.
      await expect(frame.locator('script')).toHaveCount(0);
      await expect(frame.locator('iframe')).toHaveCount(0);
      await expect(frame.locator('style')).toHaveCount(0);
      await expect(frame.locator('[onerror]')).toHaveCount(0);
      await expect(frame.locator('[onload]')).toHaveCount(0);
      await expect(frame.locator('a[href^="javascript:"]')).toHaveCount(0);
      await expect(frame.locator('[style*="example.invalid"]')).toHaveCount(0);
      await expect(frame.locator('[background*="example.invalid"]')).toHaveCount(0);

      // Give any script a moment to have run, then confirm nothing executed in the
      // top-level page (the sandbox prevents this even if a sanitizer bypass existed).
      await page.waitForTimeout(300);
      const fired = await page.evaluate(() => (window as Record<string, unknown>).__xssFired);
      expect(fired).toBe(false);
    });
  });
});
