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
