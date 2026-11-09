import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeAll, expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { IconApp } from './fixtures/IconApp';
import { buildHydrationFixture } from '../../fixtures/hydration/build';

let script: string;
let css: string;

beforeAll(async () => {
  script = await buildHydrationFixture(new URL('./fixtures/hydrate-icons.tsx', import.meta.url));
  css = (await Promise.all(['src/generated/tokens.css', 'src/components/button/button.css', 'src/components/icon/icon.css', 'stories/shared/stories.css']
    .map(path => readFile(new URL(`../../../../${path}`, import.meta.url), 'utf8')))).join('\n');
});

test.beforeEach(async ({ page }) => {
  const markup = renderToString(createElement(IconApp));
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body><main class="showcase" data-theme="corporate"><div id="root">${markup}</div></main></body></html>`);
  await page.addScriptTag({ content: script });
  await page.locator('[data-hydrated="true"]').waitFor();
});

test('custom SVG markup hydrates with its naming, artwork, and style intact', async ({ page, errors }) => {
  // act
  const result = await page.getByRole('img', { name: 'Custom shape' }).evaluate(element => ({
    viewBox: element.getAttribute('viewBox'), source: element.getAttribute('data-source'),
    width: getComputedStyle(element).width, path: element.querySelector('g > path')?.getAttribute('d'),
    fill: element.getAttribute('fill'), stroke: element.getAttribute('stroke'),
  }));

  // assert
  expect(result).toEqual({ viewBox: '0 0 32 32', source: 'consumer', width: '28px', path: 'M4 4h24v24H4Z', fill: 'currentColor', stroke: 'none' });
  expect(errors).toEqual([]);
});

test.for([
  { size: 'small', expected: '16px' }, { size: 'medium', expected: '20px' }, { size: 'large', expected: '24px' },
])('every named icon renders at the $size dimensions', async ({ size, expected }, { page }) => {
  // act
  const result = await page.getByRole('img', { name: new RegExp(`^[0-7] ${size}$`) }).evaluateAll(elements =>
    elements.map(element => ({ width: getComputedStyle(element).width, height: getComputedStyle(element).height })));

  // assert
  expect(result).toHaveLength(8);
  expect(result).toEqual(Array(8).fill({ width: expected, height: expected }));
});

test('scoped semantic overrides reset at an explicit nested theme', async ({ page }) => {
  // act
  const result = await page.getByRole('img', { name: 'Local override' }).evaluate(element => ({ width: getComputedStyle(element).width, stroke: getComputedStyle(element).strokeWidth }));

  // assert
  expect(result).toEqual({ width: '30px', stroke: '3px' });
  expect(await page.getByRole('img', { name: 'Nested reset' }).evaluate(element => getComputedStyle(element).width)).toBe('20px');
  expect(await page.getByRole('img', { name: 'Corporate default' }).evaluate(element => getComputedStyle(element).width)).toBe('20px');
});

test('the forwarded SVG ref survives hydration', async ({ page }) => {
  // act
  await page.getByRole('button', { name: 'Inspect SVG ref' }).click();

  // assert
  await expect.poll(() => page.getByLabel('Ref result').textContent()).toBe('true');
});

test('decorative icons introduce no keyboard stop or extra button name', async ({ page }) => {
  // arrange
  await page.getByRole('button', { name: 'Inspect SVG ref' }).focus();

  // act
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  // assert
  await expect.poll(() => page.getByLabel('Activations').textContent()).toBe('1');
  expect(await page.getByRole('button', { name: 'Save all changes and return to your account settings' }).evaluate(element => element === document.activeElement)).toBe(true);
  expect(await page.locator('svg[tabindex]').count()).toBe(0);
});

test.for(['corporate', 'luna'])('icons inherit Button text colors across $0 states', async (theme, { page }) => {
  // arrange
  await page.getByRole('main').evaluate((element, value) => { element.dataset['theme'] = value; }, theme);
  const button = page.getByRole('button', { name: 'Save all changes and return to your account settings' });

  // act
  await button.hover();
  await page.mouse.down();

  // assert
  const result = await button.evaluate(element => ({ text: getComputedStyle(element).color, stroke: getComputedStyle(element.querySelector('svg')!).stroke }));
  expect(result.stroke).toBe(result.text);
  await page.mouse.up();
});

test('icons leave room for enlarged and spaced labels in a narrow viewport', async ({ page }) => {
  // arrange
  await page.setViewportSize({ width: 320, height: 700 });

  // act
  await page.addStyleTag({ content: 'html { font-size: 200%; } .fs-button { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; }' });

  // assert
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const result = await page.getByRole('button', { name: 'Save all changes and return to your account settings' }).evaluate(element => element.scrollWidth <= element.clientWidth);
  expect(result).toBe(true);
});
