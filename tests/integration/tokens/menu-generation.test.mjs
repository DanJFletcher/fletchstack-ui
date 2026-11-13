import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test('generates named Menu roles in both themes with shared inline indentation', async ({ root }) => {
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });
  await buildTokens(root);
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result).toContain('--fs-menu-surface: rgb(255 255 255 / 1);');
  expect(result).toContain('--fs-menu-surface: rgb(41 36 66 / 1);');
  expect(result.split('--fs-menu-indent: 16px;')).toHaveLength(3);
});
