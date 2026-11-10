import { afterEach, expect, it, vi } from 'vitest';
import { discoverChanges, gitOutput, parseChanges } from '../../../scripts/affected-git.mjs';
import { execFileSync } from 'node:child_process';

vi.mock('node:child_process', () => ({ execFileSync: vi.fn() }));
afterEach(() => vi.resetAllMocks());

it('invokes Git without a shell and preserves raw path delimiters', () => {
  // arrange
  vi.mocked(execFileSync).mockReturnValue('M\0file name.ts\0');

  // act
  const result = gitOutput(['diff', '-z'], '/repo');

  // assert
  expect(result).toBe('M\0file name.ts\0');
  expect(execFileSync).toHaveBeenCalledWith('git', ['diff', '-z'], expect.objectContaining({ cwd: '/repo', encoding: 'utf8' }));
});

it('retains both rename paths and copies', () => {
  // arrange
  const given = 'R100\0old name.ts\0new name.ts\0C100\0source.ts\0copy.ts\0D\0gone.ts\0';

  // act
  const result = parseChanges(given);

  // assert
  expect(result.map(item => item.path)).toEqual(['old name.ts', 'new name.ts', 'source.ts', 'copy.ts', 'gone.ts']);
});

it('rejects an incomplete Git record', () => {
  // arrange
  const given = 'R100\0old.ts\0';

  // act
  const act = () => parseChanges(given);

  // assert
  expect(act).toThrow('Incomplete Git');
});

it('unions separate Git changes without cancelling paths', () => {
  // arrange
  const git = vi.fn().mockReturnValueOnce('/repo\n').mockReturnValueOnce('head\n').mockReturnValueOnce('base\n').mockReturnValueOnce('merge\n')
    .mockReturnValueOnce('M\0same.ts\0M\0alpha.ts\0').mockReturnValueOnce('M\0same.ts\0').mockReturnValueOnce('D\0same.ts\0').mockReturnValueOnce('new file.ts\0');

  // act
  const result = discoverChanges('main', '/repo', git);

  // assert
  expect(result.changes).toEqual([{ path: 'alpha.ts', status: 'M' }, { path: 'new file.ts', status: '?' }, { path: 'same.ts', status: 'D' }, { path: 'same.ts', status: 'M' }]);
});

/**
 * Supply successful identity lookups followed by an unavailable comparison result.
 **/
function missingComparison(prefix) {
  const git = vi.fn(() => { throw Object.assign(new Error('unavailable'), { status: 1 }); });
  prefix.forEach(value => git.mockReturnValueOnce(value));
  return git;
}

it.each([{ prefix: ['/repo', 'head'] }, { prefix: ['/repo', 'head', 'base'] }])('falls back when comparison lookup %# has no result', ({ prefix }) => {
  // arrange
  const git = missingComparison(prefix);

  // act
  const result = discoverChanges('missing', '/repo', git);

  // assert
  expect(result.fallback).toContain('history unavailable');
});

it('does not disguise Git operational errors as missing history', () => {
  // arrange
  const git = vi.fn().mockReturnValueOnce('/repo').mockReturnValueOnce('head').mockImplementationOnce(() => { throw Object.assign(new Error('permission denied'), { status: 128 }); });

  // act
  const act = () => discoverChanges('main', '/repo', git);

  // assert
  expect(act).toThrow('permission denied');
});
