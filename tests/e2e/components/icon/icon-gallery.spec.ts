import { expect, test } from '../../fixtures/test';

test('the actual theme toolbar switches Gallery and its native control palette', async ({
  page,
}) => {
  await page.goto('/?path=/story/components-icon--gallery');
  const preview = page.frameLocator('#storybook-preview-iframe');
  const search = preview.getByRole('searchbox', { name: 'Search icons' });
  await expect(search).toBeVisible();
  await expect(search).toHaveCSS('color-scheme', 'light');

  await page.getByRole('button', { name: 'Preview theme Corporate', exact: true }).click();
  await page.getByRole('option', { name: 'Luna', exact: true }).click();
  await expect(search).toHaveCSS('color-scheme', 'dark');
  await search.fill('moon');
  await expect(preview.getByRole('status')).toHaveText('1 icon');
  await page.getByRole('button', { name: 'Preview theme Luna', exact: true }).click();
  await page.getByRole('option', { name: 'Corporate', exact: true }).click();
  await expect(search).toHaveCSS('color-scheme', 'light');
  await search.fill('new');
  await expect(preview.getByRole('heading', { name: 'PlusIcon', exact: true })).toBeVisible();
});
