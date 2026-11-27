import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  cpSync,
  existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, expect, it } from 'vitest';
import {
  discoverInventory,
  discoverOwnership,
} from '../../browser-harness/selection/inventory.mjs';
import { discoverBrowserSelection } from '../../browser-harness/selection/discover.mjs';
import { gitOutput } from '../../../scripts/affected-git.mjs';
import { createHash } from 'node:crypto';

const root = process.cwd();
const temporary = [];
afterEach(() => {
  temporary.splice(0).forEach((path) => rmSync(path, { recursive: true, force: true }));
});

/**
 * Set up isolated discovery inputs, including a test body that must never execute.
 **/
function repository() {
  const directory = mkdtempSync(join(tmpdir(), 'browser-discovery-'));
  temporary.push(directory);
  for (const folder of [
    'src',
    'stories',
    '.storybook',
    'tests/fixtures',
    'tests/e2e',
    'tests/browser-harness/specs',
    'tests/browser-harness/scenarios',
  ]) {
    mkdirSync(join(directory, folder), { recursive: true });
  }
  writeFileSync(
    join(directory, 'tests/e2e/example.spec.ts'),
    'throw new Error("Do not execute test bodies during discovery");',
  );
  const discovery = {};
  for (const name of ['playwright.config.ts', 'playwright.components.config.ts']) {
    cpSync(join(root, name), join(directory, name));
    discovery[name] = createHash('sha256')
      .update(readFileSync(join(directory, name)))
      .digest('hex');
  }
  writeFileSync(
    join(directory, 'tests/browser-harness/catalog.json'),
    JSON.stringify({
      discovery,
      scenarios: {},
      suites: [
        {
          project: 'chromium',
          file: 'tests/e2e/example.spec.ts',
          scope: 'storybook-runtime',
          scenarios: [],
        },
      ],
    }),
  );
  gitOutput(['init', '-q'], directory);
  gitOutput(['config', 'user.name', 'Test'], directory);
  gitOutput(['config', 'user.email', 'test@example.test'], directory);
  gitOutput(['add', '.'], directory);
  gitOutput(['-c', 'commit.gpgsign=false', 'commit', '-qm', 'baseline'], directory);
  return directory;
}

it('matches actual Playwright project/file discovery exactly once across both configurations', () => {
  const actual = [];
  for (const config of ['playwright.components.config.ts', 'playwright.config.ts']) {
    const output = execFileSync(
      process.execPath,
      [
        'node_modules/@playwright/test/cli.js',
        'test',
        '--config',
        config,
        '--list',
        '--reporter=json',
      ],
      { cwd: root, encoding: 'utf8' },
    );
    const report = JSON.parse(output);
    const visit = (suite) => {
      for (const spec of suite.specs ?? []) {
        for (const test of spec.tests) {
          actual.push({
            file: `${report.config.rootDir}/${spec.file}`.slice(root.length + 1),
            project: test.projectName,
          });
        }
      }
      suite.suites?.forEach(visit);
    };
    report.suites.forEach(visit);
  }
  const unique = [
    ...new Map(actual.map((suite) => [`${suite.project}:${suite.file}`, suite])).values(),
  ].sort((a, b) => a.project.localeCompare(b.project) || a.file.localeCompare(b.file));
  expect(unique).toEqual(discoverInventory(root));
  expect(new Set(unique.map((suite) => suite.file)).size).toBe(unique.length);
}, 20000);

it('includes mixed branch/index/worktree/untracked paths, rename names, deletion and whitespace', () => {
  const directory = repository();
  writeFileSync(join(directory, 'src/with spaces.ts'), 'first');
  gitOutput(['add', '.'], directory);
  gitOutput(['-c', 'commit.gpgsign=false', 'commit', '-qm', 'branch'], directory);
  gitOutput(['mv', 'src/with spaces.ts', 'src/renamed.ts'], directory);
  writeFileSync(join(directory, 'src/renamed.ts'), 'unstaged');
  writeFileSync(join(directory, 'tests/e2e/new spec.spec.ts'), 'throw 1;');
  const plan = discoverBrowserSelection('HEAD~1', directory);
  expect(plan.changes.map((change) => change.path)).toEqual(
    expect.arrayContaining(['src/with spaces.ts', 'src/renamed.ts', 'tests/e2e/new spec.spec.ts']),
  );
  expect(plan.mode).toBe('full-fallback');
  expect(plan.suites.map((suite) => suite.file)).toContain('tests/e2e/new spec.spec.ts');
  rmSync(join(directory, 'src/renamed.ts'));
  expect(discoverBrowserSelection('HEAD~1', directory).changes).toContainEqual({
    path: 'src/renamed.ts',
    status: 'D',
  });
});

