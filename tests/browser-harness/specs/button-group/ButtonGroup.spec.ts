import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

/**
 * Measure visible actions in DOM order, including logical corners and border widths.
 **/
async function edges(group: Locator) {
  return group.locator('button:not([hidden])').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    return { left: box.left, right: box.right, top: box.top, bottom: box.bottom, width: box.width, height: box.height, border: parseFloat(style.borderInlineStartWidth), corners: [style.borderStartStartRadius, style.borderStartEndRadius, style.borderEndStartRadius, style.borderEndEndRadius] };
  }));
}

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} joined rows and columns share one seam and only outside corners`, async ({ page, mount }) => {
    const radius = theme === 'luna' ? '12px' : '4px';
    await openScenario(mount, 'components-button-group--joined', { theme });
    const row = await edges(page.getByRole('group'));
    expect(row.map(button => button.corners)).toEqual([[radius, '0px', radius, '0px'], ['0px', '0px', '0px', '0px'], ['0px', radius, '0px', radius]]);
    expect(row[1]!.left - row[0]!.right).toBe(-row[1]!.border);
    expect(row[2]!.left - row[1]!.right).toBe(-row[2]!.border);
    await expect(page.getByRole('group')).toHaveCSS('flex-wrap', 'nowrap');
    await openScenario(mount, 'components-button-group--vertical-joins', { theme });
    const column = await edges(page.getByRole('group'));
    expect(column.map(button => button.corners)).toEqual([[radius, radius, '0px', '0px'], ['0px', '0px', '0px', '0px'], ['0px', '0px', radius, radius]]);
    expect(column[1]!.top - column[0]!.bottom).toBe(-column[1]!.border);
    expect(column[2]!.top - column[1]!.bottom).toBe(-column[2]!.border);
    expect(column[0]!.width).toBe(column[2]!.width);
  });

  test(`${theme} hidden edge and interior actions retain correct live joins`, async ({ page, mount }) => {
    const radius = theme === 'luna' ? '12px' : '4px';
    await openScenario(mount, 'components-button-group--hidden-edges', { theme });
    const row = page.getByRole('group', { name: 'Hidden horizontal edges' });
    const column = page.getByRole('group', { name: 'Hidden vertical edges' });
    expect((await edges(row)).map(button => button.corners)).toEqual([[radius, '0px', radius, '0px'], ['0px', radius, '0px', radius]]);
    expect((await edges(column)).map(button => button.corners)).toEqual([[radius, radius, '0px', '0px'], ['0px', '0px', radius, radius]]);
    expect((await edges(page.getByRole('group', { name: 'Single visible action' })))[0]!.corners).toEqual([radius, radius, radius, radius]);
    await page.getByRole('button', { name: 'Toggle edge actions' }).click();
    const visible = await edges(row);
    expect(visible).toHaveLength(5);
    expect(visible[0]!.corners).toEqual([radius, '0px', radius, '0px']);
    expect(visible[4]!.corners).toEqual(['0px', radius, '0px', radius]);
    expect(visible[4]!.left - visible[3]!.right).toBe(-1);
    await page.getByRole('button', { name: 'Toggle edge actions' }).click();
    expect(await edges(row)).toHaveLength(2);
  });

  test(`${theme} joined middle focus paints above neighbors without clipping`, async ({ page, mount }) => {
    await openScenario(mount, 'components-button-group--joined-focus', { theme });
    await page.getByRole('button', { name: 'Save draft' }).click();
    await page.keyboard.press('Tab');
    const middle = page.getByRole('button', { name: 'Preview' });
    await expect(middle).toBeFocused();
    await expect(middle).toHaveCSS('outline-style', 'solid');
    await expect(middle).toHaveCSS('z-index', '1');
    await expect(page.getByRole('group')).toHaveCSS('overflow', 'visible');
    const clearance = await middle.evaluate(element => { const box = element.getBoundingClientRect(); const style = getComputedStyle(element); const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset); return box.left - ring >= 0 && box.top - ring >= 0 && box.right + ring <= innerWidth; });
    expect(clearance).toBe(true);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Publish' })).toBeFocused();
    await page.emulateMedia({ forcedColors: 'active' });
    await expect(page.getByRole('button', { name: 'Publish' })).toHaveCSS('outline-style', 'solid');
  });

  test(`${theme} separated actions wrap intrinsically with a 12px gap in narrow parents`, async ({ page, mount }) => {
    await openScenario(mount, 'components-button-group--wrapping', { theme });
    const wide = await edges(page.getByRole('group', { name: 'Wide actions' }));
    const narrow = await edges(page.getByRole('group', { name: 'Narrow actions' }));
    expect(wide[2]!.top).toBe(wide[0]!.top);
    expect(narrow[2]!.top).toBeGreaterThan(narrow[0]!.top);
    expect(narrow[1]!.left - narrow[0]!.right).toBe(12);
    expect(narrow[2]!.top - narrow[0]!.bottom).toBe(12);
    await expect(page.getByRole('group', { name: 'Unwrapped actions' })).toHaveCSS('flex-wrap', 'nowrap');
  });

  test(`${theme} long labels reflow at 320px with 200% text and user spacing`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-button-group--long-labels', { theme });
    await page.addStyleTag({ content: 'html {font-size:200%} * {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const group of await page.getByRole('group').all()) {
      const boxes = await edges(group);
      expect(boxes.every(box => box.height >= 44 && box.left >= 0 && box.right <= 320)).toBe(true);
      await expect(group).toHaveCSS('overflow', 'visible');
    }
  });
}

test('RTL joins follow source order from inline start and preserve logical corners', async ({ page, mount }) => {
  await openScenario(mount, 'components-button-group--rtl');
  const row = await edges(page.getByRole('group'));
  expect(row[0]!.left).toBeGreaterThan(row[1]!.left);
  expect(row[0]!.left - row[1]!.right).toBe(-1);
  expect(row.map(button => button.corners)).toEqual([['4px', '0px', '4px', '0px'], ['0px', '0px', '0px', '0px'], ['0px', '4px', '0px', '4px']]);
  await page.getByRole('button', { name: 'Save draft' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Preview' })).toBeFocused();
});

test('fullWidth and equalWidth are independent and final wrapped rows expand equally', async ({ page, mount }) => {
  await openScenario(mount, 'components-button-group--widths');
  const intrinsic = await page.getByRole('group', { name: 'Intrinsic', exact: true }).boundingBox();
  const full = await page.getByRole('group', { name: 'Full width', exact: true }).boundingBox();
  expect(intrinsic!.width).toBeLessThan(full!.width);
  expect(full!.width).toBe(600);
  const equal = await edges(page.getByRole('group', { name: 'Equal width', exact: true }));
  expect(Math.abs(equal[0]!.width - equal[1]!.width)).toBeLessThan(0.1);
  const wrapped = await edges(page.getByRole('group', { name: 'Equal wrapped rows' }));
  expect(wrapped[1]!.top).toBe(wrapped[0]!.top);
  expect(wrapped[4]!.width).toBe(140);
  expect(wrapped[4]!.top).toBeGreaterThan(wrapped[2]!.top);
  const column = await edges(page.getByRole('group', { name: 'Equal column' }));
  expect(column.map(button => button.width)).toEqual([600, 600, 600]);
});

test('alignment remains on the logical inline axis in both orientations and RTL', async ({ page, mount }) => {
  await openScenario(mount, 'components-button-group--alignments');
  for (const direction of ['ltr', 'rtl']) {
    await page.locator('html').evaluate((element, dir) => element.setAttribute('dir', dir), direction);
    for (const orientation of ['horizontal', 'vertical']) {
      const start = page.getByRole('group', { name: `${orientation} start` });
      const end = page.getByRole('group', { name: `${orientation} end` });
      const center = page.getByRole('group', { name: `${orientation} center` });
      const startBox = (await start.boundingBox())!;
      const endBox = (await end.boundingBox())!;
      const startChild = (await edges(start))[0]!;
      const endChildren = await edges(end);
      expect(direction === 'ltr' ? startChild.left - startBox.x : startBox.x + startBox.width - startChild.right).toBe(0);
      const endChild = orientation === 'vertical' ? endChildren[0]! : endChildren.at(-1)!;
      expect(direction === 'ltr' ? endBox.x + endBox.width - endChild.right : endChild.left - endBox.x).toBe(0);
      const children = await edges(center);
      const outer = (await center.boundingBox())!;
      const min = Math.min(...children.map(child => child.left));
      const max = Math.max(...children.map(child => child.right));
      expect(Math.abs((min - outer.x) - (outer.x + outer.width - max))).toBeLessThan(0.1);
    }
  }
});

test('CSS token scopes retain action gaps and nested themes reset them', async ({ page, mount }) => {
  await openScenario(mount, 'components-button-group--scoped-gap');
  await expect(page.getByRole('group', { name: 'Scoped actions' })).toHaveCSS('gap', '20px');
  await expect(page.getByRole('group', { name: 'Reset actions' })).toHaveCSS('gap', '12px');
  await expect(page.getByRole('group', { name: 'Sibling actions' })).toHaveCSS('gap', '12px');
});

test('native Tab, Enter, Space, external submit and reset remain action-owned', async ({ page, mount }) => {
  await openScenario(mount, 'components-button-group--composition');
  const group = page.getByRole('group', { name: 'Article actions' });
  await expect(group).toHaveAttribute('aria-labelledby', 'editor-actions');
  await expect(group).not.toHaveAttribute('tabindex');
  await page.getByRole('button', { name: 'Save draft' }).focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('status')).toHaveText('Draft saved');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Preview', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Preview opened');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Published');
  await page.getByRole('textbox', { name: 'Article title' }).fill('Changed title');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('textbox')).toHaveValue('Draft article');
});

test('disabled group actions cannot be re-enabled and disabled children leave the tab sequence', async ({ page, mount }) => {
  await openScenario(mount, 'components-button-group--disabled-actions');
  for (const button of await page.getByRole('group', { name: 'Page actions' }).getByRole('button').all()) {
    await expect(button).toBeDisabled();
  }
  await page.getByRole('button', { name: 'Save', exact: true }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Delete' })).not.toBeFocused();
});

test('native hidden removes the group from layout', async ({ page, mount }) => {
  await openScenario(mount, 'components-button-group--hidden');
  await expect(page.locator('.fs-button-group')).toHaveCSS('display', 'none');
});
