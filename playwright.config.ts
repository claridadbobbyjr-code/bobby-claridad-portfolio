import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests run against the production build (vite preview).
 * Browser: the locally installed Microsoft Edge (channel "msedge") or Chrome (set PW_CHANNEL=chrome),
 * so no Playwright browser download is needed. Run `npx playwright install chromium` and
 * set PW_CHANNEL=chromium to use the bundled one instead (e.g. on CI).
 */
const channel = process.env.PW_CHANNEL ?? 'msedge';
const browser = channel === 'chromium' ? {} : { channel };

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 180_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...browser, viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], ...browser, viewport: { width: 390, height: 844 } } },
  ],
});
