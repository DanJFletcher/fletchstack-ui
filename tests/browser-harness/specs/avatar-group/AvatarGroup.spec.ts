import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} group uses 32px avatars, 8px overlap and a 2px separating ring`, async ({ page, mount }) => {
    await openScenario(mount, 'components-avatar-group--playground', { theme });
    const avatars = page.getByRole('img');
    const bounds = await avatars.evaluateAll(elements => elements.map(element => ({ x: element.getBoundingClientRect().x, width: element.getBoundingClientRect().width })));
    expect(bounds.map(item => item.width)).toEqual([32, 32, 32]);
    expect(bounds[1]!.x - bounds[0]!.x).toBe(24);
    await expect(page.locator('.fs-avatar-group__member').first()).toHaveCSS('box-shadow', /2px/);
    const summary = page.getByText('+3', { exact: true });
    const paint = await summary.evaluate(element => ({ color: getComputedStyle(element.parentElement!).color, background: getComputedStyle(element.parentElement!).backgroundColor }));
    expect(contrast(paint.color, paint.background)).toBeGreaterThanOrEqual(4.5);
  });

  test(`${theme} native keyboard disclosure reveals ordered names and preserves focus`, async ({ page, mount }) => {
    await openScenario(mount, 'components-avatar-group--playground', { theme });
    const summary = page.getByLabel('Show 3 more members');
    const list = page.getByRole('list', { name: 'Additional team members' });
    await expect(list).toBeHidden();
    await page.keyboard.press('Tab');
    await expect(summary).toBeFocused();
    await expect(summary).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(list).toBeVisible();
    await expect(list.getByRole('listitem')).toHaveText(['AMAri Morgan', 'JRJo Rivera', 'SLSam Lee']);
    await expect(summary).toBeFocused();
    await expect(list.getByRole('img')).toHaveCount(0);
    await page.keyboard.press('Space');
    await expect(list).toBeHidden();
    await expect(summary).toBeFocused();
  });

  test(`${theme} count-only long names reflow at 320px with enlarged and spaced text`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-avatar-group--long-names', { theme });
    await page.addStyleTag({ content: 'html { font-size: 200%; } .fs-avatar-group__list { line-height: 1.5; letter-spacing: .12em; word-spacing: .16em; }' });
    await page.getByLabel('Show 1 more member').click();
    const list = page.getByRole('list');
    await expect(list).toBeVisible();
    const box = await list.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    expect(await list.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('all four footprints and small groups retain the shared Avatar contract', async ({ page, mount }) => {
  await openScenario(mount, 'components-avatar-group--sizes');
  for (const [size, pixels] of [['small', 24], ['medium', 32], ['large', 48], ['xlarge', 64]] as const) {
    const group = page.getByRole('group', { name: `${size} team`, exact: true });
    expect(await group.getByRole('img').first().evaluate(element => element.getBoundingClientRect().width)).toBe(pixels);
    expect(await group.locator('summary').evaluate(element => element.getBoundingClientRect().width)).toBe(pixels);
  }
  await openScenario(mount, 'components-avatar-group--small');
  await expect(page.getByRole('img')).toHaveCount(2);
  await expect(page.locator('summary')).toHaveCount(0);
});

test('failed member photos retain their named initials and footprint', async ({ page, mount }) => {
  await openScenario(mount, 'components-avatar-group--failed-photo');
  const avatar = page.getByRole('img', { name: 'Unavailable Photo' });
  await expect(avatar).toHaveText('UP');
  await expect(avatar.locator('img')).toHaveCount(0);
  expect(await avatar.evaluate(element => element.getBoundingClientRect().width)).toBe(32);
});

test('RTL stacks preserve source order and use logical overlap', async ({ page, mount }) => {
  await openScenario(mount, 'components-avatar-group--playground', { args: { dir: 'rtl' } });
  const positions = await page.getByRole('img').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().x));
  expect(positions[0]! - positions[1]!).toBe(24);
  await page.getByLabel('Show 3 more members').click();
  const list = page.getByRole('list');
  await expect(list).toBeVisible();
  const bounds = await list.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
});

test('forced colors preserve disclosure boundaries and hidden groups leave layout', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-avatar-group--playground');
  const summary = page.getByLabel('Show 3 more members');
  await expect(summary).toHaveCSS('outline-width', '2px');
  await summary.click();
  await expect(page.getByRole('list')).toHaveCSS('border-style', 'solid');
  await openScenario(mount, 'components-avatar-group--playground', { args: { hidden: true } });
  await expect(page.locator('.fs-avatar-group')).toBeHidden();
  expect(await page.locator('.fs-avatar-group').boundingBox()).toBeNull();
});

test('nested themes reset group overflow tokens while custom outer colors stay scoped', async ({ page, mount }) => {
  await openScenario(mount, 'components-avatar-group--scopes');
  await expect(page.getByRole('group', { name: 'Outer team' }).getByLabel('Show 3 more members')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  await expect(page.getByRole('group', { name: 'Nested team' }).getByLabel('Show 3 more members')).not.toHaveCSS('background-color', 'rgb(0, 0, 0)');
});
