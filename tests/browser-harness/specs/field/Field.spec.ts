import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Field reflows at 320px with enlarged text and user spacing`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-field--long-labels', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }',
    });
    await page.getByRole('textbox').focus();
    await expect(page.getByRole('textbox')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('Field exposes default, invalid, disabled, read-only, and hidden states', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-field--states');
  await expect(page.getByRole('textbox', { name: 'Error', exact: true })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  await expect(page.getByRole('textbox', { name: 'Disabled', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Read-only', exact: true })).toHaveAttribute(
    'readonly',
    '',
  );
  await expect(page.getByRole('textbox', { name: 'Hidden', exact: true })).toHaveCount(0);
});

test('Field shares the existing component theme language', async ({ page, mount }) => {
  await openScenario(mount, 'components-field--both-themes');
  await expect(page.locator('[data-theme="corporate"] .fs-field-error').first()).toHaveCSS(
    'color',
    'rgb(180, 35, 24)',
  );
  await expect(page.locator('[data-theme="luna"] .fs-field-error').first()).toHaveCSS(
    'color',
    'rgb(255, 180, 171)',
  );
});

test('standalone field atoms expose the label and supporting messages', async ({ page, mount }) => {
  await openScenario(mount, 'components-field--standalone-primitives');
  await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveAccessibleDescription(
    'Use a short name. Enter a project name.',
  );
});

test('inline messages remain valid clickable label content', async ({ page, mount }) => {
  await openScenario(mount, 'components-field--inline-messages');
  await page.getByText('Product news.').click();
  await expect(page.getByRole('checkbox')).toBeChecked();
});

test('Field scoped tokens change actual spacing', async ({ page, mount }) => {
  await openScenario(mount, 'components-field--customization');
  await expect(page.locator('.custom-field')).toHaveCSS('gap', '24px');
});

test('Field default spacing uses its semantic relationship', async ({ page, mount }) => {
  await openScenario(mount, 'components-field--playground');
  await expect(page.locator('.fs-field')).toHaveCSS('gap', '8px');
});
