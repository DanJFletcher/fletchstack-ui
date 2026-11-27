import { expect, test } from '../fixtures/test';

for (const preference of ['no-preference', 'reduce'] as const) {
  for (const mode of ['system', 'reduced', 'full'] as const) {
    test(`${mode} preview under ${preference} controls both themes and disclosure`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: preference });
      await page.goto(
        `/?path=/story/design-system-motion-examples--components&globals=motion:${mode}`,
      );
      const preview = page.frameLocator('#storybook-preview-iframe');
      const moving = mode === 'full' || (mode === 'system' && preference === 'no-preference');
      const expectedName = moving ? 'fs-spinner-rotate' : 'none';
      for (const theme of ['corporate', 'luna']) {
        const section = preview.getByRole('region', { name: `${theme} motion`, exact: true });
        await expect(section.getByRole('status').first().locator('svg')).toHaveCSS(
          'animation-name',
          expectedName,
        );
        await expect(
          section.getByRole('region', { name: 'Nested theme' }).locator('svg'),
        ).toHaveCSS('animation-name', expectedName);
        const trigger = section.getByRole('button', { name: 'How do I invite someone?' });
        await trigger.click();
        await expect(section.getByRole('region', { name: 'How do I invite someone?' })).toHaveCSS(
          'transition-duration',
          moving ? '0.16s, 0.16s, 0s' : '0s',
        );
        await expect(trigger.locator('.fs-accordion__chevron')).toHaveCSS(
          'transition-duration',
          moving ? '0.16s' : '0s',
        );
      }
    });
  }
}

test('motion toolbar owns all Docs canvases and persists across theme and story navigation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?path=/docs/design-system-motion--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.getByRole('heading', { name: /Motion$/, level: 1 })).toBeVisible();
  await page
    .getByRole('button', { name: 'Preview motion (Storybook only) System preference', exact: true })
    .click();
  await page.getByRole('option', { name: 'Full motion', exact: true }).click();
  await expect(preview.locator('html')).toHaveAttribute('data-fs-preview-motion', 'full');
  const graphics = preview.locator('.fs-spinner__graphic');
  await expect(graphics).toHaveCount(4);
  for (const graphic of await graphics.all()) {
    await expect(graphic).toHaveCSS('animation-name', 'fs-spinner-rotate');
  }
  await expect(preview.locator('.motion-sample')).toHaveCount(6);
  await expect(preview.locator('.motion-sample').first()).toHaveCSS('transition-duration', '0.1s');
  await page.getByRole('button', { name: 'Preview theme Corporate', exact: true }).click();
  await page.getByRole('option', { name: 'Luna', exact: true }).click();
  await expect(preview.locator('html')).toHaveAttribute('data-fs-preview-motion', 'full');
  await page.getByRole('button', { name: 'Feedback', exact: true }).click();
  await page.getByRole('button', { name: 'Spinner', exact: true }).click();
  await page.getByRole('link', { name: 'Playground', exact: true }).click();
  await expect(preview.locator('.fs-spinner__graphic').first()).toHaveCSS(
    'animation-name',
    'fs-spinner-rotate',
  );
  await page
    .getByRole('button', { name: 'Preview motion (Storybook only) Full motion', exact: true })
    .click();
  await page.getByRole('option', { name: 'System preference', exact: true }).click();
  await expect(preview.locator('html')).not.toHaveAttribute('data-fs-preview-motion');
  await expect(preview.locator('.fs-spinner__graphic').first()).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(preview.locator('.fs-spinner__graphic').first()).toHaveCSS(
    'animation-name',
    'fs-spinner-rotate',
  );
});

test('duration replay supports native keyboard activation without moving focus', async ({
  page,
}) => {
  await page.goto('/?path=/story/design-system-motion-examples--durations');
  const preview = page.frameLocator('#storybook-preview-iframe');
  const replay = preview.getByRole('button', { name: 'Replay duration' });
  await expect(replay).toHaveAttribute('aria-pressed', 'true');
  await replay.focus();
  await replay.press('Space');
  await expect(replay).toHaveAttribute('aria-pressed', 'false');
  await expect(replay).toBeFocused();
});

for (const mode of ['system', 'reduced', 'full'] as const) {
  test(`carousel respects ${mode} motion preview without enabling autoplay`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?path=/story/components-carousel--auto-play&globals=motion:${mode}`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.getByRole('button', { name: 'Start slide rotation' })).toBeDisabled();
    await expect(preview.locator('.fs-carousel__slide').first()).toHaveCSS(
      'transition-duration',
      mode === 'full' ? '0.16s' : '0s',
    );
  });
}

for (const mode of ['system', 'reduced', 'full'] as const) {
  test(`photo fan honors ${mode} Storybook motion preview`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?path=/story/components-bounce-cards--playground&globals=motion:${mode}`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.locator('.fs-bounce-cards__card').first()).toHaveCSS(
      'animation-name',
      mode === 'full' ? 'fs-bounce-cards-enter' : 'none',
    );
    await expect(preview.locator('.fs-bounce-cards__item').first()).toHaveCSS(
      'transition-duration',
      mode === 'full' ? '0.32s' : '0s',
    );
    await preview.getByRole('button', { name: 'White lilies with red stamens' }).focus();
    await expect(preview.locator('.fs-bounce-cards__card').first()).toHaveCSS(
      'animation-name',
      'none',
    );
  });
}

for (const mode of ['system', 'reduced', 'full'] as const) {
  test(`progress honors ${mode} Storybook motion preview`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?path=/story/components-progress--indeterminate&globals=motion:${mode}`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.locator('.fs-progress__indicator')).toHaveCSS(
      'animation-name',
      mode === 'full' ? 'fs-progress-loading' : 'none',
    );
    await expect(preview.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    await page.goto(`/?path=/story/components-progress--playground&globals=motion:${mode}`);
    await expect(preview.locator('.fs-progress__indicator')).toHaveCSS(
      'transition-duration',
      mode === 'full' ? '0.16s' : '0s',
    );
  });
}

for (const mode of ['system', 'reduced', 'full'] as const) {
  test(`toast honors ${mode} Storybook motion preview`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/?path=/story/components-toast--playground&globals=motion:${mode}`);
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(preview.locator('.fs-toast')).toHaveCSS(
      'animation-name',
      mode === 'full' ? 'fs-toast-enter' : 'none',
    );
    await preview.getByRole('button', { name: 'Dismiss notification' }).click();
    await expect(preview.locator('.fs-toast')).toBeHidden();
  });
}
