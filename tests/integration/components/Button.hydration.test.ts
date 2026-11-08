import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeAll, expect } from 'vitest';
import { test } from '../fixtures/browser';
import { ButtonApp } from '../fixtures/hydration/ButtonApp';
import { buildHydrationFixture } from '../fixtures/hydration/build';

let script: string;
let css: string;

beforeAll(async () => {
  script = await buildHydrationFixture();
  css = await readFile(new URL('../../../src/generated/tokens.css', import.meta.url), 'utf8') + await readFile(new URL('../../../src/button.css', import.meta.url), 'utf8');
});

test.beforeEach(async ({ page, errors }) => {
  const markup = renderToString(createElement(ButtonApp));
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body><div id="root">${markup}</div></body></html>`);
  await page.addScriptTag({ content: script });
  if (errors.length > 0) { throw new Error(errors.join('\n')); }
  await page.locator('[data-hydrated="true"]').waitFor();
});

test('hydrates server-rendered markup without React errors', async ({ page, errors }) => {
  // arrange
  const button = page.getByRole('button', { name: 'Save draft' });

  // act
  await button.click();

  // assert
  await expect.poll(() => page.getByLabel('Clicks', { exact: true }).textContent()).toBe('1');
  expect(errors).toEqual([]);
});

test.for(['Enter', 'Space'])('activates the React handler with $0', async (key, { page }) => {
  // arrange
  await page.getByRole('button', { name: 'Save draft' }).focus();

  // act
  await page.keyboard.press(key);

  // assert
  await expect.poll(() => page.getByLabel('Clicks', { exact: true }).textContent()).toBe('1');
});

test('the default button type does not submit its form', async ({ page }) => {
  // arrange
  const button = page.getByRole('button', { name: 'Save draft' });

  // act
  await button.click();

  // assert
  expect(await page.getByLabel('Submissions').textContent()).toBe('0');
});

test('an explicit submit Button invokes the React form handler', async ({ page }) => {
  // arrange
  const button = page.getByRole('button', { name: 'Submit', exact: true });

  // act
  await button.click();

  // assert
  await expect.poll(() => page.getByLabel('Submissions').textContent()).toBe('1');
});

test('an explicit reset Button restores a native field value', async ({ page }) => {
  // arrange
  await page.getByLabel('Title').fill('Revised');

  // act
  await page.getByRole('button', { name: 'Reset' }).click();

  // assert
  expect(await page.getByLabel('Title').inputValue()).toBe('Draft');
});

test('a disabled Button ignores pointer activation', async ({ page }) => {
  // arrange
  const button = page.getByRole('button', { name: 'Unavailable' });
  const point = await button.evaluate(element => {
    const bounds = element.getBoundingClientRect();
    return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  });

  // act
  // Physical input can target a disabled control without bypassing locator checks.
  await page.mouse.click(point.x, point.y);

  // assert
  expect(await page.getByLabel('Clicks', { exact: true }).textContent()).toBe('0');
});

test('Tab navigation skips a disabled Button', async ({ page }) => {
  // arrange
  await page.getByRole('button', { name: 'Reset' }).focus();

  // act
  await page.keyboard.press('Tab');

  // assert
  expect(await page.getByRole('button', { name: 'Add item' }).evaluate(button => button === document.activeElement)).toBe(true);
});

test('a consumer can focus the native button through its forwarded ref', async ({ page }) => {
  // arrange
  const trigger = page.getByRole('button', { name: 'Focus draft' });

  // act
  await trigger.click();

  // assert
  expect(await page.locator(':focus').textContent()).toBe('Save draft');
});

test('decorative icon composition retains the accessible name', async ({ page }) => {
  // arrange
  const button = page.getByRole('button', { name: 'Add item' });

  // act
  await button.click();

  // assert
  await expect.poll(() => page.getByLabel('Clicks', { exact: true }).textContent()).toBe('1');
});

test('semantic style overrides survive hydration', async ({ page }) => {
  // arrange
  const button = page.locator('.consumer-action');

  // act
  const result = await button.evaluate(element => getComputedStyle(element).borderRadius);

  // assert
  expect(result).toBe('0px');
});

test.for([
  { theme: 'corporate', color: 'rgb(36, 75, 176)' },
  { theme: 'luna', color: 'rgb(242, 213, 139)' },
])('keyboard focus has a visible indicator in $theme', async ({ theme, color }, { page }) => {
  // arrange
  await page.locator('html').evaluate((element, value) => { element.dataset['theme'] = value; }, theme);
  await page.getByLabel('Title').focus();

  // act
  await page.keyboard.press('Tab');

  // assert
  const result = await page.getByRole('button', { name: 'Save draft' }).evaluate(button => {
    const style = getComputedStyle(button);
    return { visible: button.matches(':focus-visible'), width: style.outlineWidth, style: style.outlineStyle, color: style.outlineColor };
  });
  expect(result).toEqual({ visible: true, width: '3px', style: 'solid', color });
});
