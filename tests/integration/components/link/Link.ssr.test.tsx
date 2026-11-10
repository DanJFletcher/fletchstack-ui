import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Link } from '../../../../src/components/link/Link';

test.for([
  { theme: 'corporate', foreground: 'rgb(36, 75, 176)' },
  { theme: 'luna', foreground: 'rgb(199, 181, 255)' },
])('server-rendered $theme links inherit text sizing before hydration', async ({ theme, foreground }, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/link/link.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<p style={{ fontSize: '24px' }}><Link href="#documentation">Documentation</Link></p>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('link').evaluate(element => ({ color: getComputedStyle(element).color, size: getComputedStyle(element).fontSize }));

  // assert
  expect(result).toEqual({ color: foreground, size: '24px' });
});
