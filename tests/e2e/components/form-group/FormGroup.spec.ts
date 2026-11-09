import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} FormGroup adds no keyboard stop and preserves native choice behavior`, async ({ page }) => {
    await openStory(page, 'components-formgroup--playground', { theme });
    const email = page.getByRole('checkbox', { name: 'Email', exact: true });
    await email.focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox', { name: 'SMS', exact: true })).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByRole('checkbox', { name: 'SMS', exact: true })).not.toBeChecked();
    await expect(page.getByRole('group')).toHaveAccessibleName('Notification channels');
    await expect(email).toHaveAccessibleDescription('Choose how you would like to hear from us. You can change these later.');
    await expect(page.locator('.fs-form-group__controls')).toHaveCSS('gap', '12px');
    await expect(page.locator('legend')).toHaveCSS('margin-bottom', '8px');
  });

  test(`${theme} FormGroup reflows enlarged text and user spacing at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-formgroup--composition', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const standard = page.getByRole('radio', { name: 'Standard' });
    await standard.focus();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('radio', { name: 'Express' })).toBeChecked();
  });
}

test('FormGroup exposes default, invalid, and disabled groups', async ({ page }) => {
  await openStory(page, 'components-formgroup--states');
  await expect(page.getByRole('checkbox', { name: 'Disabled email' })).toBeDisabled();
  await expect(page.getByRole('checkbox', { name: 'Disabled SMS' })).toBeDisabled();
  await expect(page.getByRole('checkbox', { name: 'Error email' })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByRole('checkbox', { name: 'Error email' })).toHaveAccessibleDescription('Select at least one option. Choose at least one channel.');
});

test('FormGroup presents both theme palettes and wrapping horizontal choices', async ({ page }) => {
  await openStory(page, 'components-formgroup--both-themes');
  await expect(page.locator('[data-theme="corporate"] .fs-form-group').first()).toHaveCSS('color', 'rgb(23, 35, 56)');
  await expect(page.locator('[data-theme="luna"] .fs-form-group').first()).toHaveCSS('color', 'rgb(244, 239, 255)');
  await expect(page.locator('.fs-form-group__controls--horizontal').first()).toHaveCSS('flex-wrap', 'wrap');
});

test('FormGroup accepts ordinary children, nesting, empty groups and token overrides', async ({ page }) => {
  await openStory(page, 'components-formgroup--native-children');
  await expect(page.getByRole('group', { name: 'Nested settings' })).toHaveAttribute('aria-invalid', 'false');
  await expect(page.getByRole('group', { name: 'Empty group' })).not.toHaveAttribute('aria-describedby');
  await expect(page.locator('.custom-form-group > .fs-form-group__controls')).toHaveCSS('gap', '24px');
});

test('FormGroup combines consumer descriptions with shared and local messages', async ({ page }) => {
  await openStory(page, 'components-formgroup--descriptions');
  await expect(page.getByRole('checkbox')).toHaveAccessibleDescription('Project settings. Choose how we contact you. Change these later. Choose one channel. Product news.');
});
