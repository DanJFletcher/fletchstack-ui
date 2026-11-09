import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Select supports native keyboard typeahead and focus`, async ({ page }) => {
    await openStory(page, 'components-select--selected', { theme });
    const select = page.getByRole('combobox', { name: 'Workspace' });
    await select.focus();
    await page.keyboard.press('d');

    await expect(select).toHaveValue('design');
    await expect(select).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(select).not.toBeFocused();
  });

  test(`${theme} Select labels and descriptions reflow with enlarged text`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-select--long-labels', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });

    const select = page.getByRole('combobox');
    await select.focus();
    await expect(select).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(select).toHaveAccessibleDescription('Labels and descriptions wrap in narrow containers and with enlarged text.');
  });

  test(`${theme} Select keeps its validation boundary when hovered`, async ({ page }) => {
    await openStory(page, 'components-select--invalid', { theme });
    const select = page.getByRole('combobox', { name: 'Workspace' });
    const expected = theme === 'corporate' ? 'rgb(180, 35, 24)' : 'rgb(255, 180, 171)';

    await select.hover();

    await expect(select).toHaveCSS('border-color', expected);
  });
}

for (const story of ['playground', 'browser-default', 'selected', 'invalid', 'disabled', 'states', 'both-themes', 'sizes', 'controlled', 'native-form', 'groups-and-descriptions', 'customization', 'long-labels', 'luna-states']) {
  test(`the ${story} Select example renders successfully`, async ({ page }) => {
    await openStory(page, `components-select--${story}`);
    await expect(page.getByRole('combobox').first()).toBeVisible();
  });
}

test('Select error descriptions include the consumer context', async ({ page }) => {
  await openStory(page, 'components-select--groups-and-descriptions');
  const select = page.getByRole('combobox', { name: 'Workspace' });

  await expect(select).toHaveAccessibleDescription('Only active workspaces can be selected. Choose a team. Review your selection.');
  await expect(select).toHaveAttribute('aria-invalid', 'true');
});
