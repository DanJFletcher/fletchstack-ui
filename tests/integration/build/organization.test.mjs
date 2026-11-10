import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';
import { inScope } from '../../e2e/coverage/report.mjs';

const baseline = JSON.parse(await readFile('tests/fixtures/component-organization-baseline.json', 'utf8'));
const paths = JSON.parse(await readFile('tests/fixtures/component-organization-paths.json', 'utf8'));

/**
 * Inventory actual files recursively, including modules no test has imported.
 **/
async function inventory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const descendants = entries.map(entry => entry.isDirectory()
    ? inventory(`${directory}/${entry.name}`) : `${directory}/${entry.name}`);

  return (await Promise.all(descendants)).flat();
}

/**
 * Resolve a frozen pre-migration path through the explicit relocation map.
 **/
function relocated(path) {
  return paths[path] ?? path;
}

it('retains every production module after relocation', async () => {
  // arrange
  const expected = [...baseline.production.map(relocated), 'src/components/radio/Radio.tsx', 'src/components/link/Link.tsx', 'src/components/switch/Switch.tsx', 'src/components/spinner/Spinner.tsx', 'src/components/badge/Badge.tsx', 'src/components/separator/Separator.tsx', 'src/components/container/Container.tsx', 'src/components/stack/Stack.tsx', 'src/components/cluster/Cluster.tsx', 'src/components/simple-grid/SimpleGrid.tsx', 'src/components/aspect-ratio/AspectRatio.tsx', 'src/components/section/Section.tsx'].sort();

  // act
  const result = (await inventory('src')).filter(path => /\.tsx?$/.test(path)
    && !/(?:__tests__|stories)\//.test(path)).sort();

  // assert
  expect(result.filter(path => !path.endsWith('/index.ts'))).toEqual(expected.filter(path => !path.endsWith('/index.ts')));
});

it('retains the complete pre-migration browser runtime inventory', async () => {
  // arrange
  const expected = baseline.browser.map(relocated).sort();

  // act
  const result = (await Promise.all(['src', 'stories', '.storybook'].map(inventory))).flat().filter(inScope);

  // assert
  expect(result).toEqual(expect.arrayContaining(expected));
});

it('retains every existing test file exactly once', async () => {
  // arrange
  const expected = baseline.tests.map(relocated);

  // act
  const result = (await Promise.all(['src', 'tests'].map(inventory))).flat()
    .filter(path => /\.(?:test\.(?:ts|tsx|mjs)|spec.ts)$/.test(path));

  // assert
  expect(result).toEqual(expect.arrayContaining(expected));
  expect(new Set(expected).size).toBe(expected.length);
  expect(result.filter(path => paths[path] && paths[path] !== path)).toEqual([]);
});

it.each(Object.entries(baseline.hashes).filter(([path]) => path.startsWith('src/') && path.endsWith('.css')))(
  'preserves stylesheet contents for %s', async (path, expected) => {
    // arrange
    const destination = relocated(path);

    // act
    const content = await readFile(destination, 'utf8');
    // Radio, Link, Switch, Spinner, Badge, Separator, Container, SimpleGrid and Section add semantic properties while every legacy token declaration remains frozen.
    const legacy = destination === 'src/generated/tokens.css' ? content.replace(/^.*--fs-(?:radio|link|switch|spinner|badge|separator|container|simple-grid|section)-.*\n/gm, '') : content;
    const result = createHash('sha256').update(legacy).digest('hex');

    // assert
    expect(result).toBe(expected);
  },
);

it('preserves public runtime and type export declarations', async () => {
  // arrange
  const expected = baseline.publicExports.replace(/from '[^']+'/g, 'from OWNER');

  // act
  const result = (await readFile('src/index.ts', 'utf8')).replace(/^.*from '.\/components\/(?:radio|link|switch|spinner|badge|separator|container|stack|cluster|simple-grid|aspect-ratio|section)\/index.js';\n/gm, '').replace(/from '[^']+'/g, 'from OWNER');

  // assert
  expect(result).toBe(expected);
});

it('preserves package export entrypoints', async () => {
  // arrange
  const expected = { ...baseline.packageExports, './radio.css': './dist/radio.css', './link.css': './dist/link.css', './switch.css': './dist/switch.css', './spinner.css': './dist/spinner.css', './badge.css': './dist/badge.css', './separator.css': './dist/separator.css', './container.css': './dist/container.css', './stack.css': './dist/stack.css', './cluster.css': './dist/cluster.css', './simple-grid.css': './dist/simple-grid.css', './aspect-ratio.css': './dist/aspect-ratio.css', './section.css': './dist/section.css' };

  // act
  const result = JSON.parse(await readFile('package.json', 'utf8')).exports;

  // assert
  expect(result).toEqual(expected);
});

it('excludes development modules from emitted package files', async () => {
  // arrange
  const forbidden = /(?:__tests__|stories|fixtures|storybook|icon-catalog|icon-gallery|\.test\.)/;

  // act
  const result = await inventory('dist');

  // assert
  expect(result.filter(path => forbidden.test(path))).toEqual([]);
});
