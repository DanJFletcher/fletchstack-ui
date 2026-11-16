import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} local state survives container-only shrink, menu toggles and widening`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await openScenario(mount, 'components-navbar--identity', { theme });
    const nav = page.getByRole('navigation', { name: 'Identity' }), input = nav.getByRole('textbox', { name: 'Workspace name' });
    await expect(nav.getByRole('button', { name: 'Menu' })).toHaveCount(0);
    await input.fill('Wide edit');
    await nav.getByRole('switch', { name: 'Dark mode' }).check();
    await page.getByRole('button', { name: 'Shrink container' }).click();
    expect(await page.evaluate(() => innerWidth)).toBe(1200);
    await expect(nav.getByRole('textbox')).toHaveCount(0);
    await expect(nav.getByRole('link', { name: 'Let’s talk' })).toBeVisible();
    await nav.getByRole('button', { name: 'Menu' }).click();
    await expect(input).toHaveValue('Wide edit'); await expect(nav.getByRole('switch')).toBeChecked();
    await input.fill('Compact edit'); await nav.getByRole('switch').uncheck();
    await nav.getByRole('button', { name: 'Menu' }).click();
    await expect(nav.getByRole('link', { name: 'Let’s talk' })).toBeVisible();
    await nav.getByRole('button', { name: 'Menu' }).click();
    await expect(input).toHaveValue('Compact edit'); await expect(nav.getByRole('switch')).not.toBeChecked();
    await page.getByRole('button', { name: 'Widen container' }).click();
    await expect(input).toHaveValue('Compact edit'); await expect(nav.getByRole('switch')).not.toBeChecked();
    await expect(nav.getByRole('link', { name: 'Let’s talk' })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Menu' })).toHaveCount(0);
  });
  test(`${theme} compact disclosure follows native Tab order and Escape returns to Menu`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await openScenario(mount, 'components-navbar--playground', { theme });
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'FletchStack home' })).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Let’s talk' })).toBeFocused();
    await page.keyboard.press('Tab'); const trigger = page.getByRole('button', { name: 'Menu' }); await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter'); await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'What we do' })).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'How we work' })).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.getByRole('switch', { name: 'Dark mode' })).toBeFocused();
    await page.keyboard.press('Space'); await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused(); await expect(trigger).toHaveCSS('outline-style', 'solid');
    await expect(page.getByRole('link', { name: 'What we do' })).toHaveCount(0);
    await page.keyboard.press('Space'); await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
  test(`${theme} wide keyboard order agrees with the visual sequence`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await openScenario(mount, 'components-navbar--playground', { theme });
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'FletchStack home' })).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'What we do' })).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'How we work' })).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.getByRole('switch')).toBeFocused();
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Let’s talk' })).toBeFocused();
  });
  test(`${theme} 320px reflow retains CTA and all controls at 200% text with user spacing`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-navbar--playground', { theme });
    await page.addStyleTag({ content: 'html{font-size:200%}.fs-navbar{line-height:1.5;letter-spacing:.12em;word-spacing:.16em}' });
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('link', { name: 'Let’s talk' })).toBeVisible();
    await expect(page.getByRole('switch')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('a nested destination label follows its native link and dismisses the menu', async ({ page, mount }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await openScenario(mount, 'components-navbar--playground');
  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByText('What we do', { exact: true }).click();
  await expect(page).toHaveURL(/#services$/); await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
});
test('all-visible items omit the trigger and retain native links at compact widths', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-navbar--all-visible');
  await expect(page.getByRole('button')).toHaveCount(0); await expect(page.getByRole('link')).toHaveText(['Help', 'Sign in']);
});
test('controlled custom actions close only when their parent updates open', async ({ page, mount }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await openScenario(mount, 'components-navbar--controlled');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('switch').check(); await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('button', { name: 'Switch to Studio' }).click();
  await expect(page.getByRole('status')).toHaveText('Workspace: Studio'); await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
});
test('an unaccepted controlled request preserves closed content until accepted', async ({ page, mount }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await openScenario(mount, 'components-navbar--deferred');
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('status')).toHaveText('Requested: true'); await expect(page.getByRole('link', { name: 'What we do' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Accept request' }).click(); await expect(page.getByRole('link', { name: 'What we do' })).toBeVisible();
});
test('typed mapped links, conditional controls and fragments retain group order', async ({ page, mount }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await openScenario(mount, 'components-navbar--resources');
  await expect(page.getByRole('link', { name: 'Support' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('link')).toHaveText(['Support', 'Docs', 'Examples']);
  await expect(page.getByRole('button', { name: 'Account settings' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Signed in' }).uncheck();
  await expect(page.getByRole('button', { name: 'Account settings' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Handwritten action' })).toBeVisible();
});
test('scoped width and surface geometry overrides leave a neighbor unchanged', async ({ page, mount }) => {
  await page.setViewportSize({ width: 950, height: 800 });
  await openScenario(mount, 'components-navbar--overrides');
  const custom = page.getByRole('navigation', { name: 'Custom' }), neighbor = page.getByRole('navigation', { name: 'Neighbor' });
  await expect(custom).toHaveCSS('border-radius', '24px'); await expect(neighbor).toHaveCSS('border-radius', '6px');
  await expect(custom.getByRole('button', { name: 'Menu' })).toBeVisible(); await expect(neighbor.getByRole('button', { name: 'Menu' })).toHaveCount(0);
});
test('forced colors preserve compact trigger focus and navigation boundaries', async ({ page, mount }) => {
  await page.setViewportSize({ width: 400, height: 800 }); await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-navbar--playground');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused(); await expect(page.getByRole('button', { name: 'Menu' })).toHaveCSS('outline-style', 'solid');
  await expect(page.getByRole('navigation')).toHaveCSS('border-style', 'solid');
});
