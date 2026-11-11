import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import { dependencyGraph } from '../../browser-harness/selection/graph.mjs';
import { selectBrowserTests } from '../../browser-harness/selection/policy.mjs';
import { parseBrowserOptions } from '../../browser-harness/selection/options.mjs';
import { discoverOwnership } from '../../browser-harness/selection/inventory.mjs';

// Repository files stay unchanged in this suite; share only their read-only ownership snapshot.
const repositoryOwnership = discoverOwnership(process.cwd());
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

it.each(['src', 'poster', 'href'])('follows explicit module-relative JSX %s URLs', attribute => {
  const root = fixture({
    'scenarios/demo.tsx': `export const view = <video ${attribute}={new URL('./asset.svg', import.meta.url).href} />;`,
    'scenarios/asset.svg': '<svg/>',
  });
  const graph = dependencyGraph(['scenarios/demo.tsx'], root);
  expect(graph.unknown).toEqual([]);
  expect(graph.files).toEqual(['scenarios/asset.svg', 'scenarios/demo.tsx']);
  expect(graph.paths['scenarios/asset.svg']).toEqual(['scenarios/demo.tsx', 'scenarios/asset.svg']);
});

it.each([
  "new URL(name, import.meta.url).href",
  "new URL('./asset.svg', location.href).href",
  "new URL('./asset.svg', import.meta.url).toString()",
  "condition ? new URL('./asset.svg', import.meta.url).href : other",
  'asset',
])('retains full fallback for unproven JSX resources: %s', expression => {
  const root = fixture({ 'scenario.tsx': `export const view = <img src={${expression}} />;`, 'asset.svg': '<svg/>' });
  const graph = dependencyGraph(['scenario.tsx'], root);
  const inventory = [{ project: 'components', file: 'test.spec.ts' }];
  const result = selectBrowserTests({ inventory, graphs: new Map([['test.spec.ts', graph]]), changes: [{ path: 'asset.svg', status: 'M' }] });
  expect(graph.unknown).toContain('scenario.tsx: Document-relative or dynamic JSX resource');
  expect(result.mode).toBe('full-fallback');
  expect(result.suites).toEqual(inventory);
});

it('does not accept a missing asset just because its JSX URL is module-relative', () => {
  const root = fixture({ 'scenario.tsx': "export const view = <img src={new URL('./missing.svg', import.meta.url).href} />;" });
  const graph = dependencyGraph(['scenario.tsx'], root);
  expect(graph.unknown).toContain('Unresolved local resource: ./missing.svg from scenario.tsx');
});

it('flags unresolved CSS URLs and never drops the known root', () => {
  const root = fixture({ 'scoped.css': '.x{background:url(var(--asset))}' });
  const graph = dependencyGraph(['scoped.css'], root);
  expect(graph.files).toContain('scoped.css');
  expect(graph.unknown).toContain('scoped.css: Dynamic CSS resource');
});

it('selects direct and transitive Button consumers, while excluding unrelated harness scenarios', () => {
  const ownership = repositoryOwnership;
  const result = selectBrowserTests({ ...ownership, changes: [{ path: 'src/components/button/Button.tsx', status: 'M' }] });
  expect(result.mode).toBe('selected');
  expect(result.suites.filter(suite => suite.project === 'components').map(suite => suite.file)).toEqual([
    'tests/browser-harness/specs/aspect-ratio/AspectRatio.spec.ts',
    'tests/browser-harness/specs/badge/Badge.spec.ts', 'tests/browser-harness/specs/button-group/ButtonGroup.spec.ts',
    'tests/browser-harness/specs/button/Button.spec.ts', 'tests/browser-harness/specs/card/Card.spec.ts',
    'tests/browser-harness/specs/cluster/Cluster.spec.ts',
    'tests/browser-harness/specs/code-block/CodeBlock.spec.ts', 'tests/browser-harness/specs/container/Container.spec.ts',
    'tests/browser-harness/specs/harness/lifecycle.spec.ts', 'tests/browser-harness/specs/icon/Icon.spec.ts',
    'tests/browser-harness/specs/radio/Radio.spec.ts',
    'tests/browser-harness/specs/section/Section.spec.ts',
    'tests/browser-harness/specs/separator/Separator.spec.ts', 'tests/browser-harness/specs/simple-grid/SimpleGrid.spec.ts',
    'tests/browser-harness/specs/spatial/SpatialSystem.spec.ts',
    'tests/browser-harness/specs/spinner/Spinner.spec.ts',
    'tests/browser-harness/specs/stack/Stack.spec.ts', 'tests/browser-harness/specs/switch/Switch.spec.ts',
    'tests/browser-harness/specs/textarea/Textarea.spec.ts',
    'tests/browser-harness/specs/themes/themes.spec.ts',
    'tests/browser-harness/specs/typography/Typography.spec.ts',
  ]);
  expect(result.suites.filter(suite => suite.project === 'chromium')).toEqual(ownership.inventory.filter(suite => suite.project === 'chromium'));
  const scoped = selectBrowserTests({ ...ownership, changes: [{ path: 'src/components/code-block/code-block.css', status: 'M' }] });
  expect(scoped.suites.filter(suite => suite.project === 'components').map(suite => suite.file)).toEqual(['tests/browser-harness/specs/code-block/CodeBlock.spec.ts', 'tests/browser-harness/specs/harness/lifecycle.spec.ts']);
});

