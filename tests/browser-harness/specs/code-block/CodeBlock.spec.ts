import type { Page } from '@playwright/test';
import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';
import { contrast } from '../../../e2e/fixtures/contrast';

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} literal code preserves whitespace and uses approved typography and AA paint`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-code-block--literal-content', { theme });
    const source = page.getByRole('region', { name: 'Code in literal.txt' });
    expect(await source.textContent()).toBe(
      '\n\t<div>Markup & whitespace stay literal.</div>\n<script>not executed</script>\n',
    );
    await expect(source).toHaveCSS('font-size', '14px');
    await expect(source).toHaveCSS('line-height', '21px');
    await expect(source).toHaveCSS('padding', '16px');
    expect(await source.evaluate((element) => getComputedStyle(element).fontFamily)).toContain(
      'monospace',
    );
    const paint = await page.locator('.fs-code-block').evaluate((element) => {
      const style = getComputedStyle(element);
      const language = getComputedStyle(element.querySelector('.fs-code-block__language')!);
      const header = getComputedStyle(element.querySelector('.fs-code-block__header')!);
      return {
        text: style.color,
        surface: style.backgroundColor,
        muted: language.color,
        header: header.backgroundColor,
        radius: style.borderRadius,
      };
    });
    expect(contrast(paint.text, paint.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(paint.muted, paint.header)).toBeGreaterThanOrEqual(4.5);
    expect(paint.radius).toBe(theme === 'luna' ? '12px' : '4px');
    await expect(page.getByRole('button')).toHaveCSS(
      'background-color',
      theme === 'luna' ? 'rgb(199, 181, 255)' : 'rgb(255, 255, 255)',
    );
    await expect(page.getByRole('button')).toHaveCSS(
      'color',
      theme === 'luna' ? 'rgb(17, 19, 41)' : 'rgb(23, 35, 56)',
    );
    await expect(source.locator('script')).toHaveCount(0);
  });

  test(`${theme} code scrolls by keyboard while wrap reflows without changing source`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-code-block--long-lines', { theme });
    const scroll = page.getByRole('region', { name: 'Scrollable long source' });
    const wrapped = page.getByRole('region', { name: 'Wrapped long source' });
    expect(await scroll.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
      true,
    );
    expect(await wrapped.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    expect(await wrapped.textContent()).toBe(await scroll.textContent());
    await scroll.focus();
    await page.keyboard.press('ArrowRight');
    await expect.poll(() => scroll.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await expect(scroll).toHaveCSS('outline-style', 'solid');
    await expect(page.locator('.fs-code-block').first()).toHaveCSS('overflow', 'visible');
    await page.keyboard.press('Tab');
    await expect(scroll).not.toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });

  test(`${theme} copy failure remains focused with one visible polite result and sufficient contrast`, async ({
    page,
    mount,
  }) => {
    await denyClipboard(page);
    await openScenario(mount, 'components-code-block--copy-failure', { theme });
    await page.getByRole('button', { name: 'Copy settings.ts' }).click();
    await expect(page.getByRole('button', { name: 'Try again settings.ts' })).toBeFocused();
    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toHaveText('Copy failed. Select the code to copy manually.');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(page.getByRole('status')).toHaveCount(1);
    const paint = await status.evaluate((element) => ({
      color: getComputedStyle(element).color,
      surface: getComputedStyle(element.closest('.fs-code-block')!).backgroundColor,
    }));
    expect(contrast(paint.color, paint.surface)).toBeGreaterThanOrEqual(4.5);
    await expect(page.locator('.fs-code-block')).toHaveCSS('overflow', 'visible');
  });

  test(`${theme} long metadata and source reflow at 320px with enlarged and spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-code-block--long-metadata', { theme });
    await page.addStyleTag({
      content:
        'html{font-size:200%} *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}',
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const region = page.getByRole('region');
    expect(await region.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    await expect(page.getByRole('button')).toBeVisible();
    await page.getByRole('button').focus();
    await expect(page.getByRole('button')).toHaveCSS('outline-style', 'solid');
    await expect(page.locator('.fs-code-block')).toHaveCSS('overflow', 'visible');
  });
}

