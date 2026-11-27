import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { test as baseTest } from 'vitest';

export const test = baseTest.extend({
  // eslint-disable-next-line no-empty-pattern -- Vitest fixtures require destructuring their dependencies.
  root: async ({}, use) => {
    const directory = await mkdtemp(join(tmpdir(), 'fletchstack-integration-'));
    try {
      await use(pathToFileURL(`${directory}/`));
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
});

/**
 * Create a fresh on-disk token project, keeping theme and primitive documents separate.
 **/
export async function writeProject(root, document, themes = {}) {
  const { primitive, ...corporate } = document;
  await mkdir(new URL('tokens', root));
  await mkdir(new URL('docs', root));
  const documents = {
    'primitives.json': { $type: document.$type, primitive },
    'corporate.json': corporate,
    ...themes,
  };
  await Promise.all(
    Object.entries(documents).map(([name, value]) =>
      writeFile(new URL(`tokens/${name}`, root), JSON.stringify(value)),
    ),
  );
  await writeFile(new URL('tokens/README.md', root), 'Ignored by theme discovery.');
}

/**
 * Define a complete minimal source document for a public semantic token.
 **/
export function tokenDocument(type, value) {
  return {
    primitive: { sample: { $type: type, $value: value } },
    semantic: {
      sample: { $type: type, $value: '{primitive.sample}', $description: 'Example purpose.' },
    },
  };
}
