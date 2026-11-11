import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

// Retained until affected selection can prove ownership of Link's forwarded href.
test('copy preserves native tab order and inline links keep visible focus', async ({ page }) => {
  await openStory(page, 'components-heading--native-focus');
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