test('native clipboard writing preserves exact raw text and keeps the button focused', async ({
  page,
  context,
  mount,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openScenario(mount, 'components-code-block--literal-content');
  await page.getByRole('button', { name: 'Copy literal.txt' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Copied literal.txt' })).toBeFocused();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    '\n\t<div>Markup & whitespace stay literal.</div>\n<script>not executed</script>\n',
  );
  await expect(page.getByRole('status')).toHaveText('Code copied.');
});

test('wrapped display still copies the unmodified long source', async ({
  page,
  context,
  mount,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 320, height: 1000 });
  await openScenario(mount, 'components-code-block--wrapped');
  const original = await page.getByRole('region').textContent();
  await page.getByRole('button', { name: 'Copy settings.ts' }).click();
  await expect(page.getByRole('button', { name: 'Copied settings.ts' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
});

test('missing clipboard APIs offer manual copy without throwing or trapping keyboard focus', async ({
  page,
  mount,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true }),
  );
  await openScenario(mount, 'components-code-block--playground');
  await page.getByRole('button', { name: 'Copy settings.ts' }).click();
  await expect(page.getByRole('button', { name: 'Try again settings.ts' })).toBeFocused();
  await expect(page.getByRole('status')).toHaveText(
    'Copy failed. Select the code to copy manually.',
  );
  await page.keyboard.press('Tab');
  await expect(page.getByRole('region')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('region')).not.toBeFocused();
});

test('copy feedback retry clears the failure and reports success once', async ({ page, mount }) => {
  await page.addInitScript(() => {
    let attempts = 0;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          if (!attempts++) {
            throw new Error('Denied');
          }
        },
      },
    });
  });
  await openScenario(mount, 'components-code-block--copy-retry');
  await page.getByRole('button', { name: 'Copy settings.ts' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Copy failed. Select the code to copy manually.',
  );
  await page.getByRole('button', { name: 'Try again settings.ts' }).click();
  await expect(page.getByRole('button', { name: 'Copied settings.ts' })).toBeFocused();
  await expect(page.getByRole('status')).toHaveCount(1);
  await expect(page.getByRole('status')).toHaveText('Code copied.');
  await expect(page.locator('.fs-code-block__feedback--error')).toHaveCount(0);
});

test('scoped code tokens inherit and reset at nested explicit themes', async ({ page, mount }) => {
  await openScenario(mount, 'components-code-block--scoped-overrides');
  await expect(page.getByRole('region', { name: 'Scoped source' })).toHaveCSS('padding', '24px');
  await expect(page.getByRole('region', { name: 'Scoped source' })).toHaveCSS('font-size', '18px');
  await expect(page.getByRole('region', { name: 'Reset source' })).toHaveCSS('padding', '16px');
  await expect(page.getByRole('region', { name: 'Reset source' })).toHaveCSS('font-size', '14px');
  await expect(page.getByRole('region', { name: 'Sibling source' })).toHaveCSS('padding', '16px');
});

test('RTL metadata preserves LTR source and places the copy action at logical inline end', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-code-block--rtl');
  await expect(page.getByRole('region')).toHaveCSS('direction', 'ltr');
  const button = await page.getByRole('button').boundingBox();
  const filename = await page.getByText('settings.ts', { exact: true }).boundingBox();
  expect(button!.x).toBeLessThan(filename!.x);
});

test('forced colors retain code, failure text and keyboard focus', async ({ page, mount }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await denyClipboard(page);
  await openScenario(mount, 'components-code-block--copy-failure');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button')).toHaveCSS('outline-style', 'solid');
  await expect(page.getByRole('status')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('region')).toBeFocused();
  await expect(page.getByRole('region')).toHaveCSS('outline-style', 'solid');
  await expect(page.locator('.fs-code-block')).toHaveCSS('border-style', 'solid');
});

test('native hidden removes code and controls from layout', async ({ page, mount }) => {
  await openScenario(mount, 'components-code-block--hidden');
  await expect(page.locator('.fs-code-block')).toHaveCSS('display', 'none');
});

test('metadata variations keep copy at logical inline end in either writing direction', async ({
  page,
  mount,
}) => {
  await openScenario(mount, 'components-code-block--metadata');
  for (const direction of ['ltr', 'rtl']) {
    await page
      .locator('html')
      .evaluate((element, dir) => element.setAttribute('dir', dir), direction);
    for (const block of await page.locator('.fs-code-block').all()) {
      const result = await block.evaluate((element) => {
        const panel = element.getBoundingClientRect();
        const button = element.querySelector('button')!.getBoundingClientRect();
        const language = element.querySelector('.fs-code-block__language')?.getBoundingClientRect();
        const rtl = getComputedStyle(element).direction === 'rtl';

        return {
          inset: rtl ? button.left - panel.left : panel.right - button.right,
          gap: language && (rtl ? language.left - button.right : button.left - language.right),
        };
      });
      expect(result.inset).toBeCloseTo(17, 2);
      if (result.gap !== undefined) {
        expect(result.gap).toBeCloseTo(12, 2);
      }
    }
  }
});

