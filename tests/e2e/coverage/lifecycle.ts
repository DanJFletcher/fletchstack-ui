import type { Page } from '@playwright/test';

export interface BrowserCoverageOptions {
  collectBrowserCoverage: boolean;
}

type JavaScriptCoverage = Pick<Page['coverage'], 'startJSCoverage' | 'stopJSCoverage'>;

/**
 * Collect only explicitly requested diagnostics, including after a failed test.
 **/
export async function withBrowserCoverage(enabled: boolean, coverage: JavaScriptCoverage, use: () => Promise<void>) {
  if (!enabled) {
    await use();
    return;
  }

  await coverage.startJSCoverage({ resetOnNavigation: false });
  try {
    await use();
  } finally {
    const entries = await coverage.stopJSCoverage();
    if (entries.length) {
      const { coverageReport } = await import('./report.mjs');
      await coverageReport().add(entries);
    }
  }
}
