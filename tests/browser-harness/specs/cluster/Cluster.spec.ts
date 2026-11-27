import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

/**
 * Read visible direct-item rectangles relative to the Cluster's own border box.
 **/
async function items(cluster: Locator) {
  return cluster.evaluate((element) => {
    const parent = element.getBoundingClientRect();

    return [...element.children]
      .filter((child) => getComputedStyle(child).display !== 'none')
      .map((child) => {
        const box = child.getBoundingClientRect();

        return {
          x: box.left - parent.left,
          right: box.right - parent.left,
          y: box.top - parent.top,
          bottom: box.bottom - parent.top,
          width: box.width,
          height: box.height,
          text: child.textContent,
        };
      });
  });
}

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Cluster gap presets control both axes`, async ({ page, mount }) => {
    await openScenario(mount, 'components-cluster--gaps', { theme });
    for (const [gap, pixels] of [
      ['none', 0],
      ['actions', 12],
      ['related', 16],
    ] as const) {
      await test.step(`${theme} ${gap} uses ${pixels}px on both row and column axes`, async () => {
        const boxes = await items(page.getByTestId(`gap-${gap}`));
        expect(boxes[1]!.x - boxes[0]!.right).toBe(pixels);
        expect(boxes[2]!.y - boxes[0]!.bottom).toBe(pixels);
      });
    }
  });

  test(`${theme} identical intrinsic actions wrap at a narrow parent in the same viewport`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openScenario(mount, 'components-cluster--wrapping', { theme });
    const wide = await items(page.getByTestId('wrap-wide'));
    const narrow = await items(page.getByTestId('wrap-narrow'));
    expect(new Set(wide.map((box) => box.y)).size).toBe(1);
    expect(new Set(narrow.map((box) => box.y)).size).toBeGreaterThan(1);
    expect(wide.map((box) => box.width)).toEqual(narrow.map((box) => box.width));
    expect(new Set(wide.map((box) => box.width)).size).toBeGreaterThan(1);
    expect(wide[2]!.right).toBeLessThan(640);
    expect(wide.map((box) => box.text)).toEqual(['Save changes', 'Preview', 'Cancel']);
    expect(narrow.map((box) => box.text)).toEqual(['Save changes', 'Preview', 'Cancel']);
    await expect(page.getByTestId('wrap-narrow')).toHaveCSS('flex-direction', 'row');
    await expect(page.getByTestId('wrap-narrow')).toHaveCSS('flex-wrap', 'wrap');
  });

  test(`${theme} supported long labels shrink and grow at 320px with enlarged text and spacing`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-cluster--long-labels', { theme });
    const before = (await page.getByRole('button').first().boundingBox())!.height;
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }',
    });
    const boxes = await items(page.getByTestId('long-cluster'));
    expect(boxes[0]!.height).toBeGreaterThan(before);
    expect(boxes[1]!.y).toBeGreaterThanOrEqual(boxes[0]!.bottom + 12);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button').first().focus();
    await expect(page.getByRole('button').first()).toBeFocused();
    await expect(page.getByTestId('long-cluster')).toHaveCSS('overflow', 'visible');
  });
}

test('Cluster alignment presets control mixed heights', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--alignments');
  for (const align of ['start', 'center', 'end'] as const) {
    await test.step(`${align} aligns mixed heights within a row`, async () => {
      const boxes = await items(page.getByTestId(`align-${align}`));
      const positions = {
        start: boxes.map((box) => box.y),
        center: boxes.map((box) => box.y + box.height / 2),
        end: boxes.map((box) => box.bottom),
      };
      expect(new Set(positions[align]).size).toBe(1);
      expect(boxes.map((box) => box.height)).toEqual([24, 48, 16]);
    });
  }
});

test('baseline alignment shares the real baseline across mixed text sizes', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-cluster--baseline');
  const positions = await page
    .locator('.cluster-baseline-marker')
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
  expect(new Set(positions).size).toBe(1);
  const boxes = await items(page.getByTestId('baseline-cluster'));
  expect(boxes[1]!.height).toBeGreaterThan(boxes[0]!.height);
});

test('Cluster justification presets position wrapped rows', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--justification');
  for (const justify of ['start', 'center', 'end'] as const) {
    await test.step(`${justify} positions each wrapped row independently`, async () => {
      const boxes = await items(page.getByTestId(`justify-${justify}`));
      const expected = { start: [0, 92, 0], center: [24, 116, 70], end: [48, 140, 140] };
      expect(boxes.map((box) => box.x)).toEqual(expected[justify]);
      expect(boxes[2]!.y - boxes[0]!.bottom).toBe(12);
    });
  }
});

for (const [justify, expected] of [
  ['start', [140, 48, 140]],
  ['end', [92, 0, 0]],
] as const) {
  test(`RTL ${justify} justification respects inline direction on wrapped rows`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-cluster--justification');
    await page.addStyleTag({ content: 'html { direction: rtl; }' });
    const boxes = await items(page.getByTestId(`justify-${justify}`));
    expect(boxes.map((box) => box.x)).toEqual(expected);
    expect(boxes.map((box) => box.text)).toEqual(['One', 'Two', 'Three']);
  });
}

test('default Cluster stays passive and transparent without inset or forced child growth', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-cluster--playground');
  const cluster = page.getByTestId('default-cluster');
  await expect(cluster).toHaveCSS('align-items', 'center');
  expect((await items(cluster))[0]!.x).toBe(0);
  await expect(cluster).toHaveCSS('padding', '0px');
  await expect(cluster).toHaveCSS('border-top-width', '0px');
  await expect(cluster).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(cluster).toHaveCSS('box-shadow', 'none');
  await expect(cluster).toHaveCSS('overflow', 'visible');
  await expect(cluster).not.toHaveAttribute('role');
  await expect(cluster).not.toHaveAttribute('tabindex');
  expect(
    await cluster
      .getByRole('button')
      .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).flexGrow)),
  ).toEqual(['0', '0', '0']);
});

test('hidden children leave no phantom item gaps', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--hidden-children');
  const boxes = await items(page.getByTestId('hidden-children'));
  expect(boxes.map((box) => box.text)).toEqual(['First', 'Last']);
  expect(boxes[1]!.x - boxes[0]!.right).toBe(12);
  await expect(page.getByText('Hidden', { exact: true })).toBeHidden();
  await expect(page.getByText('Not displayed', { exact: true })).toBeHidden();
});

test('consumer margins remain additional to the Cluster gap', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--consumer-margins');
  const boxes = await items(page.getByTestId('margin-cluster'));
  expect(boxes[1]!.x - boxes[0]!.right).toBe(20);
  await expect(page.getByText('First', { exact: true })).toHaveCSS('margin-inline-end', '8px');
});

test('nested clusters independently own actions and related gaps', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--nested');
  const outer = await items(page.getByTestId('outer-cluster'));
  const inner = await items(page.getByTestId('inner-cluster'));
  expect(outer[1]!.x - outer[0]!.right).toBe(16);
  expect(inner[1]!.x - inner[0]!.right).toBe(12);
});

test('scoped gaps affect both axes while independent roles, nested themes and siblings retain defaults', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-cluster--scoped-overrides');
  for (const [id, gap] of [
    ['scoped-cluster', '24px'],
    ['independent-cluster', '16px'],
    ['reset-cluster', '12px'],
    ['sibling-cluster', '12px'],
  ]) {
    await expect(page.getByTestId(id!)).toHaveCSS('row-gap', gap!);
    await expect(page.getByTestId(id!)).toHaveCSS('column-gap', gap!);
  }
  const boxes = await items(page.getByTestId('scoped-cluster'));
  expect(boxes[1]!.y - boxes[0]!.bottom).toBe(24);
});

test('consumer responsive gaps do not change Cluster direction or wrap behavior', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 601, height: 900 });
  await openScenario(mount, 'components-cluster--responsive-gap');
  await expect(page.getByTestId('responsive-cluster')).toHaveCSS('gap', '12px');
  await page.setViewportSize({ width: 600, height: 900 });
  await expect(page.getByTestId('responsive-cluster')).toHaveCSS('gap', '24px');
  await expect(page.getByTestId('responsive-cluster')).toHaveCSS('flex-direction', 'row');
  await expect(page.getByTestId('responsive-cluster')).toHaveCSS('flex-wrap', 'wrap');
});

test('Cluster shrinks in flex/grid parents', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--narrow-parents');
  await expect(page.getByTestId('flex-cluster')).toHaveCSS('width', '160px');
  await expect(page.getByTestId('grid-cluster')).toHaveCSS('width', '160px');
  await expect(page.getByTestId('flex-cluster')).toHaveCSS('min-width', '0px');
  await expect(page.getByTestId('grid-cluster')).toHaveCSS('min-width', '0px');
});

test('wrapped actions preserve native tab order, interaction and focus clearance inside Container', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await openScenario(mount, 'components-cluster--composition');
  const cluster = page.getByTestId('project-actions');
  const buttons = cluster.getByRole('button');
  const tops = await buttons.evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().top),
  );
  expect(new Set(tops).size).toBeGreaterThan(1);
  await page.getByRole('textbox', { name: 'Project name' }).focus();
  for (const name of ['Save changes', 'Preview', 'Cancel']) {
    await page.keyboard.press('Tab');
    await expect(cluster.getByRole('button', { name })).toBeFocused();
    await expect(cluster.getByRole('button', { name })).toHaveCSS('outline-style', 'solid');
  }
  await buttons.first().focus();
  await page.keyboard.press('ArrowRight');
  await expect(buttons.first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Project changes saved.');
  const clearance = await buttons.evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
      const box = element.getBoundingClientRect();
      const parent = element.closest('.fs-container')!.getBoundingClientRect();

      return box.left - ring >= parent.left && box.right + ring <= parent.right;
    }),
  );
  expect(clearance).toEqual([true, true, true]);
  await expect(cluster).toHaveCSS('overflow', 'visible');
});

test('RTL action order remains native through wrapped rows', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--right-to-left');
  const cluster = page.getByTestId('rtl-cluster');
  expect(await cluster.getByRole('button').allTextContents()).toEqual([
    'Save changes',
    'Preview',
    'Cancel',
  ]);
  await cluster.getByRole('button', { name: 'Save changes' }).focus();
  await page.keyboard.press('Tab');
  await expect(cluster.getByRole('button', { name: 'Preview' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(cluster.getByRole('button', { name: 'Cancel' })).toBeFocused();
});

test('both themes share gap and wrapping behavior without Cluster supplying a surface', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-cluster--both-themes');
  for (const theme of ['corporate', 'luna']) {
    const cluster = page.locator(`[data-theme="${theme}"].theme-panel .fs-cluster`);
    await expect(cluster).toHaveCSS('gap', '12px');
    await expect(cluster).toHaveCSS('flex-wrap', 'wrap');
    await expect(cluster).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  }
});

test('native hidden suppresses Cluster and its children', async ({ page, mount }) => {
  await openScenario(mount, 'components-cluster--hidden');
  await expect(page.locator('.fs-cluster')).toHaveCSS('display', 'none');
});
