import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

test('the media card disclosure supports native keyboard activation', async ({ page }) => {
  await openStory(page, 'components-card--with-media');
  const summary = page.getByText('Collection details', { exact: true });
  const description = page.getByText('Reusable React components with Corporate and Luna themes.');
  await expect(description).toBeVisible();

  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(description).toBeHidden();
  await page.keyboard.press('Space');
  await expect(description).toBeVisible();
  await expect(summary).toBeFocused();
});

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} cards reflow at 320px with enlarged and spaced text`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-card--long-content', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });

    await expect(page.getByRole('heading', { name: 'A very long title with room to wrap and grow' })).toBeVisible();
    const save = page.getByRole('button', { name: 'Save this collection for another day' });
    await save.focus();
    await expect(save).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await save.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  });
}

test('card token overrides customize geometry without changing other cards', async ({ page }) => {
  await openStory(page, 'components-card--consumer-override');
  const title = page.getByRole('heading', { name: 'A foundation for every interface.' });
  await expect(title).toHaveCSS('font-size', '32px');
  await expect(page.locator('.fs-card')).toHaveCSS('border-radius', '32px');

  await openStory(page, 'components-card--playground', { theme: 'corporate' });
  await expect(page.locator('.fs-card')).toHaveCSS('border-radius', '4px');
});

for (const story of ['playground', 'consumer-override', 'reference-layouts', 'variants-and-padding', 'both-themes', 'with-footer', 'luna-footer', 'luna-media']) {
  test(`the ${story} composition renders its documented content`, async ({ page }) => {
    await openStory(page, `components-card--${story}`);
    await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  });
}
