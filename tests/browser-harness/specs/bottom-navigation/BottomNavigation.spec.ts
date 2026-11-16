import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} native destinations have equal cells and independent keyboard focus`, async ({ page, mount }) => {
    await openScenario(mount, 'components-bottom-navigation--playground', { theme });
    const nav = page.getByRole('navigation', { name: 'Primary' }), links = nav.getByRole('link');
    await expect(links).toHaveText(['Home', 'Inbox', 'Help']);
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', '#home');
    await expect(links.nth(1)).toHaveAttribute('href', '#inbox');
    await expect(links.nth(2)).toHaveAttribute('href', '#help');
    await expect(nav.getByRole('listitem')).toHaveCount(3);
    const widths = await links.evaluateAll(elements => elements.map(element => element.getBoundingClientRect().width));
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
    await page.keyboard.press('Tab'); await expect(links.nth(0)).toBeFocused();
    await page.keyboard.press('Tab'); await expect(links.nth(1)).toBeFocused();
    await page.keyboard.press('Tab'); await expect(links.nth(2)).toBeFocused();
    await expect(links.nth(2)).toHaveCSS('outline-style', 'solid');
    await expect(links.nth(1)).toHaveAttribute('aria-current', 'page');
    expect(await links.nth(1).evaluate(element => getComputedStyle(element, '::before').content)).toBe('""');
    expect(await links.nth(2).evaluate(element => getComputedStyle(element, '::before').content)).toBe('none');
    await page.keyboard.press('Shift+Tab'); await expect(links.nth(1)).toBeFocused();
    await page.keyboard.press('Enter'); await expect(page).toHaveURL(/#inbox$/);
  });
  test(`${theme} current changes and token overrides remain scoped`, async ({ page, mount }) => {
    await openScenario(mount, 'components-bottom-navigation--changes', { theme });
    await page.getByRole('button', { name: 'Show Help' }).click();
    const help = page.getByRole('link', { name: 'Help' });
    await expect(help).toHaveAttribute('aria-current', 'page');
    await expect(page.getByRole('link', { name: 'Inbox' })).not.toHaveAttribute('aria-current');
    expect(await help.evaluate(element => getComputedStyle(element, '::before').content)).toBe('""');
    await openScenario(mount, 'components-bottom-navigation--overrides', { theme });
    const custom = page.getByRole('navigation', { name: 'Custom' }).getByRole('link', { name: 'Inbox' });
    const neighbor = page.getByRole('navigation', { name: 'Neighbor' }).getByRole('link', { name: 'Inbox' });
    expect(await custom.evaluate(element => getComputedStyle(element, '::before').backgroundColor)).toBe('rgb(255, 200, 0)');
    expect(await neighbor.evaluate(element => getComputedStyle(element, '::before').backgroundColor)).not.toBe('rgb(255, 200, 0)');
    const nested = page.getByRole('navigation', { name: 'Nested' });
    await expect(nested).toHaveCSS('background-color', 'rgb(17, 19, 41)');
  });
  test(`${theme} labels survive narrow widths, enlarged text and user spacing`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-bottom-navigation--long-labels', { theme });
    await page.addStyleTag({ content: 'html{font-size:200%}.fs-bottom-navigation{line-height:1.5;letter-spacing:.12em;word-spacing:.16em}' });
    await expect(page.getByRole('link', { name: 'Inbox with important messages to review' })).toBeVisible();
    expect(await page.getByRole('navigation').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('both theme examples use the same destination markup', async ({ page, mount }) => {
  await openScenario(mount, 'components-bottom-navigation--composition');
  await expect(page.getByRole('navigation', { name: 'corporate primary' }).getByRole('link')).toHaveText(['Home', 'Inbox', 'Help']);
  await expect(page.getByRole('navigation', { name: 'luna primary' }).getByRole('link')).toHaveText(['Home', 'Inbox', 'Help']);
});

test('real router links match nested routes, native Help navigation survives history', async ({ page, mount }) => {
  await openScenario(mount, 'components-bottom-navigation--routing');
  await expect(page.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
  await page.goto('/navigation-demo/inbox/42');
  await expect(page.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Home' }).click();
  await expect(page.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: 'Open message 42' }).click();
  await expect(page).toHaveURL(/\/navigation-demo\/inbox\/42$/);
  const help = page.getByRole('link', { name: 'Help' });
  await help.click({ position: { x: 5, y: 5 } });
  await expect(page).toHaveURL(/\/navigation-demo\/help$/);
  await expect(page.getByRole('link', { name: 'Help' })).toHaveAttribute('aria-current', 'page');
  await page.goBack();
  await expect(page.getByRole('link', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
  await page.goForward();
  await expect(page.getByRole('link', { name: 'Help' })).toHaveAttribute('aria-current', 'page');
});

test('modified activation opens a real native destination in a new tab', async ({ page, context }) => {
  await page.goto('/navigation-demo/inbox/42');
  const opened = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Help' }).click({ modifiers: ['ControlOrMeta'] });
  const destination = await opened;
  await destination.waitForURL(/\/navigation-demo\/help$/);
  await expect(destination.getByRole('link', { name: 'Help' })).toHaveAttribute('aria-current', 'page');
  await expect(page).toHaveURL(/\/navigation-demo\/inbox\/42$/);
});
