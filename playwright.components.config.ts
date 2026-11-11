import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testDir: './tests/browser-harness/specs',
  outputDir: './test-results/components',
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/components' }]],
  use: { ...base.use, baseURL: 'http://127.0.0.1:6008' },
  projects: [{ ...base.projects![0], name: 'components' }],
  webServer: {
    command: 'npm run tokens && npx --no-install vite --config vite.harness.config.ts',
    url: 'http://127.0.0.1:6008', reuseExistingServer: !process.env['CI'],
  },
});
