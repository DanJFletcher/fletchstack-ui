import { beforeEach, expect, it, vi } from 'vitest';

const files = vi.hoisted(() => ({ copyFile: vi.fn(), readFile: vi.fn(), writeFile: vi.fn() }));
vi.mock('node:fs/promises', () => files);

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  files.copyFile.mockResolvedValue(undefined);
  files.readFile.mockResolvedValueOnce(':root { --fs-text: black; }').mockResolvedValueOnce('.fs-field { display: grid; }').mockResolvedValueOnce('.fs-button { color: var(--fs-text); }').mockResolvedValueOnce('.fs-icon { width: var(--fs-icon-size-medium); }').mockResolvedValueOnce('.fs-card { color: var(--fs-card-text); }').mockResolvedValueOnce('.fs-select { color: var(--fs-select-text); }').mockResolvedValueOnce('.fs-text-input { color: var(--fs-text-input-text); }').mockResolvedValueOnce('.fs-checkbox { color: var(--fs-checkbox-text); }');
  files.readFile.mockResolvedValueOnce('.fs-form-group { display: block; }');
  files.readFile.mockResolvedValueOnce('.fs-textarea { resize: vertical; }');
  files.writeFile.mockResolvedValue(undefined);
});

it.each([
  { source: 'src/generated/tokens.css', destination: 'dist/tokens.css' },
  { source: 'src/components/field/field.css', destination: 'dist/field.css' },
  { source: 'src/components/button/button.css', destination: 'dist/button.css' },
  { source: 'src/components/icon/icon.css', destination: 'dist/icon.css' },
  { source: 'src/components/card/card.css', destination: 'dist/card.css' },
  { source: 'src/components/select/select.css', destination: 'dist/select.css' },
  { source: 'src/components/text-input/text-input.css', destination: 'dist/text-input.css' },
  { source: 'src/components/textarea/textarea.css', destination: 'dist/textarea.css' },
  { source: 'src/components/form-group/form-group.css', destination: 'dist/form-group.css' },
  { source: 'src/components/checkbox/checkbox.css', destination: 'dist/checkbox.css' },
])('publishes $source at $destination', async ({ source, destination }) => {
  // act
  await import('../../../scripts/copy-styles.mjs');

  // assert
  expect(files.copyFile).toHaveBeenCalledWith(source, destination);
});

it('combines tokens before component styles in the public stylesheet', async () => {
  // arrange
  const expected = ':root { --fs-text: black; }\n.fs-field { display: grid; }\n.fs-button { color: var(--fs-text); }\n.fs-icon { width: var(--fs-icon-size-medium); }\n.fs-card { color: var(--fs-card-text); }\n.fs-select { color: var(--fs-select-text); }\n.fs-text-input { color: var(--fs-text-input-text); }\n.fs-checkbox { color: var(--fs-checkbox-text); }\n.fs-form-group { display: block; }\n.fs-textarea { resize: vertical; }';

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
