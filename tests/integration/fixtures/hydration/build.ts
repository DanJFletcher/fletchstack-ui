import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

/**
 * Bundle the real React hydration fixture without external services or repository outputs.
 **/
export async function buildHydrationFixture(entry = new URL('./hydrate.tsx', import.meta.url)) {
  const directory = await mkdtemp(join(tmpdir(), 'fletchstack-hydration-'));
  try {
    await build({ configFile: false, logLevel: 'silent', esbuild: { jsxDev: false }, define: { 'process.env.NODE_ENV': '"production"' }, build: {
      outDir: directory, emptyOutDir: true,
      lib: { entry: fileURLToPath(entry), name: 'ButtonFixture', formats: ['iife'], fileName: () => 'hydrate.js' },
    } });
    return await readFile(join(directory, 'hydrate.js'), 'utf8');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
