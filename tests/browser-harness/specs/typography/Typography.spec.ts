import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} typography uses the approved rem scale without child margins`, async ({ page, mount }) => {
    await openScenario(mount, 'components-heading--sizes', { theme });
    for (const [size, font, line] of [['page', '32px', '40px'], ['section', '24px', '30px'], ['subheading', '18px', '22.5px']] as const) {
      await expect(page.getByTestId(`heading-${size}`)).toHaveCSS('font-size', font);
      await expect(page.getByTestId(`heading-${size}`)).toHaveCSS('line-height', line);
      await expect(page.getByTestId(`heading-${size}`)).toHaveCSS('margin', '0px');
    }
    await openScenario(mount, 'components-text--sizes', { theme });
    for (const [size, font, line] of [['lead', '18px', '27px'], ['body', '16px', '24px'], ['small', '14px', '21px']] as const) {
      await expect(page.getByTestId(`text-${size}`)).toHaveCSS('font-size', font);
      await expect(page.getByTestId(`text-${size}`)).toHaveCSS('line-height', line);
    }
  });

  test(`${theme} long copy reflows at 320px with enlarged and spaced text`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-heading--long-content', { theme });
    const copy = page.getByTestId('long-copy');
    const before = await copy.boundingBox();
    await page.addStyleTag({ content: 'html {font-size:200%} * {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} .fs-text {margin-block-end:2em!important}' });
    expect((await copy.boundingBox())!.height).toBeGreaterThan(before!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(copy.locator('[lang="ar"]')).toHaveCSS('direction', 'rtl');
    await expect(copy.locator('[lang="ar"]')).toHaveCSS('text-align', 'start');
    await expect(copy).toHaveCSS('overflow', 'visible');
  });
}

test('default and supporting text meet AA contrast against both theme surfaces', async ({ page, mount }) => {
  await openScenario(mount, 'components-text--both-themes');
  for (const theme of ['corporate', 'luna']) {
    const panel = page.locator(`.theme-panel[data-theme="${theme}"]`);
    const background = await panel.evaluate(element => getComputedStyle(element).backgroundColor);
    for (const copy of await panel.locator('.fs-heading, .fs-text').all()) {
      const color = await copy.evaluate(element => getComputedStyle(element).color);
      expect(contrast(color, background)).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test('scoped font overrides inherit and reset at nested explicit themes', async ({ page, mount }) => {
  await openScenario(mount, 'components-heading--scoped-overrides');
  await expect(page.getByTestId('outer-heading')).toHaveCSS('font-size', '40px');
  await expect(page.getByTestId('reset-heading')).toHaveCSS('font-size', '24px');
  await expect(page.getByTestId('sibling-heading')).toHaveCSS('font-size', '24px');
  await expect(page.getByTestId('independent-heading')).toHaveCSS('font-size', '18px');
  await openScenario(mount, 'components-text--scoped-overrides');
  await expect(page.getByTestId('outer-text')).toHaveCSS('font-size', '20px');
  await expect(page.getByTestId('outer-text')).toHaveCSS('line-height', '40px');
  await expect(page.getByTestId('reset-text')).toHaveCSS('font-size', '16px');
  await expect(page.getByTestId('reset-text')).toHaveCSS('line-height', '24px');
  await expect(page.getByTestId('sibling-text')).toHaveCSS('font-size', '16px');
});

test('native hidden removes heading and paragraph from layout', async ({ page, mount }) => {
  await openScenario(mount, 'components-heading--hidden');
  await expect(page.locator('.fs-heading')).toHaveCSS('display', 'none');
  await openScenario(mount, 'components-text--hidden');
  await expect(page.locator('.fs-text')).toHaveCSS('display', 'none');
});

test('copy preserves native tab order and inline links keep visible focus', async ({ page, mount }) => {
  await openScenario(mount, 'components-heading--native-focus');
  await page.getByRole('button', { name: 'Before copy' }).focus();
  await page.keyboard.press('Tab');
  const link = page.getByRole('link', { name: 'delivery guidance' });
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS('outline-style', 'solid');
  await expect(link.locator('..')).toHaveCSS('overflow', 'visible');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(link).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After copy' })).toBeFocused();
});
