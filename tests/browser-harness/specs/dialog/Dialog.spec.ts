import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} modal keeps native focus contained and restores the invoker`, async ({ page, mount }) => {
    await openScenario(mount, 'components-dialog--playground', { theme });
    const trigger = page.getByRole('button', { name: 'Open dialog' });
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog', { name: 'Confirm the changes?' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleDescription('Review this action before continuing.');
    const close = dialog.getByRole('button', { name: 'Close dialog' });
    await expect(close).toBeFocused();
    await expect(close).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab'); await expect(dialog.getByRole('textbox', { name: 'Change summary' })).toBeFocused();
    await page.keyboard.press('Shift+Tab'); await expect(close).toBeFocused();
    expect(await dialog.evaluate(element => element.matches(':modal'))).toBe(true);
    await trigger.evaluate(element => (element as HTMLElement).focus());
    await expect(close).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
    await expect(page.getByRole('status', { name: 'Close requests' })).toHaveText('1');
  });
  test(`${theme} editing survives close and reopen and confirmation is consumer owned`, async ({ page, mount }) => {
    await openScenario(mount, 'components-dialog--playground', { theme });
    await page.getByRole('button', { name: 'Open dialog' }).click();
    const input = page.getByRole('textbox', { name: 'Change summary' });
    await input.fill('Persistent summary'); await input.press('Tab');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await expect(input).toHaveValue('Persistent summary');
    await page.getByRole('button', { name: 'Confirm', exact: true }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('status', { name: 'Confirmations' })).toHaveText('1');
  });
  test(`${theme} long content reflows at 320px and scrolls within the modal body`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 600 });
    await openScenario(mount, 'components-dialog--playground', { theme, args: { long: true } });
    await page.addStyleTag({ content: 'html{font-size:200%}.fs-dialog{line-height:1.5;letter-spacing:.12em;word-spacing:.16em}' });
    await page.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = page.getByRole('dialog'), body = dialog.locator('.fs-dialog__body');
    const before = await page.evaluate(() => scrollY);
    await dialog.getByRole('link', { name: 'Review help' }).focus();
    expect(await body.evaluate(element => element.scrollTop > 0)).toBe(true);
    await expect(dialog.getByRole('button', { name: 'Confirm', exact: true })).toBeInViewport();
    expect(await dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.mouse.move(2, 2); await page.mouse.wheel(0, 500);
    expect(await page.evaluate(() => scrollY)).toBe(before);
  });
}

test('controlled dismissal waits for parent acceptance', async ({ page, mount }) => {
  await openScenario(mount, 'components-dialog--deferred');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Accept close' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

for (const args of [{ closeOnEscape: false }, { veto: true }]) {
  test(`Escape respects dismissal veto ${JSON.stringify(args)}`, async ({ page, mount }) => {
    await openScenario(mount, 'components-dialog--playground', { args });
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close dialog' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
}

test('backdrop dismissal defaults on, supports opting out, and ignores panel padding and drags', async ({ page, mount }) => {
  await openScenario(mount, 'components-dialog--playground');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.mouse.click(2, 2); await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open dialog' })).toBeFocused();
  await expect(page.getByRole('status', { name: 'Close requests' })).toHaveText('1');
  await openScenario(mount, 'components-dialog--playground', { args: { closeOnBackdropClick: false } });
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.mouse.click(2, 2); await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
  await openScenario(mount, 'components-dialog--playground', { args: { closeOnBackdropClick: true } });
  await page.getByRole('button', { name: 'Open dialog' }).click();
  const box = await page.getByRole('dialog').boundingBox();
  await page.mouse.click(box!.x + 2, box!.y + 2); await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.move(box!.x + 2, box!.y + 2); await page.mouse.down(); await page.mouse.move(2, 2); await page.mouse.up();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.click(2, 2); await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('status', { name: 'Close requests' })).toHaveText('1');
});

test('native form and imperative close notify once and can reopen', async ({ page, mount }) => {
  await openScenario(mount, 'components-dialog--playground', { args: { nativeForm: true } });
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('button', { name: 'Save and close natively' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('status', { name: 'Close requests' })).toHaveText('1');
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('button', { name: 'Close through ref' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('status', { name: 'Close requests' })).toHaveText('2');
});

for (const motion of ['fade', 'slide', 'none']) {
  test(`${motion} motion preserves modality until exit and honors live reduction`, async ({ page, mount }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openScenario(mount, 'components-dialog--playground', { args: { motion } });
    await page.getByRole('button', { name: 'Open dialog' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.evaluate(async element => { await Promise.all(element.getAnimations().map(animation => animation.finished)); element.style.setProperty('--fs-motion-duration-standard', '10s'); });
    await dialog.getByRole('button', { name: 'Close dialog' }).focus();
    await page.keyboard.press('Enter');
    if (motion !== 'none') {
      await expect(dialog).toHaveAttribute('data-state', 'closing');
      expect(await dialog.evaluate(element => element.matches(':modal') && element.getAnimations().length > 0)).toBe(true);
      await page.emulateMedia({ reducedMotion: 'reduce' });
    }
    await expect(dialog).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Open dialog' })).toBeFocused();
    await page.getByRole('button', { name: 'Open dialog' }).click();
    await expect(dialog).toHaveCSS('animation-name', 'none');
  });
}

test('theme and per-instance hooks inherit without affecting neighboring dialogs', async ({ page, mount }) => {
  await openScenario(mount, 'components-dialog--composition');
  const regions = page.locator('.dialog-demo__theme');
  await regions.nth(0).getByRole('button', { name: 'Open dialog' }).click();
  const corporate = await page.getByRole('dialog').evaluate(element => getComputedStyle(element).backgroundColor);
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
  await regions.nth(1).getByRole('button', { name: 'Open dialog' }).click();
  expect(await page.getByRole('dialog').evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(corporate);
  await openScenario(mount, 'components-dialog--overrides');
  await page.getByRole('region', { name: 'Custom dialog' }).getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('border-radius', '24px');
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('region', { name: 'Default dialog' }).getByRole('button', { name: 'Open dialog' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('border-radius', '12px');
});

test('nested modals close one at a time and restore the correct parent focus', async ({ page, mount }) => {
  await openScenario(mount, 'components-dialog--nested');
  await page.getByRole('button', { name: 'Open parent' }).click();
  const childTrigger = page.getByRole('button', { name: 'Open child' });
  await childTrigger.click(); await expect(page.getByRole('dialog', { name: 'Child review' })).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog', { name: 'Child review' })).not.toBeVisible();
  await expect(childTrigger).toBeFocused();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog', { name: 'Parent review' })).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open parent' })).toBeFocused();
});
