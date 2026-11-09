import { expect, test } from '../fixtures/test';
import { openStory } from '../fixtures/storybook';

test('both themes coexist without sharing action colors', async ({ page }) => {
  await openStory(page, 'components-button--both-themes');
  const corporate = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Corporate', exact: true }),
  });
  const luna = page.locator('section').filter({
    has: page.getByRole('heading', { name: 'Luna', exact: true }),
  });

  await expect(corporate.getByRole('button', { name: 'Save changes' })).toHaveCSS('background-color', 'rgb(36, 75, 176)');
  await expect(luna.getByRole('button', { name: 'Save changes' })).toHaveCSS('background-color', 'rgb(199, 181, 255)');
  await expect(corporate.getByRole('button', { name: 'Saved', exact: true })).toBeDisabled();
  await expect(luna.getByRole('button', { name: 'Saved', exact: true })).toBeDisabled();
});

test('nested theme boundaries restore their own semantic values', async ({ page }) => {
  await openStory(page, 'components-button--nested-theme');

  await expect(page.getByRole('button', { name: 'Outer action' })).toHaveCSS('background-color', 'rgb(199, 181, 255)');
  await expect(page.getByRole('button', { name: 'Inner action' })).toHaveCSS('background-color', 'rgb(36, 75, 176)');
  await expect(page.getByRole('button', { name: 'Nested Luna action' })).toHaveCSS('background-color', 'rgb(199, 181, 255)');
});

test('scoped consumer tokens customize color and shape without affecting siblings', async ({ page }) => {
  await openStory(page, 'components-button--consumer-override');
  const brandedAction = page.getByRole('button', { name: 'Forest brand action' });

  await expect(brandedAction).toHaveCSS('background-color', 'rgb(20, 98, 61)');
  await expect(brandedAction).toHaveCSS('border-radius', '24px');
  await expect(page.getByRole('button', { name: 'Local square override' })).toHaveCSS('border-radius', '0px');
  await expect(page.getByRole('button', { name: 'Unmodified sibling' })).toHaveCSS('background-color', 'rgb(36, 75, 176)');
});
