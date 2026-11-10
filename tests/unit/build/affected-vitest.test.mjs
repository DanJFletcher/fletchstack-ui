import { EventEmitter } from 'node:events';
import { afterEach, expect, it, vi } from 'vitest';
import { openVitest, runSelected } from '../../../scripts/affected-vitest.mjs';
import { createVitest } from 'vitest/node';

vi.mock('vitest/node', () => ({ createVitest: vi.fn() }));
vi.mock('node:fs/promises', () => ({ realpath: async path => path }));
afterEach(() => vi.resetAllMocks());

/**
 * Supply a runner boundary that never launches workers or touches the filesystem.
 **/
function context() {
  return { config: {}, close: vi.fn(), standalone: vi.fn(), cancelCurrentRun: vi.fn(),
    globTestSpecifications: vi.fn().mockResolvedValue([{ moduleId: '/repo/button.test.ts' }]),
    getRelevantTestSpecifications: vi.fn().mockResolvedValue([{ moduleId: '/repo/button.test.ts' }]),
    runTestSpecifications: vi.fn().mockResolvedValue({ testModules: [{ state: () => 'passed' }], unhandledErrors: [] }) };
}

it('discovers owners without running tests and executes only exact selected files', async () => {
  // arrange
  const ctx = context();
  vi.mocked(createVitest).mockResolvedValue(ctx);

  // act
  const result = await openVitest({ project: 'unit', root: '/repo', changes: [{ path: 'button.test.ts', status: 'M' }, { path: 'gone.ts', status: 'D' }] });
  const status = await result.run(['button.test.ts']);
  await result.close();

  // assert
  expect(result.inventory).toEqual(['button.test.ts']);
  expect(result.owners.get('button.test.ts')).toEqual(['button.test.ts']);
  expect(status).toBe(0);
  expect(createVitest).toHaveBeenCalledWith('test', expect.objectContaining({ project: ['unit'], coverage: { enabled: false }, watch: false }));
  expect(ctx.close).toHaveBeenCalledOnce();
});

it('closes a context when dependency discovery fails', async () => {
  // arrange
  const ctx = context();
  ctx.getRelevantTestSpecifications.mockRejectedValue(new Error('transform failed'));

  // act
  const act = openVitest({ project: 'unit', root: '/repo', changes: [{ path: 'broken.ts', status: 'M' }] }, async () => ctx);

  // assert
  await expect(act).rejects.toThrow('transform failed');
  expect(ctx.close).toHaveBeenCalledOnce();
});

it.each([
  [{ testModules: [{ state: () => 'failed' }], unhandledErrors: [] }, 1],
  [{ testModules: [], unhandledErrors: [] }, 1],
  [{ testModules: [{ state: () => 'passed' }], unhandledErrors: [new Error('unhandled')] }, 1],
  [{ testModules: [{ state: () => 'skipped' }], unhandledErrors: [] }, 0],
])('preserves the completed test status %#', async (outcome, expected) => {
  // arrange
  const ctx = context();
  ctx.runTestSpecifications.mockResolvedValue(outcome);

  // act
  const result = await runSelected(ctx, { specs: [{ moduleId: '/repo/button.test.ts' }], files: ['button.test.ts'], root: '/repo' });

  // assert
  expect(result).toBe(expected);
});

it.each([['SIGINT', 130], ['SIGTERM', 143]])('preserves %s interruption and removes listeners', async (signal, expected) => {
  // arrange
  const ctx = context();
  const signals = new EventEmitter();
  ctx.runTestSpecifications.mockImplementation(async () => { signals.emit(signal); return { testModules: [], unhandledErrors: [] }; });

  // act
  const result = await runSelected(ctx, { specs: [{ moduleId: '/repo/a.test.ts' }], files: ['a.test.ts'], root: '/repo' }, signals);

  // assert
  expect(result).toBe(expected);
  expect(ctx.cancelCurrentRun).toHaveBeenCalledWith('keyboard-input');
  expect(signals.eventNames()).toEqual([]);
});

it('refuses an empty specification set', async () => {
  // arrange
  const ctx = context();

  // act
  const act = runSelected(ctx, { specs: [], files: [], root: '/repo' });

  // assert
  await expect(act).rejects.toThrow('Refusing execution');
});
