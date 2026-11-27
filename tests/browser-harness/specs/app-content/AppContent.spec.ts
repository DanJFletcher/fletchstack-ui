import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

test('embedded content avoids a nested main and keeps its final link reachable', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-app-content--playground');
  await expect(page.getByRole('main')).toHaveCount(1);
  const content = page.getByTestId('content');
  await expect(content).toHaveCSS('overflow', 'auto');
  await page.getByRole('link', { name: 'Final message' }).focus();
  await expect(page.getByRole('link', { name: 'Final message' })).toBeInViewport();
  expect(await content.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});
