import { beforeEach, expect, it, vi } from 'vitest';

const files = vi.hoisted(() => ({ copyFile: vi.fn(), readFile: vi.fn(), writeFile: vi.fn() }));
vi.mock('node:fs/promises', () => files);

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  files.copyFile.mockResolvedValue(undefined);
  files.readFile.mockResolvedValueOnce(':root { --fs-text: black; }').mockResolvedValueOnce('.fs-button { color: var(--fs-text); }').mockResolvedValueOnce('.fs-icon { width: var(--fs-icon-size-medium); }').mockResolvedValueOnce('.fs-card { color: var(--fs-card-text); }');
  files.writeFile.mockResolvedValue(undefined);
});

it.each([
  { source: 'src/generated/tokens.css', destination: 'dist/tokens.css' },
  { source: 'src/button.css', destination: 'dist/button.css' },
  { source: 'src/icon.css', destination: 'dist/icon.css' },
  { source: 'src/card.css', destination: 'dist/card.css' },
])('publishes $source at $destination', async ({ source, destination }) => {
  // act
  await import('../../../scripts/copy-styles.mjs');

  // assert
  expect(files.copyFile).toHaveBeenCalledWith(source, destination);
});

it('combines tokens before component styles in the public stylesheet', async () => {
  // arrange
  const expected = ':root { --fs-text: black; }\n.fs-button { color: var(--fs-text); }\n.fs-icon { width: var(--fs-icon-size-medium); }\n.fs-card { color: var(--fs-card-text); }';

  // act
  await import('../../../scripts/copy-styles.mjs');

  // assert
  expect(files.writeFile).toHaveBeenCalledWith('dist/styles.css', expected);
});

it('propagates missing source stylesheet errors', async () => {
  // arrange
  const expected = new Error('Source stylesheet missing');
  files.copyFile.mockRejectedValue(expected);

  // act
  const result = import('../../../scripts/copy-styles.mjs');

  // assert
  await expect(result).rejects.toBe(expected);
  expect(files.writeFile).not.toHaveBeenCalled();
});

it('propagates combined stylesheet write errors', async () => {
  // arrange
  const expected = new Error('Cannot write stylesheet');
  files.writeFile.mockRejectedValue(expected);

  // act
  const result = import('../../../scripts/copy-styles.mjs');

  // assert
  await expect(result).rejects.toBe(expected);
});
