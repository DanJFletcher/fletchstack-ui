import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} native keycaps use theme paint and compact monospace type`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-kbd--playground', { theme });
    const key = page.locator('kbd');
    await expect(key).toHaveText('Ctrl');
    const paint = await key.evaluate((node) => ({
      text: getComputedStyle(node).color,
      fill: getComputedStyle(node).backgroundColor,
    }));
    expect(contrast(paint.text, paint.fill)).toBeGreaterThanOrEqual(4.5);
    await expect(key).toHaveCSS('font-size', '12px');
    await expect(key).toHaveCSS('min-height', '20px');
    await expect(key).toHaveCSS('border-top-style', 'solid');
    await expect(key).not.toHaveAttribute('role');
    await expect(key).not.toHaveAttribute('tabindex');
  });

  test(`${theme} long labels reflow with 200 percent text and text spacing at 320px`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-kbd--long', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }',
    });
    const key = page.locator('kbd');
    await expect(key).toHaveCSS('font-size', '24px');
    expect(
      await key.evaluate(
        (node) => node.scrollWidth <= node.clientWidth && node.scrollHeight <= node.clientHeight,
      ),
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await openScenario(mount, 'components-kbd--wrapping', { theme });
    const group = page.locator('kbd.fs-kbd-group');
    expect(
      await group.evaluate(
        (node) =>
          node.getBoundingClientRect().height >
          node.querySelector('kbd')!.getBoundingClientRect().height,
      ),
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('a grouped shortcut leaves the native tab sequence unchanged', async ({ page, mount }) => {
  await openScenario(mount, 'components-kbd--flow');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Before' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'After' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'Before' })).toBeFocused();
  await expect(page.locator('kbd.fs-kbd-group')).toHaveText('Ctrl + K');
});

test('keycaps do not replace native button keyboard or pointer activation', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-kbd--button');
  const button = page.getByRole('button', { name: 'Accept Enter' });
  await page.keyboard.press('Tab');
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Accepted 1 times');
  await page.locator('kbd').click();
  await expect(page.getByRole('status')).toHaveText('Accepted 2 times');
  await expect(page.getByRole('button')).toHaveCount(1);
});

test('tooltip key labels describe the focused button without an additional focus stop', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-kbd--tooltip');
  const button = page.getByRole('button', { name: 'Save', exact: true });
  await button.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await expect(button).toHaveAccessibleDescription(/Save changes.*Command.*S/);
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Changes saved');
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await expect(page.getByRole('tooltip')).toBeHidden();
});

test('a search hint is associated with its native input', async ({ page, mount }) => {
  await openScenario(mount, 'components-kbd--search');
  const input = page.getByRole('searchbox', { name: 'Search workspace' });
  await expect(input).toHaveAccessibleDescription(
    /^Focus search using Ctrl\s*\+\s*K\s*\.\s*Shortcut handling belongs to your application\.$/,
  );
  await input.fill('Projects');
  await expect(input).toHaveValue('Projects');
});

test('nested regions inherit their theme while overrides remain local', async ({ page, mount }) => {
  await openScenario(mount, 'components-kbd--composition', { theme: 'luna' });
  const corporate = page.locator('[data-theme="corporate"]').getByText('Esc', { exact: true });
  const luna = page.locator('section[data-theme="luna"]').getByText('Esc', { exact: true });
  expect(await corporate.evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe(
    await luna.evaluate((node) => getComputedStyle(node).backgroundColor),
  );
  await openScenario(mount, 'components-kbd--overrides');
  const keys = page.getByText('Enter', { exact: true });
  await expect(keys.nth(0)).toHaveCSS('border-radius', '0px');
  await expect(keys.nth(1)).toHaveCSS('border-radius', '4px');
  await expect(page.locator('kbd.fs-kbd-group')).toHaveCSS('gap', '12px');
});

test('explicit left to right chords retain key order in right to left content', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-kbd--rtl');
  const control = await page.getByText('Ctrl', { exact: true }).boundingBox();
  const key = await page.getByText('K', { exact: true }).boundingBox();
  expect(control!.x).toBeLessThan(key!.x);
});

test('native hidden removes both keys and groups from rendered content', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-kbd--playground', { args: { hidden: true } });
  await expect(page.locator('kbd')).toBeHidden();
  await openScenario(mount, 'components-kbd--hidden-group');
  await expect(page.getByText('Ctrl', { exact: true })).toBeHidden();
  await expect(page.getByText('Visible content')).toBeVisible();
});

test('forced colors retains a keycap boundary without a shadow', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-kbd--playground');
  await expect(page.locator('kbd')).toHaveCSS('border-top-style', 'solid');
  await expect(page.locator('kbd')).toHaveCSS('box-shadow', 'none');
});
