import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Spinner rotates steadily and stops under reduced motion while retaining text`, async ({ page, mount }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openScenario(mount, 'components-spinner--playground', { theme });
    const status = page.getByRole('status');
    const graphic = status.locator('svg');
    await expect(status).toHaveText('Loading projects…');
    await expect(graphic).toHaveCSS('animation-name', 'fs-spinner-rotate');
    await expect(graphic).toHaveCSS('animation-duration', '1s');
    await expect(graphic).toHaveCSS('animation-timing-function', 'linear');
    await expect(graphic).toHaveCSS('animation-iteration-count', 'infinite');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(graphic).toHaveCSS('animation-name', 'none');
    await expect(status.getByText('Loading projects…')).toBeVisible();
  });

  test(`${theme} Spinner inherits button color without duplicating its accessible name`, async ({ page, mount }) => {
    await openScenario(mount, 'components-spinner--decorative', { theme });
    const button = page.getByRole('button', { name: 'Saving…' });
    await expect(page.getByRole('status')).toHaveCount(0);
    const paint = await button.evaluate(element => ({ text: getComputedStyle(element).color, artwork: getComputedStyle(element.querySelector('svg')!).stroke }));
    expect(paint.artwork).toBe(paint.text);
    await expect(button.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(button).toHaveAttribute('aria-busy', 'true');
  });

  test(`${theme} Spinner reflows enlarged and spaced status text at 320px`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-spinner--long-label', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status').locator('svg')).toHaveCSS('width', '20px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('Spinner renders 16, 20, and 24px artwork without adding status duplicates', async ({ page, mount }) => {
  await openScenario(mount, 'components-spinner--sizes');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'small', exact: true }).locator('..').locator('svg')).toHaveCSS('width', '16px');
  await expect(page.getByRole('heading', { name: 'medium', exact: true }).locator('..').locator('svg')).toHaveCSS('width', '20px');
  await expect(page.getByRole('heading', { name: 'large', exact: true }).locator('..').locator('svg')).toHaveCSS('width', '24px');
});

test('Spinner removal follows pending state with one persistent region announcement', async ({ page, mount }) => {
  await openScenario(mount, 'components-spinner--content-region');
  const region = page.getByRole('region', { name: 'Activity', exact: true });
  await expect(page.getByRole('status')).toHaveCount(1);
  await expect(region).toHaveAttribute('aria-busy', 'true');
  await expect(page.locator('.fs-spinner')).toBeVisible();
  await page.getByRole('button', { name: 'Complete loading' }).click();
  await expect(page.locator('.fs-spinner')).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveText('Activity loaded.');
  await expect(region).toHaveAttribute('aria-busy', 'false');
  await expect(region).toContainText('Your project activity is up to date.');
  await expect(page.getByRole('button', { name: 'Reload activity' })).toBeEnabled();
});

test('Spinner adds no keyboard focus stop while adjacent actions remain usable', async ({ page, mount }) => {
  await openScenario(mount, 'components-spinner--content-region');
  await page.getByRole('button', { name: 'Complete loading' }).focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Complete loading' })).toBeFocused();
  await expect(page.locator('.fs-spinner')).not.toHaveAttribute('tabindex');
  await expect(page.locator('.fs-spinner svg')).toHaveAttribute('focusable', 'false');
});

test('Spinner retains a visible static arc and status in forced colors', async ({ page, mount }) => {
  await openScenario(mount, 'components-spinner--playground');
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await expect(page.getByRole('status')).toBeVisible();
  await expect(page.getByRole('status').locator('svg')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.fs-spinner__track')).toHaveCSS('opacity', '1');
});

test('Spinner honors native hidden semantics despite its inline flex layout', async ({ page, mount }) => {
  await openScenario(mount, 'components-spinner--hidden');
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('.fs-spinner')).toHaveCSS('display', 'none');
});
