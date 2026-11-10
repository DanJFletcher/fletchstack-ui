import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Separator } from '../../../../src/index';

test.for(['corporate', 'luna'])('server-rendered %s rules fill parent dimensions without adding spacing', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/separator/separator.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div style={{ width: '200px' }}><Separator decorative={false} /><div style={{ display: 'flex', height: '64px' }}><span>Overview</span><Separator decorative={false} orientation="vertical" /><span>Activity</span></div></div>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('separator').evaluateAll(elements => elements.map(element => ({ width: getComputedStyle(element).width, height: getComputedStyle(element).height, margin: getComputedStyle(element).margin, padding: getComputedStyle(element).padding })));

  // assert
  expect(result).toEqual([{ width: '200px', height: '1px', margin: '0px', padding: '0px' }, { width: '1px', height: '64px', margin: '0px', padding: '0px' }]);
});
