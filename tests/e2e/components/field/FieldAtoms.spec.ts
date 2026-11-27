import { expect, test } from '../../fixtures/test';

const atoms = [
  { id: 'field-label', name: 'FieldLabel', prop: 'htmlFor' },
  { id: 'field-description', name: 'FieldDescription', prop: 'as' },
  { id: 'field-error', name: 'FieldError', prop: 'as' },
];

for (const atom of atoms) {
  test(`${atom.name} documents public props and links to composed Field`, async ({ page }) => {
    await page.goto(`/?path=/docs/components-${atom.id}--docs`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.getByRole('heading', { name: atom.name, exact: true })).toBeVisible();
    await expect(preview.getByRole('table').first()).toContainText(atom.prop);
    const examples = preview.locator('.field-atom-demo');
    await examples.nth(1).getByText('Project name', { exact: true }).click();
    await expect(examples.nth(1).getByRole('textbox')).toBeFocused();
    await preview
      .getByRole('link', { name: 'Explore composed Field', exact: true })
      .first()
      .click();
    await expect(page).toHaveURL(/path=\/docs\/components-field--docs/);
    await expect(preview.getByRole('heading', { name: 'Field', exact: true })).toBeVisible();
  });
}
