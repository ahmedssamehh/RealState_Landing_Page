import { defineConfig, devices } from '@playwright/test';

/**
 * E2E config. `npm run test:e2e` starts the dev server itself (reuses one
 * already running on :3000) and runs against it — no separate `npm run dev`
 * step required.
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  // Heavy first-compile routes (3D scene, GSAP) under Next dev can take a
  // few seconds on a cold hit — give navigation assertions room for that.
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    navigationTimeout: 45_000,
  },
  // A single shared Next dev server compiles routes on demand; running
  // workers serially avoids racing that cold compile under parallel load.
  workers: 1,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
