import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Avatar } from '../../../../src/components/avatar/Avatar';

test.for(['corporate', 'luna'])('server-rendered %s identities retain initials and geometry without hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/avatar/avatar.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<><Avatar name="Maya Chen" size="large" shape="rounded" /><Avatar name="Hidden" hidden /></>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);
  // act
  const result = await page.getByRole('img', { name: 'Maya Chen' }).evaluate(element => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height, radius: getComputedStyle(element).borderRadius, text: element.textContent }));
  // assert
  expect(result).toEqual({ width: 48, height: 48, radius: '8px', text: 'MC' });
  expect(await page.getByRole('img', { name: 'Hidden' }).count()).toBe(0);
});
