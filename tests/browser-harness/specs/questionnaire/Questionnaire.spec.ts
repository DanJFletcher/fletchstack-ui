import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} supports the full keyboard flow without automatic advancement`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-questionnaire--interactive', { theme });
    await page.keyboard.press('Tab');
    const timeline = page.getByRole('radio', { name: 'Tool call timeline' });
    await expect(timeline).toBeFocused();
    await page.keyboard.press('Space');
    await expect(timeline).toBeChecked();
    await expect(page.getByRole('status')).toHaveText('Question 1 of 3');
    await expect(timeline.locator('..')).toHaveCSS('outline-style', 'solid');
    await page.getByRole('textbox', { name: 'Another feature' }).focus();
    await page.keyboard.press('Enter');
    await expect(
      page.getByRole('group', { name: 'What should every progress update include?' }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox', { name: 'Progress' })).toBeFocused();
    await page.keyboard.press('Space');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('radio', { name: 'Tool call timeline' })).toHaveCount(0);
    await page.getByRole('radio', { name: 'Start now' }).check();
    await page.getByRole('button', { name: 'Save plan' }).click();
    await expect(page.getByText('Plan saved.')).toBeVisible();
  });
  test(`${theme} reflows long text at 320px with enlarged typography and spacing`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-questionnaire--playground', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; }',
    });
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
test('native radio arrows select within one step and shortcuts pause inside custom fields', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-questionnaire--shortcuts');
  await page.keyboard.press('Tab');
  const first = page.getByRole('radio', { name: 'Build components' });
  const second = page.getByRole('radio', { name: 'Improve testing' });
  await expect(first).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(second).toBeChecked();
  await page.keyboard.press('a');
  await expect(first).toBeFocused();
  await expect(first).toBeChecked();
  await page.getByRole('textbox').fill('b');
  await expect(first).not.toBeChecked();
  await expect(second).not.toBeChecked();
  await expect(page.getByRole('textbox')).toHaveValue('b');
});
test('Enter in a multiline answer preserves the question and inserts a newline', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-questionnaire--text');
  const text = page.getByRole('textbox', { name: 'Your feedback' });
  await text.fill('First line');
  await text.press('Enter');
  await text.pressSequentially('Second line');
  await expect(text).toHaveValue('First line\nSecond line');
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
});
test('pending persistence locks navigation, then rejection retains drafts for retry', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-questionnaire--pending');
  await page.getByRole('button', { name: 'Save plan' }).dblclick();
  await expect(page.getByRole('form')).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
  await expect(page.getByRole('radio', { name: 'Start now' })).toBeDisabled();
  await page.getByRole('button', { name: 'Reject save' }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Unable to save your answers. Please try again.',
  );
  await expect(page.getByRole('radio', { name: 'Start now' })).toBeChecked();
  await page.getByRole('button', { name: 'Save plan' }).click();
  await page.getByRole('button', { name: 'Resolve save' }).click();
  await expect(page.getByText('Plan saved.')).toBeVisible();
});
test('controlled consumer accepts changes while explicit skip advances only one question', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-questionnaire--controlled');
  await page.getByRole('radio', { name: 'Approval checkpoints' }).check();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Skip' }).click();
  await expect(page.getByRole('group', { name: 'When should work begin?' })).toBeFocused();
  await page.getByRole('button', { name: 'Previous' }).click();
  await expect(page.getByRole('checkbox', { name: 'Progress' })).not.toBeChecked();
});
test('native reset restores the saved checkpoint and original answers', async ({ page, mount }) => {
  await openScenario(mount, 'components-questionnaire--resume');
  await page.getByRole('checkbox', { name: 'Progress' }).uncheck();
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Reset draft' }).click();
  await expect(page.getByRole('checkbox', { name: 'Progress' })).toBeChecked();
  await expect(page.getByRole('status')).toHaveText('Question 2 of 3');
});
test('independent reference checkpoints inherit the enclosing theme', async ({ page, mount }) => {
  await openScenario(mount, 'components-questionnaire--composition');
  const corporate = await page
    .getByRole('form')
    .first()
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  await openScenario(mount, 'components-questionnaire--composition', { theme: 'luna' });
  const luna = await page
    .getByRole('form')
    .first()
    .evaluate((node) => getComputedStyle(node).backgroundColor);
  expect(luna).not.toBe(corporate);
  await expect(page.getByRole('form')).toHaveCount(3);
});
