import { build } from 'vite';
import { verifyIconBundles } from './verify-icon-bundles.mjs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/**
 * Run a local tool with inherited output and fail on a nonzero status.
 **/
function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: 'inherit', env: process.env });
}

const root = process.cwd();
const temporary = await mkdtemp(join(tmpdir(), 'fletchstack-consumer-'));
const consumerTypes = await readFile('scripts/fixtures/consumer.tsx', 'utf8');
const consumerRuntime = await readFile('scripts/fixtures/consumer.mjs', 'utf8');
try {
  run('npm', ['pack', '--pack-destination', temporary], root);
  const manifest = JSON.parse(await readFile('package.json', 'utf8'));
  const archive = join(temporary, `${manifest.name}-${manifest.version}.tgz`);
  await writeFile(
    join(temporary, 'package.json'),
    JSON.stringify({ private: true, type: 'module' }),
  );
  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      archive,
      'react@19.3.1',
      'react-dom@19.3.1',
      '@types/react@19.3.0',
      '@types/react-dom@19.3.0',
    ],
    temporary,
  );
  await writeFile(join(temporary, 'consumer.tsx'), consumerTypes);
  await writeFile(
    join(temporary, 'gatsby-example.tsx'),
    await readFile('examples/gatsby/src/pages/index.tsx', 'utf8'),
  );
  await writeFile(
    join(temporary, 'astro-island.tsx'),
    await readFile('examples/astro/src/components/SaveAction.tsx', 'utf8'),
  );
  run(
    resolve('node_modules/.bin/tsc'),
    [
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--jsx',
      'react-jsx',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      'consumer.tsx',
      'gatsby-example.tsx',
      'astro-island.tsx',
    ],
    temporary,
  );
  await writeFile(join(temporary, 'verify.mjs'), consumerRuntime);
  run('node', ['verify.mjs'], temporary);
  await build({
    configFile: false,
    root: temporary,
    logLevel: 'error',
    esbuild: { jsx: 'automatic' },
    build: {
      lib: {
        entry: join(temporary, 'consumer.tsx'),
        formats: ['es'],
        fileName: 'consumer',
        cssFileName: 'consumer',
      },
    },
  });
  assert.match(await readFile(join(temporary, 'dist/consumer.css'), 'utf8'), /--fs-button/);
  assert.match(
    await readFile(join(temporary, 'dist/consumer.css'), 'utf8'),
    /--fs-icon-size-medium/,
  );
  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      'react@18.3.1',
      'react-dom@18.3.1',
      '@types/react@18',
      '@types/react-dom@18',
    ],
    temporary,
  );
  run('node', ['verify.mjs'], temporary);
  run(
    resolve('node_modules/.bin/tsc'),
    [
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--jsx',
      'react-jsx',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      'consumer.tsx',
      'gatsby-example.tsx',
      'astro-island.tsx',
    ],
    temporary,
  );
  await verifyIconBundles(temporary);
  assert.equal(manifest.sideEffects.includes('**/*.css'), true);
  console.log('Packed exports, types, CSS imports, bundling and React 18/19 SSR passed.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
