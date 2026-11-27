import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} chevron matches Select artwork, size and trailing inset at every field size`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-multi-select--chevron-comparison', { theme });
    for (const size of ['small', 'medium', 'large']) {
      const single = page.getByRole('combobox', { name: `Single ${size}` }).locator('..');
      const multiple = page.getByRole('combobox', { name: `Multiple ${size}` }).locator('..');
      const expected = await single.locator('svg').evaluate((element) => {
        const rect = element.getBoundingClientRect(),
          control = element.parentElement!.previousElementSibling!.getBoundingClientRect(),
          paint = getComputedStyle(element);
        return {
          path: element.querySelector('path')!.getAttribute('d'),
          width: rect.width,
          height: rect.height,
          inset: control.right - rect.right,
          stroke: paint.strokeWidth,
          color: paint.color,
        };
      });
      await expect(multiple.locator('svg')).toHaveCount(1);
      const result = await multiple.locator('svg').evaluate((element) => {
        const rect = element.getBoundingClientRect(),
          control = element.closest('.fs-multi-select__control')!.getBoundingClientRect(),
          paint = getComputedStyle(element);
        return {
          path: element.querySelector('path')!.getAttribute('d'),
          width: rect.width,
          height: rect.height,
          inset: control.right - rect.right,
          stroke: paint.strokeWidth,
          color: paint.color,
        };
      });
      expect(result).toEqual(expected);
      await expect(multiple.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    }
  });
  test(`${theme} searches, toggles and removes choices with keyboard focus retained`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-multi-select--playground', { theme });
    const input = page.getByRole('combobox', { name: 'Article topics' });
    await input.fill('des');
    await expect(page.getByRole('option')).toHaveText(['Design systems', 'Product design']);
    await input.press('Enter');
    await expect(page.getByRole('button', { name: 'Remove Design systems' })).toBeVisible();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('');
    await input.press('End');
    await expect(page.getByRole('option', { name: 'Accessibility' })).toHaveAttribute(
      'data-active',
      'true',
    );
    await input.press('ArrowDown');
    await expect(page.getByRole('option', { name: 'React' })).toHaveAttribute(
      'data-active',
      'true',
    );
    await input.press('Enter');
    await input.press('Backspace');
    await expect(page.getByRole('button', { name: 'Remove React' })).toHaveCount(0);
    await input.press('Escape');
    await expect(page.getByRole('listbox')).toHaveCount(0);
  });

  test(`${theme} pointer selection preserves focus and the active state has contrast`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-multi-select--playground', { theme });
    const input = page.getByRole('combobox');
    await input.click();
    await page.getByRole('option', { name: 'React' }).click();
    await expect(input).toBeFocused();
    const active = page.getByRole('option', { name: 'React' });
    const paint = await active.evaluate((element) => ({
      color: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
    }));
    expect(contrast(paint.color, paint.background)).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator('.fs-multi-select__control')).toHaveCSS('outline-style', 'solid');
    await page.getByRole('button', { name: 'Clear selections' }).click();
    await expect(page.getByRole('button', { name: 'Remove React' })).toHaveCount(0);
    await expect(input).toBeFocused();
  });

  test(`${theme} wraps long tags and options at 320px with enlarged and spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-multi-select--long-options', { theme });
    await page.addStyleTag({
      content:
        'html {font-size:200%} .fs-multi-select {line-height:1.5;letter-spacing:.12em;word-spacing:.16em}',
    });
    await page.getByRole('combobox').click();
    const popup = page.getByRole('listbox');
    await expect(popup).toBeVisible();
    expect(await popup.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.getByRole('button', { name: /Remove Long/ })).toBeVisible();
  });
}

