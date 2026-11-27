import { test as base, expect } from '@playwright/test';
import { withBrowserCoverage, type BrowserCoverageOptions } from '../coverage/lifecycle';

export const test = base.extend<BrowserCoverageOptions & { browserCoverage: void }>({
  collectBrowserCoverage: [false, { option: true }],
  browserCoverage: [
    async ({ page, collectBrowserCoverage }, use) => {
      await withBrowserCoverage(collectBrowserCoverage, page.coverage, use);
    },
    { auto: true },
  ],
});

export { expect };
