import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect } from 'vitest';
import { test } from '../fixtures/token-project.mjs';

test('the token command reproduces the checked-in CSS and reference', async () => {
  // arrange
  const stylesheet = new URL('../../../src/generated/tokens.css', import.meta.url);
  const reference = new URL('../../../docs/tokens.md', import.meta.url);
  const expected = await Promise.all([readFile(stylesheet, 'utf8'), readFile(reference, 'utf8')]);

  // act
  await import('../../../scripts/build-tokens.mjs');

  // assert
  const result = await Promise.all([readFile(stylesheet, 'utf8'), readFile(reference, 'utf8')]);
  expect(result).toEqual(expected);
});

test('the stylesheet command publishes separate and combined CSS exports', async ({ root }) => {
  // arrange
  await mkdir(new URL('src/generated', root), { recursive: true });
  await mkdir(new URL('dist', root));
  await writeFile(new URL('src/generated/tokens.css', root), ':root { --fs-text: black; }');
  await copyFile(new URL('../../../src/button.css', import.meta.url), new URL('src/button.css', root));
  await copyFile(new URL('../../../src/icon.css', import.meta.url), new URL('src/icon.css', root));
  await copyFile(new URL('../../../src/card.css', import.meta.url), new URL('src/card.css', root));

  const icon = await readFile(new URL('src/icon.css', root), 'utf8');
  const card = await readFile(new URL('src/card.css', root), 'utf8');
  const button = await readFile(new URL('src/button.css', root), 'utf8');
  const previousDirectory = process.cwd();

  // act
  try {
    process.chdir(fileURLToPath(root));
    await import('../../../scripts/copy-styles.mjs');
  } finally {
    process.chdir(previousDirectory);
  }

  // assert
  const result = await Promise.all(['tokens.css', 'button.css', 'icon.css', 'card.css', 'styles.css'].map(name => readFile(new URL(`dist/${name}`, root), 'utf8')));
  expect(result).toEqual([':root { --fs-text: black; }', button, icon, card, `:root { --fs-text: black; }\n${button}\n${icon}\n${card}`]);
});
