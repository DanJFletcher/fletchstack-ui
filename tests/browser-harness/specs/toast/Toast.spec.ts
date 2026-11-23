import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} notifications provide contrasting semantic tones`, async ({ page, mount }) => {
    await openScenario(mount, 'components-toast--tones', { theme });
    const cards = page.locator('.fs-toast');
    await expect(cards).toHaveCount(5);
    await expect(page.getByRole('region', { name: 'Notifications' })).toHaveCSS('position', 'static');
    await expect(page.getByRole('region', { name: 'Notifications' })).toHaveCSS('translate', 'none');
    for (const card of await cards.all()) {
      const paint = await card.evaluate(node => ({ text: getComputedStyle(node).color, surface: getComputedStyle(node).backgroundColor }));
      expect(contrast(paint.text, paint.surface)).toBeGreaterThanOrEqual(4.5);
    }
    await expect(page.getByRole('alert')).toHaveCount(0);
  });
  test(`${theme} long messages and actions reflow at 320px with enlarged spaced text`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-toast--narrow', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }' });
    await expect(page.getByRole('button', { name: 'Review the invitation and send it again' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const card = await page.locator('.fs-toast').boundingBox();
    const close = await page.getByRole('button', { name: 'Dismiss notification' }).boundingBox();
    expect(close!.x + close!.width).toBeLessThanOrEqual(card!.x + card!.width);
  });
}
test('keyboard actions stay open and Escape returns focus without trapping Tab', async ({ page, mount }) => {
  await openScenario(mount, 'components-toast--controlled');
  const trigger = page.getByRole('button', { name: 'Archive project' });
  await trigger.focus(); await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  await expect(page.getByRole('status').filter({ hasText: 'Project archived' })).toHaveAttribute('aria-live', 'polite');
  await page.keyboard.press('Tab');
  const action = page.getByRole('button', { name: 'View archived projects' });
  await expect(action).toBeFocused();
  await expect(action).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('View requests')).toHaveText('1 requests');
  await expect(action).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(action).toHaveCount(0);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Next page action' })).toBeFocused();
});
test('dismiss button supports Space and restores focus', async ({ page, mount }) => {
  await openScenario(mount, 'components-toast--controlled');
  const trigger = page.getByRole('button', { name: 'Archive project' });
  await trigger.click(); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Dismiss notification' })).toBeFocused();
  await page.keyboard.press('Space'); await expect(trigger).toBeFocused();
  await expect(page.getByRole('button', { name: 'Dismiss notification' })).toHaveCount(0);
});
test('timeout preserves remaining time across hover and focus pauses', async ({ page, mount }) => {
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:00Z'));
  await openScenario(mount, 'components-toast--timed');
  const trigger = page.getByRole('button', { name: 'Copy project link' });
  await trigger.click();
  const toast = page.locator('.fs-toast');
  await page.clock.runFor(4000); await toast.hover(); await page.clock.runFor(20000);
  await expect(toast).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Project settings', exact: true })).toBeFocused();
  await trigger.hover(); await page.clock.runFor(20000); await expect(toast).toBeVisible();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Open project settings' })).toBeFocused();
  await page.clock.runFor(5999); await expect(toast).toBeVisible();
  await page.clock.runFor(1); await expect(toast).toBeHidden();
  await expect(page.getByRole('link', { name: 'Open project settings' })).toBeFocused();
  await trigger.click(); await expect(toast).toBeVisible();
  await page.clock.runFor(10000); await expect(toast).toBeHidden();
});
test('queue starts empty, stacks at the logical corner and removes one notification', async ({ page, mount }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openScenario(mount, 'components-toast--interactive-queue');
  await expect(page.getByRole('button', { name: /Dismiss revision/ })).toHaveCount(0);
  const save = page.getByRole('button', { name: 'Save changes' });
  await save.click(); await save.click();
  await expect(page.getByRole('button', { name: /Dismiss revision/ })).toHaveCount(2);
  const viewport = page.getByRole('region', { name: 'Notifications' });
  await expect(viewport).toHaveCSS('position', 'fixed');
  const bounds = await viewport.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(844);
  await page.getByRole('button', { name: 'Dismiss revision 1' }).click();
  await expect(page.getByRole('button', { name: 'Dismiss revision 2' })).toBeVisible();
  await expect(save).toBeFocused();
});
test('theme regions inherit independent surfaces without leaking overrides', async ({ page, mount }) => {
  await openScenario(mount, 'components-toast--composition');
  const corporate = page.getByRole('region', { name: 'corporate', exact: true }).locator('.fs-toast');
  const luna = page.getByRole('region', { name: 'luna', exact: true }).locator('.fs-toast');
  expect(await corporate.evaluate(node => getComputedStyle(node).backgroundColor)).not.toBe(await luna.evaluate(node => getComputedStyle(node).backgroundColor));
  await openScenario(mount, 'components-toast--scoped-overrides');
  await expect(page.locator('.fs-toast').first()).toHaveCSS('border-radius', '0px');
  await expect(page.locator('.fs-toast').last()).toHaveCSS('border-radius', '8px');
});
test('dismissal is immediate with reduced motion and native hidden overrides layout', async ({ page, mount }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScenario(mount, 'components-toast--playground');
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.locator('.fs-toast')).toBeHidden();
  await expect(page.getByRole('status')).toHaveCount(0);
});
test('forced colors preserve the card and dismissal control', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-toast--playground');
  await expect(page.locator('.fs-toast')).toHaveCSS('border-inline-start-style', 'solid');
  await page.getByRole('button').focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button')).toHaveCount(0);
});

for (const scenario of ['positions', 'positioned-stack']) {
  for (const [position, horizontal, vertical] of [
    ['top', 'center', 'top'], ['top-right', 'right', 'top'], ['right', 'right', 'center'],
    ['bottom-right', 'right', 'bottom'], ['bottom', 'center', 'bottom'],
    ['bottom-left', 'left', 'bottom'], ['left', 'left', 'center'], ['top-left', 'left', 'top'],
  ] as const) {
    test(`${scenario} places ${position} within the page`, async ({ page, mount }) => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await openScenario(mount, `components-toast--${scenario}`);
      await page.getByLabel('Notification position').selectOption(position);
      await page.getByRole('button', { name: 'Show notification' }).click();
      const target = page.locator(scenario === 'positions' ? '.fs-toast' : '.fs-toast-viewport');
      await expect(target).toHaveCSS('position', 'fixed');
      const bounds = (await target.boundingBox())!;
      const horizontalAnchor = { left: bounds.x, center: bounds.x + bounds.width / 2, right: bounds.x + bounds.width };
      const verticalAnchor = { top: bounds.y, center: bounds.y + bounds.height / 2, bottom: bounds.y + bounds.height };
      expect(horizontalAnchor[horizontal]).toBeCloseTo(({ left: 16, center: 500, right: 984 })[horizontal], 0);
      expect(verticalAnchor[vertical]).toBeCloseTo(({ top: 16, center: 400, bottom: 784 })[vertical], 0);
      if (scenario === 'positioned-stack') {
        const cards = await page.locator('.fs-toast').all();
        const first = (await cards[0]!.boundingBox())!;
        const second = (await cards[1]!.boundingBox())!;
        expect(second.y).toBeGreaterThan(first.y + first.height);
      }
    });
  }
}
for (const [position, x, y] of [['top', 0, -16], ['bottom', 0, 16], ['left', -16, 0], ['right', 16, 0]] as const) {
  test(`${position} fades and slides inward on every opening`, async ({ page, mount }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openScenario(mount, 'components-toast--positions');
    await page.addStyleTag({ content: '.fs-toast { --fs-motion-duration-standard: 100s; }' });
    await page.getByLabel('Notification position').selectOption(position);
    const show = page.getByRole('button', { name: 'Show notification' });
    await show.click();
    const toast = page.locator('.fs-toast');
    const start = await toast.evaluate(node => {
      const animation = node.getAnimations()[0]!; animation.pause(); animation.currentTime = 0;
      const style = getComputedStyle(node); const matrix = new DOMMatrix(style.transform);
      return { opacity: style.opacity, x: matrix.m41, y: matrix.m42 };
    });
    expect(start).toEqual({ opacity: '0', x, y });
    await toast.evaluate(node => node.getAnimations()[0]!.finish());
    await expect(toast).toHaveCSS('opacity', '1');
    await expect(show).toBeFocused();
    await page.getByRole('button', { name: 'Dismiss notification' }).click();
    await expect(toast).toBeHidden();
    await show.click();
    expect(await toast.evaluate(node => node.getAnimations()[0]!.playState)).toBe('running');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(toast).toHaveCSS('animation-name', 'none');
    await expect(toast).toHaveCSS('opacity', '1');
    await expect(toast).toHaveCSS('transform', 'none');
  });
}
for (const [position, expectedLeft] of [['top-start', 584], ['top-end', 16], ['top-right', 584], ['top-left', 16]] as const) {
  test(`RTL preserves the documented ${position} placement`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 1000, height: 800 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openScenario(mount, 'components-toast--playground', { args: { position, dir: 'rtl' } });
    expect((await page.locator('.fs-toast').boundingBox())!.x).toBe(expectedLeft);
  });
}
test('centered stacks fit a narrow page', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScenario(mount, 'components-toast--positioned-stack');
  await page.getByLabel('Notification position').selectOption('bottom');
  await page.getByRole('button', { name: 'Show notification' }).click();
  const bounds = (await page.getByRole('region', { name: 'Notifications' }).boundingBox())!;
  expect(bounds.x).toBe(16); expect(bounds.width).toBe(288);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});
