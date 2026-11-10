import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { test } from '../../fixtures/browser';
import { Heading } from '../../../../src/components/typography/Heading';
import { Text } from '../../../../src/components/typography/Text';

it('renders repeatable native content on the server without browser globals', () => {
  // arrange
  const given = <div><Heading>Notifications</Heading><Text>Choose updates.</Text><Heading as="h1" size="page" className="consumer" style={{ '--fs-typography-heading-font-page': '3rem' }}>Project</Heading><Text as="span" size="small" tone="muted" className="consumer">Updated yesterday</Text></div>;

  // act
  const result = renderToString(given);

  // assert
  expect(result).toBe(renderToString(given));
  expect(result).toContain('<h2 class="fs-heading fs-heading--section">');
  expect(result).toContain('fs-text fs-text--body fs-text--default');
  expect(result).toContain('--fs-typography-heading-font-page:3rem');
  expect(result).toContain('<span');
  expect(result).not.toMatch(/tabindex|role=| as=| size=| tone=/);
});

test.for(['corporate', 'luna'])('%s typography applies the full scale before hydration', async (theme, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/typography/typography.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<div><Heading as="h1" size="page">Project</Heading><Heading>Notifications</Heading><Heading as="h3" size="subheading">Email</Heading><Text size="lead">Lead</Text><Text>Body</Text><Text size="small" tone="muted">Supporting text</Text><p><Text as="span" className="consumer">Inline</Text></p></div>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.locator('.fs-heading, .fs-text').evaluateAll(elements => elements.map(element => { const style = getComputedStyle(element); return { tag: element.tagName, size: style.fontSize, height: style.lineHeight, margin: style.margin, weight: style.fontWeight }; }));

  // assert
  expect(result).toEqual([
    { tag: 'H1', size: '32px', height: '40px', margin: '0px', weight: '700' },
    { tag: 'H2', size: '24px', height: '30px', margin: '0px', weight: '700' },
    { tag: 'H3', size: '18px', height: '22.5px', margin: '0px', weight: '700' },
    { tag: 'P', size: '18px', height: '27px', margin: '0px', weight: '400' },
    { tag: 'P', size: '16px', height: '24px', margin: '0px', weight: '400' },
    { tag: 'P', size: '14px', height: '21px', margin: '0px', weight: '400' },
    { tag: 'SPAN', size: '16px', height: '24px', margin: '0px', weight: '400' },
  ]);
  expect(await page.locator('script').count()).toBe(0);
});
