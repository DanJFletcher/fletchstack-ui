import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

test('Storybook args reach the rendered native button', async ({ page }) => {
  await openStory(page, 'components-button--playground', {
    args: { className: 'consumer-action', children: 'Publish', title: 'Publish settings' },
  });
  const button = page.getByRole('button', { name: 'Publish', exact: true });

  await expect(button).toHaveClass(/consumer-action/);
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveAttribute('title', 'Publish settings');
});
