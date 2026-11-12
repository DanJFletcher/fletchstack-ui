import { beforeEach, expect, it, vi } from 'vitest';
import { publishStyles } from '../../../scripts/component-styles.mjs';

const files = vi.hoisted(() => ({ copyFile: vi.fn(), readFile: vi.fn(), writeFile: vi.fn() }));
vi.mock('node:fs/promises', () => files);
beforeEach(() => { vi.resetAllMocks(); });

it('copies styles and combines tokens before the supplied component order', async () => {
  // arrange
  files.readFile.mockResolvedValueOnce('tokens').mockResolvedValueOnce('second').mockResolvedValueOnce('first');
  const families = [{ style: 'src/second.css' }, {}, { style: 'src/first.css' }];
  // act
  await publishStyles(families);
  // assert
  expect(files.copyFile.mock.calls).toEqual([['src/generated/tokens.css', 'dist/tokens.css'], ['src/second.css', 'dist/second.css'], ['src/first.css', 'dist/first.css']]);
  expect(files.writeFile).toHaveBeenCalledWith('dist/styles.css', 'tokens\nsecond\nfirst');
});

it.each(['copyFile', 'readFile', 'writeFile'])('propagates %s failure', async operation => {
  // arrange
  const expected = new Error('Disk unavailable');
  files[operation].mockRejectedValue(expected);
  // act
  const result = publishStyles([]);
  // assert
  await expect(result).rejects.toBe(expected);
});

it('the entrypoint publishes the reviewed inventory', async () => {
  // arrange
  const inventory = await import('../../../scripts/component-inventory.json');
  // act
  await import('../../../scripts/copy-styles.mjs');
  // assert
  expect(files.copyFile.mock.calls.slice(1).map(call => call[0])).toEqual(inventory.default.families.map(family => family.style));
});
