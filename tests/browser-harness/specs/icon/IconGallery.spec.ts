import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

const names = ['MoonIcon', 'SunIcon', 'CheckIcon', 'CloseIcon', 'ChevronDownIcon', 'ArrowRightIcon', 'PlusIcon', 'ExternalLinkIcon', 'HomeIcon', 'InboxIcon', 'HelpIcon'];

for (const theme of ['corporate', 'luna'] as const) {
  test.describe(`Icon gallery / ${theme}`, () => {
    test('searches names, uses and synonyms literally without changing order or focus', async ({ page, mount }) => {
      await openScenario(mount, 'components-icon--gallery', { theme });
      const search = page.getByRole('searchbox', { name: 'Search icons' });
      const results = page.getByRole('list', { name: 'Icon results' });
      const count = page.getByRole('status');
      await expect(results.getByRole('heading')).toHaveText(names);
      await expect(count).toHaveText('11 icons');
      await expect(count).toHaveAttribute('aria-live', 'polite');
      const initialCardWidth = await results.getByRole('listitem').first().evaluate(card => card.getBoundingClientRect().width);
      await expect(results.getByRole('img')).toHaveCount(0);
      await expect(results.locator('svg[aria-hidden="true"][focusable="false"]')).toHaveCount(11);
      await expect(results.locator('button, a, [tabindex]')).toHaveCount(0);

      for (const example of [
        { query: '  mOoN  ', names: ['MoonIcon'], count: '1 icon' },
        { query: 'mode', names: ['MoonIcon', 'SunIcon'], count: '2 icons' },
        { query: 'new', names: ['PlusIcon'], count: '1 icon' },
        { query: 'add', names: ['PlusIcon'], count: '1 icon' },
        { query: 'dismiss', names: ['CloseIcon'], count: '1 icon' },
        { query: '   ', names, count: '11 icons' },
        { query: '[', names: [], count: '0 icons' },
      ]) {
        await search.fill(example.query);
        await expect(search).toBeFocused();
        await expect(results.getByRole('heading')).toHaveText(example.names);
        await expect(count).toHaveText(example.count);
      }
      await expect(page.getByText('No icons found. Try another term or clear the search.')).toBeVisible();
      await search.fill('new');
      const filteredCardWidth = await results.getByRole('listitem').evaluate(card => card.getBoundingClientRect().width);
      expect(filteredCardWidth).toBeCloseTo(initialCardWidth, 0);
      await page.getByRole('button', { name: 'Clear search' }).click();
      await expect(search).toHaveValue('');
      await expect(search).toBeFocused();
      await expect(results.getByRole('heading')).toHaveText(names);
    });

    test('keyboard clearing recovers from filtered, empty and already-clear queries', async ({ page, mount }) => {
      await openScenario(mount, 'components-icon--gallery', { theme });
      const search = page.getByRole('searchbox', { name: 'Search icons' });
      const clear = page.getByRole('button', { name: 'Clear search' });

      for (const query of ['add', 'no-such-icon', '']) {
        await search.fill(query);
        await page.keyboard.press('Tab');
        await expect(clear).toBeFocused();
        await expect(clear).toHaveCSS('outline-style', 'solid');
        await page.keyboard.press('Enter');
        await expect(search).toBeFocused();
        await expect(search).toHaveValue('');
        await expect(page.getByRole('status')).toHaveText('11 icons');
      }
      await expect(search).toHaveCSS('outline-style', 'solid');
      await expect(search).not.toHaveCSS('outline-width', '0px');
    });

    test('styled search text, boundaries and keyboard focus have sufficient contrast', async ({ page, mount }) => {
      await openScenario(mount, 'components-icon--gallery', { theme });
      const search = page.getByRole('searchbox', { name: 'Search icons' });
      // The Storybook play ended with search focused; establish that prerequisite explicitly.
      await search.focus();
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      const paint = await search.evaluate(element => {
        const style = getComputedStyle(element);
        return { text: style.color, background: style.backgroundColor, border: style.borderColor, outline: style.outlineColor, surface: getComputedStyle(element.closest('.showcase')!).backgroundColor };
      });

      await expect(search).toBeFocused();
      expect(contrast(paint.text, paint.background)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(paint.border, paint.surface)).toBeGreaterThanOrEqual(3);
      expect(contrast(paint.border, paint.background)).toBeGreaterThanOrEqual(3);
      expect(contrast(paint.outline, paint.surface)).toBeGreaterThanOrEqual(3);
      expect(contrast(paint.outline, paint.background)).toBeGreaterThanOrEqual(3);
    });


    test('preview sizes and local theme selection preserve discovery', async ({ page, mount }) => {
      await openScenario(mount, 'components-icon--gallery', { theme });
      const results = page.getByRole('list', { name: 'Icon results' });
      for (const option of [{ label: '16 px', pixels: '16px' }, { label: '20 px', pixels: '20px' }, { label: '24 px', pixels: '24px' }]) {
        await page.getByRole('radio', { name: option.label, exact: true }).check();
        await expect(page.getByRole('radio', { name: option.label, exact: true })).toBeChecked();
        await expect(results.locator('svg').first()).toHaveCSS('width', option.pixels);
        await expect(results.getByRole('heading')).toHaveText(names);
      }
      const selector = page.getByRole('combobox', { name: 'Theme' });
      await selector.selectOption('luna');
      await expect(page.locator('.icon-gallery')).toHaveAttribute('data-theme', 'luna');
      await expect(selector).toHaveCSS('color-scheme', 'dark');
      await selector.selectOption('corporate');
      await expect(selector).toHaveCSS('color-scheme', 'light');
      await selector.selectOption('inherit');
      await expect(page.locator('.icon-gallery')).not.toHaveAttribute('data-theme');
      await expect(results.getByRole('heading')).toHaveText(names);
      await page.getByRole('radio', { name: '16 px', exact: true }).focus();
      await page.keyboard.press('ArrowRight');
      await expect(page.getByRole('radio', { name: '20 px', exact: true })).toBeChecked();
      await expect(page.getByRole('radio', { name: '20 px', exact: true }).locator('..').locator('span')).toHaveCSS('outline-style', 'solid');
    });

    test('cards and controls reflow with enlarged, spaced text at 320px', async ({ page, mount }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await openScenario(mount, 'components-icon--gallery', { theme });
      await page.addStyleTag({ content: `
        html { font-size: 200%; }
        .icon-gallery, .icon-gallery * { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; }
        .icon-gallery p { margin-bottom: 2em; }
      ` });
      const search = page.getByRole('searchbox', { name: 'Search icons' });
      await expect(search).toHaveCSS('font-size', '28px');
      await expect(page.getByRole('heading', { name: 'ExternalLinkIcon', exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.getByRole('listitem').evaluateAll(cards => cards.every(card => card.scrollWidth <= card.clientWidth))).toBe(true);
      await search.fill('no-such-icon');
      await expect(page.getByText('No icons found. Try another term or clear the search.')).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.getByRole('button', { name: 'Clear search' }).click();
      await expect(page.getByRole('listitem')).toHaveCount(11);
    });
  });
}

for (const theme of ['corporate', 'luna'] as const) {
  test.describe(`Spatial system / ${theme}`, () => {
    test('control height does not change search padding', async ({ page, mount }) => {
      await openScenario(mount, 'components-icon--gallery', { theme });
      await page.addStyleTag({ content: '.icon-gallery { --fs-gallery-control-height: 60px; }' });
      const search = page.getByRole('searchbox', { name: 'Search icons' });
      await expect(search).toHaveCSS('min-height', '60px');
      await expect(search).toHaveCSS('padding-inline-start', '36px');
      await expect(search).toHaveCSS('padding-block-start', '8px');
    });

    test('general insets do not change heading separation', async ({ page, mount }) => {
      await openScenario(mount, 'components-icon--gallery', { theme });
      await page.addStyleTag({ content: '.icon-gallery { --fs-gallery-inset: 40px; --fs-gallery-compact-inset: 12px; }' });
      await expect(page.locator('.icon-gallery__heading')).toHaveCSS('margin-bottom', '16px');
    });

    test('border thickness does not change preview edge inset', async ({ page, mount }) => {
      await openScenario(mount, 'components-icon--gallery', { theme });
      await page.addStyleTag({ content: '.icon-gallery { --fs-gallery-border-width: 3px; }' });
      await expect(page.locator('.icon-gallery__sizes > div')).toHaveCSS('padding', '1px');
    });
  });
}
