import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Stack } from '../../../../src/components/stack/Stack';

test.for(['corporate', 'luna'])('server-rendered %s Stack lays out every semantic gap before hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/stack/stack.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div>{(['none', 'related', 'group', 'section'] as const).map(gap => <Stack key={gap} gap={gap}><div style={{ height: '20px' }}>One</div><div style={{ height: '20px' }}>Two</div></Stack>)}</div>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-stack').evaluateAll(elements => elements.map(element => ({ gap: element.children[1]!.getBoundingClientRect().top - element.children[0]!.getBoundingClientRect().bottom, direction: getComputedStyle(element).flexDirection })));

  // assert
  expect(result).toEqual([{ gap: 0, direction: 'column' }, { gap: 16, direction: 'column' }, { gap: 24, direction: 'column' }, { gap: 64, direction: 'column' }]);
});

test('Stack retains child sizes and visible overflow in a constrained-height parent', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/stack/stack.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<Stack style={{ height: '40px', width: '200px' }}><div style={{ height: '60px', width: '1000px' }}>Oversized child</div><div style={{ height: '60px' }}>Second</div></Stack>);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-stack').evaluate(element => ({ height: element.getBoundingClientRect().height, child: element.children[0]!.getBoundingClientRect().height, overflow: getComputedStyle(element).overflow, overflowing: element.scrollWidth > element.clientWidth && element.scrollHeight > element.clientHeight }));

  // assert
  expect(result).toEqual({ height: 40, child: 60, overflow: 'visible', overflowing: true });
});
