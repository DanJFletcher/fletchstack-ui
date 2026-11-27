import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

/**
 * Measure padding and actual content edges on a section with participating children.
 **/
async function geometry(section: Locator) {
  return section.evaluate((element) => {
    const style = getComputedStyle(element);
    const box = element.getBoundingClientRect();
    const first = element.firstElementChild!.getBoundingClientRect();
    const last = element.lastElementChild!.getBoundingClientRect();

    return {
      width: box.width,
      height: box.height,
      paddingStart: parseFloat(style.paddingBlockStart),
      paddingEnd: parseFloat(style.paddingBlockEnd),
      inlineStart: parseFloat(style.paddingInlineStart),
      inlineEnd: parseFloat(style.paddingInlineEnd),
      start: first.top - box.top,
      end: box.bottom - last.bottom,
    };
  });
}

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Section spacing presets pad both block edges`, async ({ page, mount }) => {
    await openScenario(mount, 'components-section--spacing-presets', { theme });
    for (const [spacing, padding, height] of [
      ['compact', 32, 84],
      ['default', 64, 148],
      ['spacious', 96, 212],
    ] as const) {
      await test.step(`${theme} ${spacing} applies ${padding}px at both block edges`, async () => {
        expect(await geometry(page.getByTestId(`spacing-${spacing}`))).toMatchObject({
          height,
          paddingStart: padding,
          paddingEnd: padding,
          inlineStart: 0,
          inlineEnd: 0,
          start: padding,
          end: padding,
        });
      });
    }
  });

  test(`${theme} responsive overrides are scoped and the component has no built-in breakpoint`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 1000, height: 1000 });
    await openScenario(mount, 'components-section--responsive', { theme });
    expect((await geometry(page.getByTestId('responsive-section'))).paddingStart).toBe(64);
    await page.setViewportSize({ width: 600, height: 1000 });
    expect((await geometry(page.getByTestId('responsive-section'))).paddingStart).toBe(32);
    expect((await geometry(page.getByTestId('responsive-section'))).paddingEnd).toBe(32);
    expect((await geometry(page.getByTestId('unmodified-section'))).paddingStart).toBe(64);
    await page.setViewportSize({ width: 601, height: 1000 });
    expect((await geometry(page.getByTestId('responsive-section'))).paddingStart).toBe(64);
  });

  test(`${theme} content grows and reflows at320px with enlarged text and user spacing`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-section--composition', { theme });
    const section = page.getByTestId('composed-section');
    const before = await geometry(section);
    await page.addStyleTag({
      content:
        'html { font-size:200%; } * { line-height:1.5!important; letter-spacing:.12em!important; word-spacing:.16em!important; } p { margin-block-end:2em!important; }',
    });
    const after = await geometry(section);
    expect(after.height).toBeGreaterThan(before.height);
    expect(after).toMatchObject({
      width: 272,
      paddingStart: 64,
      paddingEnd: 64,
      inlineStart: 0,
      inlineEnd: 0,
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(section.locator('.fs-container')).toHaveCSS('padding-inline', '16px');
    await page.getByRole('button', { name: 'Get started' }).focus();
    await expect(page.getByRole('button', { name: 'Get started' })).toHaveCSS(
      'outline-style',
      'solid',
    );
    await expect(section).toHaveCSS('overflow', 'visible');
  });
}

test('heading associations create native topics while div remains a visual wrapper', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-section--semantics');
  const region = page.getByRole('region', { name: 'A meaningful topic' });
  await expect(region).toHaveAttribute('aria-labelledby', 'semantic-title');
  await expect(region.getByRole('heading', { name: 'A meaningful topic', level: 2 })).toBeVisible();
  expect(await region.evaluate((element) => element.tagName)).toBe('SECTION');
  expect(await page.getByTestId('visual-section').evaluate((element) => element.tagName)).toBe(
    'DIV',
  );
  await expect(page.getByTestId('visual-section')).not.toHaveAttribute('role');
  await expect(region).not.toHaveAttribute('role');
  await expect(region).not.toHaveAttribute('tabindex');
});

test('scoped padding inherits while other presets gaps and theme boundaries stay independent', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-section--scoped-overrides');
  expect(await geometry(page.getByTestId('scoped-section'))).toMatchObject({
    paddingStart: 80,
    paddingEnd: 80,
    height: 180,
  });
  expect(await geometry(page.getByTestId('independent-preset'))).toMatchObject({
    paddingStart: 32,
    paddingEnd: 32,
    height: 84,
  });
  expect(await geometry(page.getByTestId('reset-section'))).toEqual(
    await geometry(page.getByTestId('sibling-section')),
  );
  expect((await geometry(page.getByTestId('reset-section'))).paddingStart).toBe(64);
  expect((await geometry(page.getByTestId('gap-independent-section'))).paddingStart).toBe(64);
  const roles = await page.getByTestId('scoped-section').evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      padding: style.getPropertyValue('--fs-section-padding-default').trim(),
      gap: style.getPropertyValue('--fs-layout-section-gap').trim(),
    };
  });
  expect(roles).toEqual({ padding: '80px', gap: '64px' });
  expect(
    await page
      .getByTestId('gap-independent-section')
      .evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--fs-layout-section-gap').trim(),
      ),
  ).toBe('12px');
});

test('adjacent sections contribute both padding edges without adding a parent gap', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-section--adjacent');
  const first = await page.getByTestId('adjacent-first').locator(':scope > div').boundingBox();
  const second = await page.getByTestId('adjacent-second').locator(':scope > div').boundingBox();
  expect(second!.y - first!.y - first!.height).toBe(128);
  expect((await geometry(page.getByTestId('adjacent-first'))).height).toBe(148);
  expect((await geometry(page.getByTestId('adjacent-second'))).height).toBe(148);
});

test('consumer margins remain additive to selected padding', async ({ page, mount }) => {
  await openScenario(mount, 'components-section--child-margins');
  expect(await geometry(page.getByTestId('margin-section'))).toMatchObject({
    height: 164,
    paddingStart: 64,
    paddingEnd: 64,
    start: 72,
    end: 72,
  });
});

test('nested sections independently own their padding without inserting sibling gaps', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-section--nested');
  expect(await geometry(page.getByTestId('outer-section'))).toMatchObject({
    height: 168,
    paddingStart: 32,
    paddingEnd: 32,
    start: 32,
    end: 32,
  });
  expect(await geometry(page.getByTestId('inner-section'))).toMatchObject({
    height: 84,
    paddingStart: 32,
    paddingEnd: 32,
    start: 32,
    end: 32,
  });
});

test('native tab order skips the section and padded composition leaves focus clearance', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 320, height: 1000 });
  await openScenario(mount, 'components-section--native-focus');
  await page.getByRole('button', { name: 'Before topic' }).focus();
  await page.keyboard.press('Tab');
  const open = page.getByRole('button', { name: 'Open project' });
  await expect(open).toBeFocused();
  await expect(open).toHaveCSS('outline-style', 'solid');
  const clearance = await open.evaluate((element) => {
    const style = getComputedStyle(element);
    const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
    const box = element.getBoundingClientRect();
    const section = element.closest('.fs-section')!.getBoundingClientRect();
    return {
      left: box.left - ring >= section.left,
      right: box.right + ring <= section.right,
      top: box.top - ring >= section.top,
      bottom: box.bottom + ring <= section.bottom,
    };
  });
  expect(clearance).toEqual({ left: true, right: true, top: true, bottom: true });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Preview project' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After topic' })).toBeFocused();
  await expect(page.getByTestId('focus-section')).toHaveCSS('overflow', 'visible');
  await expect(page.getByTestId('focus-section')).not.toHaveAttribute('tabindex');
});

test('theme changes preserve geometry and Section has no surface or boundary', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await openScenario(mount, 'components-section--both-themes');
  expect(await geometry(page.getByTestId('theme-luna'))).toEqual(
    await geometry(page.getByTestId('theme-corporate')),
  );
  await expect(page.getByTestId('theme-luna')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.getByTestId('theme-luna')).toHaveCSS('border-width', '0px');
  await expect(page.getByTestId('theme-luna')).toHaveCSS('box-shadow', 'none');
  await expect(page.getByTestId('theme-luna')).toHaveCSS('border-radius', '0px');
});

test('RTL keeps logical block padding without introducing inline gutters', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-section--spacing-presets');
  await page.addStyleTag({ content: 'html { direction:rtl; }' });
  expect(await geometry(page.getByTestId('spacing-default'))).toMatchObject({
    height: 148,
    paddingStart: 64,
    paddingEnd: 64,
    inlineStart: 0,
    inlineEnd: 0,
  });
});

test('vertical writing uses logical block edges instead of hard-coded top and bottom', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-section--spacing-presets');
  await page.addStyleTag({
    content: '[data-testid="spacing-default"] { writing-mode:vertical-rl; inline-size:200px; }',
  });
  const padding = await page.getByTestId('spacing-default').evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      top: style.paddingTop,
      bottom: style.paddingBottom,
      left: style.paddingLeft,
      right: style.paddingRight,
    };
  });
  expect(padding).toEqual({ top: '0px', bottom: '0px', left: '64px', right: '64px' });
});

test('sections shrink inside flex and grid parents while parents own placement', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-section--narrow-parents');
  expect(await geometry(page.getByTestId('flex-section'))).toMatchObject({
    width: 200,
    height: 148,
    paddingStart: 64,
    paddingEnd: 64,
  });
  expect(await geometry(page.getByTestId('grid-section'))).toMatchObject({
    width: 200,
    height: 148,
    paddingStart: 64,
    paddingEnd: 64,
  });
});

test('native padding styles take precedence over the selected preset', async ({ page, mount }) => {
  await openScenario(mount, 'components-section--native-style-override');
  expect(await geometry(page.getByTestId('style-section'))).toMatchObject({
    height: 44,
    paddingStart: 12,
    paddingEnd: 12,
    inlineStart: 0,
    inlineEnd: 0,
  });
});

test('native hidden suppresses the region and its controls', async ({ page, mount }) => {
  await openScenario(mount, 'components-section--hidden');
  await expect(page.locator('.fs-section')).toHaveCSS('display', 'none');
});
