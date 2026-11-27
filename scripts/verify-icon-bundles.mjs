import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { build } from 'vite';

const artwork = {
  MoonIcon: 'M20.9 13.4A9 9 0 0 1 10.6 3.1 9 9 0 1 0 20.9 13.4Z',
  SunIcon:
    'M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42',
  CheckIcon: 'm5 12 4 4L19 6',
  CloseIcon: 'm6 6 12 12M6 18 18 6',
  ChevronDownIcon: 'm6 9 6 6 6-6',
  ArrowRightIcon: 'M4 12h16m-6-6 6 6-6 6',
  PlusIcon: 'M12 4v16M4 12h16',
  ExternalLinkIcon: 'M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5',
};

/**
 * Bundle a consumer entry from the installed tarball with React externalized.
 **/
async function consumerBundle(directory, names) {
  const entry = join(directory, 'icon-bundle-check.js');
  const examples = names.map((name) => `createElement(${name})`).join(', ');
  await writeFile(
    entry,
    `import { createElement } from 'react';\nimport { ${names.join(', ')} } from 'fletchstack-ui';\nexport const examples = [${examples}];`,
  );
  const result = await build({
    configFile: false,
    root: directory,
    logLevel: 'error',
    build: {
      write: false,
      minify: true,
      lib: { entry, formats: ['es'] },
      rollupOptions: { external: [/^react($|\/)/, /^react-dom($|\/)/] },
    },
  });
  const outputs = Array.isArray(result) ? result : [result];

  return outputs
    .flatMap((output) => output.output)
    .filter((chunk) => chunk.type === 'chunk')
    .map((chunk) => chunk.code)
    .join('\n');
}

/**
 * Verify opted-in artwork and highlighting survive while unrelated consumers omit them.
 **/
export async function verifyIconBundles(directory) {
  for (const names of [['MoonIcon'], ['Button'], ['MoonIcon', 'SunIcon'], ['CodeBlock']]) {
    const code = await consumerBundle(directory, names);
    for (const [name, marker] of Object.entries(artwork)) {
      assert.equal(
        code.includes(marker),
        names.includes(name),
        `${names.join('+')}: unexpected ${name} artwork retention`,
      );
    }
    assert.equal(
      code.includes('Unknown language:'),
      names.includes('CodeBlock'),
      'Only CodeBlock consumers retain the syntax highlighter',
    );
    assert.match(code, /from\s*["']react["']/);
  }
  console.log(
    'Single-icon, Button-only and positive-control bundles retain only opted-in artwork and syntax highlighting.',
  );
}
