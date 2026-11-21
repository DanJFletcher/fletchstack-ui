import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} keyboard navigation hides inactive links and preserves local state`, async ({ page, mount }) => {
    await openScenario(mount, 'components-carousel--playground', { theme });
    const carousel = page.getByRole('region', { name: 'Featured stories' });
    await page.keyboard.press('Tab'); await expect(carousel).toBeFocused();
    await expect(carousel).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Explore focus' })).toBeFocused();
    await page.keyboard.press('Enter'); await expect(page).toHaveURL(/#focus$/);
    await page.getByRole('textbox').fill('Saved note');
    await carousel.focus(); await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('link', { name: 'Explore focus' })).not.toBeVisible();
    await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Explore flow' })).toBeFocused();
    await carousel.focus(); await page.keyboard.press('Home'); await expect(page.getByRole('textbox')).toHaveValue('Saved note');
    await page.keyboard.press('End'); await expect(page.getByRole('button', { name: 'Next slide' })).toBeDisabled();
    await page.getByRole('button', { name: 'Go to slide 2' }).click();
    await expect(page.getByRole('group', { name: 'Build your flow, 2 of 3' })).toBeVisible();
  });
}

test('controlled requests update the parent and can reset', async ({ page, mount }) => {
  await openScenario(mount, 'components-carousel--controlled');
  await page.getByRole('button', { name: 'Next slide' }).click();
  await expect(page.getByRole('status', { name: 'Selected slide' })).toHaveText('3');
  await page.getByRole('button', { name: 'Reset selection' }).click();
  await expect(page.getByRole('link', { name: 'Explore focus' })).toBeVisible();
});

test('autoplay pauses on hover and stops on focus until explicitly restarted', async ({ page, mount }) => {
  await page.clock.install(); await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openScenario(mount, 'components-carousel--playground', { args: { autoPlay: true, autoPlayInterval: 1000, loop: true } });
  await page.mouse.move(0, 0); await page.clock.runFor(1000);
  await expect(page.getByRole('group', { name: 'Build your flow, 2 of 3' })).toBeVisible();
  const carousel = page.getByRole('region', { name: 'Featured stories' });
  await carousel.hover(); await page.clock.runFor(3000);
  await expect(page.getByRole('group', { name: 'Build your flow, 2 of 3' })).toBeVisible();
  await page.mouse.move(0, 0); await page.clock.runFor(1000);
  await expect(page.getByRole('group', { name: 'Move forward, 3 of 3' })).toBeVisible();
  await carousel.focus(); await page.clock.runFor(3000);
  await expect(page.getByRole('group', { name: 'Move forward, 3 of 3' })).toBeVisible();
  await page.getByRole('button', { name: 'Start slide rotation' }).focus(); await page.keyboard.press('Enter');
  await page.clock.runFor(1000);
  await expect(page.getByRole('group', { name: 'Find your focus, 1 of 3' })).toBeVisible();
});

test('live reduced motion disables rotation and transitions', async ({ page, mount }) => {
  await page.clock.install(); await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openScenario(mount, 'components-carousel--playground', { args: { autoPlay: true } });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Start slide rotation' })).toBeDisabled();
  await page.clock.runFor(10000);
  const slide = page.getByRole('group', { name: 'Find your focus, 1 of 3' });
  await expect(slide).toBeVisible(); await expect(slide).toHaveCSS('transition-duration', '0s');
});

test('touch gestures preserve vertical scroll', async ({ page, mount }) => {
  await openScenario(mount, 'components-carousel--playground');
  const viewport = page.locator('.fs-carousel__viewport');
  await expect(viewport).toHaveCSS('touch-action', 'pan-y');
  await viewport.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 200, clientY: 100 });
  await viewport.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 50, clientY: 110 });
  await expect(page.getByRole('link', { name: 'Explore flow' })).toBeVisible();
});

test('narrow overlay controls use normal flow with enlarged text', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-carousel--playground', { args: { controlsPosition: 'overlay', overlaySafeArea: false } });
  await page.addStyleTag({ content: 'html{font-size:200%}.fs-carousel{letter-spacing:.12em;word-spacing:.16em;line-height:1.5}' });
  await expect(page.locator('.fs-carousel__controls')).toHaveCSS('position', 'static');
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.verification/carousel-narrow.png' });
});

test('many indicators wrap without shrinking targets', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-carousel--many');
  const target = page.getByRole('button', { name: 'Go to slide 12' });
  await expect(target).toHaveCSS('width', '44px'); await expect(target).toHaveCSS('height', '44px');
  await target.click(); await expect(target).toHaveAttribute('aria-current', 'true');
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth)).toBe(true);
});

test('reserved frames contain scrollable long content', async ({ page, mount }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await openScenario(mount, 'components-carousel--reserved');
  const viewport = page.locator('.fs-carousel__viewport'), slide = page.getByRole('group', { name: '1 of 2' });
  const box = (await viewport.boundingBox())!;
  expect(box.width / box.height).toBeCloseTo(16 / 9, 1);
  expect(await slide.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await slide.evaluate(el => { el.scrollTop = el.scrollHeight; });
  await expect(page.getByRole('link', { name: 'Read the story' })).toBeInViewport();
});

test('themes inherit and overrides stay scoped', async ({ page, mount }) => {
  await openScenario(mount, 'components-carousel--composition');
  const regions = page.getByRole('region', { name: 'Featured stories' });
  expect(await regions.nth(0).evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(await regions.nth(1).evaluate(el => getComputedStyle(el).backgroundColor));
  await page.screenshot({ path: '.verification/carousel-composition.png', fullPage: true });
  await openScenario(mount, 'components-carousel--overrides');
  await expect(page.getByRole('region', { name: 'Custom gallery' })).toHaveCSS('border-radius', '32px');
  await expect(page.getByRole('region', { name: 'Default gallery' })).toHaveCSS('border-radius', '12px');
});

test('RTL arrows mirror logical navigation', async ({ page, mount }) => {
  await openScenario(mount, 'components-carousel--playground');
  const carousel = page.getByRole('region'); await carousel.evaluate(el => { el.setAttribute('dir', 'rtl'); });
  await carousel.focus(); await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('link', { name: 'Explore flow' })).toBeVisible();
  await page.keyboard.press('Home'); await expect(page.getByRole('link', { name: 'Explore focus' })).toBeVisible();
});

// Wrapped controls need their full intrinsic height, not one row of reserved space.
test('wide safe-area overlays keep wrapped controls clear of slide text', async ({ page, mount }) => {
  await page.setViewportSize({ width: 640, height: 1000 });
  await openScenario(mount, 'components-carousel--many', { args: { controlsPosition: 'overlay' } });
  const controls = page.locator('.fs-carousel__controls');
  await expect.poll(async () => {
    const message = (await page.getByRole('group', { name: 'Gallery item 1, 1 of 12' }).locator('p').boundingBox())!;
    const panel = (await controls.boundingBox())!;
    return panel.y >= message.y + message.height;
  }).toBe(true);
  await page.getByRole('button', { name: 'Go to slide 12' }).click();
  await expect(page.getByRole('group', { name: 'Gallery item 12, 12 of 12' })).toBeVisible();
});
