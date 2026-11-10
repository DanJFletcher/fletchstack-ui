import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Spinner } from '../../../../src/index';

test.for(['corporate', 'luna'])('server-rendered %s spinners retain text under reduced motion without Icon CSS', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/spinner/spinner.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<Spinner label="Loading projects…" />);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('status').locator('svg').evaluate(element => ({ width: getComputedStyle(element).width, animation: getComputedStyle(element).animationName }));

  // assert
  expect(result).toEqual({ width: '20px', animation: 'none' });
  expect(await page.getByRole('status').textContent()).toBe('Loading projects…');
});

test('Spinner geometry remains independently customizable when Icon CSS loads last', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/spinner/spinner.css', 'src/components/icon/icon.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<Spinner style={{ '--fs-spinner-size-medium': '32px', '--fs-spinner-stroke-width': 4 }} />);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('status').locator('svg').evaluate(element => ({ width: getComputedStyle(element).width, stroke: getComputedStyle(element).strokeWidth }));

  // assert
  expect(result).toEqual({ width: '32px', stroke: '4px' });
});
