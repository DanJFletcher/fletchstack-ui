import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} keyboard actions preserve focus and the persistent message`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-callout--action', { theme });
    const action = page.getByRole('button', { name: 'Review pages' });
    await page.keyboard.press('Tab');
    await expect(action).toBeFocused();
    await expect(action).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Review requests')).toHaveText('Review requested 1 time(s).');
    await page.keyboard.press('Space');
    await expect(page.getByLabel('Review requests')).toHaveText('Review requested 2 time(s).');
    await expect(action).toBeFocused();
    await expect(page.getByText('Two pages still need approval.')).toBeVisible();
    await expect(page.locator('.fs-callout')).not.toHaveAttribute('role');
  });
  test(`${theme} tones preserve readable text without implicit announcements`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-callout--tones', { theme });
    const callouts = page.locator('.fs-callout');
    await expect(callouts).toHaveCount(5);
    for (const callout of await callouts.all()) {
      await expect(callout).not.toHaveAttribute('role');
      await expect(callout).not.toHaveAttribute('aria-live');
      const colors = await callout.evaluate((element) => ({
        text: getComputedStyle(element).color,
        surface: getComputedStyle(element).backgroundColor,
      }));
      expect(
        contrast(colors.text, colors.surface),
        (await callout.getAttribute('class')) ?? 'Callout contrast',
      ).toBeGreaterThanOrEqual(4.5);
    }
    await expect(page.getByRole('img')).toHaveCount(0);
  });
  test(`${theme} long content and actions reflow at 320px with enlarged spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-callout--narrow', { theme });
    await page.addStyleTag({
      content:
        'html{font-size:200%}.fs-callout,.fs-callout button{line-height:1.5;letter-spacing:.12em;word-spacing:.16em}',
    });
    const action = page.getByRole('button', {
      name: 'Review all pages awaiting approval from the publishing team',
    });
    await expect(action).toBeVisible();
    expect(
      await page
        .locator('.fs-callout__content')
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const positions = await page
      .locator('.fs-callout__content > *')
      .evaluateAll((elements) =>
        elements.map((element) => Math.round(element.getBoundingClientRect().left)),
      );
    expect(new Set(positions).size).toBe(1);
  });
}

test('per-instance style hooks leave neighbors unchanged', async ({ page, mount }) => {
  await openScenario(mount, 'components-callout--overrides');
  const custom = page.locator('.fs-callout').filter({ hasText: 'Only this instance changes.' });
  const neighbor = page
    .locator('.fs-callout')
    .filter({ hasText: 'The theme supplies this instance.' });
  await expect(custom).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(custom).toHaveCSS('border-radius', '0px');
  await expect(custom).toHaveCSS('border-left-color', 'rgb(0, 0, 0)');
  await expect(custom).toHaveCSS('border-top-color', 'rgb(120, 120, 120)');
  await expect(neighbor).toHaveCSS('background-color', 'rgb(232, 239, 255)');
  await expect(neighbor).toHaveCSS('border-radius', '6px');
});
test('nested themes supply their own callout colors', async ({ page, mount }) => {
  await openScenario(mount, 'components-callout--nested');
  const outer = page.locator('.fs-callout').filter({ hasText: 'Outer guidance' });
  const nested = page.locator('.fs-callout').filter({ hasText: 'Nested guidance' });
  await expect(outer).toHaveCSS('background-color', 'rgb(232, 239, 255)');
  await expect(nested).toHaveCSS('background-color', 'rgb(36, 61, 112)');
});
test('body-only callouts occupy one compact row without optional gaps', async ({ page, mount }) => {
  await openScenario(mount, 'components-callout--body-only');
  await expect(
    page.locator('.fs-callout__icon, .fs-callout__title, .fs-callout__action'),
  ).toHaveCount(0);
  const box = await page.locator('.fs-callout').boundingBox();
  expect(box!.height).toBeLessThanOrEqual(52);
});
test('forced colors retain boundaries and the action focus ring', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-callout--action');
  await expect(page.locator('.fs-callout')).toHaveCSS('border-left-style', 'solid');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Review pages' })).toHaveCSS(
    'outline-style',
    'solid',
  );
});
