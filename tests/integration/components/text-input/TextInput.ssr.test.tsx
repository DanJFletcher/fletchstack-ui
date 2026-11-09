import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { TextInput } from '../../../../src/index';

test.for([
  { theme: 'corporate', expected: 'rgb(255, 255, 255)' },
  { theme: 'luna', expected: 'rgb(17, 19, 41)' },
])('server-rendered TextInput uses the $theme surface before hydration', async ({ theme, expected }, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/text-input/text-input.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<><TextInput label="Project name" defaultValue="Website refresh" /><p id="context">Project settings.</p><TextInput id="website" label="Website" prefix="https://" suffix="/" helperText="Enter a domain." error="Enter a website." aria-describedby="context" defaultValue="example.com" /><TextInput label="Identifier" readOnly defaultValue="project-1" /><TextInput label="Unavailable" disabled /><TextInput label="Controlled name" value="Launch" onChange={() => { /* Controlled by the consumer. */ }} /></>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('textbox', { name: 'Project name' }).evaluate(element => getComputedStyle(element.parentElement!).backgroundColor);

  // assert
  expect(result).toBe(expected);
});