it.each([
  ['Cluster', 'cluster'], ['Container', 'container'], ['Section', 'section'],
  ['SimpleGrid', 'simple-grid'], ['Separator', 'separator'],
  ['Checkbox', 'checkbox'], ['Radio', 'radio'], ['Switch', 'switch'],
  ['TextInput', 'text-input'], ['Textarea', 'textarea'], ['Select', 'select'],
  ['Badge', 'badge'], ['Spinner', 'spinner'], ['ButtonGroup', 'button-group'], ['FormGroup', 'form-group'],
  ['Field', 'field'],
  ['Card', 'card'], ['Icon', 'icon'],
  ['AspectRatio', 'aspect-ratio'], ['Link', 'link'], ['SpatialSystem', 'spatial'],
])('selects only the %s suite for its private scenario edit', (name, family) => {
  const ownership = repositoryOwnership;
  const result = selectBrowserTests({ ...ownership, changes: [{ path: `tests/browser-harness/scenarios/${name}.tsx`, status: 'M' }] });
  expect(result.mode).toBe('selected');
  expect(result.suites).toEqual([{ project: 'components', file: `tests/browser-harness/specs/${family}/${name}.spec.ts` }]);
});

it.each([
  ['src/components/cluster/cluster.css', ['cluster/Cluster', 'section/Section', 'simple-grid/SimpleGrid']],
  ['src/components/container/Container.tsx', ['aspect-ratio/AspectRatio', 'button-group/ButtonGroup', 'cluster/Cluster', 'container/Container', 'section/Section', 'simple-grid/SimpleGrid', 'stack/Stack', 'typography/Typography']],
  ['src/components/separator/separator.css', ['separator/Separator']],
  ['src/components/checkbox/checkbox.css', ['checkbox/Checkbox', 'field/Field', 'form-group/FormGroup', 'section/Section', 'simple-grid/SimpleGrid', 'stack/Stack']],
  ['src/components/text-input/TextInput.tsx', ['cluster/Cluster', 'container/Container', 'field/Field', 'form-group/FormGroup', 'stack/Stack', 'text-input/TextInput']],
  ['src/components/form-group/FormGroup.tsx', ['form-group/FormGroup', 'radio/Radio', 'stack/Stack', 'switch/Switch']],
  ['src/components/badge/badge.css', ['badge/Badge', 'cluster/Cluster', 'simple-grid/SimpleGrid']],
  ['src/components/spinner/Spinner.tsx', ['spinner/Spinner']],
  ['src/components/button-group/stories/button-group.stories.css', ['button-group/ButtonGroup']],
  ['src/components/field/stories/field-atoms.css', ['field/FieldAtoms']],
  ['src/components/card/Card.tsx', ['aspect-ratio/AspectRatio', 'card/Card', 'container/Container', 'section/Section', 'simple-grid/SimpleGrid']],
  ['src/components/card/stories/card.stories.css', ['card/Card']],
  ['src/components/icon/named/MoonIcon.tsx', ['button/Button', 'harness/lifecycle', 'icon/Icon']],
  ['src/components/aspect-ratio/stories/landscape.svg', ['aspect-ratio/AspectRatio']],
  ['src/components/aspect-ratio/aspect-ratio.css', ['aspect-ratio/AspectRatio']],
  ['src/components/simple-grid/SimpleGrid.tsx', ['aspect-ratio/AspectRatio', 'section/Section', 'simple-grid/SimpleGrid']],
  ['src/components/typography/Heading.tsx', ['button-group/ButtonGroup', 'code-block/CodeBlock', 'harness/lifecycle', 'typography/Typography']],
  ['src/components/typography/Text.tsx', ['button-group/ButtonGroup', 'code-block/CodeBlock', 'harness/lifecycle', 'typography/Typography']],
  ['src/components/typography/typography.css', ['button-group/ButtonGroup', 'code-block/CodeBlock', 'harness/lifecycle', 'typography/Typography']],
  ['stories/foundations/spatial.stories.css', ['spatial/SpatialSystem']],
  ['src/components/icon/named/CheckIcon.tsx', ['badge/Badge', 'checkbox/Checkbox', 'field/Field', 'form-group/FormGroup', 'icon/Icon', 'section/Section', 'simple-grid/SimpleGrid', 'spatial/SpatialSystem', 'stack/Stack']],
  ['src/components/link/Link.tsx', ['link/Link', 'typography/Typography']],
  ['src/components/link/link.css', ['link/Link', 'typography/Typography']],
  ['src/components/icon/named/ArrowRightIcon.tsx', ['icon/Icon', 'link/Link']],
  ['src/components/typography/stories/typography.stories.css', ['typography/Typography']],
])('includes composed consumers for %s without selecting unrelated harness families', (path, consumers) => {
  const ownership = repositoryOwnership;
  const result = selectBrowserTests({ ...ownership, changes: [{ path, status: 'M' }] });
  expect(result.mode).toBe('selected');
  expect(result.suites.filter(suite => suite.project === 'components').map(suite => suite.file)).toEqual(consumers.map(consumer => `tests/browser-harness/specs/${consumer}.spec.ts`));
  expect(result.suites.filter(suite => suite.project === 'chromium')).toEqual(ownership.inventory.filter(suite => suite.project === 'chromium'));
});

