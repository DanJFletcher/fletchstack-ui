import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { test } from '../../fixtures/browser';
import { CodeBlock } from '../../../../src/components/code-block/CodeBlock';

it('server-renders deterministic escaped code without reading the clipboard', () => {
  // arrange
  const given = <CodeBlock highlight={false} filename="settings.ts" language="TypeScript" id="source" style={{ '--fs-code-block-inset': '24px' }}>{'\n<script>alert("literal")</script>\n\t'}</CodeBlock>;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(renderToString(given));
  expect(result).toContain('&lt;script&gt;');
  expect(result).not.toContain('<script>');
  expect(result).toContain('--fs-code-block-inset:24px');
  expect(result).toContain('aria-label="Copy settings.ts"');
  expect(result).toContain('type="button"');
  expect(result).toContain('aria-atomic="true"');
});

test.for(['corporate', 'luna'])('%s standalone CSS preserves source and supports native scrolling before hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/button/button.css', 'src/components/code-block/code-block.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div style={{ width: '240px' }}><CodeBlock copyable={false}>{'\n\tconst title = settings.project.displayName.repeat(100);\n'}</CodeBlock><CodeBlock copyable={false} wrap label="Wrapped source">{'const title = settings.project.displayName.repeat(100);'}</CodeBlock></div>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('region', { name: 'Code sample' }).evaluate(element => { const style = getComputedStyle(element); return { text: element.textContent, font: style.fontSize, line: style.lineHeight, inset: style.paddingInlineStart, scroll: element.scrollWidth > element.clientWidth }; });

  // assert
  expect(result).toEqual({ text: '\n\tconst title = settings.project.displayName.repeat(100);\n', font: '14px', line: '21px', inset: '16px', scroll: true });
  expect(await page.getByRole('region', { name: 'Wrapped source' }).evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.locator('script').count()).toBe(0);
});

test.for(['corporate', 'luna'])('%s packaged CSS keeps language and copy adjacent without a filename', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/button/button.css', 'src/components/code-block/code-block.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div style={{ width: '400px' }}><CodeBlock id="language-only" language="JavaScript">const ready = true;</CodeBlock><CodeBlock id="copy-only">const ready = true;</CodeBlock></div>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('#language-only').evaluate(element => { const language = element.querySelector('.fs-code-block__language')!.getBoundingClientRect(); const button = element.querySelector('button')!.getBoundingClientRect(); return button.left - language.right; });

  // assert
  expect(result).toBeCloseTo(12, 2);
  const inset = await page.locator('#copy-only').evaluate(element => element.getBoundingClientRect().right - element.querySelector('button')!.getBoundingClientRect().right);
  expect(inset).toBe(17);
});


test.for(['corporate', 'luna'])('%s SSR highlights escaped source before hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/code-block/code-block.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const source = '\n\t<script>literal & text</script>\n';
  const markup = renderToString(<CodeBlock language="html" copyable={false}>{source}</CodeBlock>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('code').textContent();

  // assert
  expect(result).toBe('\n\t<script>literal & text</script>\n');
  expect(await page.locator('code script').count()).toBe(0);
  expect(await page.locator('code > .token.tag').count()).toBe(2);
  expect(await page.locator('.token.tag').first().evaluate(element => getComputedStyle(element).color)).toBe(theme === 'luna' ? 'rgb(199, 181, 255)' : 'rgb(36, 75, 176)');
});
