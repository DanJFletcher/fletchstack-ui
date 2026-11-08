import { test as base, expect } from '@playwright/test';
import { coverageReport } from '../coverage/report.mjs';

export const test = base.extend<{ browserCoverage: void }>({
  browserCoverage: [async ({ page }, use) => {
    await page.coverage.startJSCoverage({ resetOnNavigation: false });
    try {
      await use();
    } finally {
      await coverageReport().add(await page.coverage.stopJSCoverage());
    }
  }, { auto: true }],
});

export { expect };
