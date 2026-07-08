import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

// Flat config. Lints TS/TSX (src + tests) and .astro pages. Intentionally light:
// the goal is a working, green lint as a publish gate, not a strict style overhaul.
export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'coverage/**',
      'test-results/**',
      'playwright-report/**',
      'src/env.d.ts', // Astro-generated
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // TypeScript already checks for undefined identifiers (and knows browser /
    // worker / service-worker globals); core no-undef only false-positives here.
    files: ['**/*.ts', '**/*.tsx', '**/*.astro'],
    rules: { 'no-undef': 'off' },
  },
  {
    // Hand-written service worker (plain JS) — runs in the ServiceWorker scope.
    files: ['public/**/*.js'],
    languageOptions: { globals: { ...globals.serviceworker, ...globals.browser } },
  },
  {
    // Playwright's `({}, testInfo) => ...` fixture/info signature is idiomatic.
    files: ['tests/**'],
    rules: { 'no-empty-pattern': 'off' },
  },
];
