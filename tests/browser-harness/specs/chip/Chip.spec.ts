import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} controlled selection responds to native Enter and Space`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-chip--filters', { theme });
    const selection = page.getByRole('button', { name: 'Design systems' });
    await page.keyboard.press('Tab');
    await expect(selection).toBeFocused();
    await expect(selection).toHaveCSS('outline-style', 'solid');
    await selection.press('Enter');
    await expect(selection).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByRole('status')).toHaveText('Design systems selected.');
    await selection.press('Space');
    await expect(selection).toHaveAttribute('aria-pressed', 'false');
    await selection.press('Tab');
    await expect(page.getByRole('button', { name: 'Remove Drafts' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('button', { name: 'Remove Drafts' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Reset filters' })).toBeFocused();
  });

  test(`${theme} static and selected tags keep readable text in all enabled states`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-chip--playground', { theme });
    const chip = page.locator('.fs-chip');
    const normal = await chip.evaluate((element) => ({
      color: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
    }));
    expect(contrast(normal.color, normal.background)).toBeGreaterThanOrEqual(4.5);
    await expect(page.getByRole('button')).toHaveCount(0);
    await openScenario(mount, 'components-chip--actions', { theme });
    const selection = page.getByRole('button', { name: 'React', exact: true });
    const selected = await page.locator('.fs-chip').evaluate((element) => ({
      color: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
    }));
    expect(contrast(selected.color, selected.background)).toBeGreaterThanOrEqual(4.5);
    await selection.hover();
    const hover = await page.locator('.fs-chip').evaluate((element) => ({
      color: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
    }));
    expect(contrast(hover.color, hover.background)).toBeGreaterThanOrEqual(4.5);
    await page.getByRole('button', { name: 'Remove React' }).click();
    await expect(selection).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Removal requested')).toHaveText('React removal requested.');
    await expect(page.locator('button button')).toHaveCount(0);
  });

  test(`${theme} long interactive labels reflow at 320px with enlarged and spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-chip--long-label', { theme });
    await page.addStyleTag({
      content:
        'html {font-size:200%} .fs-chip {line-height:1.5;letter-spacing:.12em;word-spacing:.16em}',
    });
    await expect(page.getByRole('button', { name: 'Remove long tag' })).toBeVisible();
    expect(
      await page
        .locator('.fs-chip__label')
        .evaluate((element) => element.scrollWidth <= element.clientWidth),
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const target = await page.getByRole('button', { name: 'Remove long tag' }).boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(24);
    expect(target!.height).toBeGreaterThanOrEqual(24);
  });
}

test('disabled native actions are skipped in keyboard navigation', async ({ page, mount }) => {
  await openScenario(mount, 'components-chip--disabled');
  await expect(page.getByRole('button', { name: 'Disabled tag', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Remove disabled tag' })).toBeDisabled();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Next control' })).toBeFocused();
});

test('selection and removal do not submit an enclosing form', async ({ page, mount }) => {
  await openScenario(mount, 'components-chip--form');
  const current = page.url();
  await page.getByRole('button', { name: 'React', exact: true }).click();
  await page.getByRole('button', { name: 'Remove React' }).click();
  await expect(page.getByLabel('Removal requested')).toHaveText('React removal requested.');
  await expect(page).toHaveURL(current);
});

test('all three sizes increase the chip minimum height', async ({ page, mount }) => {
  await openScenario(mount, 'components-chip--sizes');
  expect(
    await page
      .locator('.fs-chip')
      .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).minBlockSize)),
  ).toEqual(['24px', '32px', '40px']);
});

test('nested theme boundaries reset scoped custom colors', async ({ page, mount }) => {
  await openScenario(mount, 'components-chip--scopes');
  const outer = page.getByText('Outer tag').locator('..');
  const nested = page.getByText('Nested tag').locator('..');
  await expect(outer).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(nested).not.toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(nested).not.toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('forced colors preserve selection and keyboard focus', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-chip--actions');
  await page.keyboard.press('Tab');
  const selection = page.getByRole('button', { name: 'React', exact: true });
  await expect(selection).toHaveAttribute('aria-pressed', 'true');
  await expect(selection).toHaveCSS('outline-style', 'solid');
  await expect(page.getByRole('img')).toHaveCount(0);
});

test('composition provides functional filters within both theme panels', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-chip--composition');
  await expect(page.getByRole('heading', { name: 'Chip', exact: true })).toBeVisible();
  const luna = page
    .locator('[data-theme="luna"]')
    .getByRole('button', { name: 'Filter', exact: true });
  await luna.click();
  await expect(luna).toHaveAttribute('aria-pressed', 'true');
});
