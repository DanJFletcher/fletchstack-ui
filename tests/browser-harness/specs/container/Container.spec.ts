import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

/**
 * Read the rendered outer box and its available parent content width.
 **/
async function geometry(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);
    const parent = element.parentElement!;
    const parentStyle = getComputedStyle(parent);
    const box = element.getBoundingClientRect();
    const parentBox = parent.getBoundingClientRect();

    return {
      width: box.width,
      parent:
        parent.clientWidth -
        parseFloat(parentStyle.paddingLeft) -
        parseFloat(parentStyle.paddingRight),
      start: box.left - parentBox.left - parseFloat(parentStyle.paddingLeft),
      end: parentBox.right - parseFloat(parentStyle.paddingRight) - box.right,
      paddingStart: style.paddingInlineStart,
      paddingEnd: style.paddingInlineEnd,
      box: style.boxSizing,
    };
  });
}

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Container width presets include gutters and center`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1800, height: 900 });
    await openScenario(mount, 'components-container--width-presets', { theme });
    for (const [size, width] of [
      ['reading', 720],
      ['content', 1120],
      ['wide', 1440],
    ] as const) {
      await test.step(`${theme} ${size} maximum includes gutters and centers within its parent`, async () => {
        const box = await geometry(page.getByTestId(`preset-${size}`));
        expect(box.width).toBe(width);
        expect(box.start).toBe((box.parent - width) / 2);
        expect(box.end).toBe(box.start);
        expect(box.paddingStart).toBe('24px');
        expect(box.paddingEnd).toBe('24px');
        expect(box.box).toBe('border-box');
      });
    }
  });

  test(`${theme} gutters change at exactly 600px while the outer box still fills its parent`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 599, height: 900 });
    await openScenario(mount, 'components-container--responsive-gutters', { theme });
    const container = page.getByTestId('responsive-container');
    await expect(container).toHaveCSS('padding-inline-start', '16px');
    await expect(container).toHaveCSS('padding-inline-end', '16px');
    const below = await geometry(container);
    expect(below.width).toBe(below.parent);
    await page.setViewportSize({ width: 600, height: 900 });
    await expect(container).toHaveCSS('padding-inline-start', '24px');
    await expect(container).toHaveCSS('padding-inline-end', '24px');
    const above = await geometry(container);
    expect(above.width).toBe(above.parent);
  });

  test(`${theme} gutter opt-out preserves content maximum and centering`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 1800, height: 900 });
    await openScenario(mount, 'components-container--without-gutters', { theme });
    const box = await geometry(page.getByTestId('without-gutters'));
    expect(box.width).toBe(1120);
    expect(box.start).toBe(box.end);
    expect(box.start).toBeGreaterThan(0);
    expect(box.paddingStart).toBe('0px');
    expect(box.paddingEnd).toBe('0px');
  });

  test(`${theme} representative content reflows at 320px with enlarged and spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-container--composition', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }',
    });
    await expect(page.getByRole('textbox', { name: 'Project name' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
    await expect(page.locator('.fs-container')).toHaveCSS('padding-inline-start', '16px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('textbox', { name: 'Project name' }).fill('Readable project');
    await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveValue(
      'Readable project',
    );
  });
}

test('default Container stays a passive block without adding a surface, section role or vertical inset', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 1800, height: 900 });
  await openScenario(mount, 'components-container--playground');
  const container = page.locator('.fs-container');
  await expect(container).toHaveCSS('width', '1120px');
  await expect(container).toHaveCSS('display', 'block');
  await expect(container).toHaveCSS('padding-block-start', '0px');
  await expect(container).toHaveCSS('padding-block-end', '0px');
  await expect(container).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(container).toHaveCSS('border-top-width', '0px');
  await expect(container).toHaveCSS('box-shadow', 'none');
  await expect(container).toHaveCSS('overflow', 'visible');
  await expect(container).not.toHaveAttribute('tabindex');
  await expect(container).not.toHaveAttribute('role');
});

