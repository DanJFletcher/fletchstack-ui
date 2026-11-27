import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} keyboard description preserves focus and normal Tab order`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-tooltip--playground', { theme });
    const trigger = page.getByRole('button', { name: 'More information' });
    await expect(page.getByRole('tooltip')).not.toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAccessibleDescription(
      'Brief contextual help appears on hover or keyboard focus.',
    );
    await expect(trigger).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tooltip')).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tooltip')).not.toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Next action' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.getByRole('status', { name: 'Activations' })).toHaveText('1');
  });
  test(`${theme} hover help is hoverable, persistent and dismissible`, async ({ page, mount }) => {
    await openScenario(mount, 'components-tooltip--playground', { theme });
    const trigger = page.getByRole('button', { name: 'More information' }),
      tooltip = page.getByRole('tooltip');
    await trigger.hover();
    await expect(tooltip).toBeVisible();
    await tooltip.hover();
    await expect(tooltip).toBeVisible();
    await page.getByRole('button', { name: 'Next action' }).hover();
    await expect(tooltip).not.toBeVisible();
    await trigger.focus();
    await trigger.hover();
    await page.getByRole('button', { name: 'Next action' }).hover();
    await expect(tooltip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tooltip).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
}

test('retains an existing accessible description and native links', async ({ page, mount }) => {
  await openScenario(mount, 'components-tooltip--described');
  const trigger = page.getByRole('button', { name: 'Project help' });
  await trigger.focus();
  await expect(trigger).toHaveAccessibleDescription(
    'Existing project guidance. Additional contextual help.',
  );
  await openScenario(mount, 'components-tooltip--link');
  const link = page.getByRole('link', { name: 'Workspace docs' });
  await link.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await link.press('Enter');
  await expect(page).toHaveURL(/#workspace-docs$/);
});

test('names icon-only actions independently from tooltip descriptions', async ({ page, mount }) => {
  await openScenario(mount, 'components-tooltip--icon');
  const trigger = page.getByRole('button', { name: 'Workspace help' });
  await trigger.focus();
  await expect(trigger).toHaveAccessibleDescription('Learn about the current workspace.');
  await expect(page.getByRole('tooltip')).toBeVisible();
});

for (const placement of ['top', 'right', 'bottom', 'left']) {
  test(`${placement} placement uses its preferred edge when space allows`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-tooltip--placements');
    const trigger = page.getByRole('button', { name: placement, exact: true });
    await trigger.focus();
    await expect(page.getByRole('tooltip')).toHaveAttribute('data-side', placement);
  });
}

test('fits long enlarged text at 320px and flips near the top edge', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await openScenario(mount, 'components-tooltip--playground', {
    args: {
      content:
        'A supplementary description can wrap across multiple lines without extending beyond the narrow viewport. Keep essential instructions visible in the page.',
    },
  });
  await page.addStyleTag({
    content:
      'html{font-size:200%}.fs-tooltip__content{letter-spacing:.12em;word-spacing:.16em;line-height:1.5}',
  });
  await page.getByRole('button', { name: 'More information' }).focus();
  const tooltip = page.getByRole('tooltip');
  await expect(tooltip).toHaveAttribute('data-side', 'bottom');
  expect(
    await tooltip.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return (
        box.left >= 8 &&
        box.right <= innerWidth - 8 &&
        box.top >= 8 &&
        box.bottom <= innerHeight - 8
      );
    }),
  ).toBe(true);
  const anchorBox = (await page.getByRole('button', { name: 'More information' }).boundingBox())!;
  const tooltipBox = (await tooltip.boundingBox())!;
  expect(tooltipBox.y).toBeGreaterThanOrEqual(anchorBox.y + anchorBox.height + 8);
  expect(await tooltip.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
    true,
  );
  await page.screenshot({ path: '.verification/tooltip-narrow.png' });
});

test('uses a vertical fallback when horizontal help would cover its trigger', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await openScenario(mount, 'components-tooltip--playground', { args: { placement: 'right' } });
  const trigger = page.getByRole('button', { name: 'More information' }),
    tooltip = page.getByRole('tooltip');
  await trigger.focus();
  await expect(tooltip).toHaveAttribute('data-side', 'bottom');
  const triggerBox = (await trigger.boundingBox())!;
  expect((await tooltip.boundingBox())!.y).toBeGreaterThanOrEqual(
    triggerBox.y + triggerBox.height + 8,
  );
});

test('native top layer escapes transformed clipping', async ({ page, mount }) => {
  await openScenario(mount, 'components-tooltip--clipped');
  await page.getByRole('button', { name: 'Clipped panel help' }).focus();
  const tooltip = page.getByRole('tooltip'),
    clip = page.locator('.tooltip-demo__clipped');
  await expect(tooltip).toBeVisible();
  expect(await tooltip.evaluate((element) => element.matches(':popover-open'))).toBe(true);
  const box = (await tooltip.boundingBox())!,
    boundary = (await clip.boundingBox())!;
  expect(box.x + box.width).toBeGreaterThan(boundary.x + boundary.width);
  const hit = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.closest('[role="tooltip"]') !== null,
    { x: box.x + box.width - 5, y: box.y + box.height / 2 },
  );
  expect(hit).toBe(true);
});

test('follows ancestor scrolling and viewport resizing', async ({ page, mount }) => {
  await openScenario(mount, 'components-tooltip--scrollable');
  await page.getByRole('button', { name: 'Scrollable help' }).focus();
  const tooltip = page.getByRole('tooltip'),
    before = (await tooltip.boundingBox())!.y;
  await page.locator('.tooltip-demo__scroll').evaluate((element) => {
    element.scrollTop = 30;
  });
  await expect.poll(async () => (await tooltip.boundingBox())!.y).toBeLessThan(before);
  await page.setViewportSize({ width: 400, height: 500 });
  await expect(tooltip).toBeInViewport();
});

test('inherits nested theme tokens and isolates per-instance overrides', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-tooltip--composition');
  const day = page.locator('section.tooltip-demo__theme[data-theme="corporate"]'),
    night = page.locator('section.tooltip-demo__theme[data-theme="luna"]');
  await day.getByRole('button', { name: 'More information' }).focus();
  await expect(day.getByRole('tooltip')).toHaveCSS('border-radius', '6px');
  const dayColor = await day
    .getByRole('tooltip')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.screenshot({ path: '.verification/tooltip-corporate.png' });
  await night.getByRole('button', { name: 'More information' }).focus();
  await expect(night.getByRole('tooltip')).toHaveCSS('border-radius', '32px');
  expect(
    await night
      .getByRole('tooltip')
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(dayColor);
  await page.screenshot({ path: '.verification/tooltip-luna.png' });
  await openScenario(mount, 'components-tooltip--overrides');
  await page.getByRole('button', { name: 'Custom tooltip' }).focus();
  await expect(page.getByRole('tooltip')).toHaveCSS('border-radius', '20px');
  await page.getByRole('button', { name: 'Default tooltip' }).focus();
  await expect(page.getByRole('tooltip')).toHaveCSS('border-radius', '6px');
});

test('Escape closes the tooltip before its surrounding Popover', async ({ page, mount }) => {
  await openScenario(mount, 'components-tooltip--popover');
  await page.getByRole('button', { name: 'Project details' }).click();
  await page.getByRole('button', { name: 'Panel help' }).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).not.toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Panel help' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('Escape closes the tooltip before its surrounding native Dialog', async ({ page, mount }) => {
  await openScenario(mount, 'components-tooltip--dialog');
  await page.getByRole('button', { name: 'Open review' }).click();
  await page.getByRole('button', { name: 'More information' }).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).not.toBeVisible();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('forced colors preserves boundaries and reduced motion is immediate', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ forcedColors: 'active', reducedMotion: 'reduce' });
  await openScenario(mount, 'components-tooltip--playground');
  await page.getByRole('button', { name: 'More information' }).focus();
  await expect(page.getByRole('tooltip')).toHaveCSS('border-style', 'solid');
  await expect(page.getByRole('tooltip')).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).not.toBeVisible();
});

test.describe('touch', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test('tap toggles help without swallowing the action and outside tap dismisses', async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-tooltip--playground');
    const trigger = page.getByRole('button', { name: 'More information' });
    await trigger.tap();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page.getByRole('status', { name: 'Activations' })).toHaveText('1');
    await trigger.tap();
    await expect(page.getByRole('tooltip')).not.toBeVisible();
    await expect(page.getByRole('status', { name: 'Activations' })).toHaveText('2');
    await trigger.tap();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await page.getByRole('button', { name: 'Next action' }).tap();
    await expect(page.getByRole('tooltip')).not.toBeVisible();
  });
});
