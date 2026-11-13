import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} wide trail uses native underlined links and emphasized current text`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1100, height: 800 });
    await openScenario(mount, 'components-breadcrumbs--playground', { theme });
    const nav = page.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(nav.getByRole('list')).toBeVisible();
    await expect(nav.getByRole('link')).toHaveText(['Home', 'Projects', 'Atlas']);
    await expect(nav.getByRole('button')).toHaveCount(0);
    await expect(nav.getByText('Settings')).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Home' })).toHaveCSS('text-decoration-line', 'underline');
    const currentWeight = await nav.getByText('Settings').evaluate(element => Number(getComputedStyle(element).fontWeight));
    const linkWeight = await nav.getByRole('link', { name: 'Home' }).evaluate(element => Number(getComputedStyle(element).fontWeight));
    expect(currentWeight).toBeGreaterThan(linkWeight);
    await page.keyboard.press('Tab');
    await expect(nav.getByRole('link', { name: 'Home' })).toBeFocused();
    await expect(nav.getByRole('link', { name: 'Home' })).toHaveCSS('outline-style', 'solid');
  });
  test(`${theme} Enter and Space retain disclosure focus and update the native Tab sequence`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 480, height: 800 });
    await openScenario(mount, 'components-breadcrumbs--navigation', { theme });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' })).toBeFocused();
    await page.keyboard.press('Enter');
    const disclosure = page.getByRole('button', { name: 'Hide intermediate levels' });
    await expect(disclosure).toBeFocused();
    await expect(disclosure).toHaveAttribute('aria-expanded', 'true');
    await expect(disclosure).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Projects' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Atlas' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Next control' })).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' })).toBeFocused();
    await expect(page.getByRole('link', { name: 'Projects' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Atlas' })).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Next control' })).toBeFocused();
  });
  test(`${theme} 40rem collapses inclusively and resizing above restores every ancestor`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await openScenario(mount, 'components-breadcrumbs--playground', { theme });
    await expect(page.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' })).toBeVisible();
    await page.setViewportSize({ width: 641, height: 800 });
    await expect(page.getByRole('button')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Atlas' })).toBeVisible();
    await page.setViewportSize({ width: 640, height: 800 });
    await page.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' }).click();
    await page.setViewportSize({ width: 900, height: 800 });
    await expect(page.getByRole('button')).toHaveCount(0);
    await page.setViewportSize({ width: 640, height: 800 });
    await expect(page.getByRole('button', { name: 'Hide intermediate levels' })).toBeVisible();
  });
  test(`${theme} long labels reflow with 200% text and user spacing at 320px`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-breadcrumbs--long-labels', { theme });
    await page.addStyleTag({ content: 'html{font-size:200%}.fs-breadcrumbs{line-height:1.5;letter-spacing:.12em;word-spacing:.16em}' });
    await expect(page.getByText('A detailed current page name that remains readable on a narrow screen')).toBeVisible();
    expect(await page.getByRole('navigation').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('a custom CSS-width breakpoint changes the collapse boundary', async ({ page, mount }) => {
  await page.setViewportSize({ width: 800, height: 800 });
  await openScenario(mount, 'components-breadcrumbs--custom');
  await expect(page.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' })).toBeVisible();
  await page.setViewportSize({ width: 801, height: 800 });
  await expect(page.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
});
test('a two-item trail never renders a disclosure at narrow widths', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-breadcrumbs--two-items');
  await expect(page.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
  await expect(page.getByText('Settings')).toHaveAttribute('aria-current', 'page');
});
test('native destinations navigate without a router dependency', async ({ page, mount }) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await openScenario(mount, 'components-breadcrumbs--playground');
  await page.getByRole('link', { name: 'Projects' }).click();
  await expect(page).toHaveURL(/#projects$/);
});
test('scoped styles leave the neighboring hierarchy unchanged', async ({ page, mount }) => {
  await openScenario(mount, 'components-breadcrumbs--overrides');
  const custom = page.getByRole('navigation', { name: 'Custom breadcrumb' });
  const neighbor = page.getByRole('navigation', { name: 'Neighbor breadcrumb' });
  await expect(custom.getByRole('list')).toHaveCSS('gap', '24px');
  await expect(neighbor.getByRole('list')).toHaveCSS('gap', '8px');
  await expect(custom.getByRole('link', { name: 'Home' })).toHaveCSS('color', 'rgb(117, 31, 119)');
  await expect(neighbor.getByRole('link', { name: 'Home' })).not.toHaveCSS('color', 'rgb(117, 31, 119)');
});
test('forced colors retain a visible disclosure focus ring', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.setViewportSize({ width: 480, height: 800 });
  await openScenario(mount, 'components-breadcrumbs--playground');
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  await expect(page.getByRole('button')).toBeFocused();
  await expect(page.getByRole('button')).toHaveCSS('outline-style', 'solid');
});
