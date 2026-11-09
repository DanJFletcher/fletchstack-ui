import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Field preserves native label activation and keyboard editing`, async ({ page }) => {
    await openStory(page, 'components-field--playground', { theme });
    const input = page.getByRole('textbox', { name: 'Notes' });
    await expect(input).toHaveValue('Launch checklist');
    await expect(input).toHaveAccessibleDescription('A short project summary.');
    await input.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.type('Updated summary');
    await expect(input).toHaveValue('Updated summary');
    await expect(page.locator('.fs-field')).toHaveCSS('gap', '8px');
  });

  test(`${theme} Field reflows at 320px with enlarged text and user spacing`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-field--long-labels', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    await page.getByRole('textbox').focus();
    await expect(page.getByRole('textbox')).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('Field exposes default, invalid, disabled, read-only, and hidden states', async ({ page }) => {
  await openStory(page, 'components-field--states');
  await expect(page.getByRole('textbox', { name: 'Error', exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('textbox', { name: 'Disabled', exact: true })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Read-only', exact: true })).toHaveAttribute('readonly', '');
  await expect(page.getByRole('textbox', { name: 'Hidden', exact: true })).toHaveCount(0);
});

test('Field shares the existing component theme language', async ({ page }) => {
  await openStory(page, 'components-field--both-themes');
  await expect(page.locator('[data-theme="corporate"] .fs-field-error').first()).toHaveCSS('color', 'rgb(180, 35, 24)');
  await expect(page.locator('[data-theme="luna"] .fs-field-error').first()).toHaveCSS('color', 'rgb(255, 180, 171)');
});

test('standalone field atoms expose the label and supporting messages', async ({ page }) => {
  await openStory(page, 'components-field--standalone-primitives');
  await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveAccessibleDescription('Use a short name. Enter a project name.');
});

test('inline messages remain valid clickable label content', async ({ page }) => {
  await openStory(page, 'components-field--inline-messages');
  await page.getByText('Product news.').click();
  await expect(page.getByRole('checkbox')).toBeChecked();
  await expect(page.locator('#inline-help')).toHaveJSProperty('tagName', 'SPAN');
  await expect(page.locator('#inline-error')).toHaveJSProperty('tagName', 'SPAN');
});

test('Field supports token and individual slot customization', async ({ page }) => {
  await openStory(page, 'components-field--customization');
  await expect(page.locator('.custom-field')).toHaveCSS('gap', '24px');
  await expect(page.locator('.custom-label')).toHaveAttribute('for', 'custom-name');
  await expect(page.locator('.custom-hint')).toHaveText('Custom hint.');
  await expect(page.locator('.custom-error')).toHaveText('Enter a project name.');
});

test('Field orders consumer context before local helper and validation messages', async ({ page }) => {
  await openStory(page, 'components-field--descriptions');
  await expect(page.getByRole('textbox')).toHaveAccessibleDescription('Project settings. Characters. Use a short name. Enter a project name.');
});
