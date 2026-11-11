import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test.describe(`Spatial examples / ${theme}`, () => {
    test('the preferred scale displays every raw measurement', async ({ page, mount }) => {
      await openScenario(mount, 'design-system-spatial-examples--scale', { theme });
      const scale = page.getByRole('list', { name: 'Preferred spacing scale' });
      await expect(scale.getByText(/^\d+px$/)).toHaveText(['0px', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px', '80px', '96px']);
      await expect(scale.getByRole('meter')).toHaveCount(13);
    });

    test('keyboard typeahead changes parent gaps without changing Button padding', async ({ page, mount }) => {
      await openScenario(mount, 'design-system-spatial-examples--composition', { theme });
      const select = page.getByRole('combobox', { name: 'Action spacing' });
      const actions = page.getByRole('group', { name: 'Adjustable actions' });
      const save = actions.getByRole('button', { name: 'Save', exact: true });
      await expect(actions).toHaveCSS('gap', '12px');
      await select.focus();
      await page.keyboard.press('r');
      await expect(select).toHaveValue('related');
      await expect(actions).toHaveCSS('gap', '16px');
      await expect(select).toHaveCSS('outline-style', 'auto');
      await expect(select).not.toHaveCSS('outline-width', '0px');
      await select.selectOption('label');
      await expect(actions).toHaveCSS('gap', '8px');
      await expect(save).toHaveCSS('padding-inline-start', '16px');
      await expect(save).toHaveCSS('padding-block-start', '10px');
      await expect(save).toHaveCSS('gap', '8px');
      await expect(save).toHaveCSS('margin', '0px');
      await select.selectOption('actions');
      await expect(actions).toHaveCSS('gap', '12px');
      await page.addStyleTag({ content: '.spatial-demo { --fs-space-gap-label: 20px; }' });
      await expect(page.locator('.spatial-field')).toHaveCSS('gap', '20px');
      await expect(select).toHaveCSS('padding', '8px');
    });

    test('scoped overrides reset only at explicit nested theme boundaries', async ({ page, mount }) => {
      await openScenario(mount, 'design-system-spatial-examples--scoped-overrides', { theme });
      await expect(page.getByRole('group', { name: 'Outer actions' })).toHaveCSS('gap', '32px');
      await expect(page.getByRole('group', { name: 'Nested actions' })).toHaveCSS('gap', '12px');
      await expect(page.getByRole('group', { name: 'Sibling actions' })).toHaveCSS('gap', '12px');
      await page.addStyleTag({ content: 'html { --fs-space-gap-actions: 20px; }' });
      await expect(page.getByRole('group', { name: 'Sibling actions' })).toHaveCSS('gap', '12px');
    });

    test('only the example-specific breakpoint changes section separation', async ({ page, mount }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await openScenario(mount, 'design-system-spatial-examples--responsive-sections', { theme });
      const sections = page.getByRole('group', { name: 'Page sections' });
      await expect(sections).toHaveCSS('gap', '64px');
      await page.setViewportSize({ width: 600, height: 768 });
      await expect(sections).toHaveCSS('gap', '32px');
      await page.setViewportSize({ width: 601, height: 768 });
      await expect(sections).toHaveCSS('gap', '64px');
    });

    for (const story of ['scale', 'composition', 'scoped-overrides', 'responsive-sections']) {
      test(`${story} reflows with 200% text and user text spacing`, async ({ page, mount }) => {
        await page.setViewportSize({ width: 320, height: 700 });
        await openScenario(mount, `design-system-spatial-examples--${story}`, { theme });
        await page.addStyleTag({ content: 'html {font-size:200%} .spatial-demo, .spatial-demo * {line-height:1.5;letter-spacing:.12em;word-spacing:.16em} .spatial-demo p {margin-bottom:2em}' });
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await page.locator('.spatial-actions .fs-button').evaluateAll(buttons => buttons.every(button => button.scrollWidth <= button.clientWidth))).toBe(true);
      });
    }
  });
}
