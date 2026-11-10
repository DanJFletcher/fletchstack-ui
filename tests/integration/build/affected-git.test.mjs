import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeEach, afterEach, expect, it } from 'vitest';
import { discoverChanges, gitOutput, parseChanges } from '../../../scripts/affected-git.mjs';
import { parseOptions } from '../../../scripts/affected-options.mjs';

let root;
beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'affected-git-'));
  gitOutput(['init', '-q'], root);
  gitOutput(['config', 'user.name', 'Test Author'], root);
  gitOutput(['config', 'user.email', 'author@example.test'], root);
  await writeFile(join(root, 'same name.ts'), 'original');
  await writeFile(join(root, '.gitignore'), 'ignored.ts\n');
  gitOutput(['add', '.'], root);
  gitOutput(['-c', 'commit.gpgsign=false', 'commit', '-qm', 'baseline'], root);
});
afterEach(async () => { await rm(root, { recursive: true, force: true }); });

it('retains committed paths even when staged and unstaged edits undo them', async () => {
  // arrange
  const base = gitOutput(['rev-parse', 'HEAD'], root).trim();
  await writeFile(join(root, 'same name.ts'), 'branch');
  gitOutput(['add', '.'], root);
  gitOutput(['-c', 'commit.gpgsign=false', 'commit', '-qm', 'branch change'], root);
  await writeFile(join(root, 'same name.ts'), 'staged');
  gitOutput(['add', '.'], root);
  await writeFile(join(root, 'same name.ts'), 'original');
  await writeFile(join(root, 'new test.ts'), 'new');
  await writeFile(join(root, 'ignored.ts'), 'ignored');

  // act
  const result = discoverChanges(base, root);

  // assert
  expect(result.changes).toEqual([{ path: 'new test.ts', status: '?' }, { path: 'same name.ts', status: 'M' }]);
});

it('reports both names of a staged rename', () => {
  // arrange
  gitOutput(['mv', 'same name.ts', 'renamed.ts'], root);

  // act
  const result = discoverChanges('HEAD', root);

  // assert
  expect(result.changes).toEqual([{ path: 'renamed.ts', status: 'R100' }, { path: 'same name.ts', status: 'R100' }]);
});

it('reports deleted runtime paths', () => {
  // arrange
  gitOutput(['rm', 'same name.ts'], root);

  // act
  const result = discoverChanges('HEAD', root);

  // assert
  expect(result.changes).toEqual([{ path: 'same name.ts', status: 'D' }]);
});

it('retains overlapping staged rename and unstaged deletion records', async () => {
  // arrange
  gitOutput(['mv', 'same name.ts', 'renamed.ts'], root);
  await rm(join(root, 'renamed.ts'));

  // act
  const result = discoverChanges('HEAD', root);

  // assert
  expect(result.changes).toEqual([{ path: 'renamed.ts', status: 'D' }, { path: 'renamed.ts', status: 'R100' }, { path: 'same name.ts', status: 'R100' }]);
});

it('falls back for an unavailable ref', () => {
  // arrange
  const given = 'not-available';

  // act
  const result = discoverChanges(given, root);

  // assert
  expect(result).toMatchObject({ resolvedBase: null, mergeBase: null, changes: [], fallback: expect.stringContaining('history unavailable') });
});

it('falls back when histories have no common ancestor', async () => {
  // arrange
  const base = gitOutput(['rev-parse', 'HEAD'], root).trim();
  gitOutput(['checkout', '--orphan', 'unrelated'], root);
  gitOutput(['rm', '-rf', '.'], root);
  await writeFile(join(root, 'other.ts'), 'unrelated');
  gitOutput(['add', '.'], root);
  gitOutput(['-c', 'commit.gpgsign=false', 'commit', '-qm', 'unrelated'], root);

  // act
  const result = discoverChanges(base, root);

  // assert
  expect(result.mergeBase).toBeNull();
  expect(result.fallback).toContain('history unavailable');
});

it('fails outside a Git repository', async () => {
  // arrange
  await rm(join(root, '.git'), { recursive: true });

  // act
  const act = () => discoverChanges('HEAD', root);

  // assert
  expect(act).toThrow();
});

it('surfaces a broken comparison command', () => {
  // arrange
  const git = (args, cwd) => {
    if (args.includes('--quiet')) { throw Object.assign(new Error('repository unreadable'), { status: 128 }); }
    return gitOutput(args, cwd);
  };

  // act
  const act = () => discoverChanges('HEAD', root, git);

  // assert
  expect(act).toThrow('repository unreadable');
});

it('rejects truncated rename data', () => {
  // arrange
  const given = 'C100\0source.ts\0';

  // act
  const act = () => parseChanges(given);

  // assert
  expect(act).toThrow('Incomplete Git');
});

it.each([
  [['unit', '--base', 'HEAD'], { project: 'unit', base: 'HEAD', dryRun: false }],
  [['integration', '--dry-run', '--base', 'HEAD'], { project: 'integration', base: 'HEAD', dryRun: true }],
])('accepts supported invocation %j', (given, expected) => {
  // arrange

  // act
  const result = parseOptions(given);

  // assert
  expect(result).toEqual(expected);
});

it.each([[], ['unit'], ['unit', '--base'], ['e2e'], ['unit', '--base', 'HEAD', '--config', 'other'], ['unit', '--base', 'HEAD', '--dry-run', '--dry-run']])('rejects unsupported invocation %j', (...given) => {
  // arrange

  // act
  const act = () => parseOptions(given);

  // assert
  expect(act).toThrow();
});
