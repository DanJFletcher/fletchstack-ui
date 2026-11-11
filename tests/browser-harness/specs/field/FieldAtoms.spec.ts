import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

const atoms = [
  { id: 'field-label', name: 'FieldLabel', description: '' },
  { id: 'field-description', name: 'FieldDescription', description: 'Use a short, descriptive name.' },
  { id: 'field-error', name: 'FieldError', description: 'Enter a project name.' },
];

for (const atom of atoms) {
  for (const theme of ['corporate', 'luna'] as const) {
    test(`${theme} ${atom.name} associates its control and reflows with enlarged text`, async ({ page, mount }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await openScenario(mount, `components-${atom.id}--playground`, { theme });
      const input = page.getByRole('textbox', { name: 'Project name' });
      await expect(input).toHaveAccessibleDescription(atom.description);
      await page.getByText('Project name', { exact: true }).click();
      await expect(input).toBeFocused();
      await page.keyboard.type('Website refresh');
      await expect(input).toHaveValue('Website refresh');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Next action' })).toBeFocused();
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

  test(`${atom.name} has a working theme comparison`, async ({ page, mount }) => {
    await openScenario(mount, `components-${atom.id}--both-themes`);
    await expect(page.getByRole('textbox', { name: 'Project name' })).toHaveCount(2);
  });
}

for (const id of ['field-description', 'field-error']) {
  test(`${id} demonstrates an associated inline message`, async ({ page, mount }) => {
    await openScenario(mount, `components-${id}--inline`);
    await expect(page.locator(`span.fs-${id}`)).toBeVisible();
    await expect(page.getByRole('textbox')).toHaveAttribute('aria-describedby', /project-/);
  });
}
