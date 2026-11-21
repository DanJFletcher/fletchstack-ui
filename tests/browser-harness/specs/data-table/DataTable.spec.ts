import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme}: filters then sorts then paginates while selection survives`, async ({ page, mount }) => {
    await openScenario(mount, 'components-data-table--playground', { theme });
    const table = page.getByRole('table', { name: 'Payments' });
    await expect(table.getByRole('columnheader', { name: /Email/ })).toHaveAttribute('aria-sort', 'ascending');
    await expect(table.locator('tbody tr td:nth-child(3)')).toHaveText(['member-01@example.test', 'member-02@example.test', 'member-03@example.test']);
    const all = page.getByRole('checkbox', { name: 'Select all selectable rows on this page' });
    await expect(all).toBeChecked({ indeterminate: true });
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await all.focus(); await page.keyboard.press('Space');
    await expect(page.getByText('4 selected')).toBeVisible();
    await page.getByRole('combobox', { name: 'Status' }).selectOption('0');
    await expect(page.getByRole('status')).toHaveText('1–3 of 4 results');
    await expect(table.locator('tbody tr td:nth-child(3)')).toHaveText(['member-01@example.test', 'member-04@example.test', 'member-07@example.test']);
    await expect(all).toBeChecked({ indeterminate: true });
    await table.getByRole('button', { name: /Amount/ }).focus(); await page.keyboard.press('Enter');
    await expect(table.locator('tbody tr td:nth-child(3)')).toHaveText(['member-10@example.test', 'member-04@example.test', 'member-07@example.test']);
    await expect(table.getByRole('button', { name: /Amount/ })).toHaveCSS('outline-style', 'solid');
    await page.getByRole('searchbox', { name: 'Search email' }).fill('missing');
    await expect(page.getByText('No matching rows.')).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.getByRole('status')).toHaveText('1–3 of 12 results');
    await expect(page.getByText('4 selected')).toBeVisible();
  });

  test(`${theme}: column chooser preserves filtered records and returns focus`, async ({ page, mount }) => {
    await openScenario(mount, 'components-data-table--playground', { theme });
    await page.getByRole('searchbox').fill('member-01');
    await page.getByRole('button', { name: 'Columns', exact: true }).click();
    const chooser = page.getByRole('dialog', { name: 'Visible columns' });
    await expect(chooser.getByRole('checkbox', { name: 'Email' })).toBeDisabled();
    await chooser.getByRole('checkbox', { name: 'Status' }).uncheck();
    await expect(page.getByRole('columnheader', { name: 'Status', exact: true })).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveText('1–1 of 1 results');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Columns', exact: true })).toBeFocused();
    await expect(chooser).toBeHidden();
  });
}

test('controlled state and record-specific actions work with keyboard', async ({ page, mount }) => {
  await openScenario(mount, 'components-data-table--controlled');
  await page.getByRole('searchbox').fill('member-02');
  const action = page.getByRole('button', { name: 'Actions for member-02@example.test' });
  await action.focus(); await page.keyboard.press('Enter');
  await page.getByRole('menuitem', { name: 'View payment ID' }).click();
  await expect(page.getByText('Payment ID: payment-2')).toBeVisible();
  await expect(action).toBeFocused();
});

test('loading, empty, no matches and retry keep headers and editable filters', async ({ page, mount }) => {
  await openScenario(mount, 'components-data-table--playground', { args: { loading: true } });
  await expect(page.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('columnheader')).toHaveCount(5);
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
  await openScenario(mount, 'components-data-table--retry');
  await expect(page.getByRole('alert')).toHaveText('Payments could not be loaded.');
  await expect(page.getByRole('table')).toHaveAttribute('aria-busy', 'false');
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByRole('cell', { name: 'member-01@example.test', exact: true })).toBeVisible();
  await page.getByRole('searchbox').fill('missing');
  await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  await expect(page.getByRole('searchbox')).toHaveValue('missing');
});

test('a second dataset uses the same public composition', async ({ page, mount }) => {
  await openScenario(mount, 'components-data-table--stock');
  await expect(page.getByRole('table', { name: 'Stock' })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'desk' })).toBeVisible();
});

test('themes inherit palette while a narrow enlarged layout scrolls the table only', async ({ page, mount }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-data-table--composition');
  const tables = page.getByRole('table', { name: 'Payments' });
  await expect(tables).toHaveCount(2);
  const backgrounds = await tables.evaluateAll(nodes => nodes.map(node => getComputedStyle(node.closest('.fs-table')!).backgroundColor));
  expect(backgrounds[0]).not.toBe(backgrounds[1]);
  await page.addStyleTag({ content: 'html { font-size: 200%; } * { letter-spacing: .12em !important; word-spacing: .16em !important; line-height: 1.5 !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const scroll = page.getByRole('region', { name: 'Scrollable table' }).first();
  expect(await scroll.evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
  await expect(page.getByRole('searchbox').first()).toBeVisible();
});
