import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test('generates Navbar semantic surfaces and the shared container width role', async ({ root }) => {
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });
  await buildTokens(root);
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result).toContain('--fs-navbar-surface: rgb(255 255 255 / 1);');
  expect(result).toContain('--fs-navbar-surface: rgb(17 19 41 / 1);');
  expect(result.split('--fs-navbar-collapse-width: 720px;')).toHaveLength(3);
});
