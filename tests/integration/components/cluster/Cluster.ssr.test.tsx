import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Cluster } from '../../../../src/index';

test.for(['corporate', 'luna'])('server-rendered %s Cluster wraps with both gap axes before hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/cluster/cluster.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div>{(['none', 'actions', 'related'] as const).map(gap => <Cluster key={gap} gap={gap} style={{ width: '180px' }}><div style={{ width: '80px', height: '20px' }}>One</div><div style={{ width: '80px', height: '20px' }}>Two</div><div style={{ width: '80px', height: '20px' }}>Three</div></Cluster>)}</div>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-cluster').evaluateAll(elements => elements.map(element => { const boxes = [...element.children].map(child => child.getBoundingClientRect()); return { column: boxes[1]!.left - boxes[0]!.right, row: boxes[2]!.top - boxes[0]!.bottom }; }));

  // assert
  expect(result).toEqual([{ column: 0, row: 0 }, { column: 12, row: 12 }, { column: 16, row: 16 }]);
});

test('unsupported fixed-minimum children remain visibly overflowing rather than concealed or resized', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/cluster/cluster.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<Cluster style={{ width: '200px' }}><div style={{ minWidth: '1000px' }}>Unsupported child minimum</div></Cluster>);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-cluster').evaluate(element => ({ width: element.getBoundingClientRect().width, child: element.firstElementChild!.getBoundingClientRect().width, overflow: getComputedStyle(element).overflow, overflowing: element.scrollWidth > element.clientWidth }));

  // assert
  expect(result).toEqual({ width: 200, child: 1000, overflow: 'visible', overflowing: true });
});

test('rows keep their selected gap when a parent provides extra block space', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/cluster/cluster.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<Cluster style={{ width: '180px', height: '100px' }}><div style={{ width: '80px', height: '20px' }}>One</div><div style={{ width: '80px', height: '20px' }}>Two</div><div style={{ width: '80px', height: '20px' }}>Three</div></Cluster>);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-cluster').evaluate(element => { const boxes = [...element.children].map(child => child.getBoundingClientRect()); return { first: boxes[0]!.top - element.getBoundingClientRect().top, row: boxes[2]!.top - boxes[0]!.bottom }; });

  // assert
  expect(result).toEqual({ first: 0, row: 12 });
});
