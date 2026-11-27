import { defineConfig, devices } from '@playwright/test';
import type { BrowserCoverageOptions } from './tests/e2e/coverage/lifecycle';

const baseURL = 'http://127.0.0.1:6007';

export default defineConfig<BrowserCoverageOptions>({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  forbidOnly: Boolean(process.env['CI']),
  retries: 0,
  outputDir: './test-results/storybook',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/storybook' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'npm run tokens && npx --no-install storybook dev --host 127.0.0.1 --port 6007 --ci --no-open --disable-telemetry',
    url: `${baseURL}/iframe.html`,
    reuseExistingServer: !process.env['CI'],
  },
});
