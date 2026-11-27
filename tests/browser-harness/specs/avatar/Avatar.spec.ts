import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} sizes and shapes match the identity contract`, async ({ page, mount }) => {
    await openScenario(mount, 'components-avatar--sizes', { theme });
    const avatars = page.getByRole('img', { name: 'Maya Chen' });
    expect(
      await avatars.evaluateAll((elements) =>
        elements.map((element) => [
          element.getBoundingClientRect().width,
          element.getBoundingClientRect().height,
        ]),
      ),
    ).toEqual([
      [24, 24],
      [32, 32],
      [48, 48],
      [64, 64],
    ]);
    await openScenario(mount, 'components-avatar--shapes', { theme });
    await expect(page.locator('.fs-avatar--circle')).toHaveCSS('border-radius', '50%');
    await expect(page.locator('.fs-avatar--rounded')).toHaveCSS('border-radius', '8px');
    await expect(page.locator('.fs-avatar--square')).toHaveCSS('border-radius', '0px');
  });

  test(`${theme} initials contrast and image failure preserve the same footprint`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-avatar--playground', { theme, args: { size: 'large' } });
    const avatar = page.getByRole('img', { name: 'Maya Chen' });
    const paint = await avatar.evaluate((element) => ({
      text: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
    }));
    expect(contrast(paint.text, paint.background)).toBeGreaterThanOrEqual(4.5);
    const bounds = await avatar.boundingBox();
    await openScenario(mount, 'components-avatar--failed', { theme, args: { size: 'large' } });
    await expect(avatar.locator('img')).toHaveCount(0);
    await expect(avatar).toHaveText('MC');
    expect(await avatar.boundingBox()).toEqual(bounds);
    await openScenario(mount, 'components-avatar--photo', { theme, args: { size: 'large' } });
    await expect(avatar.locator('img')).toBeVisible();
    await expect(avatar).toHaveText('');
    await expect(avatar.locator('img')).toHaveCSS('object-fit', 'cover');
    expect(await avatar.boundingBox()).toEqual(bounds);
    await expect(page.getByRole('img')).toHaveCount(1);
  });

  test(`${theme} identity composition reflows at 320px with enlarged and spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-avatar--composition', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } .avatar-demo, .avatar-demo * { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; } .avatar-demo p { margin-bottom: 2em; }',
    });
    await expect(page.getByRole('heading', { name: 'Avatar', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(
      await page
        .locator('.fs-avatar__initials')
        .evaluateAll((initials) =>
          initials.every(
            (element) =>
              element.getBoundingClientRect().width <= element.parentElement!.clientWidth,
          ),
        ),
    ).toBe(true);
    await expect(page.getByRole('heading', { name: 'Maya Chen' })).toHaveCount(2);
  });
}

test('pending image keeps initials until the real browser finishes decoding', async ({
  page,
  mount,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route('**/portrait.svg*', async (route) => {
    await gate;
    await route.continue();
  });
  await openScenario(mount, 'components-avatar--photo');
  const avatar = page.getByRole('img', { name: 'Maya Chen' });
  try {
    await expect(avatar).toHaveText('MC');
    await expect(avatar.locator('img')).toBeHidden();
  } finally {
    release();
  }
  await expect(avatar.locator('img')).toBeVisible();
  await expect(avatar).toHaveText('');
});

test('changing a failed source recovers and can fail again without changing identity', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-avatar--source-changes');
  const avatar = page.getByRole('img', { name: 'Maya Chen' });
  await expect(avatar.locator('img')).toHaveCount(0);
  await expect(avatar).toHaveText('MC');
  await page.getByRole('button', { name: 'Use available photo' }).click();
  await expect(avatar.locator('img')).toBeVisible();
  await expect(avatar).toHaveText('');
  await page.getByRole('button', { name: 'Use failed photo' }).click();
  await expect(avatar.locator('img')).toHaveCount(0);
  await expect(avatar).toHaveText('MC');
});

test('avatars stay outside keyboard order and native hidden removes layout', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-avatar--keyboard');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Before' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
  await openScenario(mount, 'components-avatar--playground', { args: { hidden: true } });
  await expect(page.locator('.fs-avatar')).toBeHidden();
  expect(await page.locator('.fs-avatar').boundingBox()).toBeNull();
});

test('nested themes reset fallback paint while custom outer values remain scoped', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-avatar--scopes');
  await expect(page.getByRole('img', { name: 'Outer owner' })).toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );
  await expect(page.getByRole('img', { name: 'Nested owner' })).not.toHaveCSS(
    'background-color',
    'rgb(0, 0, 0)',
  );
});

test('forced colors retain a visible initials boundary', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-avatar--playground');
  const avatar = page.getByRole('img', { name: 'Maya Chen' });
  await expect(avatar).toHaveCSS('outline-style', 'solid');
  await expect(avatar).toHaveCSS('outline-width', '1px');
  await expect(avatar).toHaveText('MC');
});
