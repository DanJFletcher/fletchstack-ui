import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const scenario of [
  'components-app-shell--playground',
  'components-bottom-navigation--shell',
  'components-bottom-navigation--safe-area',
  'components-bottom-navigation--viewport',
]) {
  test(`${scenario} reserves intrinsic navigation height while only content scrolls`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, scenario);
    const content = page.getByTestId('content'),
      nav = page.getByRole('navigation'),
      shell = page.getByTestId('shell');
    const initialNav = await nav.boundingBox(),
      initialHeader = await page.getByText('Workspace', { exact: true }).boundingBox();
    const contentBox = await content.boundingBox(),
      shellBox = await shell.boundingBox();
    expect(contentBox!.y + contentBox!.height).toBeCloseTo(initialNav!.y, 1);
    expect(initialNav!.y + initialNav!.height).toBeCloseTo(shellBox!.y + shellBox!.height, 1);
    expect(shellBox!.height).toBe(scenario.endsWith('--viewport') ? 900 : 480);
    await content.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    const final = await page.getByRole('link', { name: 'Final message' }).boundingBox();
    expect(final!.y + final!.height).toBeLessThanOrEqual(initialNav!.y);
    expect(final!.y).toBeGreaterThanOrEqual(contentBox!.y);
    expect(await nav.boundingBox()).toEqual(initialNav);
    expect(await page.getByText('Workspace', { exact: true }).boundingBox()).toEqual(initialHeader);
    await expect(content).toHaveCSS('padding-bottom', '0px');
    await expect(nav).toHaveCSS('position', 'static');
    await expect(nav).toHaveCSS(
      'padding-bottom',
      scenario.endsWith('--safe-area') ? '24px' : '0px',
    );
  });
}

test('wrapped labels and changing safe-area padding resize the reserved row once', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-bottom-navigation--safe-area');
  const nav = page.getByRole('navigation'),
    content = page.getByTestId('content');
  const before = await nav.boundingBox(),
    beforeContent = await content.boundingBox();
  await nav.evaluate((element) => {
    element.style.setProperty('--fs-bottom-navigation-safe-area-inset', '48px');
  });
  const after = await nav.boundingBox(),
    afterContent = await content.boundingBox();
  expect(after!.height - before!.height).toBeCloseTo(24, 1);
  expect(beforeContent!.height - afterContent!.height).toBeCloseTo(24, 1);
  await page.setViewportSize({ width: 320, height: 900 });
  const wrapped = await nav.boundingBox(),
    wrappedContent = await content.boundingBox();
  expect(wrapped!.height).toBeGreaterThan(after!.height);
  expect(wrappedContent!.y + wrappedContent!.height).toBeCloseTo(wrapped!.y, 1);
});
