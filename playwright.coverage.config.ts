import { defineConfig } from '@playwright/test';
import base from './playwright.config';
import components from './playwright.components.config';
import type { BrowserCoverageOptions } from './tests/e2e/coverage/lifecycle';

export default defineConfig<BrowserCoverageOptions>({
  ...base,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/diagnostic' }], ['./tests/e2e/coverage/reporter.mjs']],
  use: { ...base.use, collectBrowserCoverage: true },
  projects: [
    { ...base.projects![0], testDir: './tests/e2e', outputDir: './test-results/diagnostic/storybook' },
    { ...components.projects![0], testDir: './tests/browser-harness/specs', outputDir: './test-results/diagnostic/components', use: { ...components.use, collectBrowserCoverage: true } },
  ],
  webServer: [
    base.webServer as Exclude<typeof base.webServer, unknown[] | undefined>,
    { ...components.webServer, command: 'npx --no-install vite --config vite.harness.config.ts' },
  ],
});
