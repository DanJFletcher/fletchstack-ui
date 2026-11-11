import { expect, test } from '../../fixtures/test';
import { openScenario } from '../../fixtures/scenario';

test('unknown IDs reject instead of mounting an empty success', async ({ mount }) => {
  await expect(mount('unknown-scenario')).rejects.toThrow('Unknown scenario');
});

test('failed module imports reject and a subsequent navigation recovers', async ({ page, mount }) => {
  await page.route('**/scenarios/Button.tsx', route => route.fulfill({ contentType: 'text/javascript', body: 'throw new Error("Module failed");' }));
  await expect(mount('components-button--playground')).rejects.toThrow('Module failed');
  await page.unroute('**/scenarios/Button.tsx');
  await openScenario(mount, 'components-button--playground');
  await expect(page.getByRole('button', { name: 'Save changes' })).toBeVisible();
});

test('React render failures reject and unmount clears committed state', async ({ page, mount }) => {
  await page.route('**/scenarios/Button.tsx', route => route.fulfill({ contentType: 'text/javascript', body: 'export const component = () => { throw new Error("Render failed"); }; export const defaults = {}; export const scenarios = { Playground: {} };' }));
  await expect(mount('components-button--playground')).rejects.toThrow('Render failed');
  await page.unroute('**/scenarios/Button.tsx');
  const rendered = await mount('components-button--playground');
  await rendered.update({ children: 'Updated' });
  await expect(page.getByRole('button', { name: 'Updated' })).toBeVisible();
  await rendered.unmount();
  await expect(page.getByRole('button')).toHaveCount(0);
});

for (const order of [['luna', 'corporate'], ['corporate', 'luna']] as const) {
  test(`navigation isolates theme, document CSS and clipboard in ${order.join(' then ')} order`, async ({ page, mount }) => {
    await openScenario(mount, 'components-button--playground', { theme: order[0] });
    await page.addStyleTag({ content: 'button { display: none !important }' });
    await page.evaluate(() => {
      document.documentElement.dir = 'rtl';
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    });
    await openScenario(mount, 'components-button--playground', { theme: order[1] });
    await expect(page.locator('main')).toHaveAttribute('data-theme', order[1]);
    await expect(page.getByRole('button')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.dir)).toBe('');
    expect(await page.evaluate(() => typeof navigator.clipboard.writeText)).toBe('function');
  });
}

test('new contexts reset permissions and emulated preferences after a failed scenario', async ({ browser, baseURL }) => {
  const dirty = await browser.newContext({ baseURL: baseURL!, reducedMotion: 'reduce', forcedColors: 'active', permissions: ['clipboard-read'] });
  try {
    const page = await dirty.newPage();
    await page.goto('/');
    await expect(page.evaluate(() => window.mount({ story: 'missing' }))).rejects.toThrow('Unknown scenario');
  } finally { await dirty.close(); }

  const clean = await browser.newContext({ baseURL: baseURL! });
  try {
    const page = await clean.newPage();
    await page.goto('/');
    expect(await page.evaluate(() => matchMedia('(forced-colors: active)').matches)).toBe(false);
    expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(false);
    expect(await page.evaluate(async () => (await navigator.permissions.query({ name: 'clipboard-read' as PermissionName })).state)).toBe('prompt');
  } finally { await clean.close(); }
});

for (const order of [['success', 'unavailable'], ['unavailable', 'success']]) {
  test(`clipboard state is independent in ${order.join(' then ')} order`, async ({ page, context, mount }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    for (const state of order) {
      await openScenario(mount, 'components-code-block--playground');
      if (state === 'unavailable') {
        await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true }));
      }
      await page.getByRole('button', { name: 'Copy settings.ts' }).click();
      await expect(page.getByRole('status')).toHaveText(state === 'success' ? 'Code copied.' : 'Copy failed. Select the code to copy manually.');
      if (state === 'success') {
        expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('const settings = {\n  theme: "corporate",\n};');
      }
    }
  });
}
