import { test, expect } from '@playwright/test';
import { waitReady, openSampleEml } from './_helpers';

// Content routing is engine-independent; one browser is enough.
test.describe('i18n', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'content routing (one engine)');
  });

  for (const loc of [
    { path: '/eml-viewer/', lang: 'en' },
    { path: '/eml-viewer/ja/', lang: 'ja' },
  ]) {
    test(`opens a file on the ${loc.lang} route (#5)`, async ({ page }) => {
      await page.goto(loc.path);
      await waitReady(page);
      await openSampleEml(page);
      await expect(page.getByTestId('eml-subject')).toContainText('Simple plain text test');
    });
  }

  test('serves every locale with the correct <html lang>', async ({ page }) => {
    const expected: Array<[string, string]> = [
      ['/eml-viewer/', 'en'],
      ['/eml-viewer/ja/', 'ja'],
      ['/eml-viewer/zh/', 'zh-Hans'],
      ['/eml-viewer/de/', 'de'],
      ['/eml-viewer/es/', 'es'],
    ];
    for (const [path, lang] of expected) {
      await page.goto(path);
      expect(await page.getAttribute('html', 'lang'), `lang on ${path}`).toBe(lang);
    }
  });
});
