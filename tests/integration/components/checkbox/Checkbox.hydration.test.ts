import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeAll, expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { CheckboxApp } from './fixtures/CheckboxApp';
import { buildHydrationFixture } from '../../fixtures/hydration/build';

let script: string;
let css: string;

beforeAll(async () => {
  script = await buildHydrationFixture(new URL('./fixtures/hydrate-checkbox.tsx', import.meta.url));
  css = (
    await Promise.all(
      [
        'src/generated/tokens.css',
        'src/components/checkbox/checkbox.css',
        'src/components/icon/icon.css',
        'src/components/button/button.css',
      ].map((path) => readFile(path, 'utf8')),
    )
  ).join('\n');
});

test.beforeEach(async ({ page }) => {
  const markup = renderToString(createElement(CheckboxApp));
  await page.setContent(
    `<!doctype html><html lang="en" data-theme="corporate"><head><style>${css}</style></head><body><main><div id="root">${markup}</div></main></body></html>`,
  );
  await page.addScriptTag({ content: script });
  await page.locator('[data-hydrated="true"]').waitFor();
});

test.for([
  { theme: 'corporate', expected: 'rgb(36, 75, 176)' },
  { theme: 'luna', expected: 'rgb(199, 181, 255)' },
])(
  'mixed state hydrates with the $theme selected palette',
  async ({ theme, expected }, { page, errors }) => {
    // arrange
    await page.locator('html').evaluate((element, value) => {
      element.dataset['theme'] = value;
    }, theme);

    // act
    const result = await page
      .getByRole('checkbox', { name: 'Select all' })
      .evaluate((element: HTMLInputElement) => ({
        mixed: element.indeterminate,
        background: getComputedStyle(element).backgroundColor,
      }));

    // assert
    expect(result).toEqual({ mixed: true, background: expected });
    expect(errors).toEqual([]);
  },
);

test('native activation clears hydrated mixed state', async ({ page }) => {
  // arrange
  const checkbox = page.getByRole('checkbox', { name: 'Select all' });

  // act
  await checkbox.click();

  // assert
  expect(
    await checkbox.evaluate((element: HTMLInputElement) => ({
      mixed: element.indeterminate,
      checked: element.checked,
    })),
  ).toEqual({ mixed: false, checked: true });
});

test('the public input ref survives hydration', async ({ page }) => {
  // act
  await page.getByRole('button', { name: 'Inspect input ref' }).click();

  // assert
  await expect.poll(() => page.getByLabel('Ref result').textContent()).toBe('true');
});
