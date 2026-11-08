import { execFile } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { chromium, type Browser, type Page } from 'playwright';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Button } from '../../src/Button';

/**
 * Build CSS in an isolated fixture with a custom theme sorted before Corporate.
 **/
async function buildThemeFixture() {
  const directory = await mkdtemp(join(tmpdir(), 'fletchstack-theme-test-'));
  try {
    await cp(new URL('../../scripts', import.meta.url), join(directory, 'scripts'), { recursive: true });
    await cp(new URL('../../tokens', import.meta.url), join(directory, 'tokens'), { recursive: true });
    await cp(join(directory, 'tokens/luna.json'), join(directory, 'tokens/brand.json'));
    await mkdir(join(directory, 'docs'));
    await promisify(execFile)(process.execPath, [join(directory, 'scripts/build-tokens.mjs')]);
    return await readFile(join(directory, 'src/generated/tokens.css'), 'utf8');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

let browser: Browser;
let css: string;
beforeAll(async () => {
  css = await buildThemeFixture() + await readFile(new URL('../../src/button.css', import.meta.url), 'utf8');
  browser = await chromium.launch();
});
afterAll(async () => { await browser?.close(); });

const browserTest = test.extend<{ page: Page }>({
  // eslint-disable-next-line no-empty-pattern -- Vitest requires destructuring fixture dependencies; this fixture has none.
  page: async ({}, use) => {
    const page = await browser.newPage();
    await use(page);
    await page.close();
  },
});

browserTest.for([
  { label: 'defaults to Corporate', attribute: '', expected: 'rgb(36, 75, 176)' },
  { label: 'selects Corporate explicitly', attribute: 'data-theme="corporate"', expected: 'rgb(36, 75, 176)' },
  { label: 'selects Luna explicitly', attribute: 'data-theme="luna"', expected: 'rgb(199, 181, 255)' },
  { label: 'selects a custom theme sorted before Corporate', attribute: 'data-theme="brand"', expected: 'rgb(199, 181, 255)' },
])('the document root $label', async ({ attribute, expected }, { page }) => {
  // arrange
  const markup = renderToStaticMarkup(createElement(Button, null, 'Save'));

  // act
  await page.setContent(`<!doctype html><html ${attribute}><head><style>${css}</style></head><body>${markup}</body></html>`);

  // assert
  const result = await page.getByRole('button', { name: 'Save' }).evaluate(button => getComputedStyle(button).backgroundColor);
  expect(result).toBe(expected);
});
