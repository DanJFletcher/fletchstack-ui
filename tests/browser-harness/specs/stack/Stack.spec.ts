import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

/**
 * Measure real participating item separation without assuming item heights.
 **/
async function itemGaps(stack: Locator) {
  return stack.evaluate(element => {
    const boxes = [...element.children].filter(child => getComputedStyle(child).display !== 'none').map(child => child.getBoundingClientRect());

    return boxes.slice(1).map((box, index) => box.top - boxes[index]!.bottom);
  });
}

/**
 * Read logical alignment as physical edges along with the preserved child order.
 **/
async function alignment(stack: Locator) {
  return stack.evaluate(element => {
    const parent = element.getBoundingClientRect();
    const first = element.children[0]!.getBoundingClientRect();

    return { start: first.left - parent.left, end: parent.right - first.right, width: first.width, parent: parent.width, fixed: element.children[1]!.getBoundingClientRect().width, order: [...element.children].map(child => child.textContent) };
  });
}

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Stack gap presets preserve every relationship`, async ({ page, mount }) => {
    await openScenario(mount, 'components-stack--gaps', { theme });
    for (const [gap, pixels] of [['none', 0], ['related', 16], ['group', 24], ['section', 64]] as const) {
      await test.step(`${theme} ${gap} Stack uses the existing ${pixels}px relationship`, async () => {
        expect(await itemGaps(page.getByTestId(`gap-${gap}`))).toEqual([pixels, pixels]);
        await expect(page.getByTestId(`gap-${gap}`)).toHaveCSS('flex-direction', 'column');
      });
    }
  });

  test(`${theme} form remains usable at 320px with enlarged and spaced text`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-stack--form-composition', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    await expect(page.getByRole('textbox', { name: 'Project name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Email updates' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Project name' }).fill('Readable project');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('status')).toHaveText('Project settings saved.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('Stack alignment presets honor fixed widths', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--alignments');
  for (const align of ['stretch', 'start', 'center', 'end'] as const) {
    await test.step(`${align} alignment controls only the cross axis and honors fixed child widths`, async () => {
      const box = await alignment(page.getByTestId(`align-${align}`));
      expect(box.fixed).toBe(120);
      expect(box.order).toEqual(['One', 'Two', 'Three']);
      const expected = { stretch: { start: 0, end: 0 }, start: { start: 0 }, center: { start: box.end }, end: { end: 0 } };
      expect(box).toMatchObject(expected[align]);
    });
  }
});

for (const [align, edge] of [['start', 'end'], ['end', 'start']] as const) {
  test(`RTL ${align} follows writing direction without reordering`, async ({ page, mount }) => {
    await openScenario(mount, 'components-stack--alignments');
    await page.addStyleTag({ content: 'html { direction: rtl; }' });
    const box = await alignment(page.getByTestId(`align-${align}`));
    expect(box[edge]).toBe(0);
    expect(box.order).toEqual(['One', 'Two', 'Three']);
  });
}

test('default Stack has related gaps and no inset, surface, boundary or focus stop', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--playground');
  const stack = page.getByTestId('default-stack');
  expect(await itemGaps(stack)).toEqual([16, 16]);
  await expect(stack).toHaveCSS('align-items', 'stretch');
  await expect(stack).toHaveCSS('padding', '0px');
  await expect(stack).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(stack).toHaveCSS('border-top-width', '0px');
  await expect(stack).toHaveCSS('box-shadow', 'none');
  await expect(stack).toHaveCSS('overflow', 'visible');
  await expect(stack).not.toHaveAttribute('tabindex');
  await expect(stack).not.toHaveAttribute('role');
});

test('nested Stacks own independent direct-child gaps', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--nested');
  expect(await itemGaps(page.getByTestId('outer-stack'))).toEqual([24]);
  expect(await itemGaps(page.getByTestId('inner-stack'))).toEqual([16, 16]);
});

test('hidden children reserve no space or extra gap', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--hidden-children');
  expect(await itemGaps(page.getByTestId('hidden-children'))).toEqual([16]);
  await expect(page.getByText('Hidden', { exact: true })).toBeHidden();
  await expect(page.getByText('Not displayed', { exact: true })).toBeHidden();
});

test('consumer child margins remain additional to the Stack gap', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--consumer-margins');
  expect(await itemGaps(page.getByTestId('margin-stack'))).toEqual([24]);
  await expect(page.getByText('First', { exact: true })).toHaveCSS('margin-bottom', '8px');
});

test('scoped spacing overrides preserve independent roles and nested theme resets', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--scoped-overrides');
  expect(await itemGaps(page.getByTestId('scoped-stack'))).toEqual([32, 32]);
  expect(await itemGaps(page.getByTestId('independent-stack'))).toEqual([24, 24]);
  expect(await itemGaps(page.getByTestId('reset-stack'))).toEqual([16, 16]);
  expect(await itemGaps(page.getByTestId('sibling-stack'))).toEqual([16, 16]);
});

test('consumer responsive gap CSS changes spacing while Stack stays vertical', async ({ page, mount }) => {
  await page.setViewportSize({ width: 601, height: 900 });
  await openScenario(mount, 'components-stack--responsive-gap');
  const stack = page.getByTestId('responsive-stack');
  expect(await itemGaps(stack)).toEqual([64, 64]);
  await page.setViewportSize({ width: 600, height: 900 });
  expect(await itemGaps(stack)).toEqual([32, 32]);
  await page.setViewportSize({ width: 320, height: 900 });
  expect(await itemGaps(stack)).toEqual([32, 32]);
  await expect(stack).toHaveCSS('flex-direction', 'column');
});

test('Stack can shrink within narrow flex/grid parents', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--narrow-parents');
  await expect(page.getByTestId('flex-stack')).toHaveCSS('width', '160px');
  await expect(page.getByTestId('grid-stack')).toHaveCSS('width', '160px');
  await expect(page.getByTestId('flex-stack')).toHaveCSS('min-width', '0px');
  await expect(page.getByTestId('grid-stack')).toHaveCSS('min-width', '0px');
});

test('long children grow under text enlargement with no fixed Stack height or clipping', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await openScenario(mount, 'components-stack--long-content');
  const stack = page.getByTestId('long-stack');
  const before = await stack.boundingBox();
  await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
  const after = await stack.boundingBox();
  expect(after!.height).toBeGreaterThan(before!.height);
  await expect(stack).toHaveCSS('overflow', 'visible');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('Stack preserves form keyboard order and focus clearance inside Container', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await openScenario(mount, 'components-stack--form-composition');
  await page.getByRole('textbox', { name: 'Project name' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('textbox', { name: 'Description' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('checkbox', { name: 'Email updates' })).toBeFocused();
  await page.keyboard.press('Tab');
  const button = page.getByRole('button', { name: 'Save changes' });
  await expect(button).toBeFocused();
  await expect(button).toHaveCSS('outline-style', 'solid');
  const clearance = await button.evaluate(element => {
    const style = getComputedStyle(element);
    const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
    const box = element.getBoundingClientRect();
    const parent = element.closest('.fs-container')!.getBoundingClientRect();

    return { left: box.left - ring >= parent.left, right: box.right + ring <= parent.right, clipping: [...element.closest('form')!.querySelectorAll('.fs-stack')].some(stack => getComputedStyle(stack).overflow !== 'visible') };
  });
  expect(clearance).toEqual({ left: true, right: true, clipping: false });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Reset form' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveValue('Website refresh');
});

test('Corporate and Luna keep the same layout relationships', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--both-themes');
  const corporate = page.locator('[data-theme="corporate"].theme-panel > .fs-stack');
  const luna = page.locator('[data-theme="luna"].theme-panel > .fs-stack');
  expect(await itemGaps(corporate)).toEqual([24, 24]);
  expect(await itemGaps(luna)).toEqual([24, 24]);
});

test('native hidden suppresses the complete Stack', async ({ page, mount }) => {
  await openScenario(mount, 'components-stack--hidden');
  await expect(page.locator('.fs-stack')).toHaveCSS('display', 'none');
});
