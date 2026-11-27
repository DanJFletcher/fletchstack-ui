import { expect, test } from '../fixtures/test';
import { openStory } from '../fixtures/storybook';

test('a visible preview with a failed play is rejected', async ({ page }) => {
  await page.route('**/iframe.html?**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html lang="en"><body><main class="showcase">Synthetic failed play</main><script>window.__STORYBOOK_PREVIEW__ = { channel: { last: () => [{status: "error"}] } };</script></body></html>',
    }),
  );

  await expect(openStory(page, 'synthetic-failed-play--fixture')).rejects.toThrow(/success/);
  await expect(page.getByRole('main')).toBeVisible();
});
