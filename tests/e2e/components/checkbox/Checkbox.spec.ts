import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Checkbox uses native Space and Tab behavior`, async ({ page }) => {
    await openStory(page, 'components-checkbox--keyboard', { theme });
    const email = page.getByRole('checkbox', { name: 'Email updates' });
    await email.focus();
    const initial = await email.isChecked();

    await page.keyboard.press('Space');

    await expect(email).toBeChecked({ checked: !initial });
    await expect(email).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox', { name: 'SMS', exact: true })).toBeFocused();
    await page.getByText('Email updates', { exact: true }).click();
    await expect(email).toBeChecked({ checked: initial });
  });

  test(`${theme} Checkbox reflows enlarged labels and descriptions`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-checkbox--long-labels', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    const checkbox = page.getByRole('checkbox');

    await checkbox.focus();

    await expect(checkbox).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(checkbox).toHaveCSS('width', '20px');
  });

  test(`${theme} Checkbox keeps its invalid boundary on hover`, async ({ page }) => {
    await openStory(page, 'components-checkbox--invalid', { theme });
    const checkbox = page.getByRole('checkbox', { name: 'Email updates' });

    await checkbox.hover();

    await expect(checkbox).toHaveCSS('border-color', theme === 'corporate' ? 'rgb(180, 35, 24)' : 'rgb(255, 180, 171)');
  });
}

test('Select all reflects none, partial, and all child choices', async ({ page }) => {
  await openStory(page, 'components-checkbox--group-selection');
  const group = page.getByRole('group', { name: 'Notification channels' });
  const all = group.getByRole('checkbox', { name: 'Select all' });
  await expect(all).toBeChecked({ indeterminate: true });

  await all.focus();
  await page.keyboard.press('Space');
  await expect(group.getByRole('checkbox', { checked: true })).toHaveCount(4);
  await group.getByRole('checkbox', { name: 'Email', exact: true }).click();
  await expect(all).toBeChecked({ indeterminate: true });
  await all.click();
  await expect(group.getByRole('checkbox', { checked: true })).toHaveCount(4);
  await all.click();
  await expect(group.getByRole('checkbox', { checked: false })).toHaveCount(4);
});

test('Checkbox matches the reference control, target, and label gap', async ({ page }) => {
  await openStory(page, 'components-checkbox--playground');

  await expect(page.getByRole('checkbox')).toHaveCSS('width', '20px');
  await expect(page.getByRole('checkbox')).toHaveCSS('height', '20px');
  await expect(page.locator('.fs-checkbox__label')).toHaveCSS('min-height', '44px');
  await expect(page.locator('.fs-checkbox__label')).toHaveCSS('gap', '8px');
  await page.getByText('Receive product news and tips.', { exact: true }).click();
  await expect(page.getByRole('checkbox')).toBeChecked();
});

test('Checkbox marks retain system contrast when hovered in forced colors', async ({ page }) => {
  await openStory(page, 'components-checkbox--checked');
  await page.emulateMedia({ forcedColors: 'active' });
  const checkbox = page.getByRole('checkbox');

  await checkbox.hover();

  const result = await checkbox.evaluate(element => {
    const probe = document.createElement('span');
    probe.style.backgroundColor = 'Highlight';
    document.body.appendChild(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();

    return { actual: getComputedStyle(element).backgroundColor, expected };
  });
  expect(result.actual).toBe(result.expected);
});

for (const story of ['playground', 'checked', 'indeterminate', 'invalid', 'disabled', 'states', 'both-themes', 'group-selection', 'controlled', 'native-form', 'keyboard', 'descriptions', 'customization', 'ref-access', 'long-labels', 'luna-group', 'luna-states']) {
  test(`the ${story} Checkbox example renders successfully`, async ({ page }) => {
    await openStory(page, `components-checkbox--${story}`);
    await expect(page.getByRole('checkbox').first()).toBeVisible();
  });
}
