import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} full keyboard round trip restores each parent and supports reopening`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-menu--project', { theme });
    const trigger = page.getByRole('button', { name: 'Project actions' });
    await page.keyboard.press('Tab');
    await expect(trigger).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menuitem', { name: 'Rename' })).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(page.getByRole('menuitem', { name: 'Export' })).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('menuitem', { name: 'Download PDF' })).toBeFocused();
    await expect(page.getByRole('menuitem', { name: 'Download PDF' })).toHaveCSS(
      'outline-style',
      'solid',
    );
    await page.keyboard.press('Escape');
    await expect(page.getByRole('menuitem', { name: 'Export' })).toBeFocused();
    await expect(page.getByRole('menu', { name: 'Export' })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
    await expect(page.getByRole('menu')).toHaveCount(0);
    await page.keyboard.press('Space');
    await expect(page.getByRole('menuitem', { name: 'Rename' })).toBeFocused();
  });
  test(`${theme} leaf keyboard activation runs once and selection can remain open`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-menu--keep-open', { theme });
    await page.getByRole('button', { name: 'Project actions' }).click();
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Selected action')).toHaveText('Rename (1)');
    await expect(page.getByRole('menu')).toBeVisible();
    await page.keyboard.press('Space');
    await expect(page.getByLabel('Selected action')).toHaveText('Rename (2)');
  });
  test(`${theme} desktop child aligns with its parent and flips within the viewport`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 900, height: 700 });
    await openScenario(mount, 'components-menu--project', { theme });
    await page.addStyleTag({ content: '.fs-menu {margin-inline-start:550px}' });
    await page.getByRole('button', { name: 'Project actions' }).click();
    await page.getByRole('menuitem', { name: 'Export' }).click();
    const row = await page.getByRole('menuitem', { name: 'Export' }).boundingBox();
    const child = await page.getByRole('menu', { name: 'Export' }).boundingBox();
    expect(Math.abs(child!.y - row!.y)).toBeLessThanOrEqual(1);
    expect(child!.x).toBeGreaterThanOrEqual(8);
    expect(child!.x + child!.width).toBeLessThanOrEqual(892);
    expect(child!.x).toBeLessThan(row!.x);
  });
  test(`${theme} narrow children expand inline and wrap enlarged spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await openScenario(mount, 'components-menu--project', { theme });
    await page.getByRole('button', { name: 'Project actions' }).click();
    await page.getByRole('menuitem', { name: 'Export' }).click();
    await page.addStyleTag({
      content:
        'html{font-size:200%}.fs-menu__panel{line-height:1.5;letter-spacing:.12em;word-spacing:.16em}',
    });
    const child = page.getByRole('menu', { name: 'Export' });
    await expect(child).toHaveCSS('position', 'static');
    await expect(child).toHaveCSS('border-left-width', '1px');
    const parentBox = await page.getByRole('menuitem', { name: 'Export' }).boundingBox();
    const childBox = await child.boundingBox();
    expect(childBox!.y).toBeGreaterThanOrEqual(parentBox!.y + parentBox!.height);
    expect(childBox!.x).toBeGreaterThan(parentBox!.x);
    expect(await child.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('Tab closes from a submenu and continues to the next normal page control', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-menu--project');
  await page.getByRole('button', { name: 'Project actions' }).click();
  await page.getByRole('menuitem', { name: 'Export' }).click();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Next control' })).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(0);
});
test('Shift Tab closes and continues to the previous page control', async ({ page, mount }) => {
  await openScenario(mount, 'components-menu--controlled');
  await page.getByRole('button', { name: 'Controlled actions' }).click();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Toggle externally' })).toBeFocused();
  await expect(page.getByRole('menu')).toHaveCount(0);
});
test('sibling switching applies recursively and disabled items are skipped', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-menu--advanced');
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: 'Export' }).click();
  await page.getByRole('menuitem', { name: 'Share' }).click();
  await expect(page.getByRole('menu', { name: 'Export' })).toHaveCount(0);
  await page.getByRole('menuitem', { name: 'Team', exact: true }).click();
  await page.getByRole('menuitem', { name: 'Public', exact: true }).click();
  await expect(page.getByRole('menu', { name: 'Team', exact: true })).toHaveCount(0);
  await expect(page.getByRole('menuitem', { name: 'Copy public link' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menuitem', { name: 'Public', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Publishing guide' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('menuitem', { name: 'Rename' })).toBeFocused();
  await page.keyboard.press('End');
  await expect(page.getByRole('menuitem', { name: 'Publishing guide' })).toBeFocused();
  await page.keyboard.type('ar');
  await expect(page.getByRole('menuitem', { name: 'Archive' })).toBeFocused();
});
test('controlled state supports cancellable selection and outside dismissal', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-menu--controlled');
  await page.getByRole('button', { name: 'Toggle externally' }).click();
  await page.getByRole('menuitem', { name: 'Save draft' }).click();
  await expect(page.getByLabel('Draft saved')).toHaveText('Draft saved.');
  await expect(page.getByRole('menu')).toBeVisible();
  await page.getByRole('button', { name: 'Next control' }).click();
  await expect(page.getByRole('menu')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Next control' })).toBeFocused();
});
test('native links navigate and close without duplicate selection', async ({ page, mount }) => {
  await openScenario(mount, 'components-menu--advanced');
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('menuitem', { name: 'Publishing guide' }).click();
  await expect(page).toHaveURL(/#publishing-guide$/);
  await expect(page.getByRole('menu')).toHaveCount(0);
});
test('empty menus are named, announce unavailability and dismiss by Escape', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-menu--empty');
  await page.getByRole('button', { name: 'Project actions' }).click();
  await expect(page.getByRole('menu', { name: 'Project actions' })).toBeFocused();
  await expect(page.getByRole('menuitem', { name: 'No actions available.' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Project actions' })).toBeFocused();
});
test('motion follows live reduced-motion changes and closed branches disappear immediately', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openScenario(mount, 'components-menu--project');
  await page.getByRole('button', { name: 'Project actions' }).click();
  await expect(page.getByRole('menu')).toHaveCSS('animation-name', 'fs-menu-appear');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('menu')).toHaveCSS('animation-name', 'none');
  await page.getByRole('menuitem', { name: 'Export' }).click();
  await expect(page.getByRole('menu', { name: 'Export' })).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menuitem', { name: 'Download PDF' })).toHaveCount(0);
});
test('forced colors preserve submenu focus and boundaries', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-menu--project');
  await page.getByRole('button', { name: 'Project actions' }).click();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menuitem', { name: 'Download PDF' })).toHaveCSS(
    'outline-style',
    'solid',
  );
  await expect(page.getByRole('menu', { name: 'Export' })).toHaveCSS('border-left-style', 'solid');
});

test.describe('touch', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test('tap toggles an inline submenu and activates a leaf once', async ({ page, mount }) => {
    await openScenario(mount, 'components-menu--project');
    await page.getByRole('button', { name: 'Project actions' }).tap();
    await page.getByRole('menuitem', { name: 'Export' }).tap();
    await expect(page.getByRole('menu', { name: 'Export' })).toHaveCSS('position', 'static');
    await page.getByRole('menuitem', { name: 'Export' }).tap();
    await expect(page.getByRole('menu', { name: 'Export' })).toHaveCount(0);
    await page.getByRole('menuitem', { name: 'Export' }).tap();
    await page.getByRole('menuitem', { name: 'Download PDF' }).tap();
    await expect(page.getByLabel('Selected action')).toHaveText('Download PDF (1)');
    await expect(page.getByRole('menu')).toHaveCount(0);
  });
});
