import { afterEach, expect, it, vi } from 'vitest';
import { affectedMain, affectedRun } from '../../../scripts/affected-run.mjs';
import { discoverChanges } from '../../../scripts/affected-git.mjs';
import { openVitest } from '../../../scripts/affected-vitest.mjs';

vi.mock('../../../scripts/affected-git.mjs', () => ({ discoverChanges: vi.fn() }));
vi.mock('../../../scripts/affected-vitest.mjs', () => ({ openVitest: vi.fn() }));
afterEach(() => vi.restoreAllMocks());

/**
 * Model one selected test without filesystem or runner work.
 **/
function boundaries() {
  const info = { root: '/repo', base: 'HEAD', resolvedBase: 'head', head: 'head', mergeBase: 'head', changes: [{ path: 'src/example.ts', status: 'M' }], fallback: null };
  const runner = { inventory: ['example.test.ts'], owners: new Map([['src/example.ts', ['example.test.ts']]]), run: vi.fn().mockResolvedValue(0), close: vi.fn() };
  return { info, runner, write: vi.fn(), cwd: '/repo', discover: () => info, open: async () => runner };
}

it('uses the default boundaries for successful command execution', async () => {
  // arrange
  const given = boundaries();
  vi.mocked(discoverChanges).mockReturnValue(given.info);
  vi.mocked(openVitest).mockResolvedValue(given.runner);
  vi.spyOn(console, 'log').mockImplementation(() => {});

  // act
  const result = await affectedMain(['unit', '--base', 'HEAD']);

  // assert
  expect(result).toBe(0);
  expect(given.runner.run).toHaveBeenCalledWith(['example.test.ts']);
  expect(given.runner.close).toHaveBeenCalledOnce();
});

it('explains a dry run without executing selected tests', async () => {
  // arrange
  const given = boundaries();

  // act
  const result = await affectedRun(['integration', '--base', 'HEAD', '--dry-run'], given);

  // assert
  expect(result).toBe(0);
  expect(given.write).toHaveBeenCalledWith(expect.stringContaining('Affected integration: selected'));
  expect(given.runner.run).not.toHaveBeenCalled();
  expect(given.runner.close).toHaveBeenCalledOnce();
});

it('reports a safely empty selection without accidentally running the project', async () => {
  // arrange
  const given = boundaries();
  given.info.changes = [];

  // act
  const result = await affectedRun(['unit', '--base', 'HEAD'], given);

  // assert
  expect(result).toBe(0);
  expect(given.write).toHaveBeenCalledWith(expect.stringContaining('safely-empty'));
  expect(given.runner.run).not.toHaveBeenCalled();
});

it('explains and executes the complete project for unavailable history', async () => {
  // arrange
  const given = boundaries();
  given.info.fallback = 'Comparison history unavailable';

  // act
  const result = await affectedRun(['unit', '--base', 'HEAD'], given);

  // assert
  expect(result).toBe(0);
  expect(given.write).toHaveBeenCalledWith(expect.stringContaining('Comparison history unavailable'));
  expect(given.runner.run).toHaveBeenCalledWith(given.runner.inventory);
});

it('closes the runner after an execution error', async () => {
  // arrange
  const given = boundaries();
  given.runner.run.mockRejectedValue(new Error('worker failed'));

  // act
  const act = affectedRun(['unit', '--base', 'HEAD'], given);

  // assert
  await expect(act).rejects.toThrow('worker failed');
  expect(given.runner.close).toHaveBeenCalledOnce();
});

it('returns an actionable nonzero status for invocation errors', async () => {
  // arrange
  const write = vi.spyOn(console, 'error').mockImplementation(() => {});

  // act
  const result = await affectedMain([], async () => { throw new Error('Required: --base'); });

  // assert
  expect(result).toBe(1);
  expect(write).toHaveBeenCalledWith('Affected tests failed: Required: --base');
});
