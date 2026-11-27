import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { dependencyGraph } from './graph.mjs';
import ts from 'typescript';
import { createHash } from 'node:crypto';

const directories = { components: 'tests/browser-harness/specs', chromium: 'tests/e2e' };

/**
 * Enumerate authored files without importing test bodies or running build tools.
 **/
export function filesUnder(root, directory) {
  if (!existsSync(resolve(root, directory))) {
    throw new Error(`Missing inventory directory: ${directory}`);
  }
  return readdirSync(resolve(root, directory), { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) =>
      resolve(entry.parentPath, entry.name)
        .slice(root.length + 1)
        .replaceAll('\\', '/'),
    )
    .sort();
}

/**
 * Mirror the deliberately simple, disjoint Playwright file patterns without execution.
 **/
export function discoverInventory(root) {
  readCatalog(root);
  return Object.entries(directories)
    .flatMap(([project, directory]) =>
      filesUnder(root, directory)
        .filter((file) => file.endsWith('.spec.ts'))
        .map((file) => ({ project, file })),
    )
    .sort((a, b) => a.project.localeCompare(b.project) || a.file.localeCompare(b.file));
}

/**
 * Reject malformed metadata; stale ownership with a valid inventory broadens selection.
 **/
function readCatalog(root) {
  const catalog = JSON.parse(
    readFileSync(resolve(root, 'tests/browser-harness/catalog.json'), 'utf8'),
  );
  if (!catalog.scenarios || !Array.isArray(catalog.suites)) {
    throw new Error('Invalid browser ownership catalog');
  }
  validateDiscovery(catalog.discovery, root);
  for (const suite of catalog.suites) {
    if (
      typeof suite.file !== 'string' ||
      !directories[suite.project] ||
      !Array.isArray(suite.scenarios)
    ) {
      throw new Error('Invalid browser suite declaration');
    }
  }
  for (const entry of Object.values(catalog.scenarios)) {
    if (
      !entry ||
      typeof entry.module !== 'string' ||
      typeof entry.export !== 'string' ||
      !/^tests\/browser-harness\/scenarios\/[^/]+\.tsx$/.test(entry.module)
    ) {
      throw new Error('Invalid scenario module declaration');
    }
  }
  return catalog;
}

/**
 * Refuse a potentially incomplete static inventory when its audited runner config drifts.
 **/
function validateDiscovery(discovery, root) {
  for (const file of ['playwright.config.ts', 'playwright.components.config.ts']) {
    const actual = createHash('sha256')
      .update(readFileSync(resolve(root, file)))
      .digest('hex');
    if (discovery?.[file] !== actual) {
      throw new Error(
        `Discovery configuration changed: ${file}. Audit Playwright --list against static inventory, then update catalog.discovery.`,
      );
    }
  }
}

/**
 * Conservatively own the entire served runtime for legacy suites sharing preview CSS.
 **/
function legacyGraph(root) {
  const files = ['src', 'stories', '.storybook', 'tests/fixtures'].flatMap((directory) =>
    filesUnder(root, directory),
  );
  return { files, unknown: [] };
}

/**
 * Resolve each harness suite through its declared scenario entries and local resources.
 **/
function scenarioGraph(suite, catalog, root) {
  const missing = suite.scenarios.filter((id) => !catalog.scenarios[id]);
  const entries = suite.scenarios.flatMap((id) => catalog.scenarios[id]?.module ?? []);
  const graph = dependencyGraph(
    [...entries, ...(suite.roots ?? []), ...(suite.resources ?? [])],
    root,
  );
  graph.unknown.push(...missing.map((id) => `Missing scenario declaration: ${id}`));
  graph.unknown.push(
    ...suite.scenarios.flatMap((id) => validateExport(catalog.scenarios[id], root)),
  );
  return graph;
}

/**
 * Check the static scenario export shape without importing or evaluating its module.
 **/
function validateExport(entry, root) {
  if (!entry || !existsSync(resolve(root, entry.module))) {
    return [];
  }
  const ast = ts.createSourceFile(
    entry.module,
    readFileSync(resolve(root, entry.module), 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const declaration = ast.statements
    .filter(ts.isVariableStatement)
    .flatMap((node) => node.declarationList.declarations)
    .find((node) => node.name.getText(ast) === 'scenarios');
  const expression = declaration?.initializer;
  const found =
    expression &&
    ts.isObjectLiteralExpression(expression) &&
    expression.properties.some((property) => property.name?.getText(ast) === entry.export);
  return found ? [] : [`Missing or unsupported scenario export: ${entry.module}#${entry.export}`];
}

/**
 * Compare static ownership against every discovered suite, retaining new/unmapped files.
 **/
export function discoverOwnership(root) {
  const inventory = discoverInventory(root);
  const catalog = readCatalog(root);
  const graphs = new Map();
  const ownershipIssues = [];
  const legacy = legacyGraph(root);
  for (const suite of inventory) {
    const owners = catalog.suites.filter(
      (owner) => owner.file === suite.file && owner.project === suite.project,
    );
    if (owners.length !== 1) {
      ownershipIssues.push(`Expected one owner for ${suite.file}`);
      continue;
    }
    const owner = owners[0];
    graphs.set(
      suite.file,
      suite.project === 'chromium' && owner.scope === 'storybook-runtime'
        ? legacy
        : scenarioGraph(owner, catalog, root),
    );
  }
  checkDeclarations({ catalog, inventory, ownershipIssues });
  return { inventory, graphs, ownershipIssues };
}

/**
 * Stale entries and unowned scenarios cannot silently disappear from affected runs.
 **/
function checkDeclarations({ catalog, inventory, ownershipIssues }) {
  for (const owner of catalog.suites) {
    if (!inventory.some((suite) => suite.file === owner.file && suite.project === owner.project)) {
      ownershipIssues.push(`Stale suite declaration: ${owner.file}`);
    }
    if (owner.project === 'chromium' && owner.scope !== 'storybook-runtime') {
      ownershipIssues.push(`Unproven legacy ownership: ${owner.file}`);
    }
  }
  for (const id of Object.keys(catalog.scenarios)) {
    if (!catalog.suites.some((suite) => suite.scenarios.includes(id))) {
      ownershipIssues.push(`Unowned scenario: ${id}`);
    }
  }
}
