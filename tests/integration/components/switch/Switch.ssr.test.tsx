import { readFile } from 'node:fs/promises';
import { renderToString } from 'react-dom/server';
import { expect } from 'vitest';
import { test } from '../../fixtures/browser';
import { Switch } from '../../../../src/components/switch/Switch';

test.for([
  { theme: 'corporate', surface: 'rgb(36, 75, 176)' },
  { theme: 'luna', surface: 'rgb(199, 181, 255)' },
])('server-rendered $theme settings expose their on-state before hydration', async ({ theme, surface }, { page }) => {
  // arrange
  const css = (await Promise.all(['src/generated/tokens.css', 'src/components/field/field.css', 'src/components/switch/switch.css'].map(path => readFile(path, 'utf8')))).join('\n');
  const markup = renderToString(<Switch label="Notifications" defaultChecked />);
  await page.setContent(`<!doctype html><html lang="en" data-theme="${theme}"><head><style>${css}</style></head><body>${markup}</body></html>`);

  // act
  const result = await page.getByRole('switch', { name: 'Notifications', checked: true }).evaluate(element => getComputedStyle(element).backgroundColor);

  // assert
  expect(result).toBe(surface);
});
