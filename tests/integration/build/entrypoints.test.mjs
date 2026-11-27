import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { expect } from 'vitest';
import { test } from '../fixtures/token-project.mjs';
import inventory from '../../../scripts/component-inventory.json' with { type: 'json' };
import { publishStyles } from '../../../scripts/component-styles.mjs';

test('the token command reproduces checked-in CSS and reference', async () => {
  const paths = ['src/generated/tokens.css', 'docs/tokens.md'];
  const expected = await Promise.all(paths.map((path) => readFile(path, 'utf8')));
  await import('../../../scripts/build-tokens.mjs');
  expect(await Promise.all(paths.map((path) => readFile(path, 'utf8')))).toEqual(expected);
});

test('the stylesheet entrypoint publishes individual files and preserves combined order', async ({
  root,
}) => {
  const sources = ['src/generated/tokens.css', ...inventory.families.map((family) => family.style)];
  const expected = await Promise.all(sources.map((path) => readFile(path, 'utf8')));
  for (const source of sources) {
    await mkdir(new URL(source.slice(0, source.lastIndexOf('/')), root), { recursive: true });
    await copyFile(source, new URL(source, root));
  }
  await mkdir(new URL('dist', root));
  const previous = process.cwd();
  try {
    process.chdir(fileURLToPath(root));
    await import('../../../scripts/copy-styles.mjs');
  } finally {
    process.chdir(previous);
  }
  const result = await Promise.all(
    sources.map((path) => readFile(new URL(`dist/${path.split('/').at(-1)}`, root), 'utf8')),
  );
  expect(result).toEqual(expected);
  expect(await readFile(new URL('dist/styles.css', root), 'utf8')).toBe(expected.join('\n'));
});

test('families without CSS do not create a stylesheet entry', async ({ root }) => {
  await mkdir(new URL('src/generated', root), { recursive: true });
  await mkdir(new URL('dist', root));
  await writeFile(new URL('src/generated/tokens.css', root), 'tokens');
  const previous = process.cwd();
  try {
    process.chdir(fileURLToPath(root));
    await publishStyles([{}]);
  } finally {
    process.chdir(previous);
  }
  expect(await readFile(new URL('dist/styles.css', root), 'utf8')).toBe('tokens');
});
