import { describe, it, expect } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { ui } from '@/i18n/ui';

describe('resolveErrorMessage', () => {
  it('maps codes (incl. worker/engine-forwarded string codes) to localized strings with params', () => {
    expect(resolveErrorMessage(new AppError('errParse', { name: 'weird.eml' }), ui.en)).toBe(
      'The file weird.eml could not be read as an email. It may be corrupted or not a valid .eml file.'
    );
    expect(resolveErrorMessage(new AppError('errEmpty', { name: 'empty.eml' }), ui.ja)).toContain(
      'empty.eml'
    );
  });

  it('falls back to the localized generic message for unmapped/undefined errors', () => {
    expect(resolveErrorMessage('some internal error string', ui.zh)).toBe(ui.zh.errConversionFailed);
    expect(resolveErrorMessage(undefined, ui.es)).toBe(ui.es.errConversionFailed);
  });

  it('every locale defines the mapped codes', () => {
    for (const loc of ['en', 'ja', 'zh', 'de', 'es'] as const)
      for (const c of ['errEmpty', 'errUnreadable', 'errParse', 'errConversionFailed'])
        expect((ui as any)[loc][c], `${loc}.${c}`).toBeTruthy();
  });
});
