import { EventEmitter } from 'node:events';
import { expect, it, vi } from 'vitest';
import { executeSelection, runProject } from '../../browser-harness/selection/execute.mjs';
import { completeOptions } from '../../browser-harness/selection/complete-options.mjs';

const suites = [
  { project: 'components', file: 'tests/a (copy).spec.ts' },
  { project: 'chromium', file: 'tests/b.spec.ts' },
];

it('continues mixed selections after failure and preserves the nonzero result', async () => {
  // arrange
  const run = vi.fn().mockResolvedValueOnce({ code: 1 }).mockResolvedValueOnce({ code: 0 });

  // act
  const result = await executeSelection({ root: '/repo', suites }, run);

  // assert
  expect(result).toBe(1);
  expect(run.mock.calls.map(([request]) => request.project)).toEqual(['components', 'chromium']);
});

it('stops subsequent projects after interruption', async () => {
  // arrange
  const run = vi.fn().mockResolvedValue({ code: 130, interrupted: true });

  // act
  const result = await executeSelection({ root: '/repo', suites }, run);

  // assert
  expect(result).toBe(130);
  expect(run).toHaveBeenCalledOnce();
});

it('starts only the selected legacy project', async () => {
  // arrange
  const run = vi.fn().mockResolvedValue({ code: 0 });
  const selected = [{ project: 'chromium', file: 'tests/b.spec.ts' }];

  // act
  await executeSelection({ root: '/repo', suites: selected }, run);

  // assert
  expect(run).toHaveBeenCalledWith(expect.objectContaining({ project: 'chromium' }));
  expect(run).toHaveBeenCalledOnce();
});

it('does not launch any project for a proven empty scope', async () => {
  // arrange
  const run = vi.fn();

  // act
  const result = await executeSelection({ root: '/repo', suites: [] }, run);

  // assert
  expect(result).toBe(0);
  expect(run).not.toHaveBeenCalled();
});

it('escapes filenames in the shell-free runner invocation', async () => {
  // arrange
  const child = new EventEmitter();
  const launch = vi.fn(() => child);

  // act
  const pending = runProject(
    { root: '/repo', project: 'components', files: [suites[0].file] },
    launch,
  );
  child.emit('exit', 0, null);
  await pending;

  // assert
  expect(launch).toHaveBeenCalledWith(
    process.execPath,
    [
      '/repo/node_modules/@playwright/test/cli.js',
      'test',
      '--config',
      'playwright.components.config.ts',
      'tests/a \\(copy\\)\\.spec\\.ts$',
    ],
    { cwd: '/repo', stdio: 'inherit' },
  );
});

it('maps a killed child to interruption failure', async () => {
  // arrange
  const child = new EventEmitter();

  // act
  const pending = runProject({ root: '/repo', project: 'components', files: [] }, () => child);
  child.emit('exit', null, 'SIGTERM');
  const result = await pending;

  // assert
  expect(result).toEqual({ code: 143, interrupted: true });
});

it('propagates launch errors and removes signal handlers', async () => {
  // arrange
  const initial = process.listenerCount('SIGINT');
  const child = new EventEmitter();

  // act
  const pending = runProject({ root: '/repo', project: 'chromium', files: [] }, () => child);
  child.emit('error', new Error('Launch failed'));

  // assert
  await expect(pending).rejects.toThrow('Launch failed');
  expect(process.listenerCount('SIGINT')).toBe(initial);
});

it('routes complete-command file filters before starting servers and preserves shared options', () => {
  // arrange
  const given = ['tests/b', '--workers=3', '--grep', 'native'];
  const expected = {
    suites: [{ project: 'chromium', file: 'tests/b.spec.ts' }],
    args: ['--workers=3', '--grep', 'native'],
  };

  // act
  const result = completeOptions(given, suites);

  // assert
  expect(result).toEqual(expected);
});

it('keeps the complete inventory when no filters are supplied', () => {
  // arrange
  const given = [];

  // act
  const result = completeOptions(given, suites);

  // assert
  expect(result).toEqual({ suites, args: [] });
});

it.each([
  { given: ['missing.spec'], expected: 'No browser suites' },
  { given: ['--config', 'other'], expected: 'Unsupported' },
  { given: ['--grep'], expected: 'Missing value' },
])('rejects invalid complete command arguments $given', ({ given, expected }) => {
  // act
  const act = () => completeOptions(given, suites);

  // assert
  expect(act).toThrow(expected);
});