for (const theme of ['corporate', 'luna'] as const) {
  test(`${theme} syntax tokens retain readable theme colors and exact source`, async ({
    page,
    mount,
  }) => {
    await openScenario(mount, 'components-code-block--syntax-highlighting', { theme });
    const source = page.getByRole('region').first();
    await expect(source).toHaveText(
      '// Workspace settings\nconst count: number = 12;\nfunction greet(name: string) { return "Hello " + name; }\nconst ready = true;',
    );
    const paint = await source.evaluate((element) => ({
      surface: getComputedStyle(element.closest('.fs-code-block')!).backgroundColor,
      colors: Array.from(element.querySelectorAll('.token')).map(
        (token) => getComputedStyle(token).color,
      ),
    }));
    for (const color of paint.colors) {
      expect(contrast(color, paint.surface)).toBeGreaterThanOrEqual(4.5);
    }
    await expect(source.locator('.token.keyword').first()).toHaveCSS(
      'color',
      theme === 'luna' ? 'rgb(199, 181, 255)' : 'rgb(36, 75, 176)',
    );
    await expect(source.locator('.token.string').first()).not.toHaveCSS(
      'color',
      theme === 'luna' ? 'rgb(199, 181, 255)' : 'rgb(36, 75, 176)',
    );
  });

  test(`${theme} highlighted long tokens wrap at 320px with enlarged and spaced text`, async ({
    page,
    mount,
  }) => {
    await page.setViewportSize({ width: 320, height: 1000 });
    await openScenario(mount, 'components-code-block--wrapped', { theme });
    await page.addStyleTag({
      content:
        'html{font-size:200%} *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}',
    });
    const source = page.getByRole('region');
    await expect(source.locator('.token.keyword').first()).toHaveText('const');
    expect(await source.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(
      true,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button').focus();
    await expect(page.getByRole('button')).toHaveCSS('outline-style', 'solid');
    await expect(page.locator('.fs-code-block')).toHaveCSS('overflow', 'visible');
  });
}

test('highlighted markup copies exact text without creating executable HTML', async ({
  page,
  context,
  mount,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openScenario(mount, 'components-code-block--highlighted-markup');
  const source = page.getByRole('region');
  await expect(source).toHaveText('\n\t<script>literal & text</script>\n');
  await expect(source.locator('script')).toHaveCount(0);
  await expect(source.locator('code > .token.tag')).toHaveCount(2);
  await page.getByRole('button').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    '\n\t<script>literal & text</script>\n',
  );
  await expect(page.getByRole('button', { name: 'Copied literal.html' })).toBeFocused();
});

test('unsupported languages and explicit opt-out remain plain code', async ({ page, mount }) => {
  await openScenario(mount, 'components-code-block--plain-text-fallback');
  await expect(page.locator('code .token')).toHaveCount(0);
  await expect(page.getByRole('region').first()).toHaveText(
    'const settings = {\n  theme: "corporate",\n};',
  );
  await expect(page.getByRole('region').last()).toHaveText(
    'const settings = {\n  theme: "corporate",\n};',
  );
});

test('syntax overrides inherit and explicit nested themes reset them', async ({ page, mount }) => {
  await openScenario(mount, 'components-code-block--scoped-overrides');
  await expect(
    page.getByRole('region', { name: 'Scoped source' }).locator('.token.keyword'),
  ).toHaveCSS('color', 'rgb(138, 35, 100)');
  await expect(
    page.getByRole('region', { name: 'Reset source' }).locator('.token.keyword'),
  ).toHaveCSS('color', 'rgb(199, 181, 255)');
  await expect(
    page.getByRole('region', { name: 'Sibling source' }).locator('.token.keyword'),
  ).toHaveCSS('color', 'rgb(36, 75, 176)');
});

test('forced colors keep highlighted tokens readable without relying on syntax colors', async ({
  page,
  mount,
}) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await openScenario(mount, 'components-code-block--playground');
  const source = page.getByRole('region');
  const foreground = await source.evaluate((element) => getComputedStyle(element).color);
  await expect(source.locator('.token.keyword').first()).toHaveCSS('color', foreground);
  await source.focus();
  await expect(source).toHaveCSS('outline-style', 'solid');
});

/**
 * Control clipboard I/O while leaving the component's native interaction real.
 **/
async function denyClipboard(page: Page) {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Denied');
        },
      },
    }),
  );
}
