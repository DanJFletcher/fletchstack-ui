import { readFile } from 'node:fs/promises';
import { chromium, type Browser, type Page } from 'playwright';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Button } from '../../src/Button';

let browser: Browser;
beforeAll(async () => { browser = await chromium.launch(); });
afterAll(async () => { await browser?.close(); });

const browserTest = test.extend<{ page: Page }>({
  // eslint-disable-next-line no-empty-pattern -- Vitest requires destructuring fixture dependencies; this fixture has none.
  page: async ({}, use) => {
    const page = await browser.newPage();
    const css = await readFile(new URL('../../src/button.css', import.meta.url), 'utf8');
    const markup = ['Before', 'Hidden', 'After'].map(label =>
      renderToStaticMarkup(createElement(Button, { hidden: label === 'Hidden' }, label))).join('');
    await page.setContent(`<style>${css}</style>${markup}`);
    await use(page);
    await page.close();
  },
});

browserTest('a native hidden Button is not visible', async ({ page }) => {
  // arrange
  const button = page.locator('button[hidden]');

  // act
  const result = await button.isVisible();

  // assert
  expect(result).toBe(false);
});

browserTest('native Tab navigation skips a hidden Button', async ({ page }) => {
  // arrange
  await page.getByRole('button', { name: 'Before' }).focus();

  // act
  await page.keyboard.press('Tab');

  // assert
  const result = await page.locator(':focus').textContent();
  expect(result).toBe('After');
});
