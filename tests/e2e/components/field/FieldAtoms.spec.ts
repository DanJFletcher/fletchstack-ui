import { expect, test } from '../../fixtures/test';
import { openStory } from '../../fixtures/storybook';

const atoms = [
  { id: 'field-label', name: 'FieldLabel', description: '', prop: 'htmlFor' },
  { id: 'field-description', name: 'FieldDescription', description: 'Use a short, descriptive name.', prop: 'as' },
  { id: 'field-error', name: 'FieldError', description: 'Enter a project name.', prop: 'as' },
];

for (const atom of atoms) {
  for (const theme of ['corporate', 'luna'] as const) {
    test(`${theme} ${atom.name} associates its control and reflows with enlarged text`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await openStory(page, `components-${atom.id}--playground`, { theme });
      const input = page.getByRole('textbox', { name: 'Project name' });
      await expect(input).toHaveAccessibleDescription(atom.description);
      await page.getByText('Project name', { exact: true }).click();
      await expect(input).toBeFocused();
      await page.keyboard.type('Website refresh');
      await expect(input).toHaveValue('Website refresh');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Shift+Tab');
      await expect(input).toBeFocused();
      await expect(input).not.toHaveCSS('outline-style', 'none');
      if (atom.id === 'field-error') {
        await expect(input).toHaveAttribute('aria-invalid', 'true');
      }
      await page.addStyleTag({ content: 'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(input).toBeVisible();
    });
  }

  test(`${atom.name} documents public props and links to composed Field`, async ({ page }) => {
    await page.goto(`/?path=/docs/components-${atom.id}--docs`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.getByRole('heading', { name: atom.name, exact: true })).toBeVisible();
    await expect(preview.getByRole('table').first()).toContainText(atom.prop);
    const examples = preview.locator('.field-atom-demo');
    await examples.nth(1).getByText('Project name', { exact: true }).click();
    await expect(examples.nth(1).getByRole('textbox')).toBeFocused();
    await preview.getByRole('link', { name: 'Explore composed Field', exact: true }).first().click();
    await expect(page).toHaveURL(/path=\/docs\/components-field--docs/);
    await expect(preview.getByRole('heading', { name: 'Field', exact: true })).toBeVisible();
  });

  test(`${atom.name} has a working theme comparison`, async ({ page }) => {
    await openStory(page, `components-${atom.id}--both-themes`);
    await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveCount(2);
  });
}

for (const id of ['field-description', 'field-error']) {
  test(`${id} demonstrates an associated inline message`, async ({ page }) => {
    await openStory(page, `components-${id}--inline`);
    await expect(page.locator(`span.fs-${id}`)).toBeVisible();
    await expect(page.getByRole('textbox')).toHaveAttribute('aria-describedby', /project-/);
  });
}
