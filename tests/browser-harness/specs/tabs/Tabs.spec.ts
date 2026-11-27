import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} automatic arrows skip disabled tabs and preserve native panel access`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-tabs--playground', { theme });
    const overview = page.getByRole('tab', { name: 'Overview' }),
      activity = page.getByRole('tab', { name: 'Activity' });
    await page.keyboard.press('Tab');
    await expect(overview).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(activity).toBeFocused();
    await expect(activity).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: 'Activity' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Settings' })).toBeDisabled();
    await page.keyboard.press('ArrowRight');
    await expect(overview).toBeFocused();
    await page.keyboard.press('End');
    await expect(activity).toBeFocused();
    await page.keyboard.press('Home');
    await expect(overview).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tabpanel', { name: 'Overview' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(overview).toBeFocused();
  });
  test(`${theme} manual keyboard activation distinguishes focus from selection`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-tabs--manual', { theme });
    const overview = page.getByRole('tab', { name: 'Overview' }),
      activity = page.getByRole('tab', { name: 'Activity' });
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    await expect(activity).toBeFocused();
    await expect(activity).toHaveCSS('outline-style', 'solid');
    await expect(overview).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: 'Workspace overview' })).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tabpanel', { name: 'Overview' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(overview).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Space');
    await expect(activity).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('Enter');
    await expect(overview).toHaveAttribute('aria-selected', 'true');
  });
  test(`${theme} panels preserve local state and hidden links leave the Tab sequence`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-tabs--persistent', { theme });
    await page.getByRole('textbox', { name: 'Draft' }).fill('Preserved note');
    await page.getByRole('tab', { name: 'Preview' }).click();
    await expect(page.getByRole('textbox', { name: 'Draft' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Reverse items' }).click();
    await page.getByRole('tab', { name: 'Draft' }).click();
    await expect(page.getByRole('textbox', { name: 'Draft' })).toHaveValue('Preserved note');
    await expect(page.getByRole('link', { name: 'Open preview' })).toHaveCount(0);
    await page.keyboard.press('Tab');
    await expect(page.getByRole('tabpanel', { name: 'Draft' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('textbox', { name: 'Draft' })).toBeFocused();
  });
  test(`${theme} enlarged labels scroll only within the list at 320px`, async ({ page, mount }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-tabs--overflow', { theme });
    await page.addStyleTag({
      content:
        'html{font-size:200%}.fs-tabs{line-height:1.5;letter-spacing:.12em;word-spacing:.16em}',
    });
    await page.keyboard.press('Tab');
    const list = page.getByRole('tablist'),
      before = await page.evaluate(() => scrollY);
    await page.keyboard.press('End');
    const final = page.getByRole('tab', { name: 'Workspace section 10' });
    await expect(final).toBeFocused();
    expect(await list.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
    const listBox = await list.boundingBox(),
      tabBox = await final.boundingBox();
    expect(tabBox!.x + tabBox!.width).toBeLessThanOrEqual(listBox!.x + listBox!.width + 1);
    expect(await page.evaluate(() => scrollY)).toBe(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.keyboard.press('Home');
    const first = await page
      .getByRole('tab', { name: 'Workspace section 1', exact: true })
      .boundingBox();
    expect(first!.x).toBeGreaterThanOrEqual(listBox!.x - 1);
  });
}

test('pointer and keyboard produce one controlled request without premature selection', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-tabs--deferred');
  await page.getByRole('tab', { name: 'Activity' }).click();
  await expect(page.getByRole('status', { name: 'Requests' })).toHaveText('1');
  await expect(page.getByRole('tab', { name: 'Overview' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('button', { name: 'Accept request' }).click();
  await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('tab', { name: 'Activity' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('status', { name: 'Requests' })).toHaveText('2');
  await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('controlled parents can accept a request immediately', async ({ page, mount }) => {
  await openScenario(mount, 'components-tabs--controlled');
  await page.getByRole('tab', { name: 'Activity' }).click();
  await expect(page.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

for (const change of [{ remove: true }, { disable: true }, { allDisabled: true }]) {
  test(`dynamic items repair only owned focus: ${JSON.stringify(change)}`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-tabs--dynamic');
    await page.getByRole('tab', { name: 'Activity' }).focus();
    // Update the same mounted consumer without moving focus to an external demo control.
    await page.evaluate(
      (props) => window.mount({ story: 'components-tabs--dynamic', props }),
      change,
    );
    const target = change.allDisabled
      ? page.getByRole('tablist')
      : page.getByRole('tab', { name: 'Overview' });
    await expect(target).toBeFocused();
    await expect(page.getByRole('tabpanel')).toHaveCount(change.allDisabled ? 0 : 1);
    await page.getByRole('textbox', { name: 'Elsewhere' }).focus();
    await page.evaluate(() => window.mount({ story: 'components-tabs--dynamic', props: {} }));
    await expect(page.getByRole('textbox', { name: 'Elsewhere' })).toBeFocused();
  });
}

test('vertical and inherited RTL movement leave orthogonal arrows native', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-tabs--playground', { args: { orientation: 'vertical' } });
  await page.keyboard.press('Tab');
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('tab', { name: 'Overview' })).toBeFocused();
  await openScenario(mount, 'components-tabs--playground', {
    args: { dir: 'rtl', orientation: 'horizontal' },
  });
  await page.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Overview' })).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('tab', { name: 'Overview' })).toBeFocused();
});

test('nested tabs own their keyboard changes and do not submit a form', async ({ page, mount }) => {
  await openScenario(mount, 'components-tabs--nested');
  const inner = page.getByRole('tablist', { name: 'Inner' }),
    outer = page.getByRole('tablist', { name: 'Outer' });
  await inner.getByRole('tab', { name: 'Overview' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(inner.getByRole('tab', { name: 'Activity' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(outer.getByRole('tab', { name: 'Nested' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Submit example' })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Submissions' })).toHaveText('0');
  await page.getByRole('button', { name: 'Submit example' }).click();
  await expect(page.getByRole('status', { name: 'Submissions' })).toHaveText('1');
});

test('full-width cells distribute while overflow and reduced motion stay immediate', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScenario(mount, 'components-tabs--playground', { args: { fullWidth: true } });
  const widths = await page
    .getByRole('tab')
    .evaluateAll((tabs) => tabs.map((tab) => tab.getBoundingClientRect().width));
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
  await openScenario(mount, 'components-tabs--full-width-overflow');
  await page.getByRole('tab', { name: 'Workspace section 1', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.getByRole('tabpanel', { name: 'Workspace section 10' })).toBeVisible();
  await expect(page.getByRole('tablist')).toHaveCSS('scroll-behavior', 'auto');
});

test('the sheet and scoped token overrides inherit themes without affecting neighbors', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-tabs--composition');
  await expect(page.getByRole('heading', { name: 'Workspace overview' })).toHaveCount(4);
  await expect(page.getByText('3 projects', { exact: true })).toHaveCount(4);
  await expect(page.getByText('8 members', { exact: true })).toHaveCount(4);
  await openScenario(mount, 'components-tabs--overrides');
  const tabs = page.getByRole('tab', { name: 'Overview' });
  expect(await tabs.nth(0).evaluate((tab) => getComputedStyle(tab, '::after').height)).toBe('6px');
  expect(await tabs.nth(1).evaluate((tab) => getComputedStyle(tab, '::after').height)).toBe('3px');
  const nested = await tabs.nth(2).evaluate((tab) => getComputedStyle(tab).color);
  expect(nested).not.toBe(await tabs.nth(1).evaluate((tab) => getComputedStyle(tab).color));
});
