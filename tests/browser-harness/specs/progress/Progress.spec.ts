import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} measured fill corresponds to the actual completion and inherits contrasting paint`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-progress--playground', {
      theme,
      args: { value: 25, max: 50, showValue: true },
    });
    const bar = page.getByRole('progressbar', { name: 'Upload progress' });
    await expect(bar).toHaveAttribute('aria-valuenow', '25');
    await expect(bar).toHaveAttribute('aria-valuemax', '50');
    await expect(bar).toHaveAttribute('aria-valuetext', '50%');
    const geometry = await bar.evaluate((node) => ({
      track: node.querySelector('.fs-progress__track')!.getBoundingClientRect().width,
      fill: node.querySelector('.fs-progress__indicator')!.getBoundingClientRect().width,
    }));
    expect(geometry.fill / geometry.track).toBeCloseTo(0.5, 2);
    const paint = await bar.evaluate((node) => ({
      track: getComputedStyle(node.querySelector('.fs-progress__track')!).backgroundColor,
      fill: getComputedStyle(node.querySelector('.fs-progress__indicator')!).backgroundColor,
    }));
    expect(contrast(paint.track, paint.fill)).toBeGreaterThanOrEqual(3);
    await expect(bar).not.toHaveAttribute('tabindex');
  });
  test(`${theme} labels reflow with enlarged spaced text at 320px`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-progress--long', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }',
    });
    await expect(page.getByRole('progressbar')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
test('native keyboard and pointer controls update measured progress', async ({ page, mount }) => {
  await openScenario(mount, 'components-progress--controlled');
  const slider = page.getByRole('slider', { name: 'Upload percentage' });
  await page.keyboard.press('Tab');
  await expect(slider).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '41');
  await page.getByRole('button', { name: 'Advance upload' }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '51');
  await page.getByRole('button', { name: 'Reset upload' }).click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
});
test('unknown progress animates then stops immediately for live reduced motion', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openScenario(mount, 'components-progress--indeterminate');
  const bar = page.getByRole('progressbar', { name: 'Preparing files' });
  const fill = bar.locator('.fs-progress__indicator');
  await expect(fill).toHaveCSS('animation-name', 'fs-progress-loading');
  const initialPosition = await fill.evaluate((node) => node.getBoundingClientRect().left);
  await expect
    .poll(async () =>
      Math.abs(
        (await fill.evaluate((node) => node.getBoundingClientRect().left)) - initialPosition,
      ),
    )
    .toBeGreaterThan(1);
  await expect(bar).not.toHaveAttribute('aria-valuenow');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(fill).toHaveCSS('animation-name', 'none');
  await expect(fill).toHaveCSS('transition-duration', '0s');
  await expect(bar).toHaveAttribute('aria-valuetext', 'In progress');
  await expect(page.getByText('In progress')).toBeVisible();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(fill).toHaveCSS('animation-name', 'fs-progress-loading');
});
test('RTL begins measured fill at the right edge', async ({ page, mount }) => {
  await openScenario(mount, 'components-progress--playground', { args: { value: 50, dir: 'rtl' } });
  const geometry = await page.getByRole('progressbar').evaluate((node) => ({
    track: node.querySelector('.fs-progress__track')!.getBoundingClientRect().right,
    fill: node.querySelector('.fs-progress__indicator')!.getBoundingClientRect().right,
  }));
  expect(geometry.fill).toBeCloseTo(geometry.track, 1);
});
test('instance thickness and radius overrides leave neighbors unchanged', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-progress--overrides');
  await expect(
    page.getByRole('progressbar', { name: 'Custom progress' }).locator('.fs-progress__track'),
  ).toHaveCSS('height', '16px');
  await expect(
    page.getByRole('progressbar', { name: 'Default progress' }).locator('.fs-progress__track'),
  ).toHaveCSS('height', '8px');
  await openScenario(mount, 'components-progress--sizes');
  await expect(
    page.getByRole('progressbar', { name: 'small progress' }).locator('.fs-progress__track'),
  ).toHaveCSS('height', '4px');
  await expect(
    page.getByRole('progressbar', { name: 'large progress' }).locator('.fs-progress__track'),
  ).toHaveCSS('height', '12px');
});
test('nested theme regions supply independent indicator colors', async ({ page, mount }) => {
  await openScenario(mount, 'components-progress--composition');
  const corporate = page.getByRole('region', { name: 'corporate progress' });
  const luna = page.getByRole('region', { name: 'luna progress' });
  expect(
    await corporate
      .locator('.fs-progress__indicator')
      .first()
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  ).not.toBe(
    await luna
      .locator('.fs-progress__indicator')
      .first()
      .evaluate((node) => getComputedStyle(node).backgroundColor),
  );
});
test('forced colors retain a visible track boundary', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-progress--playground');
  await expect(page.locator('.fs-progress__track')).toHaveCSS('outline-style', 'solid');
});
