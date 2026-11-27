import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  for (const [tone, label] of [
    ['neutral', 'Draft'],
    ['info', 'New'],
    ['success', 'Published'],
    ['warning', 'Pending'],
    ['danger', 'Failed'],
  ]) {
    test(`${theme} ${tone} Badge conveys meaning with text at AA contrast`, async ({
      page,
      mount,
    }) => {
      await openScenario(mount, 'components-badge--tones', { theme });
      const badge = page.locator(`.fs-badge--${tone}`);
      await expect(badge).toHaveText(label!);
      const paint = await badge.evaluate((element) => ({
        text: getComputedStyle(element).color,
        fill: getComputedStyle(element).backgroundColor,
      }));
      expect(contrast(paint.text, paint.fill)).toBeGreaterThanOrEqual(4.5);
      await expect(badge).toHaveCSS('font-size', '12px');
      await expect(badge).toHaveCSS('min-height', '20px');
      await expect(badge).toHaveCSS('padding-inline-start', '8px');
      await expect(badge).not.toHaveAttribute('tabindex');
      await expect(badge).not.toHaveAttribute('role');
      await expect(page.getByRole('img')).toHaveCount(0);
    });
  }

  test(`${theme} Badge wraps enlarged text and user spacing within 320px`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-badge--long-label', { theme });
    await page.addStyleTag({
      content:
        'html { font-size: 200%; } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-block-end: 2em !important; }',
    });
    const badge = page.locator('.fs-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toHaveCSS('font-size', '24px');
    expect(
      await badge.evaluate(
        (element) =>
          element.scrollWidth <= element.clientWidth &&
          element.scrollHeight <= element.clientHeight,
      ),
    ).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('Badge counts remain exact, including zero, with consumer-owned status updates', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-badge--count');
  await page.getByRole('button', { name: 'Mark all read' }).click();
  await expect(page.getByRole('status')).toHaveCount(1);
  await expect(page.locator('.fs-badge')).toHaveText('0');
  await page.getByRole('button', { name: 'Receive message' }).click();
  await expect(page.getByRole('status')).toHaveText('Unread messages: 1');
  await page.getByRole('button', { name: 'Receive message' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Mark all read' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Unread messages: 0');
  await expect(page.locator('.fs-badge')).not.toHaveAttribute('aria-live');
});

test('Badge customization preserves icon dimensions when shared Icon CSS is present', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-badge--customization');
  await expect(page.locator('.fs-badge')).toHaveCSS('padding-inline-start', '12px');
  await expect(page.locator('.fs-badge svg')).toHaveCSS('width', '16px');
  await expect(page.locator('.fs-badge__icon')).toHaveAttribute('aria-hidden', 'true');
});

test('Badge honors native hidden semantics', async ({ page, mount }) => {
  await openScenario(mount, 'components-badge--hidden');
  await expect(page.locator('.fs-badge')).toHaveCSS('display', 'none');
});

test('Badge keeps passive text semantics when given untyped interactive overrides', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-badge--passive-semantics');
  await expect(page.getByText('Imported status', { exact: true })).toBeVisible();
  await expect(page.getByRole('button')).toHaveCount(0);
  await expect(page.getByRole('status')).toHaveCount(0);
  await expect(page.locator('.fs-badge')).not.toHaveAttribute('tabindex');
});

test('Badge text remains legible in forced colors', async ({ page, mount }) => {
  await openScenario(mount, 'components-badge--tones');
  await page.emulateMedia({ forcedColors: 'active' });
  await expect(page.getByText('Published', { exact: true })).toBeVisible();
  await expect(page.locator('.fs-badge--success')).toHaveCSS('outline-style', 'solid');
});
