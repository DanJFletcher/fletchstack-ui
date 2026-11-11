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
