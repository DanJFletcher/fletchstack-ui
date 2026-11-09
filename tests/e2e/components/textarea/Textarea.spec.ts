import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Textarea supports Enter, Tab, and visible keyboard focus`, async ({ page }) => {
    await openStory(page, 'components-textarea--native-form', { theme });
    const input = page.getByRole('textbox', { name: 'Description', exact: true });
    await input.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Second');
    await expect(input).toHaveValue('First\nSecond');
    await expect(input).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'Read-only description', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox', { name: 'Cancel reset' })).toBeFocused();
  });

  test(`${theme} Textarea reflows enlarged labels and messages at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-textarea--long-labels', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    await expect(page.getByRole('textbox')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`${theme} Textarea preserves its invalid boundary on hover`, async ({ page }) => {
    await openStory(page, 'components-textarea--invalid', { theme });
    await page.getByRole('textbox').hover();
    await expect(page.getByRole('textbox')).toHaveCSS('border-color', theme === 'corporate' ? 'rgb(180, 35, 24)' : 'rgb(255, 180, 171)');
  });
}

for (const story of ['playground', 'filled', 'disabled', 'read-only', 'length-guidance', 'unlimited-count', 'states', 'both-themes', 'customization', 'descriptions']) {
  test(`the ${story} Textarea example renders successfully`, async ({ page }) => {
    await openStory(page, `components-textarea--${story}`);
    await expect(page.getByRole('textbox').first()).toBeVisible();
  });
}

test('Textarea matches the reference minimum height, padding, and vertical resizing', async ({ page }) => {
  await openStory(page, 'components-textarea--playground');
  await expect(page.getByRole('textbox')).toHaveCSS('min-height', '120px');
  await expect(page.getByRole('textbox')).toHaveCSS('padding', '12px');
  await expect(page.getByRole('textbox')).toHaveCSS('font-size', '16px');
  await expect(page.getByRole('textbox')).toHaveCSS('resize', 'vertical');
  const bounds = (await page.getByRole('textbox').boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width - 3, bounds.y + bounds.height - 3);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width - 3, bounds.y + bounds.height + 60);
  await page.mouse.up();
  expect((await page.getByRole('textbox').boundingBox())!.height).toBeGreaterThan(bounds.height);
});

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Textarea keeps its controlled counter in sync`, async ({ page }) => {
    await openStory(page, 'components-textarea--controlled', { theme });
    const input = page.getByRole('textbox');
    await expect(input).toHaveAccessibleDescription('15');
    await input.focus();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.type('Edited');
    await page.keyboard.press('Enter');
    await page.keyboard.type('summary');
    await expect(input).toHaveValue('Edited\nsummary');
    await expect(input).toHaveAccessibleDescription('14');
    await expect(page.getByLabel('Current description')).toHaveText(/^Edited\nsummary$/);
    await page.getByRole('button', { name: 'Focus description' }).click();
    await expect(page.getByRole('textbox')).toBeFocused();
  });
}

test('Textarea counter tracks native submission, reset, and canceled reset', async ({ page }) => {
  await openStory(page, 'components-textarea--native-form');
  const input = page.getByRole('textbox', { name: 'Description', exact: true });
  await input.fill('Changed');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByLabel('Submitted description')).toHaveText('Changed');
  await page.getByRole('checkbox', { name: 'Cancel reset' }).check();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(input).toHaveValue('Changed');
  await expect(input).toHaveAccessibleDescription('7 / 200');
  await page.getByRole('checkbox', { name: 'Cancel reset' }).uncheck();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(input).toHaveValue('First');
  await expect(input).toHaveAccessibleDescription('5 / 200');
});

test('Textarea handles external ownership and unmounting during reset', async ({ page }) => {
  await openStory(page, 'components-textarea--reset-ownership');
  await page.getByRole('textbox').fill('Edited');
  await page.getByRole('button', { name: 'Move to second form' }).click();
  await expect(page.getByRole('textbox')).toHaveValue('Edited');
  await expect(page.getByRole('textbox')).toHaveAccessibleDescription('6');
  await page.getByRole('button', { name: 'Reset and remove' }).click();
  await expect(page.getByRole('textbox')).toHaveCount(0);
});

test('Textarea does not display an invalid negative limit', async ({ page }) => {
  await openStory(page, 'components-textarea--unlimited-count', { args: { maxLength: '-1' } });
  await expect(page.getByRole('textbox')).toHaveAccessibleDescription('0 Describe the goals of your project.');
});

test('Textarea enforces native maxLength while keeping the count synchronized', async ({ page }) => {
  await openStory(page, 'components-textarea--length-guidance', { args: { maxLength: '5' } });
  const input = page.getByRole('textbox');
  await input.fill('');
  await input.pressSequentially('abcdef');
  await expect(input).toHaveValue('abcde');
  await expect(input).toHaveAccessibleDescription('5 / 5 Keep it under 200 characters.');
});

test('Textarea read-only content remains selectable', async ({ page }) => {
  await openStory(page, 'components-textarea--read-only');
  const input = page.getByRole('textbox');
  await input.focus();
  await page.keyboard.press('ControlOrMeta+A');
  expect(await input.evaluate((element: HTMLTextAreaElement) => element.value.slice(element.selectionStart, element.selectionEnd))).toBe('A simpler experience, from start to finish.');
  await page.keyboard.type('Changed');
  await expect(input).toHaveValue('A simpler experience, from start to finish.');
});