it('distinguishes unavailable history, stale ownership, invalid metadata and non-Git errors', () => {
  const directory = repository();
  expect(discoverBrowserSelection('missing-ref', directory).mode).toBe('full-fallback');
  const catalog = JSON.parse(
    readFileSync(join(directory, 'tests/browser-harness/catalog.json'), 'utf8'),
  );
  catalog.suites[0].file = 'tests/e2e/removed.spec.ts';
  writeFileSync(join(directory, 'tests/browser-harness/catalog.json'), JSON.stringify(catalog));
  expect(discoverOwnership(directory).ownershipIssues).toEqual(
    expect.arrayContaining([
      'Expected one owner for tests/e2e/example.spec.ts',
      'Stale suite declaration: tests/e2e/removed.spec.ts',
    ]),
  );
  writeFileSync(join(directory, 'tests/browser-harness/catalog.json'), '{}');
  expect(() => discoverBrowserSelection('HEAD', directory)).toThrow(
    'Invalid browser ownership catalog',
  );
  rmSync(join(directory, '.git'), { recursive: true });
  expect(() => discoverBrowserSelection('HEAD', directory)).toThrow();
});

it('dry-run CLI neither evaluates test bodies nor writes tokens, caches, reports or browser artifacts', () => {
  const directory = repository();
  mkdirSync(join(directory, 'scripts'));
  cpSync(join(root, 'scripts/affected-git.mjs'), join(directory, 'scripts/affected-git.mjs'));
  // Run the repository-owned CLI against the disposable cwd; dependency imports stay local to the CLI.
  const before = readFileSync(join(directory, 'tests/browser-harness/catalog.json'), 'utf8');
  const output = execFileSync(
    process.execPath,
    [resolve(root, 'tests/browser-harness/affected.mjs'), '--base', 'HEAD', '--dry-run'],
    { cwd: directory, encoding: 'utf8' },
  );
  const plan = JSON.parse(output);
  expect(plan.mode).toBe('full-fallback');
  expect(plan.suites).toEqual([{ project: 'chromium', file: 'tests/e2e/example.spec.ts' }]);
  expect(readFileSync(join(directory, 'tests/browser-harness/catalog.json'), 'utf8')).toBe(before);
  for (const path of [
    'coverage',
    'node_modules',
    'src/generated',
    'test-results',
    'playwright-report',
  ]) {
    expect(existsSync(join(directory, path))).toBe(false);
  }
  expect(
    JSON.parse(
      execFileSync(
        process.execPath,
        [resolve(root, 'tests/browser-harness/affected.mjs'), '--base', 'HEAD', '--dry-run'],
        { cwd: directory, encoding: 'utf8' },
      ),
    ),
  ).toEqual(plan);
});

it('detects missing scenario exports and rejects invalid module declarations', () => {
  const directory = repository();
  const file = join(directory, 'tests/browser-harness/catalog.json');
  const catalog = JSON.parse(readFileSync(file, 'utf8'));
  catalog.scenarios['fixture--missing'] = {
    module: 'tests/browser-harness/scenarios/Fixture.tsx',
    export: 'Missing',
  };
  catalog.suites.push({
    project: 'components',
    file: 'tests/browser-harness/specs/fixture.spec.ts',
    scenarios: ['fixture--missing'],
  });
  writeFileSync(join(directory, 'tests/browser-harness/specs/fixture.spec.ts'), 'throw 1;');
  writeFileSync(
    join(directory, 'tests/browser-harness/scenarios/Fixture.tsx'),
    'export const scenarios = {};',
  );
  writeFileSync(file, JSON.stringify(catalog));
  expect(discoverBrowserSelection('HEAD', directory).ownershipIssues).toContain(
    'Missing or unsupported scenario export: tests/browser-harness/scenarios/Fixture.tsx#Missing',
  );
  catalog.scenarios['fixture--missing'].module = '../outside.ts';
  writeFileSync(file, JSON.stringify(catalog));
  expect(() => discoverOwnership(directory)).toThrow('Invalid scenario module declaration');
});

it('fails instead of claiming a complete inventory after runner discovery configuration changes', () => {
  const directory = repository();
  writeFileSync(
    join(directory, 'playwright.config.ts'),
    'export default { testDir: "elsewhere" };',
  );
  expect(() => discoverBrowserSelection('HEAD', directory)).toThrow(
    'Discovery configuration changed',
  );
});
