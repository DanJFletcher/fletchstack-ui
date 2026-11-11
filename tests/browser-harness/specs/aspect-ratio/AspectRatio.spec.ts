import type { Locator } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

/**
 * Measure the public outer frame rather than inferring geometry from inline CSS serialization.
 **/
async function geometry(frame: Locator) {
  return frame.evaluate(element => { const box = element.getBoundingClientRect(); return { width: box.width, height: box.height }; });
}

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} default frame derives its height from full available width`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await openScenario(mount, 'components-aspectratio--playground', { theme });
    expect(await geometry(page.getByTestId('default-frame'))).toEqual({ width: 640, height: 360 });
    const image = page.getByRole('img', { name: 'Illustration of mountain peaks beneath a blue sun' });
    await expect(image).toBeVisible();
    expect(await image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBe(640);
    expect(await geometry(image)).toEqual({ width: 640, height: 360 });
  });

  test(`${theme} AspectRatio presets have the documented proportions`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await openScenario(mount, 'components-aspectratio--ratios', { theme });
    for (const [name, height] of [['square', 240], ['landscape', 135], ['portrait', 320]] as const) {
      await test.step(`${theme} ${name} frames have the documented proportions`, async () => {
        expect(await geometry(page.getByTestId(`ratio-${name}`))).toEqual({ width: 240, height });
      });
    }
  });

  test(`${theme} same-viewport parent widths determine responsive frame height`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await openScenario(mount, 'components-aspectratio--responsive', { theme });
    expect(await geometry(page.getByTestId('responsive-wide'))).toEqual({ width: 640, height: 360 });
    expect(await geometry(page.getByTestId('responsive-narrow'))).toEqual({ width: 240, height: 135 });
    await page.setViewportSize({ width: 320, height: 1000 });
    expect(await geometry(page.getByTestId('responsive-wide'))).toEqual({ width: 272, height: 153 });
    expect(await geometry(page.getByTestId('responsive-narrow'))).toEqual({ width: 240, height: 135 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`${theme} enlarged captions reflow outside unchanged proportional frames at 320px`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-aspectratio--composition', { theme });
    const firstCard = page.getByTestId('media-grid').locator('.fs-card').first();
    const frame = firstCard.locator('.fs-aspect-ratio');
    const before = await geometry(frame);
    const captionBefore = (await firstCard.locator('figcaption').boundingBox())!.height;
    const cardBefore = (await firstCard.boundingBox())!.height;
    await page.addStyleTag({ content: 'html { font-size:200%; } * { line-height:1.5!important; letter-spacing:.12em!important; word-spacing:.16em!important; } p { margin-block-end:2em!important; }' });
    expect(await geometry(frame)).toEqual(before);
    expect((await firstCard.locator('figcaption').boundingBox())!.height).toBeGreaterThan(captionBefore);
    expect((await firstCard.boundingBox())!.height).toBeGreaterThan(cardBefore);
    const outside = await firstCard.evaluate(element => { const frameBox = element.querySelector('.fs-aspect-ratio')!.getBoundingClientRect(); const captionBox = element.querySelector('figcaption')!.getBoundingClientRect(); return captionBox.top >= frameBox.bottom; });
    expect(outside).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Open Mountain collection' }).focus();
    await expect(page.getByRole('button', { name: 'Open Mountain collection' })).toHaveCSS('outline-style', 'solid');
  });
}

test('media fitting belongs to the child while both frames stay square', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--media-fitting');
  expect(await geometry(page.getByTestId('fit-cover'))).toEqual({ width: 240, height: 240 });
  expect(await geometry(page.getByTestId('fit-contain'))).toEqual({ width: 240, height: 240 });
  await expect(page.getByTestId('fit-cover').getByRole('img')).toHaveCSS('object-fit', 'cover');
  await expect(page.getByTestId('fit-contain').getByRole('img')).toHaveCSS('object-fit', 'contain');
  expect(await geometry(page.getByTestId('fit-cover').getByRole('img'))).toEqual({ width: 240, height: 240 });
  expect(await geometry(page.getByTestId('fit-contain').getByRole('img'))).toEqual({ width: 240, height: 240 });
});

test('custom numeric and native style ratios both drive geometry', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--custom-ratio');
  const custom = await geometry(page.getByTestId('custom-frame'));
  expect(custom.width).toBe(640);
  expect(custom.height).toBeCloseTo(266.6667, 1);
  await openScenario(mount, 'components-aspectratio--native-style-override');
  expect(await geometry(page.getByTestId('override-frame'))).toEqual({ width: 240, height: 180 });
});

test('zero negative and non-finite ratios fall back to landscape', async ({ page, mount }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await openScenario(mount, 'components-aspectratio--invalid-ratios');
  for (const index of [0, 1, 2, 3, 4]) {
    expect(await geometry(page.getByTestId(`invalid-${index}`))).toEqual({ width: 240, height: 135 });
  }
});

test('native video controls fill the frame without wrapper playback behavior', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--video');
  const video = page.getByLabel('Project overview video');
  await expect(video).toHaveAttribute('controls');
  await expect(video).toHaveAttribute('preload', 'none');
  expect(await geometry(video)).toEqual(await geometry(page.getByTestId('video-frame')));
  await expect(page.getByTestId('video-frame')).not.toHaveAttribute('role');
});

test('titled local embeds fill the frame with native document content', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--embed');
  const embed = page.getByTitle('Project overview embed');
  expect(await geometry(embed)).toEqual(await geometry(page.getByTestId('embed-frame')));
  await expect(page.frameLocator('iframe[title="Project overview embed"]').getByText('Project overview preview')).toBeVisible();
});

test('oversized content remains visible without expanding the frame', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--overflow');
  const frame = page.getByTestId('overflow-frame');
  expect(await geometry(frame)).toEqual({ width: 240, height: 240 });
  const content = page.getByRole('img', { name: 'Oversized illustration' });
  expect(await geometry(content)).toEqual({ width: 400, height: 180 });
  await expect(frame).toHaveCSS('overflow', 'visible');
  const overflowing = await frame.evaluate(element => element.scrollWidth > element.clientWidth && getComputedStyle(element.firstElementChild!).overflow === 'visible');
  expect(overflowing).toBe(true);
});

test('native tab order skips the frame and focus rings can extend beyond its boundary', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--native-focus');
  await page.getByRole('button', { name: 'Before media' }).focus();
  await page.keyboard.press('Tab');
  const play = page.getByRole('button', { name: 'Play preview' });
  await expect(play).toBeFocused();
  await expect(play).toHaveCSS('outline-style', 'solid');
  const ring = await play.evaluate(element => { const style = getComputedStyle(element); const outset = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset); const button = element.getBoundingClientRect(); const frame = element.closest('.fs-aspect-ratio')!; const box = frame.getBoundingClientRect(); return { extendsLeft: button.left - outset < box.left, overflow: getComputedStyle(frame).overflow, contentOverflow: getComputedStyle(frame.firstElementChild!).overflow }; });
  expect(ring).toEqual({ extendsLeft: true, overflow: 'visible', contentOverflow: 'visible' });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After media' })).toBeFocused();
  await expect(page.getByTestId('focus-frame')).not.toHaveAttribute('tabindex');
});

test('themes preserve transparent unadorned frame geometry', async ({ page, mount }) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  await openScenario(mount, 'components-aspectratio--both-themes');
  expect(await geometry(page.getByTestId('theme-luna'))).toEqual(await geometry(page.getByTestId('theme-corporate')));
  const frame = page.getByTestId('theme-luna');
  await expect(frame).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(frame).toHaveCSS('padding', '0px');
  await expect(frame).toHaveCSS('border-width', '0px');
  await expect(frame).toHaveCSS('border-radius', '0px');
  await expect(frame).toHaveCSS('box-shadow', 'none');
});

test('nested frames reserve independent heights', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--nested');
  expect(await geometry(page.getByTestId('outer-frame'))).toEqual({ width: 640, height: 640 });
  expect(await geometry(page.getByTestId('inner-frame'))).toEqual({ width: 240, height: 135 });
});

test('frames shrink in flex and grid parents without cross-axis stretching', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--narrow-parents');
  expect(await geometry(page.getByTestId('flex-frame'))).toEqual({ width: 200, height: 112.5 });
  expect(await geometry(page.getByTestId('grid-frame'))).toEqual({ width: 200, height: 112.5 });
});

test('RTL changes direction without changing responsive proportions', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--responsive');
  await page.addStyleTag({ content: 'html { direction:rtl; }' });
  expect(await geometry(page.getByTestId('responsive-wide'))).toEqual({ width: 640, height: 360 });
  expect(await geometry(page.getByTestId('responsive-narrow'))).toEqual({ width: 240, height: 135 });
});

test('empty and hidden frames retain their native layout contracts', async ({ page, mount }) => {
  await openScenario(mount, 'components-aspectratio--empty');
  expect(await geometry(page.getByTestId('empty-frame'))).toEqual({ width: 240, height: 135 });
  await openScenario(mount, 'components-aspectratio--hidden');
  await expect(page.locator('.fs-aspect-ratio')).toHaveCSS('display', 'none');
});
