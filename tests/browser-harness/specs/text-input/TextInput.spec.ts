import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} TextInput supports read-only selection and keyboard editing`, async ({ page, mount }) => {
    await openScenario(mount, 'components-textinput--keyboard-and-read-only', { theme });
    const readonly = page.getByRole('textbox', { name: 'Read-only project' });
    await readonly.focus();
    await readonly.press('ControlOrMeta+A');

    expect(await readonly.evaluate((element: HTMLInputElement) => ({ start: element.selectionStart, end: element.selectionEnd }))).toEqual({ start: 0, end: 15 });
    await page.keyboard.type('Changed');
    await expect(readonly).toHaveValue('Website refresh');
    await page.keyboard.press('Tab');
    const editable = page.getByRole('textbox', { name: 'Editable project' });
    await expect(editable).toBeFocused();
    await page.keyboard.type('Launch');
    await expect(editable).toHaveValue('Launch');
    await expect(page.locator('.fs-text-input__control').filter({ has: editable })).toHaveCSS('outline-style', 'solid');
  });

  test(`${theme} TextInput reflows with enlarged text and adornments`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-textinput--long-labels', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    const input = page.getByRole('textbox');

    await input.focus();
    await expect(input).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(input).toHaveAccessibleDescription('https:// .example.test Labels, context, and descriptions wrap with enlarged text in narrow containers.');
  });

  test(`${theme} TextInput preserves its validation boundary on hover`, async ({ page, mount }) => {
    await openScenario(mount, 'components-textinput--invalid', { theme });
    const control = page.locator('.fs-text-input__control');

    await control.hover();

    await expect(control).toHaveCSS('border-color', theme === 'corporate' ? 'rgb(180, 35, 24)' : 'rgb(255, 180, 171)');
  });
}

test('TextInput links context and excludes adornments from its editable value', async ({ page, mount }) => {
  await openScenario(mount, 'components-textinput--descriptions');
  const input = page.getByRole('textbox', { name: 'Website' });

  await input.fill('example.com');

  await expect(input).toHaveValue('example.com');
  await expect(input).toHaveAccessibleDescription('Project settings. https:// / Enter a domain. Enter a website.');
});

test('TextInput matches the default geometry in the reference', async ({ page, mount }) => {
  await openScenario(mount, 'components-textinput--playground');

  await expect(page.locator('.fs-text-input__control')).toHaveCSS('height', '44px');
  await expect(page.locator('.fs-text-input__control')).toHaveCSS('padding-inline-start', '12px');
  await expect(page.getByRole('textbox')).toHaveCSS('font-size', '16px');
});
