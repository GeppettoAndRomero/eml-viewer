/**
 * Localizable engine errors.
 *
 * The engine/util layer has no locale, so instead of throwing a human message it throws a stable
 * CODE (optionally with params). The UI island — which does have the locale — resolves that code
 * to a translated string from `ui[locale]` via `resolveErrorMessage`. Anything unmapped (an
 * unexpected/internal error) falls back to the localized generic `errConversionFailed`, so raw
 * English never reaches the user. See issue #63.
 */
export class AppError extends Error {
  code: string;
  params?: Record<string, string | number>;
  constructor(code: string, params?: Record<string, string | number>) {
    super(code); // .message === code, so it survives a worker postMessage boundary too
    this.name = 'AppError';
    this.code = code;
    this.params = params;
  }
}

/** Resolve any thrown value to a localized, user-safe message using the locale's ui strings. */
export function resolveErrorMessage(err: unknown, t: Record<string, string>): string {
  let code = '';
  let params: Record<string, string | number> | undefined;
  if (err instanceof AppError) {
    code = err.code;
    params = err.params;
  } else if (err instanceof Error) {
    code = err.message; // e.g. a code thrown as new Error(code), or forwarded from a worker
  } else if (typeof err === 'string') {
    code = err; // a worker often forwards only the message string
  }

  const template = code && Object.prototype.hasOwnProperty.call(t, code) ? t[code] : undefined;
  if (!template) return t.errConversionFailed ?? 'Conversion failed';

  let out = template;
  if (params) for (const [k, v] of Object.entries(params)) out = out.split(`{${k}}`).join(String(v));
  return out;
}
