import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Container } from '../../../../src/components/container/Container';

test.for(['corporate', 'luna'])('server-rendered %s Container constrains and centers before hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/container/container.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div style={{ width: '1800px' }}><Container size="reading" data-testid="reading"><p>Article content</p></Container><Container data-testid="content"><p>Content</p></Container><Container size="wide" gutters={false} data-testid="wide"><p>Wide content</p></Container></div>);
  await page.setViewportSize({ width: 1800, height: 900 });
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>body{margin:0}${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-container').evaluateAll(elements => elements.map(element => ({ width: getComputedStyle(element).width, left: element.getBoundingClientRect().left, padding: getComputedStyle(element).paddingInlineStart, box: getComputedStyle(element).boxSizing })));

  // assert
  expect(result).toEqual([{ width: '720px', left: 540, padding: '24px', box: 'border-box' }, { width: '1120px', left: 340, padding: '24px', box: 'border-box' }, { width: '1440px', left: 180, padding: '0px', box: 'border-box' }]);
});

test('Container allows narrow flex/grid shrinking without concealing oversized child content', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/container/container.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div style={{ width: '200px', display: 'flex' }}><span style={{ flex: '0 0 80px' }}>Fixed</span><Container><div style={{ width: '1000px' }}>Oversized child</div></Container></div>);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-container').evaluate(element => ({ width: getComputedStyle(element).width, overflow: getComputedStyle(element).overflow, scroll: element.scrollWidth > element.clientWidth, child: getComputedStyle(element.firstElementChild!).width }));

  // assert
  expect(result).toEqual({ width: '120px', overflow: 'visible', scroll: true, child: '1000px' });
});
