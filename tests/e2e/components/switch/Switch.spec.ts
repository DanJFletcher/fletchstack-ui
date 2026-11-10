import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';
import { contrast } from '../../fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Switch keeps its label stable through native Space and Tab behavior`, async ({ page }) => {
    await openStory(page, 'components-switch--keyboard', { theme });
    const email = page.getByRole('switch', { name: 'Email notifications' });
    await email.focus();
    await expect(email).toBeChecked();
    await page.keyboard.press('Space');
    await expect(page.getByRole('switch', { name: 'Email notifications', checked: false })).toBeFocused();
    await expect(email).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('switch', { name: 'Push notifications' })).toBeFocused();
    await page.getByText('Email notifications', { exact: true }).click();
    await expect(email).toBeChecked();
  });

  test(`${theme} Switch exposes state through thumb position and contrasting colors`, async ({ page }) => {
    await openStory(page, 'components-switch--playground', { theme });
    const input = page.getByRole('switch');
    await expect(input).toHaveCSS('width', '40px');
    await expect(input).toHaveCSS('height', '24px');
    await expect(page.locator('.fs-switch__label')).toHaveCSS('min-height', '44px');
    await expect(page.locator('.fs-switch__label')).toHaveCSS('gap', '8px');
    const off = await switchPaint(input);
    expect(off.thumbWidth).toBe('20px');
    expect(off.thumbHeight).toBe('20px');
    expect(contrast(off.track, off.surface)).toBeGreaterThanOrEqual(3);
    expect(contrast(off.thumb, off.track)).toBeGreaterThanOrEqual(3);
    expect(contrast(off.focus, off.surface)).toBeGreaterThanOrEqual(3);
    await input.hover();
    const hoveredOff = await switchPaint(input);
    expect(contrast(hoveredOff.thumb, hoveredOff.track)).toBeGreaterThanOrEqual(3);
    await page.getByText('Receive updates about your projects.').click();
    await expect(input).toBeChecked();
    const on = await switchPaint(input);
    expect(on.left).toBeGreaterThan(off.left);
    expect(contrast(on.thumb, on.track)).toBeGreaterThanOrEqual(3);
    expect(contrast(on.track, on.surface)).toBeGreaterThanOrEqual(3);
    await page.mouse.move(0, 0);
    const restingOn = await switchPaint(input);
    expect(contrast(restingOn.thumb, restingOn.track)).toBeGreaterThanOrEqual(3);
  });

  test(`${theme} Switch wraps enlarged and spaced labels at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-switch--long-labels', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    await page.getByRole('switch').focus();
    await expect(page.getByRole('switch')).toBeFocused();
    await expect(page.getByRole('switch')).toHaveCSS('width', '40px');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('Switch submits enabled on settings and resets externally owned controls', async ({ page }) => {
  await openStory(page, 'components-switch--native-form');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByLabel('Submitted settings')).toHaveText('email');
  await page.getByRole('switch', { name: 'Push notifications' }).click();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByLabel('Submitted settings')).toHaveText('email, push');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.getByRole('switch', { name: 'Email notifications' })).toBeChecked();
  await expect(page.getByRole('switch', { name: 'Push notifications' })).not.toBeChecked();
});

test('Switch uses logical thumb placement within right-to-left layouts', async ({ page }) => {
  await openStory(page, 'components-switch--right-to-left');
  const input = page.getByRole('switch');
  const off = await switchPaint(input);
  await input.click();
  const on = await switchPaint(input);
  expect(on.left).toBeLessThan(off.left);
  await expect(input).toBeChecked();
});

test('Switch shares group context without changing its accessible name', async ({ page }) => {
  await openStory(page, 'components-switch--composition');
  await expect(page.getByRole('switch', { name: 'Email notifications' })).toHaveAccessibleDescription('Control project updates. Receive updates about your projects.');
});

test('Switch honors native fieldset disabling for both states', async ({ page }) => {
  await openStory(page, 'components-switch--disabled-group');
  const email = page.getByRole('switch', { name: 'Email notifications' });
  const push = page.getByRole('switch', { name: 'Push notifications' });
  await expect(email).toBeDisabled();
  await expect(push).toBeDisabled();
  // Locator clicks reject disabled fieldset descendants; real pointer input verifies suppression.
  for (const label of ['Email notifications', 'Push notifications']) {
    const bounds = (await page.getByText(label, { exact: true }).boundingBox())!;
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  }
  await expect(email).toBeChecked();
  await expect(push).not.toBeChecked();
});

test('Switch retains position and distinguishable thumbs in forced colors', async ({ page }) => {
  await openStory(page, 'components-switch--playground');
  await page.emulateMedia({ forcedColors: 'active' });
  const input = page.getByRole('switch');
  const off = await switchPaint(input);
  expect(off.thumb).not.toBe(off.track);
  await input.click();
  const on = await switchPaint(input);
  expect(on.thumb).not.toBe(on.track);
  expect(on.left).toBeGreaterThan(off.left);
});

test('Switch keeps theme scopes independent', async ({ page }) => {
  await openStory(page, 'components-switch--both-themes');
  const corporate = page.locator('[data-theme="corporate"].theme-panel');
  const luna = page.locator('[data-theme="luna"].theme-panel');
  await corporate.getByRole('switch', { name: 'Email notifications' }).click();
  await page.mouse.move(0, 0);
  await expect(corporate.getByRole('switch', { name: 'Email notifications' })).toHaveCSS('background-color', 'rgb(36, 75, 176)');
  await expect(luna.getByRole('switch', { name: 'Email notifications' })).not.toBeChecked();
  await expect(luna.getByRole('switch', { name: 'Push notifications' })).toHaveCSS('background-color', 'rgb(199, 181, 255)');
});

test('Switch customization preserves its thumb within the wider track', async ({ page }) => {
  await openStory(page, 'components-switch--customization');
  const input = page.getByRole('switch');
  await expect(input).toHaveCSS('width', '48px');
  await input.click();
  const paint = await switchPaint(input);
  expect(paint.left + Number.parseFloat(paint.thumbWidth)).toBeLessThan(48);
});

for (const story of ['playground', 'on', 'disabled', 'states', 'both-themes', 'controlled', 'keyboard', 'native-form', 'composition', 'disabled-group', 'customization', 'ref-access', 'long-labels', 'right-to-left']) {
  test(`the ${story} Switch example renders successfully`, async ({ page }) => {
    await openStory(page, `components-switch--${story}`);
    await expect(page.getByRole('switch').first()).toBeVisible();
  });
}

/**
 * Read the rendered track and thumb paint without relying on component state internals.
 **/
async function switchPaint(input: import('@playwright/test').Locator) {
  return input.evaluate(element => {
    const style = getComputedStyle(element);
    const thumb = getComputedStyle(element, '::before');

    return { track: style.backgroundColor, surface: style.getPropertyValue('--fs-surface').trim(), focus: style.getPropertyValue('--fs-switch-focus-color').trim(), thumb: thumb.backgroundColor, left: Number.parseFloat(thumb.left), thumbWidth: thumb.width, thumbHeight: thumb.height };
  });
}
