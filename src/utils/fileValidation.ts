/**
 * File-type validation for the .eml viewer.
 *
 * .msg (Outlook's OLE/Compound-File-Binary format) is explicitly out of scope — it
 * is a different, much harder binary format. Only RFC 822 (.eml) is accepted.
 */

/** Machine code the UI maps to a localized error string. */
export type ValidationCode = 'wrongType';

export interface ValidationResult {
  valid: boolean;
  code?: ValidationCode;
}

export const ALLOWED_EXTENSIONS = ['.eml'] as const;

// Some browsers/OSes report this for a .eml file; extension is authoritative and a
// non-empty MIME only needs to be one of these when the extension itself is missing.
const ALLOWED_MIME_TYPES = ['message/rfc822'];

/** Lower-cased extension including the dot, or '' when the name has none. */
export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot >= 0 ? fileName.slice(dot).toLowerCase() : '';
}

export function validateFileExtension(fileName: string): ValidationResult {
  return (ALLOWED_EXTENSIONS as readonly string[]).includes(getExtension(fileName))
    ? { valid: true }
    : { valid: false, code: 'wrongType' };
}

export function validateFile(file: File): ValidationResult {
  if (validateFileExtension(file.name).valid) return { valid: true };
  if (file.type && ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) return { valid: true };
  return { valid: false, code: 'wrongType' };
}
