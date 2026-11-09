import { expect, test } from '../fixtures/test';
import { openStory } from '../fixtures/storybook';

const names = ['MoonIcon', 'SunIcon', 'CheckIcon', 'CloseIcon', 'ChevronDownIcon', 'ArrowRightIcon', 'PlusIcon', 'ExternalLinkIcon'];
const sizes = [{ name: 'small', pixels: '16px' }, { name: 'medium', pixels: '20px' }, { name: 'large', pixels: '24px' }];

test('custom artwork uses the public wrapper and consumer coordinate space', async ({ page }) => {
  await openStory(page, 'components-icon--playground');
  await expect(page.getByRole('img', { name: 'Custom diamond' })).toHaveCSS('width', '20px');

  await openStory(page, 'components-icon--custom-artwork');
  const artwork = page.getByRole('img', { name: 'Wide custom artwork' });
  await expect(artwork).toHaveAttribute('viewBox', '0 0 32 32');
  await expect(artwork).toHaveAttribute('fill', 'currentColor');
  await expect(artwork).toHaveAttribute('stroke', 'none');
  await expect(artwork).toHaveAttribute('data-source', 'consumer');
  await expect(artwork).toHaveClass(/consumer-art/);
  await expect(artwork).toHaveCSS('width', '28px');
  await expect(artwork.locator('g > path')).toHaveAttribute('d', 'M4 4h24v24H4Z');
});

test('default dimensions and the three semantic sizes are explicit', async ({ page }) => {
  await openStory(page, 'components-icon--sizes');
  await expect(page.getByRole('img', { name: 'Default size' })).toHaveCSS('width', '20px');

  for (const size of sizes) {
    const artwork = page.getByRole('img', { name: `${size.name} moon` });
    await expect(artwork).toHaveCSS('width', size.pixels);
    await expect(artwork).toHaveCSS('height', size.pixels);
  }
});

test('the optional catalog presents every icon at each size in both themes', async ({ page }) => {
  await openStory(page, 'components-icon--catalog');

  for (const theme of ['corporate', 'luna']) {
    const region = page.getByRole('region', { name: theme, exact: true });
    await expect(region.getByRole('img')).toHaveCount(24);
    for (const name of names) {
      await expect(region.getByRole('heading', { name, exact: true })).toBeVisible();
      for (const size of sizes) {
        const artwork = region.getByRole('img', { name: `${name} ${size.name}`, exact: true });
        await expect(artwork).toHaveCSS('width', size.pixels);
        await expect(artwork).toHaveAttribute('viewBox', '0 0 24 24');
        await expect(artwork).toHaveAttribute('stroke-linecap', 'round');
        await expect(artwork).toHaveAttribute('stroke-linejoin', 'round');
      }
    }
  }
});

test('only a nonblank label exposes an accessible image', async ({ page }) => {
  await openStory(page, 'components-icon--accessibility');
  await expect(page.getByRole('img')).toHaveCount(1);
  await expect(page.getByRole('img', { name: 'Night mode', exact: true })).toBeVisible();

  for (const id of ['decorative-default', 'decorative-empty', 'decorative-blank']) {
    await expect(page.getByTestId(id)).toHaveAttribute('aria-hidden', 'true');
    await expect(page.getByTestId(id)).toHaveAttribute('focusable', 'false');
  }
  await expect(page.locator('svg[tabindex]')).toHaveCount(0);
});

test('semantic dimensions and stroke overrides remain local to their scope', async ({ page }) => {
  await openStory(page, 'components-icon--customization');
  const scoped = page.getByRole('img', { name: 'Scoped moon' });

  await expect(scoped).toHaveCSS('width', '32px');
  await expect(scoped).toHaveCSS('stroke-width', '3px');
  await expect(page.getByRole('img', { name: 'Local square size' })).toHaveCSS('width', '36px');
  await expect(page.getByRole('img', { name: 'Nested theme reset' })).toHaveCSS('width', '20px');
  await expect(page.getByRole('img', { name: 'Nested theme reset' })).toHaveCSS('stroke-width', '2px');
  await expect(page.getByRole('img', { name: 'Unaffected sibling' })).toHaveCSS('width', '20px');
});

