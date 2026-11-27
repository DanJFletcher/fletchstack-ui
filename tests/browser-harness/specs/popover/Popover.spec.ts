import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} keyboard opens a non-modal panel and leaves through normal Tab order`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-popover--playground', { theme });
    const trigger = page.getByRole('button', { name: 'Project details' });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    const panel = page.getByRole('dialog', { name: 'Project details' });
    await expect(panel).toBeVisible();
    await expect(trigger).toBeFocused();
    await expect(panel).toHaveAccessibleDescription('A quick view of the current workspace.');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Close popover' })).toBeFocused();
    await expect(page.getByRole('button', { name: 'Close popover' })).toHaveCSS(
      'outline-style',
      'solid',
    );
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'Project name' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Review drafts' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Next page control' })).toBeFocused();
    await expect(panel).not.toBeVisible();
    await page.keyboard.press('Shift+Tab');
    await expect(trigger).toBeFocused();
  });
  test(`${theme} Escape restores focus and editing survives reopening`, async ({ page, mount }) => {
    await openScenario(mount, 'components-popover--playground', { theme });
    const trigger = page.getByRole('button', { name: 'Project details' });
    await trigger.click();
    await page.getByRole('textbox', { name: 'Project name' }).fill('Edited draft');
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await trigger.press('Space');
    await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveValue('Edited draft');
    await page.getByRole('button', { name: 'Close popover' }).click();
    await expect(trigger).toBeFocused();
  });
  test(`${theme} outside click keeps focus on its destination`, async ({ page, mount }) => {
    await openScenario(mount, 'components-popover--playground', { theme });
    await page.getByRole('button', { name: 'Project details' }).click();
    await page.getByRole('button', { name: 'Next page control' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Next page control' })).toBeFocused();
  });
}

test('autofocus chooses a panel control when opted in', async ({ page, mount }) => {
  await openScenario(mount, 'components-popover--playground', {
    args: { autoFocus: true, showCloseButton: false },
  });
  await page.getByRole('button', { name: 'Project details' }).click();
  await expect(page.getByRole('textbox', { name: 'Project name' })).toBeFocused();
});

test('controlled requests wait for parent acceptance', async ({ page, mount }) => {
  await openScenario(mount, 'components-popover--controlled');
  await page.getByRole('button', { name: 'Controlled panel' }).click();
  await expect(page.getByRole('status', { name: 'Open request' })).toHaveText('Requested');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Accept request' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Controlled panel' }).press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Accept request' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('independent dismissal opt-outs preserve the panel', async ({ page, mount }) => {
  await openScenario(mount, 'components-popover--playground', {
    args: { closeOnEscape: false, closeOnOutsideClick: false, closeOnFocusOutside: false },
  });
  await page.getByRole('button', { name: 'Project details' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Next page control' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close popover' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('flips at an edge and fits a narrow zoomed viewport', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 600 });
  await openScenario(mount, 'components-popover--edge');
  await page.addStyleTag({
    content:
      'html{font-size:200%}.fs-popover__panel{letter-spacing:.12em;word-spacing:.16em;line-height:1.5}',
  });
  await page.getByRole('button', { name: 'Project details' }).click();
  const panel = page.getByRole('dialog');
  await expect(panel).toHaveAttribute('data-side', 'bottom');
  expect(
    await panel.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.left >= 8 && rect.right <= innerWidth - 8 && rect.bottom <= innerHeight - 8;
    }),
  ).toBe(true);
  expect(await panel.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await panel.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  await page.screenshot({ path: '.verification/popover-narrow.png' });
});

test('matches trigger width and updates after viewport resizing', async ({ page, mount }) => {
  await openScenario(mount, 'components-popover--playground', {
    args: { matchTriggerWidth: true },
  });
  const trigger = page.getByRole('button', { name: 'Project details' }),
    panel = page.getByRole('dialog');
  await trigger.click();
  expect((await panel.boundingBox())!.width).toBe((await trigger.boundingBox())!.width);
  await page.setViewportSize({ width: 400, height: 600 });
  await expect(panel).toBeInViewport();
});

test('inherits nested theme colors without leaking scoped panel styles', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-popover--composition');
  const corporate = page.locator('section.popover-demo__theme[data-theme="corporate"]');
  const luna = page.locator('[data-theme="luna"]');
  await corporate.getByRole('button', { name: 'Project details' }).click();
  const day = await corporate
    .getByRole('dialog')
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await corporate
    .getByRole('dialog')
    .evaluate((element) =>
      Promise.all(element.getAnimations().map((animation) => animation.finished)),
    );
  await page.screenshot({ path: '.verification/popover-corporate.png' });
  await page.keyboard.press('Escape');
  await luna.getByRole('button', { name: 'Project details' }).click();
  expect(
    await luna.getByRole('dialog').evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(day);
  await luna
    .getByRole('dialog')
    .evaluate((element) =>
      Promise.all(element.getAnimations().map((animation) => animation.finished)),
    );
  await page.screenshot({ path: '.verification/popover-luna.png' });
  await openScenario(mount, 'components-popover--overrides');
  await page.getByRole('button', { name: 'Custom panel' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('border-radius', '24px');
  await page.getByRole('button', { name: 'Default panel' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('border-radius', '8px');
});

test('native top-layer panel remains interactive inside a Dialog and Escape closes one layer', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-popover--nested');
  await page.getByRole('button', { name: 'Open review' }).click();
  await page.getByRole('button', { name: 'Project details' }).click();
  await page.getByRole('textbox', { name: 'Project name' }).fill('Inside modal');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Project details' })).not.toBeVisible();
  await expect(page.getByRole('dialog', { name: 'Review changes' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Project details' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Review changes' })).not.toBeVisible();
});

test('reduced motion removes animation and forced colors preserves panel boundaries', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
  await openScenario(mount, 'components-popover--playground');
  await page.getByRole('button', { name: 'Project details' }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('animation-name', 'none');
  await expect(page.getByRole('dialog')).toHaveCSS('border-style', 'solid');
});
