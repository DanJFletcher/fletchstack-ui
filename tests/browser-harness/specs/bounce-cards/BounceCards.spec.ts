import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

const firstName = 'White lilies with red stamens';
const middleName = 'Pink clouds above misty blue mountains';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} native keyboard actions show focus immediately during entrance`, async ({ page, mount }) => {
    await openScenario(mount, 'components-bounce-cards--playground', { theme, args: { animationDelay: 5 } });
    const first = page.getByRole('button', { name: firstName });
    await page.keyboard.press('Tab');
    await expect(first).toBeFocused(); await expect(first).toHaveCSS('animation-name', 'none');
    await expect(first).toHaveCSS('outline-style', 'solid');
    await expect(first.locator('..')).toHaveAttribute('data-active', 'true');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status', { name: 'Selected photograph' })).toHaveText(firstName);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Golden woodland seen through rain' })).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.getByRole('status', { name: 'Selected photograph' })).toHaveText('Golden woodland seen through rain');
    await expect(first.locator('..')).toHaveAttribute('data-active', 'false');
    await expect(first).toHaveCSS('animation-name', 'none');
  });
  test(`${theme} hover straightens a stable photo and spreads neighbors`, async ({ page, mount }) => {
    await openScenario(mount, 'components-bounce-cards--playground', { theme });
    const root = page.getByRole('group', { name: 'Photo cards' });
    await root.evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished)); });
    const middle = page.getByRole('button', { name: middleName }).locator('..');
    const box = (await middle.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await expect(middle).toHaveAttribute('data-active', 'true');
    await expect.poll(() => middle.evaluate(el => el.style.getPropertyValue('--fan-rotation'))).toBe('0deg');
    await expect.poll(() => page.locator('.fs-bounce-cards__item').first().evaluate(el => el.style.getPropertyValue('--fan-x'))).toBe('-330px');
    await page.getByRole('button', { name: middleName }).click();
    await expect(page.getByRole('status', { name: 'Selected photograph' })).toHaveText(middleName);
    await page.mouse.move(0, 0);
    await expect(middle).toHaveAttribute('data-active', 'true');
    await page.getByRole('button', { name: middleName }).evaluate(el => (el as HTMLElement).blur());
    await expect(middle).toHaveAttribute('data-active', 'false');
  });
}

test('entrance has staggered overshoot and does not replay on inspection', async ({ page, mount }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openScenario(mount, 'components-bounce-cards--playground');
  const cards = page.locator('.fs-bounce-cards__card');
  await expect(cards.first()).toHaveCSS('animation-name', 'fs-bounce-cards-enter');
  await expect(cards.first()).toHaveCSS('animation-delay', '0.5s');
  await expect(cards.nth(1)).toHaveCSS('animation-delay', '0.56s');
  await expect(cards.first()).toHaveCSS('animation-duration', '0.72s');
  expect(await cards.first().evaluate(el => (el.getAnimations()[0]!.effect! as KeyframeEffect).getKeyframes().some(frame => String(frame['transform']).includes('1.09')))).toBe(true);
  await page.getByRole('group', { name: 'Photo cards' }).evaluate(async el => { await Promise.all(el.getAnimations({ subtree: true }).map(animation => animation.finished)); });
  const box = (await page.getByRole('button', { name: middleName }).boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  expect(await cards.first().evaluate(el => el.getAnimations().some(animation => animation instanceof CSSAnimation))).toBe(false);
});

test('live reduced motion removes the effect while preserving actions', async ({ page, mount }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openScenario(mount, 'components-bounce-cards--playground', { args: { animationDelay: 5 } });
  const photo = page.getByRole('button', { name: firstName });
  await expect(photo).toHaveCSS('animation-name', 'fs-bounce-cards-enter');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(photo).toHaveCSS('animation-name', 'none');
  await expect(photo.locator('..')).toHaveCSS('transition-duration', '0s');
  await photo.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('status', { name: 'Selected photograph' })).toHaveText(firstName);
});

test('width-only container resizing preserves identity and keeps the expanded fan inside', async ({ page, mount }) => {
  await openScenario(mount, 'components-bounce-cards--playground');
  const first = page.getByRole('button', { name: firstName }), handle = await first.elementHandle();
  await page.locator('.bounce-demo__gallery').evaluate(el => { (el as HTMLElement).style.inlineSize = '320px'; });
  await first.focus();
  await expect.poll(() => page.getByRole('group', { name: 'Photo cards' }).evaluate(el => Number((el as HTMLElement).style.getPropertyValue('--fan-layout-scale')))).toBeLessThan(0.4);
  expect(await handle!.evaluate(el => el.isConnected)).toBe(true);
  const root = (await page.getByRole('group', { name: 'Photo cards' }).boundingBox())!;
  const photos = await page.locator('.fs-bounce-cards__item').evaluateAll(els => els.map(el => { const box = el.getBoundingClientRect(); return { left: box.left, right: box.right }; }));
  expect(photos.every(box => box.left >= root.x && box.right <= root.x + root.width)).toBe(true);
});

test('dense collections keep usable targets in a wrapping grid', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-bounce-cards--dense');
  await expect(page.getByRole('group', { name: 'Photo cards' })).toHaveAttribute('data-layout', 'grid');
  await expect(page.getByRole('button')).toHaveCount(24);
  await page.getByRole('button').first().focus();
  const size = (await page.getByRole('button').first().boundingBox())!;
  expect(size.width).toBeGreaterThanOrEqual(44); expect(size.height).toBeGreaterThanOrEqual(44);
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth)).toBe(true);
});

test('narrow enlarged content reflows without a horizontal scrollbar', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScenario(mount, 'components-bounce-cards--playground');
  await page.addStyleTag({ content: 'html{font-size:200%}.bounce-demo__gallery{letter-spacing:.12em;word-spacing:.16em;line-height:1.5}' });
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  expect(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '.verification/bounce-narrow.png', fullPage: true });
});

test('passive photographs have descriptions without extra keyboard stops', async ({ page, mount }) => {
  await openScenario(mount, 'components-bounce-cards--passive');
  await expect(page.getByRole('img')).toHaveCount(5); await expect(page.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('img', { name: firstName })).toBeAttached();
});

test('failed resources keep their named fallback footprint', async ({ page, mount }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScenario(mount, 'components-bounce-cards--failed');
  await expect(page.getByRole('img', { name: 'Unavailable photograph' })).toHaveText('Image unavailable');
});

test('themes and per-instance frame overrides remain independent', async ({ page, mount }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScenario(mount, 'components-bounce-cards--composition');
  const groups = page.getByRole('group', { name: 'Photo cards' });
  const one = groups.nth(0).locator('.fs-bounce-cards__card').first(), two = groups.nth(1).locator('.fs-bounce-cards__card').first();
  expect(await one.evaluate(el => getComputedStyle(el).backgroundColor)).not.toBe(await two.evaluate(el => getComputedStyle(el).backgroundColor));
  await page.screenshot({ path: '.verification/bounce-composition.png', fullPage: true });
  await openScenario(mount, 'components-bounce-cards--overrides');
  await expect(page.getByRole('group', { name: 'Custom photo fan' }).locator('.fs-bounce-cards__card').first()).toHaveCSS('border-radius', '4px');
  await expect(page.getByRole('group', { name: 'Default photo fan' }).locator('.fs-bounce-cards__card').first()).toHaveCSS('border-radius', '24px');
});

test('reordering does not replace card instances', async ({ page, mount }) => {
  await openScenario(mount, 'components-bounce-cards--reordered');
  const handle = await page.getByRole('button', { name: firstName }).elementHandle();
  await page.getByRole('button', { name: 'Reverse photographs' }).click();
  expect(await handle!.evaluate(el => el.isConnected)).toBe(true);
  await expect(page.locator('.fs-bounce-cards__card').last()).toHaveAccessibleName(firstName);
});

test.describe('touch', () => {
  test.use({ hasTouch: true });
  test('native tap activates the visible photograph', async ({ page, mount }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openScenario(mount, 'components-bounce-cards--playground');
    await page.getByRole('button', { name: 'Orange sunset reflected through dark branches' }).tap();
    await expect(page.getByRole('status', { name: 'Selected photograph' })).toHaveText('Orange sunset reflected through dark branches');
  });
});
