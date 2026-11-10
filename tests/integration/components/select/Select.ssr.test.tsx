import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Select } from '../../../../src/components/select/Select';

test.for([
  { theme: 'corporate', expected: 'rgb(255, 255, 255)' },
  { theme: 'luna', expected: 'rgb(17, 19, 41)' },
])('server-rendered Select uses the $theme contract without hydration', async ({ theme, expected }, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/select/select.css', 'src/components/icon/icon.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<>
    <Select label="Default workspace"><option value="personal">Personal</option></Select>
    <p id="context">Project settings.</p><Select id="controlled" label="Controlled workspace" value="personal" onChange={() => { /* Controlled by the consumer. */ }} aria-describedby="context" helperText="Choose a workspace." error="Select a workspace."><option value="personal">Personal</option></Select>
    <Select label="Prompt workspace" placeholder="Choose a workspace"><option value="personal">Personal</option></Select>
    <Select label="Initial workspace" defaultValue="personal" aria-invalid={false} size="large"><option value="personal">Personal</option></Select>
  </>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('combobox', { name: 'Default workspace' }).evaluate(element => getComputedStyle(element).backgroundColor);

  // assert
  expect(result).toBe(expected);
});