it.each(['FieldLabel', 'FieldDescription', 'FieldError'])('selects the shared atom suite for its %s scenario', name => {
  const ownership = repositoryOwnership;
  const result = selectBrowserTests({ ...ownership, changes: [{ path: `tests/browser-harness/scenarios/${name}.tsx`, status: 'M' }] });
  expect(result.mode).toBe('selected');
  expect(result.suites).toEqual([{ project: 'components', file: 'tests/browser-harness/specs/field/FieldAtoms.spec.ts' }]);
});

it.each(['Heading', 'Text'])('selects the shared typography suite for its %s scenario', name => {
  const ownership = repositoryOwnership;
  const result = selectBrowserTests({ ...ownership, changes: [{ path: `tests/browser-harness/scenarios/${name}.tsx`, status: 'M' }] });
  expect(result.mode).toBe('selected');
  expect(result.suites).toEqual([{ project: 'components', file: 'tests/browser-harness/specs/typography/Typography.spec.ts' }]);
});

it.each(['tokens/themes.json', 'src/generated/tokens.css', 'playwright.config.ts', 'package-lock.json', 'src/index.ts', 'unknown-resource.svg'])('falls back for shared or unproven input %s', path => {
  const ownership = repositoryOwnership;
  const result = selectBrowserTests({ ...ownership, changes: [{ path, status: 'M' }] });
  expect(result.mode).toBe('full-fallback');
  expect(result.suites).toEqual(ownership.inventory);
});

