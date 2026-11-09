import { expect, test } from '../fixtures/test';
import { openStory } from '../fixtures/storybook';

for (const theme of ['corporate', 'luna'] as const) {
  test.describe(`Spatial system / ${theme}`, () => {
    test('control height does not change search padding', async ({ page }) => {
      await openStory(page, 'components-icon--gallery', { theme });
      await page.addStyleTag({ content: '.icon-gallery { --fs-gallery-control-height: 60px; }' });
      const search = page.getByRole('searchbox', { name: 'Search icons' });
      await expect(search).toHaveCSS('min-height', '60px');
      await expect(search).toHaveCSS('padding-inline-start', '36px');
      await expect(search).toHaveCSS('padding-block-start', '8px');
    });

    test('general insets do not change heading separation', async ({ page }) => {
      await openStory(page, 'components-icon--gallery', { theme });
      await page.addStyleTag({ content: '.icon-gallery { --fs-gallery-inset: 40px; --fs-gallery-compact-inset: 12px; }' });
      await expect(page.locator('.icon-gallery__heading')).toHaveCSS('margin-bottom', '16px');
    });

    test('border thickness does not change preview edge inset', async ({ page }) => {
      await openStory(page, 'components-icon--gallery', { theme });
      await page.addStyleTag({ content: '.icon-gallery { --fs-gallery-border-width: 3px; }' });
      await expect(page.locator('.icon-gallery__sizes > div')).toHaveCSS('padding', '1px');
    });
  });
}

for (const theme of ['corporate', 'luna'] as const) {
  test.describe(`Spatial examples / ${theme}`, () => {
    test('the preferred scale displays every raw measurement', async ({ page }) => {
      await openStory(page, 'design-system-spatial-examples--scale', { theme });
      const scale = page.getByRole('list', { name: 'Preferred spacing scale' });
      await expect(scale.getByText(/^\d+px$/)).toHaveText(['0px', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px', '80px', '96px']);
      await expect(scale.getByRole('meter')).toHaveCount(13);
    });

    test('keyboard typeahead changes parent gaps without changing Button padding', async ({ page }) => {
      await openStory(page, 'design-system-spatial-examples--composition', { theme });
      const select = page.getByRole('combobox', { name: 'Action spacing' });
      const actions = page.getByRole('group', { name: 'Adjustable actions' });
      const save = actions.getByRole('button', { name: 'Save', exact: true });
      await expect(actions).toHaveCSS('gap', '12px');
      await select.focus();
      await page.keyboard.press('r');
      await expect(select).toHaveValue('related');
      await expect(actions).toHaveCSS('gap', '16px');
      await expect(select).toHaveCSS('outline-style', 'auto');
      await expect(select).not.toHaveCSS('outline-width', '0px');
      await select.selectOption('label');
      await expect(actions).toHaveCSS('gap', '8px');
      await expect(save).toHaveCSS('padding-inline-start', '16px');
      await expect(save).toHaveCSS('padding-block-start', '10px');
      await expect(save).toHaveCSS('gap', '8px');
      await expect(save).toHaveCSS('margin', '0px');
      await select.selectOption('actions');
      await expect(actions).toHaveCSS('gap', '12px');
      await page.addStyleTag({ content: '.spatial-demo { --fs-space-gap-label: 20px; }' });
      await expect(page.locator('.spatial-field')).toHaveCSS('gap', '20px');
      await expect(select).toHaveCSS('padding', '8px');
    });

    test('scoped overrides reset only at explicit nested theme boundaries', async ({ page }) => {
      await openStory(page, 'design-system-spatial-examples--scoped-overrides', { theme });
      await expect(page.getByRole('group', { name: 'Outer actions' })).toHaveCSS('gap', '32px');
      await expect(page.getByRole('group', { name: 'Nested actions' })).toHaveCSS('gap', '12px');
      await expect(page.getByRole('group', { name: 'Sibling actions' })).toHaveCSS('gap', '12px');
      await page.addStyleTag({ content: 'html { --fs-space-gap-actions: 20px; }' });
      await expect(page.getByRole('group', { name: 'Sibling actions' })).toHaveCSS('gap', '12px');
    });

    test('only the example-specific breakpoint changes section separation', async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await openStory(page, 'design-system-spatial-examples--responsive-sections', { theme });
      const sections = page.getByRole('group', { name: 'Page sections' });
      await expect(sections).toHaveCSS('gap', '64px');
      await page.setViewportSize({ width: 600, height: 768 });
      await expect(sections).toHaveCSS('gap', '32px');
      await page.setViewportSize({ width: 601, height: 768 });
      await expect(sections).toHaveCSS('gap', '64px');
    });

    for (const story of ['scale', 'composition', 'scoped-overrides', 'responsive-sections']) {
      test(`${story} reflows with 200% text and user text spacing`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 700 });
        await openStory(page, `design-system-spatial-examples--${story}`, { theme });
        await page.addStyleTag({ content: 'html {font-size:200%} .spatial-demo, .spatial-demo * {line-height:1.5;letter-spacing:.12em;word-spacing:.16em} .spatial-demo p {margin-bottom:2em}' });
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await page.locator('.spatial-actions .fs-button').evaluateAll(buttons => buttons.every(button => button.scrollWidth <= button.clientWidth))).toBe(true);
      });
    }
  });
}

test('the Storybook sidebar and guide link to runnable spacing examples and tokens', async ({ page }) => {
  await page.goto('/?path=/docs/design-system-spatial-system--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.getByRole('heading', { name: /Spatial system$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Spatial System', exact: true })).toBeVisible();
  await preview.getByRole('link', { name: 'Explore scoped spacing →' }).click();
  await expect(page).toHaveURL(/path=\/story\/design-system-spatial-examples--scoped-overrides/);
  await expect(preview.getByRole('group', { name: 'Outer actions' })).toHaveCSS('gap', '32px');
  await page.goto('/?path=/docs/design-system-spatial-system--docs');
  await preview.getByRole('link', { name: 'Read the spatial token reference →' }).click();
  await expect(preview.getByRole('heading', { name: /Public semantic tokens$/ })).toBeVisible();
  await preview.getByRole('link', { name: 'Spatial system', exact: true }).click();
  await expect(preview.getByRole('heading', { name: /Spatial system$/i })).toBeVisible();
  await page.goto('/?path=/docs/design-system-foundation--docs');
  await preview.getByRole('link', { name: 'Explore the spatial system →' }).click();
  await expect(preview.getByRole('heading', { name: /Spatial system$/i })).toBeVisible();
});