test('native form submits repeated values and restores defaults on reset', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-multi-select--form');
  await page.getByRole('combobox').fill('des');
  await page.getByRole('option', { name: 'Product design' }).click();
  await page.getByRole('combobox').press('Escape');
  await page.getByRole('button', { name: 'Save topics' }).click();
  await expect(page.getByLabel('Saved topics')).toHaveText('react, product');
  await page.getByRole('button', { name: 'Reset topics' }).click();
  await expect(page.getByRole('button', { name: 'Remove React' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove Product design' })).toHaveCount(0);
});

test('minimum validation ignores query text and clears when enough choices are selected', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-multi-select--required');
  const input = page.getByRole('combobox');
  await input.fill('React');
  expect(await input.evaluate((element) => (element as HTMLInputElement).checkValidity())).toBe(
    false,
  );
  await input.press('Enter');
  expect(await input.evaluate((element) => (element as HTMLInputElement).checkValidity())).toBe(
    false,
  );
  await input.fill('design systems');
  await input.press('Enter');
  expect(await input.evaluate((element) => (element as HTMLInputElement).checkValidity())).toBe(
    true,
  );
  await expect(input).not.toHaveAttribute('aria-invalid', 'true');
});

test('the maximum blocks additions while allowing selected values to be removed', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-multi-select--limit');
  const input = page.getByRole('combobox');
  await input.click();
  await input.press('ArrowDown');
  await expect(page.getByRole('option', { name: 'Design systems' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await input.press('Enter');
  await expect(page.getByRole('button', { name: 'Remove Design systems' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove React' }).click();
  await input.fill('design systems');
  await input.press('Enter');
  await expect(page.getByRole('button', { name: 'Remove Design systems' })).toBeVisible();
});

test('controlled parent updates are reflected', async ({ page, mount }) => {
  await openScenario(mount, 'components-multi-select--controlled');
  await page.getByRole('button', { name: 'Choose product design' }).click();
  await expect(page.getByRole('button', { name: 'Remove Product design' })).toBeVisible();
  await expect(page.getByLabel('Current topics')).toHaveText('product');
});

test('loading and empty search results announce status without a dangling active descendant', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-multi-select--loading');
  await page.getByRole('combobox').click();
  await expect(page.getByText('Loading options…')).toBeVisible();
  await expect(page.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
  await openScenario(mount, 'components-multi-select--playground');
  await page.getByRole('combobox').fill('zzzz');
  await expect(page.getByText('No matching options.')).toBeVisible();
});

test('disabled state blocks input and removal actions', async ({ page, mount }) => {
  await openScenario(mount, 'components-multi-select--disabled');
  await expect(page.getByRole('combobox')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Remove React' })).toBeDisabled();
});

test('forced colors preserve focus and distinguish the active option', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-multi-select--playground');
  await page.getByRole('combobox').click();
  await expect(page.locator('.fs-multi-select__control')).toHaveCSS('outline-style', 'solid');
  const paints = await page.getByRole('option', { name: 'React' }).evaluate((element) => ({
    background: getComputedStyle(element).backgroundColor,
    color: getComputedStyle(element).color,
  }));
  expect(paints.background).not.toBe(paints.color);
});

test('composition exposes separate theme fields and minimum validation', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-multi-select--composition');
  await expect(page.getByRole('heading', { name: 'MultiSelect', exact: true })).toBeVisible();
  await expect(page.getByRole('combobox')).toHaveCount(5);
  await expect(page.getByRole('combobox', { name: 'Required topics' })).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});

test('keyboard navigation scrolls a long popup to keep its active option visible', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-multi-select--long-list');
  await page.getByRole('combobox').click();
  await page.getByRole('combobox').press('End');
  const last = page.getByRole('option', { name: 'Topic 30', exact: true });
  await expect(last).toHaveAttribute('data-active', 'true');
  const visible = await last.evaluate((element) => {
    const option = element.getBoundingClientRect();
    const popup = element.closest('.fs-multi-select__popup')!.getBoundingClientRect();
    return option.top >= popup.top && option.bottom <= popup.bottom;
  });
  expect(visible).toBe(true);
});

test('a disabled native fieldset excludes values and blocks all editing actions', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-multi-select--disabled-fieldset');
  await expect(page.getByRole('combobox')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Remove React' })).toBeDisabled();
  expect(
    await page
      .getByRole('form')
      .evaluate((element) => new FormData(element as HTMLFormElement).getAll('topics')),
  ).toEqual([]);
});