test('a named icon forwards its SVG ref and native attributes', async ({ page }) => {
  await openStory(page, 'components-icon--ref-access');
  const sun = page.getByRole('img', { name: 'Reference sun' });

  await expect(sun).toHaveClass(/reference-art/);
  await expect(sun).toHaveAttribute('data-source', 'named');
  await expect(page.getByLabel('Ref result')).toHaveText('true');
  await page.getByRole('button', { name: 'Inspect SVG ref' }).click();
  await expect(page.getByLabel('Ref result')).toHaveText('true');
});

for (const theme of [
  { name: 'corporate', text: 'rgb(255, 255, 255)', hover: 'rgb(27, 60, 145)', active: 'rgb(20, 46, 115)', disabled: 'rgb(76, 89, 109)' },
  { name: 'luna', text: 'rgb(17, 19, 41)', hover: 'rgb(215, 202, 255)', active: 'rgb(175, 149, 237)', disabled: 'rgb(184, 177, 205)' },
] as const) {
  test.describe(theme.name, () => {
    test('decorative icons leave activation and keyboard focus on Button', async ({ page }) => {
      await openStory(page, 'components-icon--composition', { theme: theme.name });
      const save = page.getByRole('button', { name: 'Save changes', exact: true });
      const close = page.getByRole('button', { name: 'Close dialog', exact: true });
      await expect(page.getByLabel('Activations')).toHaveText('2');
      await expect(page.getByRole('img')).toHaveCount(0);

      await save.focus();
      await page.keyboard.press('Space');
      await expect(page.getByLabel('Activations')).toHaveText('3');
      await page.keyboard.press('Tab');
      await expect(close).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(page.getByLabel('Activations')).toHaveText('4');
      await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeDisabled();
    });

    test('artwork inherits control colors through pointer and keyboard states', async ({ page }) => {
      await openStory(page, 'components-icon--composition', { theme: theme.name });
      const save = page.getByRole('button', { name: 'Save changes', exact: true });
      const artwork = save.locator('svg');
      await expect(artwork).toHaveCSS('stroke', theme.text);

      await save.hover();
      await expect(save).toHaveCSS('background-color', theme.hover);
      await expect(artwork).toHaveCSS('stroke', theme.text);
      await page.mouse.down();
      await expect(save).toHaveCSS('background-color', theme.active);
      await expect(artwork).toHaveCSS('stroke', theme.text);
      await page.mouse.up();

      await page.keyboard.press('Tab');
      const close = page.getByRole('button', { name: 'Close dialog' });
      await expect(close).toBeFocused();
      await expect(close).toHaveCSS('outline-style', 'solid');
      const paint = await close.evaluate(element => ({ text: getComputedStyle(element).color, stroke: getComputedStyle(element.querySelector('svg')!).stroke }));
      expect(paint.stroke).toBe(paint.text);
      await expect(page.getByRole('button', { name: 'Saved', exact: true }).locator('svg')).toHaveCSS('stroke', theme.disabled);
    });

    test('fixed artwork leaves enlarged and spaced labels free to wrap', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await openStory(page, 'components-icon--composition', { theme: theme.name });
      await page.addStyleTag({ content: `
        html { font-size: 200%; }
        .fs-button { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; }
        p { margin-bottom: 2em; }
      ` });
      const button = page.getByRole('button', { name: 'Save all changes and return to your account settings' });

      await expect(button).toHaveCSS('font-size', '32px');
      await expect(button.locator('svg')).toHaveCSS('width', '20px');
      await expect(button.locator('svg')).toHaveCSS('margin', '0px');
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await button.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    });
  });
}
