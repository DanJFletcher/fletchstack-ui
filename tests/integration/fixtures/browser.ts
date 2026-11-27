import { chromium, type Browser, type Page } from 'playwright';
import { test as baseTest } from 'vitest';

export const test = baseTest.extend<{
  $file: { browser: Browser };
  $test: { page: Page; errors: string[] };
}>({
  browser: [
    // eslint-disable-next-line no-empty-pattern -- Vitest fixtures require destructuring their dependencies.
    async ({}, use) => {
      const browser = await chromium.launch();
      try {
        await use(browser);
      } finally {
        await browser.close();
      }
    },
    { scope: 'file' },
  ],
  // eslint-disable-next-line no-empty-pattern -- Each test needs its own browser-error collection.
  errors: async ({}, use) => {
    await use([]);
  },
  page: async ({ browser, errors }, use) => {
    const page = await browser.newPage();
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    try {
      await use(page);
    } finally {
      await page.close();
    }
  },
});