test('nested Containers avoid doubled gutters while retaining independent width constraints', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 1800, height: 900 });
  await openScenario(mount, 'components-container--nesting');
  const inner = page.getByTestId('inner-container');
  await expect(page.getByTestId('outer-container')).toHaveCSS('width', '1120px');
  await expect(inner).toHaveCSS('width', '720px');
  await expect(inner).toHaveCSS('padding-inline-start', '0px');
  await page.setViewportSize({ width: 320, height: 900 });
  const box = await geometry(inner);
  expect(box.width).toBe(box.parent);
  expect(box.paddingStart).toBe('0px');
  await expect(page.getByTestId('outer-container')).toHaveCSS('padding-inline-start', '16px');
});

test('scoped Container tokens inherit while nested explicit themes and siblings restore defaults', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 1800, height: 900 });
  await openScenario(mount, 'components-container--token-overrides');
  await expect(page.getByTestId('scoped-container')).toHaveCSS('width', '800px');
  await expect(page.getByTestId('scoped-container')).toHaveCSS('padding-inline-start', '32px');
  await expect(page.getByTestId('reset-container')).toHaveCSS('max-width', '1120px');
  await expect(page.getByTestId('reset-container')).toHaveCSS('padding-inline-start', '24px');
  await expect(page.getByTestId('sibling-container')).toHaveCSS('width', '1120px');
  await expect(page.getByTestId('sibling-container')).toHaveCSS('padding-inline-start', '24px');
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(page.getByTestId('scoped-container')).toHaveCSS('padding-inline-start', '8px');
  await expect(page.getByTestId('reset-container')).toHaveCSS('padding-inline-start', '16px');
});

test('Container shrinks in narrow flex/grid parents with viewport-based gutters', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-container--narrow-parents');
  await expect(page.getByTestId('flex-container')).toHaveCSS('width', '160px');
  await expect(page.getByTestId('grid-container')).toHaveCSS('width', '160px');
  await expect(page.getByTestId('flex-container')).toHaveCSS('min-width', '0px');
  await expect(page.getByTestId('grid-container')).toHaveCSS('min-width', '0px');
  await expect(page.getByTestId('flex-container')).toHaveCSS('padding-inline-start', '24px');
});

test('Container uses symmetric logical gutters and centering in RTL', async ({ page, mount }) => {
  await page.setViewportSize({ width: 1800, height: 900 });
  await openScenario(mount, 'components-container--width-presets');
  await page.addStyleTag({ content: 'html { direction: rtl; }' });
  const box = await geometry(page.getByTestId('preset-reading'));
  expect(box.width).toBe(720);
  expect(box.start).toBe(box.end);
  expect(box.paddingStart).toBe('24px');
  expect(box.paddingEnd).toBe('24px');
});

test('theme changes preserve Container geometry', async ({ page, mount }) => {
  await openScenario(mount, 'components-container--both-themes');
  const corporate = await geometry(
    page.locator('[data-theme="corporate"].theme-panel .fs-container'),
  );
  const luna = await geometry(page.locator('[data-theme="luna"].theme-panel .fs-container'));
  expect(luna).toEqual(corporate);
});

test('Container preserves keyboard order and clears focus rings without clipping', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await openScenario(mount, 'components-container--composition');
  await page.getByRole('textbox', { name: 'Project name' }).focus();
  await page.keyboard.press('Tab');
  const button = page.getByRole('button', { name: 'Save changes' });
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  const clearance = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
    const box = element.getBoundingClientRect();
    const container = element.closest('.fs-container')!;
    const parent = container.getBoundingClientRect();

    return {
      left: box.left - ring >= parent.left,
      right: box.right + ring <= parent.right,
      overflow: getComputedStyle(container).overflow,
    };
  });
  expect(clearance).toEqual({ left: true, right: true, overflow: 'visible' });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused();
});

test('native hidden suppresses Container and its children', async ({ page, mount }) => {
  await openScenario(mount, 'components-container--hidden');
  await expect(page.locator('.fs-container')).toHaveCSS('display', 'none');
});
