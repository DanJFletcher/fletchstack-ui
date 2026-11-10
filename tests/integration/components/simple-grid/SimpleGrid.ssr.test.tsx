import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { SimpleGrid } from '../../../../src/components/simple-grid/SimpleGrid';

test('server-rendered collections form equal tracks at different parent widths before hydration', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/simple-grid/simple-grid.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div>{[800, 520, 200].map(width => <SimpleGrid key={width} style={{ width }}>{[1, 2, 3, 4, 5, 6].map(item => <div key={item} style={{ height: '20px' }}>{item}</div>)}</SimpleGrid>)}</div>);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-simple-grid').evaluateAll(elements => elements.map(element => { const boxes = [...element.children].map(child => child.getBoundingClientRect()); return { columns: boxes.filter(box => box.top === boxes[0]!.top).length, equal: boxes.every(box => Math.abs(box.width - boxes[0]!.width) < .02), overflow: element.scrollWidth > element.clientWidth }; }));

  // assert
  expect(result).toEqual([{ columns: 3, equal: true, overflow: false }, { columns: 2, equal: true, overflow: false }, { columns: 1, equal: true, overflow: false }]);
});
