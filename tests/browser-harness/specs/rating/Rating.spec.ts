import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} fractional display clips full-size artwork and stays out of keyboard order`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-rating--playground', { theme });
    const image = page.getByRole('img', { name: '4.5 out of 5 stars' });
    await expect(page.getByRole('img')).toHaveCount(1);
    await expect(page.getByText('4.5 / 5')).toBeVisible();
    await expect(image.locator('.fs-rating__symbol')).toHaveCount(5);
    const fifth = image.locator('.fs-rating__symbol').nth(4);
    await expect(fifth.locator('.fs-rating__fill')).toHaveCSS(
      'clip-path',
      'inset(0px 50% 0px 0px)',
    );
    const filled = await fifth.locator('.fs-rating__solid').boundingBox();
    const outline = await fifth.locator('.fs-rating__outline').boundingBox();
    expect(filled).toEqual(outline);
    expect(outline!.width).toBe(32);
    await page.keyboard.press('Tab');
    await expect(page.locator('.fs-rating :focus')).toHaveCount(0);
  });

  test(`${theme} pointer and native keyboard select the same 3.5 fill, label and submitted value`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-rating--half-step-input', { theme });
    const half = page.getByRole('radio', { name: '3.5 out of 5 stars' });
    await expect(page.getByRole('radio')).toHaveCount(10);
    await expect(page.locator('.fs-rating__symbol')).toHaveCount(5);
    await half.click();
    await expect(half).toBeChecked();
    const partial = page.locator('.fs-rating__fill').nth(3);
    await expect(partial).toHaveCSS('clip-path', 'inset(0px 50% 0px 0px)');
    const pointerGeometry = await page
      .locator('.fs-rating__symbol')
      .evaluateAll((elements) =>
        elements.map((element) => [
          element.getBoundingClientRect().width,
          element.getBoundingClientRect().height,
        ]),
      );
    await page.getByRole('button', { name: 'Submit rating' }).click();
    await expect(page.getByLabel('Submitted rating')).toHaveText('3.5');
    await page.getByRole('button', { name: 'Reset rating' }).click();
    await expect(page.getByRole('radio', { name: '3 out of 5 stars' })).toBeChecked();
    await page.getByRole('button', { name: 'Before rating' }).focus();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('radio', { name: '3 out of 5 stars' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(half).toBeFocused();
    await expect(half).toBeChecked();
    await expect(half.locator('..').locator('.fs-rating__focus')).toHaveCSS(
      'outline-style',
      'solid',
    );
    await expect(partial).toHaveCSS('clip-path', 'inset(0px 50% 0px 0px)');
    const keyboardGeometry = await page
      .locator('.fs-rating__symbol')
      .evaluateAll((elements) =>
        elements.map((element) => [
          element.getBoundingClientRect().width,
          element.getBoundingClientRect().height,
        ]),
      );
    expect(keyboardGeometry).toEqual(pointerGeometry);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Submit rating' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Submitted rating')).toHaveText('3.5');
  });

  test(`${theme} unanswered required fields expose associated errors and native validation`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-rating--required', { theme });
    const group = page.getByRole('group', { name: 'Required rating' });
    await expect(group).toHaveAccessibleDescription('Choose one score. Choose a rating.');
    await expect(page.getByRole('radio', { checked: true })).toHaveCount(0);
    await expect(
      page.locator('form').evaluate((form) => (form as HTMLFormElement).checkValidity()),
    ).resolves.toBe(false);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('radio').first()).toBeFocused();
    await page.getByRole('radio', { name: '3 out of 5 stars' }).click();
    await expect(
      page.locator('form').evaluate((form) => (form as HTMLFormElement).checkValidity()),
    ).resolves.toBe(true);
  });

  test(`${theme} design sheet retains disabled survey score and both review summaries`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-rating--composition', { theme });
    await expect(page.getByRole('img', { name: '4.5 out of 5 stars' })).toHaveCount(2);
    const closed = page.getByRole('group', { name: 'Closed survey' });
    await expect(closed.getByRole('radio', { name: '4 out of 5 stars' })).toBeChecked();
    await expect(closed.getByRole('radio').first()).toBeDisabled();
    await expect(closed.getByText('4 / 5')).toBeVisible();
    const paints = await page
      .locator('[data-theme] .fs-rating__solid')
      .evaluateAll((elements) => [
        ...new Set(elements.map((element) => getComputedStyle(element).fill)),
      ]);
    expect(paints).toContain('rgb(255, 184, 0)');
    expect(paints).toContain('rgb(255, 158, 0)');
  });
}

test('whole-step inputs use one native Tab stop and controlled updates remain authoritative', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-rating--input');
  await expect(page.getByRole('radio')).toHaveCount(5);
  await page.getByRole('radio', { name: '3 out of 5 stars' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('radio', { name: '2 out of 5 stars' })).toBeChecked();
  await openScenario(mount, 'components-rating--controlled');
  await page.getByRole('button', { name: 'Give five stars' }).click();
  await expect(page.getByRole('radio', { name: '5 out of 5 stars' })).toBeChecked();
  await page.getByRole('radio', { name: '3 out of 5 stars' }).click();
  await expect(page.getByText('3 / 5')).toBeVisible();
});

test('independent unnamed instances do not deselect each other', async ({ page, mount }) => {
  await openScenario(mount, 'components-rating--instances');
  await page
    .getByRole('group', { name: 'First', exact: true })
    .getByRole('radio', { name: '5 out of 5 stars' })
    .click();
  await expect(
    page
      .getByRole('group', { name: 'Second', exact: true })
      .getByRole('radio', { name: '4 out of 5 stars' }),
  ).toBeChecked();
});

test('ten-point half scale reflows at 320px with enlarged and spaced text', async ({
  page,
  mount,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await openScenario(mount, 'components-rating--narrow');
  await page.addStyleTag({
    content:
      'html {font-size:200%} .fs-rating {line-height:1.5;letter-spacing:.12em;word-spacing:.16em}',
  });
  await expect(page.getByRole('radio')).toHaveCount(20);
  await expect(page.getByRole('radio', { name: '6.5 out of 10 stars' })).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const half = await page.getByRole('radio', { name: '3.5 out of 10 stars' }).boundingBox();
  expect(half!.width).toBe(24);
});

test('forced colors retain distinct filled artwork, outline and active half focus', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-rating--half-step-input');
  await page.getByRole('radio', { name: '3 out of 5 stars' }).focus();
  await page.keyboard.press('ArrowRight');
  const half = page.getByRole('radio', { name: '3.5 out of 5 stars' });
  await expect(half).toBeChecked();
  await expect(half.locator('..').locator('.fs-rating__focus')).toHaveCSS('outline-style', 'solid');
  await expect(page.locator('.fs-rating__outline').first()).not.toHaveCSS('stroke', 'none');
  await expect(page.locator('.fs-rating__solid').first()).not.toHaveCSS('fill', 'none');
});

for (const symbol of ['star', 'heart', 'thumbs']) {
  test(`${symbol} fractional artwork preserves full-size outline geometry at every size`, async ({
    page,
    mount,
  }) => {
    for (const [size, pixels] of [
      ['sm', 20],
      ['md', 32],
      ['lg', 48],
    ] as const) {
      await openScenario(mount, 'components-rating--playground', {
        args: { symbol, size, value: 3.5 },
      });
      const cell = page.locator('.fs-rating__symbol').nth(3);
      await expect(cell.locator('.fs-rating__fill')).toHaveCSS(
        'clip-path',
        'inset(0px 50% 0px 0px)',
      );
      await expect(cell).toHaveCSS('width', `${pixels}px`);
      expect(await cell.locator('.fs-rating__solid').boundingBox()).toEqual(
        await cell.locator('.fs-rating__outline').boundingBox(),
      );
    }
  });
}
