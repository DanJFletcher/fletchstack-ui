import { expect, test } from '../fixtures/test';
import { waitForStory } from '../fixtures/storybook';

test('design foundation links to tokens and a working override example', async ({ page }) => {
  const preview = page.frameLocator('#storybook-preview-iframe');

  await test.step('Read the design foundation', async () => {
    await page.goto('/?path=/docs/design-system-foundation--docs');
    await expect(preview.getByRole('heading', { name: /Initial design foundation$/ })).toBeVisible();
  });

  await test.step('Follow the public token reference', async () => {
    await preview.getByRole('link', { name: 'Explore the public semantic token reference →' }).click();
    await expect(page).toHaveURL(/\/\?path=\/docs\/design-system-tokens--docs/);
    await expect(preview.getByRole('heading', { name: /Public semantic tokens$/ })).toBeVisible();
    await expect(preview.getByRole('table')).toContainText('--fs-button-primary-default-background');
  });

  await test.step('See the tokens applied to a component', async () => {
    const [frame] = await Promise.all([
      page.waitForEvent('framenavigated', { predicate: frame => new URL(frame.url()).searchParams.get('id') === 'components-button--consumer-override' }),
      preview.getByRole('link', { name: 'See semantic overrides on Button →' }).click(),
    ]);
    await expect(page).toHaveURL(/\/\?path=\/story\/components-button--consumer-override/);
    await waitForStory(frame);
    await expect(preview.getByRole('button', { name: 'Forest brand action' }))
      .toHaveCSS('background-color', 'rgb(20, 98, 61)');
  });
});

test('the Storybook toolbar switches the preview surface and component theme', async ({ page }) => {
  await page.goto('/?path=/story/components-button--interaction-states');
  const preview = page.frameLocator('#storybook-preview-iframe');
  const button = preview.getByRole('button', { name: 'Primary action', exact: true });
  const surface = preview.getByRole('main');
  await expect(button).toHaveCSS('background-color', 'rgb(36, 75, 176)');

  await test.step('Switch from Corporate to Luna', async () => {
    await page.getByRole('button', { name: 'Preview theme Corporate', exact: true }).click();
    await page.getByRole('option', { name: 'Luna', exact: true }).click();
    await expect(button).toHaveCSS('background-color', 'rgb(199, 181, 255)');
    await expect(surface).toHaveAttribute('data-theme', 'luna');
  });

  await test.step('Restore Corporate', async () => {
    await page.getByRole('button', { name: 'Preview theme Luna', exact: true }).click();
    await page.getByRole('option', { name: 'Corporate', exact: true }).click();
    await expect(button).toHaveCSS('background-color', 'rgb(36, 75, 176)');
    await expect(surface).toHaveAttribute('data-theme', 'corporate');
  });
});
