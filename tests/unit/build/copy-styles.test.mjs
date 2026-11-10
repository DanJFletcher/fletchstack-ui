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
  files.readFile.mockResolvedValueOnce('.fs-radio { appearance: none; }');
  files.readFile.mockResolvedValueOnce('.fs-link { text-decoration-line: underline; }');
  files.readFile.mockResolvedValueOnce('.fs-switch { appearance: none; }');
  files.readFile.mockResolvedValueOnce('.fs-spinner { display: inline-flex; }');
  files.readFile.mockResolvedValueOnce('.fs-badge { display: inline-flex; }');
  files.readFile.mockResolvedValueOnce('.fs-separator { margin: 0; }');
  files.readFile.mockResolvedValueOnce('.fs-container { box-sizing: border-box; }');
  files.readFile.mockResolvedValueOnce('.fs-stack { display: flex; }');
  files.readFile.mockResolvedValueOnce('.fs-cluster { flex-wrap: wrap; }');
  files.readFile.mockResolvedValueOnce('.fs-simple-grid { display: grid; }');
  files.readFile.mockResolvedValueOnce('.fs-aspect-ratio { position: relative; }');
  files.readFile.mockResolvedValueOnce('.fs-section { padding-inline: 0; }');
  files.writeFile.mockResolvedValue(undefined);
});

it.each([
  { source: 'src/components/section/section.css', destination: 'dist/section.css' },
  { source: 'src/components/aspect-ratio/aspect-ratio.css', destination: 'dist/aspect-ratio.css' },
  { source: 'src/components/simple-grid/simple-grid.css', destination: 'dist/simple-grid.css' },
  { source: 'src/components/cluster/cluster.css', destination: 'dist/cluster.css' },
  { source: 'src/components/stack/stack.css', destination: 'dist/stack.css' },
  { source: 'src/components/container/container.css', destination: 'dist/container.css' },
  { source: 'src/components/separator/separator.css', destination: 'dist/separator.css' },
  { source: 'src/components/badge/badge.css', destination: 'dist/badge.css' },
  { source: 'src/components/spinner/spinner.css', destination: 'dist/spinner.css' },
  { source: 'src/components/switch/switch.css', destination: 'dist/switch.css' },
  { source: 'src/components/link/link.css', destination: 'dist/link.css' },
  { source: 'src/components/radio/radio.css', destination: 'dist/radio.css' },
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
  const expected = ':root { --fs-text: black; }\n.fs-field { display: grid; }\n.fs-button { color: var(--fs-text); }\n.fs-icon { width: var(--fs-icon-size-medium); }\n.fs-card { color: var(--fs-card-text); }\n.fs-select { color: var(--fs-select-text); }\n.fs-text-input { color: var(--fs-text-input-text); }\n.fs-checkbox { color: var(--fs-checkbox-text); }\n.fs-form-group { display: block; }\n.fs-textarea { resize: vertical; }\n.fs-radio { appearance: none; }\n.fs-link { text-decoration-line: underline; }\n.fs-switch { appearance: none; }\n.fs-spinner { display: inline-flex; }\n.fs-badge { display: inline-flex; }\n.fs-separator { margin: 0; }\n.fs-container { box-sizing: border-box; }\n.fs-stack { display: flex; }\n.fs-cluster { flex-wrap: wrap; }\n.fs-simple-grid { display: grid; }\n.fs-aspect-ratio { position: relative; }\n.fs-section { padding-inline: 0; }';

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
