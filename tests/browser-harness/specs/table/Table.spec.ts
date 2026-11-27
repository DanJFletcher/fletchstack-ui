import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} portfolio preserves five native columns, Badge statuses, chronological dates and numeric seats`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-table--playground', { theme });
    const table = page.getByRole('table', { name: 'Project portfolio' });
    await expect(table.getByRole('columnheader')).toHaveCount(5);
    await expect(table.getByRole('columnheader')).toHaveText([
      'Project↕',
      'Owner↕',
      'Status',
      'Updated↕',
      'Seats↓',
    ]);
    await expect(table.locator('tbody tr td:first-child')).toHaveText(['Atlas', 'Beacon', 'Cedar']);
    await expect(table.locator('.fs-badge')).toHaveText(['Active', 'In review', 'Draft']);
    await expect(table.locator('time').first()).toHaveText('Nov 12, 2026');
    await expect(table.locator('tbody tr td:last-child').first()).toHaveCSS('text-align', 'end');
    await expect(table.locator('tbody tr td:last-child').first()).toHaveCSS(
      'font-variant-numeric',
      'tabular-nums',
    );
    const seats = table.getByRole('button', { name: 'Seats' });
    await seats.focus();
    await page.keyboard.press('Enter');
    await expect(table.getByRole('columnheader', { name: 'Seats' })).not.toHaveAttribute(
      'aria-sort',
    );
    await page.keyboard.press('Space');
    await expect(table.locator('tbody tr td:first-child')).toHaveText(['Cedar', 'Beacon', 'Atlas']);
    await expect(table.getByRole('columnheader', { name: 'Seats' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await expect(seats).toHaveCSS('outline-style', 'solid');
    await table.getByRole('button', { name: 'Updated' }).click();
    await expect(table.locator('tbody tr td:first-child')).toHaveText(['Cedar', 'Beacon', 'Atlas']);
    await expect(table.getByRole('columnheader', { name: 'Updated' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    await table.getByRole('button', { name: 'Updated' }).click();
    await expect(table.locator('tbody tr td:first-child')).toHaveText(['Atlas', 'Beacon', 'Cedar']);
  });

  test(`${theme} filtering select-all preserves offscreen keys, skips disabled rows and exposes mixed state`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-table--selection', { theme });
    const all = page.getByRole('checkbox', { name: 'Select all selectable rows' });
    const search = page.getByRole('searchbox', { name: 'Search projects' });
    await expect(all).toBeChecked({ indeterminate: true });
    await expect(page.getByRole('checkbox', { name: 'Select Cedar' })).toBeDisabled();
    await search.fill('Atlas');
    await expect(page.getByRole('status').filter({ hasText: /^1 of 3 rows$/ })).toHaveCount(1);
    await all.focus();
    await page.keyboard.press('Space');
    await expect(page.getByLabel('Selected projects')).toHaveText('beacon, atlas');
    await expect(all).toBeChecked();
    await page.keyboard.press('Space');
    await expect(page.getByLabel('Selected projects')).toHaveText('beacon');
    await search.fill('');
    await expect(page.getByRole('checkbox', { name: 'Select Beacon' })).toBeChecked();
    await expect(all).toBeChecked({ indeterminate: true });
    await page.getByRole('button', { name: 'Project' }).click();
    await expect(page.getByRole('checkbox', { name: 'Select Beacon' })).toBeChecked();
    const selected = page
      .getByRole('checkbox', { name: 'Select Beacon' })
      .locator('xpath=ancestor::tr');
    await expect(selected).toHaveCSS(
      'background-color',
      theme === 'corporate' ? 'rgb(232, 239, 255)' : 'rgb(36, 61, 112)',
    );
  });
}

test('an unrelated inventory sorts numbers, computes raw accessor cells and updates footer summaries after searching', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-table--inventory');
  const table = page.getByRole('table', { name: 'Office inventory' });
  await table.getByRole('button', { name: 'Stock' }).click();
  await expect(table.locator('tbody tr td:first-child')).toHaveText([
    'Notepads',
    'Binder clips',
    'Pencils',
  ]);
  await expect(table.locator('tfoot tr td')).toHaveText(['Total', '42', '$91.00']);
  await page.getByRole('searchbox', { name: 'Search products' }).fill('Notepads');
  await expect(table.locator('tbody tr td')).toHaveText(['Notepads', '2', '$16.00']);
  await expect(table.locator('tfoot tr td')).toHaveText(['Total', '2', '$16.00']);
});

test('controlled and manual sorting preserve their separate data ownership', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-table--controlled');
  await page.getByRole('button', { name: 'Seats' }).click();
  await page.getByRole('button', { name: 'Seats' }).click();
  await expect(page.getByRole('table').locator('tbody tr td:first-child')).toHaveText([
    'Cedar',
    'Beacon',
    'Atlas',
  ]);
  await openScenario(mount, 'components-table--manual');
  await page.getByRole('button', { name: 'Seats' }).click();
  await page.getByRole('button', { name: 'Seats' }).click();
  await expect(page.getByLabel('Requested sort')).toHaveText('seats: asc');
  await expect(page.getByRole('table').locator('tbody tr td:first-child')).toHaveText([
    'Atlas',
    'Beacon',
    'Cedar',
  ]);
  await page.getByRole('button', { name: 'Reverse supplied rows' }).click();
  await expect(page.getByRole('table').locator('tbody tr td:first-child')).toHaveText([
    'Cedar',
    'Beacon',
    'Atlas',
  ]);
});

test('sticky headers remain at the scroll region top while rows scroll underneath', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-table--sticky');
  const region = page.getByRole('region', { name: 'Scrollable table' });
  const header = page.getByRole('columnheader', { name: 'Project' });
  const initial = (await header.boundingBox())!.y;
  await region.evaluate((element) => {
    element.scrollTop = 160;
  });
  await expect.poll(async () => (await header.boundingBox())!.y).toBe(initial);
  await expect(header).toHaveCSS('position', 'sticky');
  expect(await region.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(
    true,
  );
});

test('narrow enlarged/spaced portfolio scrolls horizontally without losing native column relationships', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-table--playground');
  await page.addStyleTag({
    content:
      'html { font-size: 200%; } .fs-table { letter-spacing: .12em; word-spacing: .16em; line-height: 1.5; }',
  });
  const region = page.getByRole('region', { name: 'Scrollable table' });
  await expect(page.getByRole('columnheader')).toHaveCount(5);
  expect(await region.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await region.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => region.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await expect(page.getByRole('columnheader', { name: 'Seats' })).toHaveAttribute('scope', 'col');
});

test('loading, empty and no-results states keep headers and an editable search', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-table--states');
  const loading = page.getByRole('table', { name: 'Loading' });
  await expect(loading.getByRole('columnheader')).toHaveCount(2);
  await expect(loading.getByRole('cell')).toHaveAttribute('colspan', '2');
  await expect(loading.locator('.fs-spinner')).toHaveAttribute('aria-hidden', 'true');
  await expect(page.getByRole('status').filter({ hasText: 'Loading projects…' })).toHaveCount(1);
  await expect(page.getByRole('table', { name: 'Empty' }).getByRole('cell')).toHaveText(
    'No projects yet.',
  );
  await expect(page.getByRole('table', { name: 'No matches' }).getByRole('cell')).toHaveText(
    'No matching projects.',
  );
  await page.getByRole('searchbox', { name: 'Search projects' }).fill('Atlas');
  await expect(page.getByRole('table', { name: 'No matches' }).locator('tbody tr')).toHaveCount(1);
  await expect(
    page.getByRole('table', { name: 'No matches' }).getByRole('cell', { name: 'Atlas' }),
  ).toBeVisible();
});

test('both portfolio instances share markup and inherit distinct theme surfaces and status paints', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-table--composition');
  const corporate = page.getByRole('region', { name: 'Corporate', exact: true }).getByRole('table');
  const luna = page.getByRole('region', { name: 'Luna', exact: true }).getByRole('table');
  await expect(corporate.getByRole('columnheader')).toHaveCount(5);
  await expect(luna.getByRole('columnheader')).toHaveCount(5);
  await expect(corporate.locator('tbody tr td:first-child')).toHaveText([
    'Atlas',
    'Beacon',
    'Cedar',
  ]);
  await expect(luna.locator('tbody tr td:first-child')).toHaveText(['Atlas', 'Beacon', 'Cedar']);
  expect(
    await corporate
      .getByRole('columnheader')
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(
    await luna
      .getByRole('columnheader')
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  );
  expect(
    await corporate
      .locator('.fs-badge')
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe(
    await luna
      .locator('.fs-badge')
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor),
  );
});

test('per-instance, column and row styles retain sorting and selection interactions', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-table--styling');
  await expect(page.getByRole('cell', { name: '24', exact: true })).toHaveCSS('font-weight', '700');
  await expect(page.getByRole('cell', { name: 'Nia Woods' }).locator('..')).toHaveCSS(
    'font-style',
    'italic',
  );
  await page.getByRole('button', { name: 'Seats' }).click();
  await page.getByRole('checkbox', { name: 'Select row atlas' }).check();
  await expect(page.getByRole('checkbox', { name: 'Select row atlas' })).toBeChecked();
});

test('forced colors keep native selection and keyboard focus visible', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-table--selection');
  await page.getByRole('button', { name: 'Seats' }).focus();
  await expect(page.getByRole('button', { name: 'Seats' })).toHaveCSS('outline-style', 'solid');
  await expect(
    page.getByRole('checkbox', { name: 'Select Beacon' }).locator('xpath=ancestor::tr'),
  ).toHaveCSS('outline-style', 'solid');
});

test('compact striped and hovered rows retain selected-row paint and built-in controls', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-table--compact');
  const row = page.getByRole('checkbox', { name: 'Select Beacon' }).locator('xpath=ancestor::tr');
  await expect(row).toHaveCSS('background-color', 'rgb(211, 242, 208)');
  await row.hover();
  await expect(row).toHaveCSS('background-color', 'rgb(211, 242, 208)');
  await expect(row.getByRole('cell').last()).toHaveCSS('padding-block-start', '4px');
  await expect(row.getByRole('cell').last()).toHaveCSS('border-inline-end-width', '1px');
  await page.getByRole('checkbox', { name: 'Select Beacon' }).uncheck();
  await expect(row).toHaveCSS('background-color', 'rgb(232, 239, 255)');
});
