import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

/**
 * Measure participating direct children relative to their grid without counting hidden cells.
 **/
async function items(grid: Locator) {
  return grid.evaluate(element => {
    const parent = element.getBoundingClientRect();

    return [...element.children].filter(child => getComputedStyle(child).display !== 'none').map(child => {
      const box = child.getBoundingClientRect();

      return { x: box.left - parent.left, right: box.right - parent.left, y: box.top - parent.top, bottom: box.bottom - parent.top, width: box.width, height: box.height, text: child.textContent };
    });
  });
}

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} equal columns reflow at three parent widths in one viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await openStory(page, 'components-simplegrid--reflow', { theme });
    const wide = await items(page.getByTestId('reflow-wide'));
    const medium = await items(page.getByTestId('reflow-medium'));
    const narrow = await items(page.getByTestId('reflow-narrow'));
    expect(wide.filter(box => box.y === 0)).toHaveLength(3);
    expect(medium.filter(box => box.y === 0)).toHaveLength(2);
    expect(narrow.filter(box => box.y === 0)).toHaveLength(1);
    expect(new Set(wide.map(box => Math.round(box.width)))).toEqual(new Set([256]));
    expect(medium.map(box => box.width)).toEqual([252, 252, 252, 252, 252, 252]);
    expect(narrow.map(box => box.width)).toEqual([200, 200, 200, 200, 200, 200]);
    expect(narrow.map(box => box.text)).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`${theme} SimpleGrid gap presets control rows and columns`, async ({ page }) => {
    await openStory(page, 'components-simplegrid--gaps', { theme });
    for (const [gap, pixels] of [['none', 0], ['related', 16], ['group', 24]] as const) {
      await test.step(`${theme} ${gap} uses ${pixels}px for columns and rows`, async () => {
        const boxes = await items(page.getByTestId(`gap-${gap}`));
        expect(boxes[1]!.x - boxes[0]!.right).toBe(pixels);
        expect(boxes[2]!.y - boxes[0]!.bottom).toBe(pixels);
      });
    }
  });

  test(`${theme} cards reflow at 320px with 200% text and user spacing`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openStory(page, 'components-simplegrid--composition', { theme });
    const before = (await items(page.getByTestId('project-grid')))[0]!.height;
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    const boxes = await items(page.getByTestId('project-grid'));
    expect(boxes.map(box => box.x)).toEqual([0, 0, 0]);
    expect(boxes[0]!.height).toBeGreaterThan(before);
    expect(boxes[1]!.y - boxes[0]!.bottom).toBe(16);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByTestId('project-grid')).toHaveCSS('overflow', 'visible');
    const supported = await page.getByTestId('project-grid').locator('button').evaluateAll(buttons => buttons.every(button => button.scrollWidth <= button.clientWidth));
    expect(supported).toBe(true);
  });
}

test('auto-fit collapses empty tracks in sparse and single-item collections', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openStory(page, 'components-simplegrid--sparse');
  expect((await items(page.getByTestId('sparse-grid'))).map(box => box.width)).toEqual([392, 392]);
  await openStory(page, 'components-simplegrid--empty-and-single');
  expect((await items(page.getByTestId('single-grid'))).map(box => box.width)).toEqual([800]);
  await expect(page.getByTestId('empty-grid')).toBeEmpty();
  expect((await page.getByTestId('empty-grid').boundingBox())!.height).toBe(0);
});

test('each row stretches to its tallest item without equalizing all rows', async ({ page }) => {
  await openStory(page, 'components-simplegrid--row-heights');
  const boxes = await items(page.getByTestId('height-grid'));
  expect(boxes[0]!.height).toBe(80);
  expect(boxes[1]!.height).toBe(80);
  expect(boxes[2]!.height).toBeLessThan(80);
  expect(boxes[3]!.height).toBe(boxes[2]!.height);
  expect(boxes[2]!.y - boxes[0]!.bottom).toBe(16);
});

test('scoped minimum and gap overrides inherit and reset at explicit theme boundaries', async ({ page }) => {
  await openStory(page, 'components-simplegrid--customization');
  const scoped = await items(page.getByTestId('scoped-grid'));
  const reset = await items(page.getByTestId('reset-grid'));
  const sibling = await items(page.getByTestId('sibling-grid'));
  expect(scoped.filter(box => box.y === 0)).toHaveLength(3);
  expect(scoped[1]!.x - scoped[0]!.right).toBe(24);
  expect(scoped[3]!.y - scoped[0]!.bottom).toBe(24);
  expect(reset.filter(box => box.y === 0)).toHaveLength(2);
  expect(reset[1]!.x - reset[0]!.right).toBe(16);
  expect(sibling).toEqual(reset);
});

