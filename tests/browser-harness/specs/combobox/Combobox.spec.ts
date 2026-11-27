import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} keyboard query, highlight, commitment, editing and clearing submit only identities`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-combobox--form', { theme });
    const input = page.getByRole('combobox', { name: 'Service region' });
    await page.getByRole('button', { name: 'Before region' }).focus();
    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();
    await expect(input).toHaveAttribute('aria-expanded', 'true');
    await input.pressSequentially('uni');
    await expect(page.getByRole('option')).toHaveCount(3);
    await expect(
      page.locator('form').evaluate((form) => (form as HTMLFormElement).checkValidity()),
    ).resolves.toBe(false);
    await input.press('End');
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      (await page.getByRole('option', { name: 'United Arab Emirates' }).getAttribute('id'))!,
    );
    await expect(
      page.locator('form').evaluate((form) => new FormData(form as HTMLFormElement).has('region')),
    ).resolves.toBe(false);
    await input.press('Home');
    await input.press('Enter');
    await expect(input).toHaveValue('United Kingdom');
    await expect(input).toBeFocused();
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await page.getByRole('button', { name: 'Submit region' }).click();
    await expect(page.getByLabel('Submitted region')).toHaveText('gb');
    await input.focus();
    await input.press('End');
    await expect(
      page.locator('form').evaluate((form) => new FormData(form as HTMLFormElement).get('region')),
    ).resolves.toBe('gb');
    await input.press('Escape');
    await expect(input).toHaveValue('United Kingdom');
    await input.pressSequentially('x');
    await expect(
      page.locator('form').evaluate((form) => new FormData(form as HTMLFormElement).has('region')),
    ).resolves.toBe(false);
    await input.press('Escape');
    await expect(input).toHaveValue('');
    await input.fill('uni');
    await page.getByRole('option', { name: 'United Kingdom' }).click();
    await expect(input).toBeFocused();
    await page.getByRole('button', { name: 'Clear selection' }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('');
    await expect(
      page.locator('form').evaluate((form) => new FormData(form as HTMLFormElement).has('region')),
    ).resolves.toBe(false);
    await input.press('Tab');
    await expect(page.getByRole('button', { name: 'Submit region' })).toBeFocused();
    await expect(page.getByRole('listbox')).toHaveCount(0);
    await page.keyboard.press('Enter');
    await expect(input).toBeFocused();
  });

  test(`${theme} disabled rows cannot be chosen and navigation skips them`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-combobox--disabled-options', { theme });
    const input = page.getByRole('combobox');
    await input.click();
    // ARIA disabled does not suppress native pointer events; exercise the component's guard.
    const disabled = page.getByRole('option', { name: 'Unavailable region' });
    await expect(disabled).toBeDisabled();
    const bounds = (await disabled.boundingBox())!;
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await expect(input).toHaveValue('');
    await input.press('End');
    await input.press('Enter');
    await expect(input).toHaveValue('United Arab Emirates');
  });

  test(`${theme} loading announces one status and no results appear only after a completed search`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-combobox--loading', { theme });
    await page.getByRole('combobox').fill('uni');
    await expect(page.getByRole('status')).toHaveText('Loading regions…');
    await expect(page.getByRole('status')).toHaveCount(1);
    await expect(page.getByRole('option')).toHaveCount(0);
    await expect(page.getByRole('listbox')).toHaveAttribute('aria-busy', 'true');
    await expect(page.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
    await expect(page.locator('.fs-spinner')).toHaveAttribute('aria-hidden', 'true');
    await openScenario(mount, 'components-combobox--playground', { theme });
    await page.getByRole('combobox').fill('xyz');
    await expect(page.getByRole('status')).toHaveText('No matching regions.');
  });
}

test('controlled selection responds to external updates and clearing', async ({ page, mount }) => {
  await openScenario(mount, 'components-combobox--controlled');
  await page.getByRole('button', { name: 'Choose Canada' }).click();
  await expect(page.getByRole('combobox')).toHaveValue('Canada');
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await expect(page.getByRole('combobox')).toHaveValue('');
  await page.getByRole('option', { name: 'United States' }).click();
  await expect(page.getByRole('combobox')).toHaveValue('United States');
});

test('long labels wrap with aligned popup at 320px under enlarged spaced text', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openScenario(mount, 'components-combobox--long-labels');
  await page.addStyleTag({
    content:
      'html { font-size: 200%; } .fs-combobox { letter-spacing: .12em; word-spacing: .16em; line-height: 1.5; }',
  });
  await page.getByRole('combobox').click();
  const control = await page.locator('.fs-combobox__control').boundingBox();
  const popup = await page.locator('.fs-combobox__popup').boundingBox();
  expect(popup!.x).toBe(control!.x);
  expect(popup!.width).toBe(control!.width);
  await expect(page.getByRole('option')).toHaveCSS('overflow-wrap', 'anywhere');
  expect((await page.getByRole('option').boundingBox())!.height).toBeGreaterThan(80);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole('option').click();
  await expect(page.getByRole('combobox')).toHaveValue(
    'United Kingdom — Northern regional operations and international customer support headquarters',
  );
});

test('keyboard focus and highlighted row remain visible in forced colors', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-combobox--playground');
  await page.keyboard.press('Tab');
  await expect(page.locator('.fs-combobox__control')).toHaveCSS('outline-style', 'solid');
  await page.getByRole('combobox').press('End');
  await expect(page.locator('[data-active="true"]')).toHaveCSS('outline-style', 'solid');
});
