import { defineConfig, devices } from '@playwright/test';

// Plan A browser matrix: Chromium + WebKit (real Safari engine — verifies the
// OffscreenCanvas fallback). Firefox + Mobile Chromium are added in Plan B.
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 5'] } },
  ],
  // Test the real production artifact (astro preview serves dist/), not the dev
  // server: no on-the-fly compilation means deterministic timing across browsers
  // (a cold vite-dev worker compile made WebKit's first attempt flaky). CI runs
  // `npm run build` before e2e; the gate builds first too.
  webServer: {
    command: 'npm run preview',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
