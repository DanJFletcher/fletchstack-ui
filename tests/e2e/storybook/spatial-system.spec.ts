import { expect, test } from '../fixtures/test';

test('the Storybook sidebar and guide link to runnable spacing examples and tokens', async ({
  page,
}) => {
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
