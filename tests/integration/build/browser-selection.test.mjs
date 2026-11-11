import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { dependencyGraph } from '../../browser-harness/selection/graph.mjs';
import { selectBrowserTests } from '../../browser-harness/selection/policy.mjs';
import { parseBrowserOptions } from '../../browser-harness/selection/options.mjs';
import { discoverOwnership } from '../../browser-harness/selection/inventory.mjs';

const roots = [];
afterEach(() => { roots.splice(0).forEach(root => rmSync(root, { recursive: true, force: true })); });

/**
 * Create isolated source inputs without executing their contents.
 **/
function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), 'browser-graph-'));
  roots.push(root);
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), content);
  }
  return root;
}

it('follows transitive reexports, literal dynamic imports, CSS imports and assets without executing source', () => {
  const root = fixture({
    'scenario.tsx': 'import { Button } from "./barrel"; import "./scoped.css"; import("./lazy.js"); throw new Error("Never execute");',
    'barrel.ts': 'export { Button } from "./Button";', 'Button.tsx': 'export const Button = 1;',
    'lazy.ts': 'new URL("./image.svg", import.meta.url);', 'scoped.css': '@import "./base.css"; .x{background:url("./image.svg")}',
    'base.css': '.x{color:red}', 'image.svg': '<svg/>', 'other.tsx': 'throw new Error("unrelated")',
  });
  const result = dependencyGraph(['scenario.tsx'], root);
  expect(result.unknown).toEqual([]);
  expect(result.files).toEqual(['Button.tsx', 'barrel.ts', 'base.css', 'image.svg', 'lazy.ts', 'scenario.tsx', 'scoped.css']);
});

it.each(['import(name)', 'import "@alias/missing"', 'fetch("/resource")', 'new URL(name, import.meta.url)', 'new URL("./asset.svg", location.href)', 'import "./missing"', 'export const broken = ('])('flags unsupported source: %s', source => {
  const root = fixture({ 'scenario.ts': source });
  expect(dependencyGraph(['scenario.ts'], root).unknown.length).toBeGreaterThan(0);
});

it('does not confuse document-relative JSX assets with module-relative imports', () => {
  const root = fixture({ 'scenarios/demo.tsx': 'export const view = <img src="./asset.svg" />;', 'scenarios/asset.svg': '<svg/>', 'asset.svg': '<svg/>' });
  const graph = dependencyGraph(['scenarios/demo.tsx'], root);
  expect(graph.unknown).toEqual(['scenarios/demo.tsx: Document-relative or dynamic JSX resource']);
  expect(graph.files).toEqual(['scenarios/demo.tsx']);
});

it('flags unresolved CSS URLs and never drops the known root', () => {
  const root = fixture({ 'scoped.css': '.x{background:url(var(--asset))}' });
  const graph = dependencyGraph(['scoped.css'], root);
  expect(graph.files).toContain('scoped.css');
  expect(graph.unknown).toContain('scoped.css: Dynamic CSS resource');
});

it('selects direct and transitive Button consumers, while excluding unrelated harness scenarios', () => {
  const ownership = discoverOwnership(process.cwd());
  const result = selectBrowserTests({ ...ownership, changes: [{ path: 'src/components/button/Button.tsx', status: 'M' }] });
  expect(result.mode).toBe('selected');
  expect(result.suites.filter(suite => suite.project === 'components').map(suite => suite.file)).toEqual([
    'tests/browser-harness/specs/button/Button.spec.ts', 'tests/browser-harness/specs/code-block/CodeBlock.spec.ts',
    'tests/browser-harness/specs/harness/lifecycle.spec.ts', 'tests/browser-harness/specs/stack/Stack.spec.ts',
  ]);
  expect(result.suites.filter(suite => suite.project === 'chromium')).toEqual(ownership.inventory.filter(suite => suite.project === 'chromium'));
  const scoped = selectBrowserTests({ ...ownership, changes: [{ path: 'src/components/code-block/code-block.css', status: 'M' }] });
  expect(scoped.suites.filter(suite => suite.project === 'components').map(suite => suite.file)).toEqual(['tests/browser-harness/specs/code-block/CodeBlock.spec.ts', 'tests/browser-harness/specs/harness/lifecycle.spec.ts']);
});

it.each(['tokens/themes.json', 'src/generated/tokens.css', 'playwright.config.ts', 'package-lock.json', 'src/index.ts', 'unknown-resource.svg'])('falls back for shared or unproven input %s', path => {
  const ownership = discoverOwnership(process.cwd());
  const result = selectBrowserTests({ ...ownership, changes: [{ path, status: 'M' }] });
  expect(result.mode).toBe('full-fallback');
  expect(result.suites).toEqual(ownership.inventory);
});

it('distinguishes planning-only empty results, direct test edits, rename/deletion and unavailable history', () => {
  const ownership = discoverOwnership(process.cwd());
  const path = 'tests/browser-harness/specs/button/Button.spec.ts';
  expect(selectBrowserTests({ ...ownership, changes: [{ path: 'openspec/change.md', status: '?' }] }).mode).toBe('safely-empty');
  expect(selectBrowserTests({ ...ownership, changes: [{ path, status: 'M' }] }).suites).toEqual([{ file: path, project: 'components' }]);
  for (const status of ['D', 'R100']) {
    expect(selectBrowserTests({ ...ownership, changes: [{ path, status }] }).mode).toBe('full-fallback');
  }
  expect(selectBrowserTests({ ...ownership, changes: [], fallback: 'Missing comparison history' }).mode).toBe('full-fallback');
  expect(selectBrowserTests({ ...ownership, changes: [], ownershipIssues: ['New unmapped suite'] }).mode).toBe('full-fallback');
  expect(() => selectBrowserTests({ inventory: [], graphs: new Map(), changes: [] })).toThrow('inventory');
});

it('accepts a single explicit base and optional dry run', () => {
  expect(parseBrowserOptions(['--dry-run', '--base', 'HEAD~2'])).toEqual({ base: 'HEAD~2', dryRun: true });
});

it.each([[], ['--base'], ['--base', '-x'], ['--base', 'HEAD', '--config', 'other'], ['--base', 'HEAD', '--base', 'HEAD'], ['--base', 'HEAD', '--dry-run', '--dry-run']])('rejects ambiguous options %j', (...args) => {
  expect(() => parseBrowserOptions(args)).toThrow();
});
