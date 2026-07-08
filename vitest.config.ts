import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

// Unit tests run in Node (pure functions). Component tests opt into jsdom via a
// `// @vitest-environment jsdom` docblock. E2E lives in Playwright, not here.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/component/**/*.test.tsx'],
    environment: 'node',
    // jsdom (used by component tests and storage-backed unit tests via docblock)
    // needs a real origin or localStorage is a non-functional opaque-origin stub.
    environmentOptions: { jsdom: { url: 'http://localhost/' } },
    setupFiles: ['tests/setup/vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: 'coverage',
      // Scope to genuinely unit-testable (pure, DOM-free) modules. emlEngine.ts needs
      // a real DOM (DOMPurify + File/Blob) and is verified end to end by the Playwright
      // suite instead (Japanese decoding, XSS neutralization, cid: resolution) — same
      // precedent as heic-to-jpg's canvas-bound renderToBlob.
      include: ['src/utils/fileValidation.ts'],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 75 },
    },
  },
});
