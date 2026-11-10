import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';
import { contrast } from '../../fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} Link follows native Enter navigation and skips unavailable text`, async ({ page }) => {
    await openStory(page, 'components-link--keyboard', { theme });
    const first = page.getByRole('link', { name: 'First destination' });
    const second = page.getByRole('link', { name: 'Second destination' });
    await expect(second).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(first).toBeFocused();
    await expect(first).toHaveCSS('outline-style', 'solid');
    await expect(first).toHaveCSS('outline-offset', '3px');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#keyboard-destination$/);
    await expect(page.getByRole('heading', { name: 'Keyboard destination' })).toBeVisible();
  });

  test(`${theme} Link preserves underlines and contrast through hover and active states`, async ({ page }) => {
    await openStory(page, 'components-link--playground', { theme });
    const link = page.getByRole('link');
    const paint = await link.evaluate(element => {
      const style = getComputedStyle(element);

      return { text: style.color, visited: style.getPropertyValue('--fs-link-visited').trim(), focus: style.getPropertyValue('--fs-link-focus-color').trim(), surface: style.getPropertyValue('--fs-surface').trim() };
    });
    expect(contrast(paint.text, paint.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(paint.visited, paint.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(paint.focus, paint.surface)).toBeGreaterThanOrEqual(3);
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
    await expect(link).toHaveCSS('text-decoration-thickness', '1px');
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-thickness', '2px');
    await expect(link).toHaveCSS('color', theme === 'corporate' ? 'rgb(23, 35, 56)' : 'rgb(244, 239, 255)');
    await page.mouse.down();
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
    await expect(link).toHaveCSS('color', theme === 'corporate' ? 'rgb(23, 35, 56)' : 'rgb(244, 239, 255)');
    await page.mouse.up();
  });

  test(`${theme} Link reflows inherited typography and icons at 320px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openStory(page, 'components-link--long-text', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
    const link = page.getByRole('link');
    await link.focus();
    await expect(link).toBeFocused();
    expect(await link.evaluate(element => getComputedStyle(element).fontSize === getComputedStyle(element.parentElement!).fontSize)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('Link announces and opens explicit new-tab navigation with no opener', async ({ page }) => {
  await openStory(page, 'components-link--new-tab');
  const link = page.getByRole('link', { name: 'Read documentation' });
  await expect(link).toHaveAccessibleDescription('Reference material. Opens in a new tab.');
  await expect(link).toHaveAttribute('rel', 'noreferrer noopener');
  const popupPromise = page.waitForEvent('popup');
  await link.click();
  const popup = await popupPromise;
  await popup.waitForURL(/#documentation$/);
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await popup.close();
});

test('Link uses the current tab for an ordinary external destination', async ({ page }) => {
  // Replace only the external document; navigation remains a real browser action.
  await page.route('https://example.com/docs', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><html lang="en"><title>Example documentation</title><h1>Example documentation</h1></html>' }));
  await openStory(page, 'components-link--external-destination');
  await page.getByRole('link', { name: 'Read documentation' }).click();
  await expect(page).toHaveURL('https://example.com/docs');
  await expect(page.getByRole('heading', { name: 'Example documentation' })).toBeVisible();
});

test('Link preserves modified clicks for opening a destination in another tab', async ({ page }) => {
  await openStory(page, 'components-link--usage');
  const popupPromise = page.context().waitForEvent('page');
  await page.getByRole('link', { name: 'privacy policy' }).click({ modifiers: ['ControlOrMeta'] });
  const popup = await popupPromise;
  await popup.waitForURL(/#privacy$/);
  expect(new URL(page.url()).hash).toBe('');
  await popup.close();
});

test('Link preserves native downloads', async ({ page }) => {
  await openStory(page, 'components-link--download');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download component guide' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('component-guide.txt');
});

test('Link preserves empty-string href as a native hyperlink', async ({ page }) => {
  await openStory(page, 'components-link--empty-destination');
  await expect(page.getByRole('link', { name: 'Current page' })).toHaveAttribute('href', '');
});

test('Link keeps unavailable text outside the hyperlink semantics', async ({ page }) => {
  await openStory(page, 'components-link--unavailable');
  await expect(page.getByRole('link')).toHaveCount(0);
  await expect(page.getByText('Unavailable documentation')).toHaveCSS('text-decoration-line', 'none');
});

test('Link retains underlines and keyboard focus in forced colors', async ({ page }) => {
  await openStory(page, 'components-link--playground');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link')).toBeFocused();
  await expect(page.getByRole('link')).toHaveCSS('outline-style', 'solid');
  await expect(page.getByRole('link')).toHaveCSS('text-decoration-line', 'underline');
});
