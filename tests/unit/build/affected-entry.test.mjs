import { expect, it, vi } from 'vitest';
import { affectedMain } from '../../../scripts/affected-run.mjs';

vi.mock('../../../scripts/affected-run.mjs', () => ({ affectedMain: vi.fn().mockResolvedValue(0) }));

it('forwards CLI arguments and propagates the command status', async () => {
  // arrange
  const previous = process.exitCode;

  // act
  await import('../../../scripts/test-affected.mjs');

  // assert
  expect(affectedMain).toHaveBeenCalledWith(process.argv.slice(2));
  expect(process.exitCode).toBe(0);
  process.exitCode = previous;
});
