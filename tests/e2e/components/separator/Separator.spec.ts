import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';
import { contrast } from '../../fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} semantic Separator spans its parent with a contrasting 1px rule`, async ({ page }) => {
    await openStory(page, 'components-separator--semantic', { theme });
    const separator = page.getByRole('separator', { name: 'Section boundary' });
    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(separator).toHaveCSS('height', '1px');
    await expect(separator).toHaveCSS('margin', '0px');
    await expect(separator).toHaveCSS('padding', '0px');
    const geometry = await separator.evaluate(element => ({ width: element.getBoundingClientRect().width, parent: element.parentElement!.clientWidth - parseFloat(getComputedStyle(element.parentElement!).paddingLeft) - parseFloat(getComputedStyle(element.parentElement!).paddingRight) }));
    expect(geometry.width).toBe(geometry.parent);
    const paint = await separator.evaluate(element => ({ rule: getComputedStyle(element).borderTopColor, surface: getComputedStyle(element.closest('main')!).backgroundColor }));
    expect(contrast(paint.rule, paint.surface)).toBeGreaterThanOrEqual(3);
    await expect(separator).not.toHaveAttribute('tabindex');
    await expect(separator).not.toHaveAttribute('aria-valuenow');
  });

  test(`${theme} vertical Separator stretches to parent height`, async ({ page }) => {
    await openStory(page, 'components-separator--vertical', { theme });
    const separator = page.getByRole('separator');
    await expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    await expect(separator).toHaveCSS('width', '1px');
    await expect(separator).toHaveCSS('height', '64px');
    await expect(separator).toHaveCSS('border-inline-start-width', '1px');
    await expect(separator).toHaveCSS('border-top-width', '0px');
  });

  test(`${theme} Separator composition reflows at 320px with enlarged and spaced text`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-separator--composition', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Preferences' })).toBeVisible();
    await expect(page.getByRole('separator')).toHaveCSS('height', '1px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('decorative grouping is visible without an exposed separator role', async ({ page }) => {
  await openStory(page, 'components-separator--playground');
  await expect(page.locator('.fs-separator')).toBeVisible();
  await expect(page.locator('.fs-separator')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('separator')).toHaveCount(0);
});

test('keyboard focus skips semantic and decorative separators between actions', async ({ page }) => {
  await openStory(page, 'components-separator--composition');
  await page.getByRole('button', { name: 'Edit', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Duplicate', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Edit', exact: true })).toBeFocused();
  await expect(page.getByRole('separator')).toHaveCount(1);
  await expect(page.locator('.fs-separator')).toHaveCount(2);
});

test('Separator tokens customize thickness and color', async ({ page }) => {
  await openStory(page, 'components-separator--customization');
  await expect(page.getByRole('separator')).toHaveCSS('height', '2px');
  await expect(page.getByRole('separator')).toHaveCSS('border-top-width', '2px');
  const colors = await page.getByRole('separator').evaluate(element => ({ rule: getComputedStyle(element).borderTopColor, text: getComputedStyle(element.closest('main')!).color }));
  expect(colors.rule).toBe(colors.text);
});

test('Separator honors native hidden semantics', async ({ page }) => {
  await openStory(page, 'components-separator--hidden');
  await expect(page.getByRole('separator')).toHaveCount(0);
  await expect(page.locator('.fs-separator')).toHaveCSS('display', 'none');
});

test('untyped widget overrides cannot turn Separator into an interactive resizer', async ({ page }) => {
  await openStory(page, 'components-separator--passive-semantics');
  await expect(page.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  await expect(page.getByRole('separator')).not.toHaveAttribute('tabindex');
  await expect(page.getByRole('separator')).not.toHaveAttribute('aria-valuenow');
  await expect(page.getByRole('slider')).toHaveCount(0);
});

test('Separator remains a visible border in forced colors', async ({ page }) => {
  await openStory(page, 'components-separator--semantic');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByRole('separator')).toHaveCSS('border-top-style', 'solid');
  await expect(page.getByRole('separator')).toHaveCSS('border-top-width', '1px');
  const paint = await page.getByRole('separator').evaluate(element => ({ border: getComputedStyle(element).borderTopColor, surface: getComputedStyle(element.closest('main')!).backgroundColor }));
  expect(contrast(paint.border, paint.surface)).toBeGreaterThanOrEqual(3);
});

test('vertical Separator retains logical geometry in right-to-left layouts', async ({ page }) => {
  await openStory(page, 'components-separator--vertical');
  await page.addStyleTag({ content: 'html { direction: rtl; }' });
  await expect(page.getByRole('separator')).toHaveCSS('border-right-width', '1px');
  await expect(page.getByRole('separator')).toHaveCSS('border-left-width', '0px');
});

for (const story of ['playground', 'semantic', 'vertical', 'composition', 'both-themes', 'customization', 'passive-semantics']) {
  test(`the ${story} Separator example renders successfully`, async ({ page }) => {
    await openStory(page, `components-separator--${story}`);
    await expect(page.locator('.fs-separator').first()).toBeVisible();
  });
}
