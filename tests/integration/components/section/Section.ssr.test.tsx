import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Section } from '../../../../src/components/section/index';

test.for(['corporate', 'luna'])('server-rendered %s sections apply both block-padding edges before hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/section/section.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div>{(['compact', 'default', 'spacious'] as const).map(spacing => <Section key={spacing} spacing={spacing}><div style={{ height: '20px' }}>Content</div></Section>)}</div>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-section').evaluateAll(elements => elements.map(element => { const style = getComputedStyle(element); const box = element.getBoundingClientRect(); const child = element.firstElementChild!.getBoundingClientRect(); return { height: box.height, start: child.top - box.top, end: box.bottom - child.bottom, inline: style.paddingInline, overflow: style.overflow }; }));

  // assert
  expect(result).toEqual([{ height: 84, start: 32, end: 32, inline: '0px', overflow: 'visible' }, { height: 148, start: 64, end: 64, inline: '0px', overflow: 'visible' }, { height: 212, start: 96, end: 96, inline: '0px', overflow: 'visible' }]);
});

test('adjacent default sections retain both padding edges rather than collapsing them', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/section/section.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div><Section><div style={{ height: '20px' }}>First</div></Section><Section><div style={{ height: '20px' }}>Second</div></Section></div>);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-section > div').evaluateAll(elements => elements[1]!.getBoundingClientRect().top - elements[0]!.getBoundingClientRect().bottom);

  // assert
  expect(result).toBe(128);
});

test('consumer child margins remain additive to section padding', async ({ page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/section/section.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<Section><div style={{ height: '20px', marginBlock: '8px' }}>Content</div></Section>);
  await page.setContent(`<!doctype html><html lang="en"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-section').evaluate(element => { const box = element.getBoundingClientRect(); const child = element.firstElementChild!.getBoundingClientRect(); return { height: box.height, start: child.top - box.top, end: box.bottom - child.bottom }; });

  // assert
  expect(result).toEqual({ height: 164, start: 72, end: 72 });
});
