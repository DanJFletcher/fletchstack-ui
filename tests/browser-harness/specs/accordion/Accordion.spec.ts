import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} native keyboard reaches an expanded link and skips it after collapse`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-accordion--playground', { theme });
    const join = page.getByRole('button', { name: 'Who can join?' });
    const invite = page.getByRole('button', { name: 'How do I invite someone?' });
    await page.keyboard.press('Tab');
    await expect(join).toBeFocused();
    await join.press('Tab');
    await expect(invite).toBeFocused();
    await invite.press('Enter');
    const link = page.getByRole('link', { name: 'Team settings' });
    await invite.press('Tab');
    await expect(link).toBeFocused();
    await link.press('Enter');
    await expect(page).toHaveURL(/#team-settings$/);
    await page.keyboard.press('Shift+Tab');
    await expect(invite).toBeFocused();
    await invite.press('Space');
    await expect(page.getByRole('link', { name: 'Team settings' })).toHaveCount(0);
    await invite.press('Tab');
    await expect(page.getByRole('button', { name: 'Can I change a role?' })).toBeFocused();
  });

  test(`${theme} focus follows the trigger independently of expansion and chevrons show state`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-accordion--playground', { theme });
    const invite = page.getByRole('button', { name: 'How do I invite someone?' });
    await invite.click();
    await invite.press('Shift+Tab');
    const join = page.getByRole('button', { name: 'Who can join?' });
    await expect(join).toBeFocused();
    await expect(join).toHaveCSS('outline-style', 'solid');
    await expect(join).toHaveAttribute('aria-expanded', 'false');
    await expect(invite).toHaveAttribute('aria-expanded', 'true');
    await expect(invite.locator('.fs-accordion__chevron')).toHaveCSS(
      'transform',
      'matrix(-1, 0, 0, -1, 0, 0)',
    );
    await join.press('Enter');
    await expect(invite).toHaveAttribute('aria-expanded', 'false');
    await expect(join).toHaveAttribute('aria-expanded', 'true');
  });

  test(`${theme} long titles wrap while panel text and trailing icons remain aligned`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await openScenario(mount, 'components-accordion--long-title', { theme });
    await page.addStyleTag({
      content:
        'html {font-size:200%} .fs-accordion {line-height:1.5;letter-spacing:.12em;word-spacing:.16em}',
    });
    const trigger = page.getByRole('button').first();
    await trigger.click();
    await expect(trigger.locator('.fs-accordion__chevron')).toHaveCSS(
      'transform',
      'matrix(-1, 0, 0, -1, 0, 0)',
    );
    const title = await trigger.locator('.fs-accordion__title').boundingBox();
    const chevron = await trigger.locator('.fs-accordion__chevron').boundingBox();
    const panel = page.getByRole('region').locator('.fs-accordion__content');
    const panelTextStart = await panel.evaluate(
      (element) =>
        element.getBoundingClientRect().x +
        parseFloat(getComputedStyle(element).paddingInlineStart),
    );
    expect(panelTextStart).toBeCloseTo(title!.x);
    expect(chevron!.x).toBeGreaterThan(title!.x + title!.width);
    expect(chevron!.width).toBe(20);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });

  test(`${theme} text retains contrast in all three group appearances`, async ({ page, mount }) => {
    await openScenario(mount, 'components-accordion--variants', { theme });
    for (const variant of ['divided', 'outlined', 'surface']) {
      const group = page.getByRole('group', { name: `${variant} settings` });
      const paints = await group.evaluate((element) => {
        let parent: Element | null = element;
        while (parent && getComputedStyle(parent).backgroundColor === 'rgba(0, 0, 0, 0)') {
          parent = parent.parentElement;
        }
        return {
          color: getComputedStyle(element).color,
          background: getComputedStyle(parent!).backgroundColor,
        };
      });
      expect(contrast(paints.color, paints.background)).toBeGreaterThanOrEqual(4.5);
      await expect(group.locator('.fs-accordion__item').last()).toHaveCSS(
        'border-top-width',
        '1px',
      );
    }
    await expect(page.getByRole('group', { name: 'outlined settings' })).toHaveCSS(
      'border-top-width',
      '1px',
    );
    await expect(page.getByRole('group', { name: 'divided settings' })).toHaveCSS(
      'border-top-width',
      '0px',
    );
    await expect(page.getByRole('group', { name: 'surface settings' })).not.toHaveCSS(
      'background-color',
      'rgba(0, 0, 0, 0)',
    );
  });
}

test('multiple mode toggles independently and controlled state follows parent updates', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-accordion--multiple');
  await page.getByRole('button', { name: 'Who can join?' }).click();
  await page.getByRole('button', { name: 'How do I invite someone?' }).click();
  await expect(page.getByRole('region')).toHaveCount(2);
  await page.getByRole('button', { name: 'Who can join?' }).click();
  await expect(page.getByRole('region')).toHaveCount(1);
  await openScenario(mount, 'components-accordion--controlled');
  await page.getByRole('button', { name: 'Show role guidance' }).click();
  await expect(page.getByRole('button', { name: 'Can I change a role?' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.getByLabel('Open question')).toHaveText('role');
});

test('disabled headings are skipped in native Tab order', async ({ page, mount }) => {
  await openScenario(mount, 'components-accordion--disabled');
  await expect(page.getByRole('button', { name: 'Who can join?' })).toBeDisabled();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'How do I invite someone?' })).toBeFocused();
});

test('separate instances keep every trigger and panel relationship unique', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-accordion--instances');
  const ids = await page
    .locator('.fs-accordion [id]')
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(12);
  for (const trigger of await page.getByRole('button').all()) {
    const relation = await trigger.evaluate((element) => {
      const panel = document.getElementById(element.getAttribute('aria-controls')!)!;
      return panel.getAttribute('aria-labelledby') === element.id;
    });
    expect(relation).toBe(true);
  }
});

test('default panel changes are immediate', async ({ page, mount }) => {
  await openScenario(mount, 'components-accordion--playground');
  await page.getByRole('button', { name: 'How do I invite someone?' }).click();
  await expect(page.getByRole('region')).toHaveCSS('transition-duration', '0s');
  await page.getByRole('button', { name: 'How do I invite someone?' }).click();
  await expect(page.locator('.fs-accordion__panel').nth(1)).toHaveAttribute('hidden', '');
});

test('opt-in motion animates grid size and opacity while closing content becomes inert immediately', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-accordion--motion');
  await page.addStyleTag({ content: '.fs-accordion {--fs-motion-duration-standard:1s}' });
  const trigger = page.getByRole('button', { name: 'How do I invite someone?' });
  await trigger.click();
  const panel = page.getByRole('region', { name: 'How do I invite someone?' });
  const transitions = await panel.evaluate((element) =>
    element.getAnimations().map((animation) => (animation as CSSTransition).transitionProperty),
  );
  expect(transitions).toContain('grid-template-rows');
  expect(transitions).toContain('opacity');
  await trigger.click();
  await expect(page.locator('.fs-accordion__panel').nth(1)).toHaveAttribute('inert', '');
  await trigger.press('Tab');
  await expect(page.getByRole('button', { name: 'Can I change a role?' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Team settings' })).toHaveCount(0);
});

test('reduced motion makes panel size, opacity and chevron changes immediate', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openScenario(mount, 'components-accordion--motion');
  const trigger = page.getByRole('button', { name: 'How do I invite someone?' });
  await trigger.click();
  await expect(page.getByRole('region')).toHaveCSS('transition-duration', '0s');
  await expect(trigger.locator('.fs-accordion__chevron')).toHaveCSS('transition-duration', '0s');
  await trigger.click();
  await expect(page.locator('.fs-accordion__panel').nth(1)).toHaveCSS('visibility', 'hidden');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(trigger.locator('.fs-accordion__chevron')).toHaveCSS('transition-duration', '0.16s');
});

test('rapid animated keyboard activation follows the latest state without exposing closed links', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openScenario(mount, 'components-accordion--motion');
  await page.addStyleTag({ content: '.fs-accordion {--fs-motion-duration-standard:5s}' });
  const trigger = page.getByRole('button', { name: 'How do I invite someone?' });
  await trigger.focus();
  await trigger.press('Enter');
  const link = page.getByRole('link', { name: 'Team settings' });
  await trigger.press('Tab');
  await expect(link).toBeFocused();
  await link.press('Enter');
  await expect(page).toHaveURL(/#team-settings$/);
  await link.press('Shift+Tab');
  await trigger.press('Space');
  await expect(trigger).toHaveCSS('outline-style', 'solid');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.fs-accordion__panel').nth(1)).toHaveAttribute('inert', '');
  await trigger.press('Tab');
  await expect(page.getByRole('button', { name: 'Can I change a role?' })).toBeFocused();
  await trigger.press('Enter');
  await trigger.press('Space');
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(link).toHaveCount(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('region')).toHaveCSS('opacity', '1');
  await expect(
    page.getByRole('region').evaluate((element) => element.getAnimations().length),
  ).resolves.toBe(0);
});

test('forced colors retain a visible focused trigger and state', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-accordion--playground');
  await page.keyboard.press('Tab');
  const trigger = page.getByRole('button', { name: 'Who can join?' });
  await expect(trigger).toHaveCSS('outline-style', 'solid');
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
});

test('design-sheet team FAQs start with the invite item expanded in both themes', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-accordion--composition');
  await expect(page.getByRole('heading', { name: 'Accordion', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'How do I invite someone?' })).toHaveCount(2);
  await expect(page.getByRole('region', { name: 'How do I invite someone?' })).toHaveCount(2);
});
