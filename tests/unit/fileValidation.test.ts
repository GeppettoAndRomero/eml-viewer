import { describe, it, expect } from 'vitest';
import { getExtension, validateFileExtension, validateFile } from '@/utils/fileValidation';

const f = (name: string, type = ''): File => ({ name, type } as unknown as File);

describe('getExtension', () => {
  it('lower-cases and keeps the dot', () => {
    expect(getExtension('Message.EML')).toBe('.eml');
  });

  it('returns an empty string when there is no extension', () => {
    expect(getExtension('message')).toBe('');
  });
});

describe('validateFileExtension', () => {
  it('accepts .eml regardless of case', () => {
    expect(validateFileExtension('invoice.EML').valid).toBe(true);
  });

  it('rejects .msg (OLE/CFB — out of scope for v1)', () => {
    const result = validateFileExtension('invoice.msg');
    expect(result.valid).toBe(false);
    expect(result.code).toBe('wrongType');
  });

  it('rejects an unrelated extension', () => {
    expect(validateFileExtension('photo.png').valid).toBe(false);
  });
});

describe('validateFile', () => {
  it('accepts a file with the .eml extension', () => {
    expect(validateFile(f('message.eml', '')).valid).toBe(true);
  });

  it('accepts a file with no/odd extension but a message/rfc822 mime type', () => {
    expect(validateFile(f('message', 'message/rfc822')).valid).toBe(true);
  });

  it('rejects a file that is neither .eml nor message/rfc822', () => {
    const result = validateFile(f('photo.png', 'image/png'));
    expect(result.valid).toBe(false);
    expect(result.code).toBe('wrongType');
  });
});
