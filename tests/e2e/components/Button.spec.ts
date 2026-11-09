import { expect, test } from '../fixtures/test';
import { openStory } from '../fixtures/storybook';

const themes = [
  {
    name: 'Corporate', id: 'corporate',
    variants: 'variants-and-sizes', keyboard: 'keyboard-activation',
    disabled: 'disabled', longLabels: 'long-labels',
  },
  {
    name: 'Luna', id: 'luna',
    variants: 'luna-variants', keyboard: 'luna-keyboard',
    disabled: 'luna-disabled', longLabels: 'luna-long-labels',
  },
] as const;

for (const theme of themes) {
  test.describe(theme.name, () => {
    test('keyboard focus skips disabled controls', async ({ page }) => {
      await openStory(page, 'components-button--interaction-states', { theme: theme.id });

      const primary = page.getByRole('button', { name: 'Primary action', exact: true });
      const secondary = page.getByRole('button', { name: 'Secondary action', exact: true });
      const ghost = page.getByRole('button', { name: 'Ghost action', exact: true });
      const disabled = page.getByRole('button', { name: 'Disabled action', exact: true });

      await page.keyboard.press('Tab');
      await expect(primary).toBeFocused();
      await expect(primary).toHaveCSS('outline-style', 'solid');

      await page.keyboard.press('Tab');
      await expect(secondary).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(ghost).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(disabled).not.toBeFocused();
      await expect(disabled).toBeDisabled();
    });

    test('all variants offer all sizes', async ({ page }) => {
      await openStory(page, `components-button--${theme.variants}`);
      await expect(page.getByRole('heading', { name: 'One action. Two atmospheres.' })).toBeVisible();

      for (const variant of ['primary', 'secondary', 'ghost']) {
        const section = page.locator('section').filter({
          has: page.getByRole('heading', { name: variant, exact: true }),
        });

        await expect(section.getByRole('button')).toHaveText(['small action', 'medium action', 'large action']);
        await expect(section.getByRole('button', { name: 'small action' })).toHaveCSS('font-size', '14px');
        await expect(section.getByRole('button', { name: 'medium action' })).toHaveCSS('font-size', '16px');
        await expect(section.getByRole('button', { name: 'large action' })).toHaveCSS('font-size', '18px');
      }
    });

    test('keyboard example finishes Enter and Space activation', async ({ page }) => {
      await openStory(page, `components-button--${theme.keyboard}`);
      await expect(page.getByRole('button', { name: 'Save changes' })).toBeFocused();
    });

    test('disabled examples cannot receive keyboard focus', async ({ page }) => {
      await openStory(page, `components-button--${theme.disabled}`);
      const save = page.getByRole('button', { name: 'Save changes' });

      await expect(page.getByRole('button')).toHaveCount(3);
      await expect(save).toBeDisabled();
      await expect(page.getByRole('button', { name: 'Cancel' })).toBeDisabled();
      await expect(page.getByRole('button', { name: 'Learn more' })).toBeDisabled();

      await page.keyboard.press('Tab');
      await expect(save).not.toBeFocused();
    });

    test('long labels reflow with enlarged and spaced text', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 700 });
      await openStory(page, `components-button--${theme.longLabels}`);
      await page.addStyleTag({ content: `
        html { font-size: 200%; }
        .fs-button {
          line-height: 1.5;
          letter-spacing: .12em;
          word-spacing: .16em;
        }
      ` });

      const button = page.getByRole('button', { name: 'Save all changes and return to your account settings' });

      await expect(button).toBeVisible();
      await expect(button).toHaveCSS('font-size', '32px');

      const pageFitsViewport = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
      const labelFitsButton = await button.evaluate(element => element.scrollWidth <= element.clientWidth);

      expect(pageFitsViewport).toBe(true);
      expect(labelFitsButton).toBe(true);
      await expect(page.getByRole('button', { name: 'ReviewYourAccountPreferencesBeforeContinuing' })).toBeVisible();
    });
  });
}

test('native default, submit and reset types preserve form behavior', async ({ page }) => {
  await openStory(page, 'components-button--native-form');
  const status = page.getByRole('status');
  await expect(status).toHaveText('Reset');

  await test.step('Default type leaves the form untouched', async () => {
    await page.getByRole('button', { name: 'Ordinary action' }).click();
    await expect(status).toHaveText('Reset');
  });

  await test.step('Enter on the submit button submits the form', async () => {
    await page.getByRole('button', { name: 'Submit changes' }).focus();
    await page.keyboard.press('Enter');
    await expect(status).toHaveText('Submitted');
  });

  await test.step('The reset button resets the form', async () => {
    await page.getByRole('button', { name: 'Reset changes' }).click();
    await expect(status).toHaveText('Reset');
  });
});

test('consumers can forward a ref to move focus', async ({ page }) => {
  await openStory(page, 'components-button--ref-access');
  const target = page.getByRole('button', { name: 'Target action' });
  await expect(target).toBeFocused();

  await page.getByRole('button', { name: 'Focus the next action' }).click();
  await expect(target).toBeFocused();
});

test('decorative icons preserve accessible button names and parent spacing', async ({ page }) => {
  await openStory(page, 'components-button--composition');
  const save = page.getByRole('button', { name: 'Save changes', exact: true });

  await expect(page.getByRole('button')).toHaveCount(4);
  await expect(save).toBeVisible();
  await expect(page.getByRole('button', { name: 'Switch to night mode', exact: true })).toBeVisible();
  await expect(page.getByRole('img')).toHaveCount(0);

  await expect(page.locator('.actions')).toHaveCSS('gap', '12px');
  await expect(save).toHaveCSS('margin', '0px');
});

test('native attributes and consumer classes reach the real button', async ({ page }) => {
  await openStory(page, 'components-button--playground', {
    args: { className: 'consumer-action', children: 'Publish', title: 'Publish settings' },
  });
  const button = page.getByRole('button', { name: 'Publish', exact: true });

  await expect(button).toHaveClass(/consumer-action/);
  await expect(button).toHaveAttribute('type', 'button');
  await expect(button).toHaveAttribute('title', 'Publish settings');
});

test('hidden native buttons stay out of layout and keyboard order', async ({ page }) => {
  await openStory(page, 'components-button--playground', { args: { hidden: true } });
  const hiddenButton = page.getByRole('button', { name: 'Save changes', includeHidden: true });
  await expect(hiddenButton).toBeHidden();

  await page.keyboard.press('Tab');
  await expect(hiddenButton).not.toBeFocused();
});
