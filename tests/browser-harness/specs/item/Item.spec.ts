import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} native actions work by keyboard without making the row focusable`, async ({ page, mount }) => {
    await openScenario(mount, 'components-item--actions', { theme });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Review invitation' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toHaveText('Invitation reviewed');
    await expect(page.locator('.fs-item')).not.toHaveAttribute('tabindex');
  });
  test(`${theme} native whole-row link keeps tab order and visible focus`, async ({ page, mount }) => {
    await openScenario(mount, 'components-item--link', { theme });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Before' })).toBeFocused();
    await page.keyboard.press('Tab');
    const link = page.getByRole('link', { name: /Read the guide/ });
    await expect(link).toBeFocused();
    await expect(link).toHaveCSS('outline-style', 'solid');
    await expect(link).toHaveCSS('outline-width', '3px');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#guide$/);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'After' })).toBeFocused();
  });
  test(`${theme} content and actions reflow at 320px with enlarged spaced text`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-item--long', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
    await expect(page.getByRole('button')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('.fs-item').evaluate(node => node.scrollHeight <= node.clientHeight)).toBe(true);
  });
}
test('instance overrides do not change neighboring rows', async ({ page, mount }) => {
  await openScenario(mount, 'components-item--overrides');
  await expect(page.getByText('Custom row')).toHaveCSS('padding', '32px');
  await expect(page.getByText('Default row')).toHaveCSS('padding', '16px');
});
test('both theme regions inherit different paint', async ({ page, mount }) => {
  await openScenario(mount, 'components-item--composition');
  const rows = page.locator('.fs-item');
  expect(await rows.nth(0).evaluate(node => getComputedStyle(node).color)).not.toBe(await rows.nth(1).evaluate(node => getComputedStyle(node).color));
});
test('media, sizes and variants render with meaningful content', async ({ page, mount }) => {
  await openScenario(mount, 'components-item--media');
  await expect(page.getByRole('img', { name: 'Gray project cover' })).toBeVisible();
  await openScenario(mount, 'components-item--sizes');
  await expect(page.locator('.fs-item').nth(2)).toHaveCSS('padding', '8px');
  await openScenario(mount, 'components-item--variants');
  await expect(page.locator('.fs-item--outline')).toHaveCSS('border-top-style', 'solid');
});

test('both theme regions retain readable supporting text contrast', async ({ page, mount }) => {
  await openScenario(mount, 'components-item--composition');
  for (const region of await page.locator('.theme-panel').all()) {
    const paint = await region.evaluate(node => ({ background: getComputedStyle(node).backgroundColor, text: getComputedStyle(node.querySelector('.fs-item__description')!).color }));
    expect(contrast(paint.text, paint.background)).toBeGreaterThanOrEqual(4.5);
  }
});
test('forced colors preserve a whole-row link focus boundary', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-item--link');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /Read the guide/ })).toHaveCSS('outline-style', 'solid');
});