test('hidden children leave no phantom cells or gaps', async ({ page }) => {
  await openStory(page, 'components-simplegrid--hidden-children');
  const boxes = await items(page.getByTestId('hidden-children'));
  expect(boxes.map(box => box.text)).toEqual(['First', 'Second', 'Third', 'Fourth']);
  expect(boxes[1]!.y).toBe(0);
  expect(boxes[1]!.x - boxes[0]!.right).toBe(16);
  expect(boxes[2]!.x).toBe(0);
  expect(boxes[2]!.y - boxes[0]!.bottom).toBe(16);
});

test('nested grids own independent direct-child track relationships', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openStory(page, 'components-simplegrid--nested');
  const outer = await items(page.getByTestId('outer-grid'));
  const inner = await items(page.getByTestId('inner-grid'));
  expect(outer.map(box => box.width)).toEqual([388, 388]);
  expect(outer[1]!.x - outer[0]!.right).toBe(24);
  expect(inner.filter(box => box.y === 0)).toHaveLength(3);
  expect(inner[1]!.x - inner[0]!.right).toBe(16);
  expect(inner[3]!.y - inner[0]!.bottom).toBe(16);
});

test('RTL reverses inline placement while preserving source and native tab order', async ({ page }) => {
  await openStory(page, 'components-simplegrid--right-to-left');
  const grid = page.getByTestId('rtl-grid');
  const boxes = await items(grid);
  expect(boxes.map(box => box.text)).toEqual(['First', 'Second', 'Third', 'Fourth']);
  expect(boxes[0]!.right).toBe(520);
  expect(boxes[1]!.x).toBe(0);
  expect(boxes[2]!.right).toBe(520);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'First', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Second', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Third', exact: true })).toBeFocused();
  await expect(grid).not.toHaveAttribute('role');
  await expect(grid).not.toHaveAttribute('tabindex');
});

test('native focus traverses wrapped cards and has clearance inside every card', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await openStory(page, 'components-simplegrid--composition');
  await page.getByRole('checkbox', { name: 'Follow Website refresh' }).focus();
  for (const name of ['Website refresh', 'Navigation update', 'Project archive']) {
    await expect(page.getByRole('checkbox', { name: `Follow ${name}` })).toBeFocused();
    await page.keyboard.press('Tab');
    const button = page.getByRole('button', { name: `Open ${name}` });
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS('outline-style', 'solid');
    const clearance = await button.evaluate(element => { const style = getComputedStyle(element); const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset); const box = element.getBoundingClientRect(); const card = element.closest('.fs-card')!.getBoundingClientRect(); return { left: box.left - ring >= card.left, right: box.right + ring <= card.right, top: box.top - ring >= card.top, bottom: box.bottom + ring <= card.bottom }; });
    expect(clearance).toEqual({ left: true, right: true, top: true, bottom: true });
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: `Preview ${name}` })).toBeFocused();
    await page.keyboard.press('Tab');
  }
  await expect(page.getByTestId('project-grid')).toHaveCSS('overflow', 'visible');
});

test('theme changes preserve geometry and the wrapper stays transparent', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await openStory(page, 'components-simplegrid--both-themes');
  expect(await items(page.getByTestId('theme-luna'))).toEqual(await items(page.getByTestId('theme-corporate')));
  await expect(page.getByTestId('theme-luna')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByTestId('theme-luna')).toHaveCSS('padding', '0px');
  await expect(page.getByTestId('theme-luna')).toHaveCSS('border-width', '0px');
});

test('consumer child margins are retained', async ({ page }) => {
  await openStory(page, 'components-simplegrid--consumer-margins');
  const boxes = await items(page.getByTestId('margin-grid'));
  expect(boxes[0]!.x).toBe(8);
  expect(boxes[0]!.width).toBe(236);
  expect(boxes[1]!.x - boxes[0]!.right).toBe(24);
});

test('grid shrinks within flex and grid parents below its preferred minimum', async ({ page }) => {
  await openStory(page, 'components-simplegrid--narrow-parents');
  expect((await items(page.getByTestId('flex-grid'))).map(box => box.width)).toEqual([200, 200, 200, 200, 200, 200]);
  expect((await items(page.getByTestId('grid-grid'))).map(box => box.width)).toEqual([200, 200, 200, 200, 200, 200]);
});

test('native hidden suppresses SimpleGrid despite its display rule', async ({ page }) => {
  await openStory(page, 'components-simplegrid--hidden');
  await expect(page.locator('.fs-simple-grid')).toHaveCSS('display', 'none');
});
