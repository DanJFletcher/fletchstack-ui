import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { FormGroup } from '../../../../src/components/form-group/FormGroup';
import { Checkbox } from '../../../../src/components/checkbox/Checkbox';
import { Select } from '../../../../src/components/select/Select';
import { TextInput } from '../../../../src/components/text-input/TextInput';

test.for([
  { theme: 'corporate', expected: 'rgb(23, 35, 56)' },
  { theme: 'luna', expected: 'rgb(244, 239, 255)' },
])('server-rendered FormGroup uses the $theme text before hydration', async ({ theme, expected }, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/form-group/form-group.css', 'src/components/checkbox/checkbox.css', 'src/components/icon/icon.css', 'src/components/text-input/text-input.css', 'src/components/select/select.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<><p id="context">Settings.</p><FormGroup id="channels" legend="Notifications" description="Choose channels." helperText="Change later." error="Choose one." aria-describedby="context" orientation="horizontal" className="custom">{props => <Checkbox {...props} label="Email" />}</FormGroup><FormGroup legend="Contact" disabled><TextInput label="Name" /><Select label="Workspace"><option>Personal</option></Select></FormGroup><FormGroup legend="Empty">{props => <input {...props} aria-label="Native" />}</FormGroup></>);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('group', { name: 'Notifications' }).evaluate(element => getComputedStyle(element).color);

  // assert
  expect(result).toBe(expected);
});

test('group disabled semantics apply before JavaScript and exclude fields from submission', async ({ page }) => {
  // arrange
  const markup = renderToString(<form id="settings"><FormGroup legend="Disabled settings" disabled><Checkbox label="Email" name="email" defaultChecked /><TextInput label="Name" name="name" defaultValue="Example" /><Select label="Workspace" name="workspace"><option>Personal</option></Select></FormGroup></form>);
  await page.setContent(markup);

  // act
  const result = await page.locator('form').evaluate(element => [...new FormData(element as HTMLFormElement).entries()]);

  // assert
  expect(result).toEqual([]);
});
