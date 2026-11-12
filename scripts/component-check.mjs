import { namedExports, scenarioNames } from './component-registration.mjs';
import { requiredFile } from './component-plan.mjs';

/**
 * Record duplicated inventory identities without silently coalescing them.
 **/
function duplicates(values, label, issues) {
  const seen = new Set();
  for (const value of values) { if (seen.has(value)) { issues.push(`Duplicate ${label}: ${value}`); } seen.add(value); }
}

/**
 * Compare all explicit public declarations with inventory identities and source targets.
 **/
function checkExports(families, source, issues) {
  const actual = namedExports(source);
  const expected = families.flatMap(family => ['runtime', 'types'].flatMap(kind => family.exports[kind].map(name => ({ name, type: kind === 'types', target: `./${family.entry.slice(4).replace(/\.ts$/, '.js')}` }))));
  duplicates(actual.map(entry => entry.name), 'public export', issues);
  for (const entry of expected) {
    if (!actual.some(item => JSON.stringify(item) === JSON.stringify(entry))) { issues.push(`Missing or mismatched export: ${entry.name}`); }
  }
  for (const entry of actual) { if (!expected.some(item => item.name === entry.name)) { issues.push(`Unregistered export: ${entry.name}`); } }
}

/**
 * Check source and style publication without deriving behavioral assertions from inventory.
 **/
function checkFamily(family, files, manifest, issues) {
  for (const path of [family.entry, ...family.modules]) { if (!Object.hasOwn(files, path)) { issues.push(`Missing source: ${path}`); } }
  if (Object.hasOwn(files, family.entry)) {
    const local = namedExports(files[family.entry]).map(entry => `${entry.type ? 'type ' : ''}${entry.name}`).sort();
    const expected = [...family.exports.runtime, ...family.exports.types.map(name => `type ${name}`)].sort();
    if (JSON.stringify(local) !== JSON.stringify(expected)) { issues.push(`Mismatched component entrypoint: ${family.entry}`); }
  }
  if (!family.style) { return; }
  if (!Object.hasOwn(files, family.style)) { issues.push(`Missing stylesheet: ${family.style}`); }
  const name = family.style.split('/').at(-1);
  if (manifest.exports[`./${name}`] !== `./dist/${name}`) { issues.push(`Mismatched CSS export: ${name}`); }
  if (!requiredFile(files, '.storybook/preview.tsx').includes(`'../${family.style}'`)) { issues.push(`Missing preview style: ${family.style}`); }
}

/**
 * Identify stale catalog entries and owners instead of treating them as empty success.
 **/
function checkCatalog(catalog, files, issues) {
  duplicates(catalog.suites.map(suite => suite.file), 'suite', issues);
  for (const suite of catalog.suites) {
    if (suite.project === 'components' && !Object.hasOwn(files, suite.file)) { issues.push(`Missing suite: ${suite.file}`); }
    for (const id of suite.scenarios) { if (!catalog.scenarios[id]) { issues.push(`Missing scenario: ${id}`); } }
  }
  for (const [id, scenario] of Object.entries(catalog.scenarios)) {
    if (!Object.hasOwn(files, scenario.module)) { issues.push(`Missing scenario module: ${scenario.module}`); }
    else if (!scenarioNames(files[scenario.module]).includes(scenario.export)) { issues.push(`Missing scenario export: ${id}`); }
    if (!catalog.suites.some(suite => suite.scenarios.includes(id))) { issues.push(`Missing scenario owner: ${id}`); }
  }
}

/**
 * Report missing authoring artifacts and unresolved markers for the requested family.
 **/
function checkAuthoring(family, files, issues) {
  const paths = Object.keys(files).filter(path => path.startsWith(`src/components/${family.slug}/`) || path === `docs/${family.slug}.md`);
  if (!Object.hasOwn(files, `docs/${family.slug}.md`)) { issues.push(`Missing documentation: docs/${family.slug}.md`); }
  if (!paths.some(path => path.endsWith('.stories.tsx'))) { issues.push(`Missing stories: ${family.slug}`); }
  if (!paths.some(path => path.includes('/__tests__/'))) { issues.push(`Missing authored DOM tests: ${family.slug}`); }
  if (family.examples && !Object.hasOwn(files, family.examples)) { issues.push(`Missing shared examples: ${family.examples}`); }
  for (const path of paths) { if (files[path].includes('COMPONENT_TODO')) { issues.push(`Unfinished scaffold: ${path}`); } }
}

/**
 * Validate global wiring and requested-family readiness; a pass does not certify behavior.
 **/
export function checkComponent(files, name) {
  const { families, internalModules } = JSON.parse(requiredFile(files, 'scripts/component-inventory.json'));
  const issues = [];
  duplicates(families.map(family => family.slug), 'family', issues);
  duplicates(families.filter(family => family.style).map(family => family.style), 'stylesheet', issues);
  checkExports(families, requiredFile(files, 'src/index.ts'), issues);
  const manifest = JSON.parse(requiredFile(files, 'package.json'));
  for (const family of families) { checkFamily(family, files, manifest, issues); }
  const known = new Set(['src/index.ts', ...internalModules, ...families.flatMap(family => [family.entry, ...family.modules])]);
  for (const path of Object.keys(files).filter(path => /^src\/.*\.tsx?$/.test(path) && !/(?:stories|__tests__)\//.test(path))) { if (!known.has(path)) { issues.push(`Unclassified production module: ${path}`); } }
  checkCatalog(JSON.parse(requiredFile(files, 'tests/browser-harness/catalog.json')), files, issues);
  const family = families.find(family => family.exports.runtime.includes(name));
  if (!family) { issues.push(`Unknown component: ${name}`); } else { checkAuthoring(family, files, issues); }
  return issues;
}
