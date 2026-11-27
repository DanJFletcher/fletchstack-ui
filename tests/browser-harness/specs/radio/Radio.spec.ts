import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Radio arrows select exclusively and skip disabled options`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-radio--group-selection', { theme });
    const standard = page.getByRole('radio', { name: 'Standard delivery' });
    const express = page.getByRole('radio', { name: 'Express delivery' });
    await standard.click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');
    await expect(standard).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(express).toBeFocused();
    await expect(express).toBeChecked();
    await expect(standard).not.toBeChecked();
    await expect(express).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('ArrowDown');
    await expect(standard).toBeChecked();
    await page.keyboard.press('ArrowUp');
    await expect(express).toBeChecked();
    await page.keyboard.press('Space');
    await expect(express).toBeChecked();
  });

  test(`${theme} Radio reflows at 320px with enlarged and spaced text`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-radio--long-labels', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }',
    });
    await page.getByRole('radio').focus();
    await expect(page.getByRole('radio')).toBeFocused();
    await expect(page.getByRole('radio')).toHaveCSS('width', '20px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });

  test(`${theme} Radio keeps error and group message relationships`, async ({ page, mount }) => {
    await openScenario(mount, 'components-radio--shared-error', { theme });
    const input = page.getByRole('radio', { name: 'Standard delivery' });
    await input.hover();
    await expect(input).toHaveAccessibleDescription('Choose a delivery method.');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveCSS(
      'border-color',
      theme === 'corporate' ? 'rgb(180, 35, 24)' : 'rgb(255, 180, 171)',
    );
    expect(await input.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(
      true,
    );
    await input.click();
    expect(await input.evaluate((element: HTMLInputElement) => element.validity.valueMissing)).toBe(
      false,
    );
  });
}

test('Radio matches circular geometry and its clickable target', async ({ page, mount }) => {
  await openScenario(mount, 'components-radio--playground');
  const input = page.getByRole('radio');
  await expect(input).toHaveCSS('width', '20px');
  await expect(input).toHaveCSS('height', '20px');
  await expect(input).toHaveCSS('border-radius', '50%');
  await expect(page.locator('.fs-radio__label')).toHaveCSS('min-height', '44px');
  await expect(page.locator('.fs-radio__label')).toHaveCSS('gap', '8px');
  await page.getByText('Arrives in 3–5 business days.').click();
  await expect(input).toBeChecked();
});

test('Radio native form submits external options and resets to defaults', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-radio--native-form');
  await page.getByRole('radio', { name: 'Collection' }).click();
  await page.getByRole('button', { name: 'Save delivery' }).click();
  await expect(page.getByLabel('Submitted delivery')).toHaveText('collection');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('radio', { name: 'Standard delivery' })).toBeChecked();
  await page.getByRole('button', { name: 'Save delivery' }).click();
  await expect(page.getByLabel('Submitted delivery')).toHaveText('standard');
});

test('Radio selected dot and focus remain visible in forced colors', async ({ page, mount }) => {
  await openScenario(mount, 'components-radio--selected');
  await page.emulateMedia({ forcedColors: 'active' });
  const input = page.getByRole('radio');
  await input.hover();
  expect(
    await input.evaluate((element) => {
      const dot = getComputedStyle(element, '::before');

      return (
        dot.visibility === 'visible' &&
        dot.backgroundColor !== getComputedStyle(element).backgroundColor
      );
    }),
  ).toBe(true);
});

test('Radio scoped themes remain independent', async ({ page, mount }) => {
  await openScenario(mount, 'components-radio--both-themes');
  const corporate = page.locator('[data-theme="corporate"].theme-panel');
  const luna = page.locator('[data-theme="luna"].theme-panel');
  await corporate.getByRole('radio', { name: 'Express delivery' }).click();
  await expect(luna.getByRole('radio', { name: 'Standard delivery' })).toBeChecked();
  await expect(corporate.getByRole('radio', { name: 'Express delivery' })).toHaveCSS(
    'border-color',
    'rgb(36, 75, 176)',
  );
  await expect(luna.getByRole('radio', { name: 'Standard delivery' })).toHaveCSS(
    'border-color',
    'rgb(199, 181, 255)',
  );
});
