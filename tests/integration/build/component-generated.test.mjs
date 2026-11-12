import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { build } from 'vite';
import ts from 'typescript';
import { chromium } from 'playwright';
import { expect, it } from 'vitest';
import { planComponent } from '../../../scripts/component-plan.mjs';
import { readComponentProject, applyComponentPlan } from '../../../scripts/component-files.mjs';
import { checkComponent } from '../../../scripts/component-check.mjs';
import { componentProject, sampleOptions } from '../../support/component-project.mjs';
import { elements } from '../../../scripts/component-options.mjs';

/**
 * Create an isolated project with real dependency resolution and the existing harness types.
 **/
async function generatedProject() {
  const root = await mkdtemp(join(tmpdir(), 'component-generated-'));
  for (const [path, source] of Object.entries(componentProject())) { await mkdir(dirname(join(root, path)), { recursive: true }); await writeFile(join(root, path), source); }
  await symlink(resolve('node_modules'), join(root, 'node_modules'), 'dir');
  const types = 'tests/browser-harness/gallery/types.ts';
  await mkdir(dirname(join(root, types)), { recursive: true });
  await writeFile(join(root, types), await readFile(types, 'utf8'));
  return root;
}

it('generated roots and adapters satisfy the existing strict TypeScript options', async () => {
  const root = await generatedProject();
  try {
    const include = [];
    for (const element of Object.keys(elements)) {
      const name = `Fixture${element[0].toUpperCase()}${element.slice(1)}`;
      const plan = planComponent(readComponentProject(root).files, { name, category: 'Feedback', element });
      applyComponentPlan(root, plan);
      include.push(...plan.changes.filter(change => change.before === null && /\.tsx?$/.test(change.path)).map(change => change.path));
    }
    const config = ts.parseConfigFileTextToJson('tsconfig.json', await readFile('tsconfig.json', 'utf8')).config;
    config.include = include; config.exclude = []; config.compilerOptions.types = ['react', 'vite/client'];
    await writeFile(join(root, 'tsconfig.json'), JSON.stringify(config));
    expect(() => execFileSync(resolve('node_modules/.bin/tsc'), ['-p', join(root, 'tsconfig.json')], { encoding: 'utf8' })).not.toThrow();
  } finally { await rm(root, { recursive: true, force: true }); }
}, 20000);

it('a completed synthetic component renders through independent adapters with published source and CSS', async () => {
  const root = await generatedProject();
  let browser;
  try {
    applyComponentPlan(root, planComponent(readComponentProject(root).files, sampleOptions));
    const directory = 'src/components/status-label';
    for (const file of [`${directory}/StatusLabel.tsx`, `${directory}/stories/StatusLabel.stories.tsx`, 'docs/status-label.md']) {
      const content = await readFile(join(root, file), 'utf8');
      await writeFile(join(root, file), content.replaceAll('COMPONENT_TODO:', 'Authored fixture:'));
    }
    await writeFile(join(root, `${directory}/stories/status-label-examples.tsx`), "import { StatusLabel } from '../StatusLabel';\nexport function StatusLabelExample() { return <StatusLabel>Ready</StatusLabel>; }\n");
    await writeFile(join(root, `${directory}/status-label.css`), '.fs-status-label { color: rgb(0, 64, 0); }');
    await mkdir(join(root, `${directory}/__tests__`));
    await writeFile(join(root, `${directory}/__tests__/StatusLabel.test.tsx`), "import { expect, it } from 'vitest'; import { renderToStaticMarkup } from 'react-dom/server'; import { StatusLabel } from '../StatusLabel'; it('renders authored status text', () => { expect(renderToStaticMarkup(<StatusLabel>Ready</StatusLabel>)).toContain('Ready'); });");
    const owner = 'tests/browser-harness/specs/status-label/StatusLabel.spec.ts';
    await mkdir(dirname(join(root, owner)), { recursive: true });
    await writeFile(join(root, owner), "import { test, expect } from '@playwright/test'; test('status composition', async ({ page }) => { await expect(page.getByText('Ready', { exact: true })).toBeVisible(); });");
    const files = readComponentProject(root).files;
    expect(checkComponent(files, 'StatusLabel')).toEqual([]);
    const manifest = JSON.parse(files['package.json']);
    expect(manifest.exports['./status-label.css']).toBe('./dist/status-label.css');
    expect(files['src/index.ts']).toContain("export { StatusLabel } from './components/status-label/index.js'");
    const entry = join(root, 'consumer.tsx');
    await writeFile(entry, "import { createRoot } from 'react-dom/client'; import { StatusLabel } from './src/index'; import { Composition } from './src/components/status-label/stories/StatusLabel.stories'; import { scenarios } from './tests/browser-harness/scenarios/StatusLabel'; const view = location.hash === '#story' ? Composition.render() : location.hash === '#consumer' ? <StatusLabel>Ready</StatusLabel> : scenarios.Composition.render({}); createRoot(document.getElementById('root')).render(view);");
    const result = await build({ root, configFile: false, logLevel: 'silent', esbuild: { jsx: 'automatic', jsxDev: false }, define: { 'process.env.NODE_ENV': '"production"' }, build: { write: false, lib: { entry, formats: ['iife'], name: 'Fixture', cssFileName: 'fixture' } } });
    const output = (Array.isArray(result) ? result[0] : result).output;
    const script = output.find(item => item.type === 'chunk').code;
    const css = output.find(item => item.type === 'asset' && item.fileName.endsWith('.css')).source;
    browser = await chromium.launch();
    for (const hash of ['#story', '#harness', '#consumer']) {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => { errors.push(error.message); });
      await page.goto(`about:blank${hash}`);
      await page.setContent(`<style>${css}</style><div id="root"></div>`);
      await page.addScriptTag({ content: script });
      await expect.poll(async () => ({ count: await page.getByText('Ready', { exact: true }).count(), errors, hash: await page.evaluate(() => globalThis.location.hash) })).toEqual({ count: 1, errors: [], hash });
      expect(await page.getByText('Ready', { exact: true }).evaluate(node => node.ownerDocument.defaultView.getComputedStyle(node).color)).toBe('rgb(0, 64, 0)');
      await page.close();
    }
  } finally { await browser?.close(); await rm(root, { recursive: true, force: true }); }
}, 20000);
