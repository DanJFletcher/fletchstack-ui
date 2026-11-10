import { defineConfig } from '@playwright/test';
import base from './playwright.config';
import type { BrowserCoverageOptions } from './tests/e2e/coverage/lifecycle';

export default defineConfig<BrowserCoverageOptions>({
  ...base,
  reporter: [['list'], ['html', { open: 'never' }], ['./tests/e2e/coverage/reporter.mjs']],
  use: { ...base.use, collectBrowserCoverage: true },
});