it('distinguishes planning-only empty results, direct test edits, rename/deletion and unavailable history', () => {
  const ownership = repositoryOwnership;
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

/**
 * A minimal forwarded navigation component and caller, inspected without evaluation.
 **/
function navigationFixture(caller, callback = 'return <a href={href} />;', binding = 'href') {
  return fixture({
    'scenario.tsx': `import { Navigation as Destination } from './Navigation'; ${caller}`,
    'Navigation.tsx': `import { forwardRef } from 'react'; export const Navigation = forwardRef(function Navigation({ ${binding} }, ref) { ${callback} });`,
    'node_modules/react/package.json': '{}',
  });
}

it.each(['#section', '', 'data:text/plain,guide', 'https://example.test/docs'])('proves a forwarded literal navigation destination %j', href => {
  const root = navigationFixture(`export const view = <Destination href="${href}" />;`);
  const graph = dependencyGraph(['scenario.tsx'], root);
  expect(graph.unknown).toEqual([]);
  expect(graph.files).toEqual(['Navigation.tsx', 'scenario.tsx']);
});

it.each(['<Destination />', '<Destination {...props} href="#known" />'])('proves omitted or finally overridden destinations: %s', jsx => {
  const root = navigationFixture(`export const view = ${jsx};`);
  expect(dependencyGraph(['scenario.tsx'], root).unknown).toEqual([]);
});

it.each([
  '<Destination href={path} />', '<Destination href="./document.html" />',
  '<Destination href="/document.html" />', '<Destination {...props} />',
  '<Destination href="#known" {...props} />', '<Destination href={undefined} />',
  '<Destination href="javascript:doSomething()" />',
])('falls back for an unproven forwarded destination: %s', jsx => {
  const root = navigationFixture(`export const view = ${jsx};`);
  const graph = dependencyGraph(['scenario.tsx'], root);
  expect(graph.unknown).toContain('Navigation.tsx: Document-relative or dynamic JSX resource');
  const inventory = [{ project: 'components', file: 'navigation.spec.ts' }, { project: 'components', file: 'other.spec.ts' }];
  expect(selectBrowserTests({ inventory, graphs: new Map([['navigation.spec.ts', graph]]), changes: [] }).suites).toEqual(inventory);
});

it.each([
  'const Alias = Destination; export const view = <Alias href="#known" />;',
  'export const view = createElement(Destination, { href: "#known" });',
  'export const component = Destination;',
  'export { Destination };',
  'export const view = <Destination href="#known" />; useComponent(Destination);',
  'export const view = <Destination href="#known" />; export const other = <Destination href={path} />;',
])('does not infer ownership when the component escapes JSX: %s', caller => {
  const root = navigationFixture(caller);
  expect(dependencyGraph(['scenario.tsx'], root).unknown).toContain('Navigation.tsx: Document-relative or dynamic JSX resource');
});

it.each([
  'href = "/unowned"; return <a href={href} />;',
  '({ href } = props); return <a href={href} />;',
  'href++; return <a href={href} />;',
  'for (href of paths) {} return <a href={href} />;',
  'consume(Navigation); return <a href={href} />;',
  'return <a href={transform(href)} />;',
  'return <img src={href} />;',
])('does not treat transformed or mutable forwarding as literal: %s', callback => {
  const root = navigationFixture('export const view = <Destination href="#known" />;', callback);
  expect(dependencyGraph(['scenario.tsx'], root).unknown).toContain('Navigation.tsx: Document-relative or dynamic JSX resource');
});

it('rejects a forwarded default that could load an unowned document', () => {
  const root = navigationFixture('export const view = <Destination />;', 'return <a href={href} />;', 'href = "/unowned"');
  expect(dependencyGraph(['scenario.tsx'], root).unknown).toContain('Navigation.tsx: Document-relative or dynamic JSX resource');
});

it('retains dynamic imports and runtime resource fallbacks alongside proven navigation', () => {
  const root = navigationFixture('export const view = <Destination href="#known" />; import(path); fetch(path);');
  expect(dependencyGraph(['scenario.tsx'], root).unknown).toEqual(['scenario.tsx: Nonliteral dynamic import', 'scenario.tsx: Runtime resource discovery']);
});

it('does not trust an unrelated function called forwardRef', () => {
  const root = fixture({
    'scenario.tsx': 'import { Navigation } from "./Navigation"; export const view = <Navigation href="#known" />;',
    'Navigation.tsx': 'function forwardRef(render) { return render({ href: path }); } export const Navigation = forwardRef(function Navigation({ href }) { return <a href={href} />; });',
  });
  expect(dependencyGraph(['scenario.tsx'], root).unknown).toContain('Navigation.tsx: Document-relative or dynamic JSX resource');
});

it.each([
  ['a later native-element spread', 'return <a href={href} {...other} />;'],
  ['a shadowed binding', 'return (() => { const href = path; return <a href={href} />; })();'],
  ['a redeclared parameter', 'var href = "/unowned"; return <a href={href} />;'],
])('rejects unproven native forwarding through %s', (_name, callback) => {
  const root = navigationFixture('export const view = <Destination href="#known" />;', callback);
  expect(dependencyGraph(['scenario.tsx'], root).unknown).toContain('Navigation.tsx: Document-relative or dynamic JSX resource');
});

it('selects only the theme suite for its private coexistence scenario', () => {
  const result = selectBrowserTests({ ...repositoryOwnership, changes: [{ path: 'tests/browser-harness/scenarios/Themes.tsx', status: 'M' }] });
  expect(result.mode).toBe('selected');
  expect(result.suites).toEqual([{ project: 'components', file: 'tests/browser-harness/specs/themes/themes.spec.ts' }]);
});
