import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test('generates themed Breadcrumbs separators with shared disclosure spacing', async ({ root }) => {
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });
  await buildTokens(root);
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result).toContain('--fs-breadcrumbs-separator: rgb(76 89 109 / 1);');
  expect(result).toContain('--fs-breadcrumbs-separator: rgb(184 177 205 / 1);');
  expect(result.split('--fs-breadcrumbs-gap: 8px;')).toHaveLength(3);
});
