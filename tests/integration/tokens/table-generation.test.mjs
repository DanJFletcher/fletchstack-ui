import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test('publishes Table header/selection roles in both themes with stable comfortable and compact padding', async ({
  root,
}) => {
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });
  await buildTokens(root);
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result).toContain('--fs-table-header-surface: rgb(228 232 239 / 1);');
  expect(result).toContain('--fs-table-header-surface: rgb(36 61 112 / 1);');
  expect(result).toContain('--fs-table-row-selected: rgb(232 239 255 / 1);');
  expect(result.split('--fs-table-padding: 12px;')).toHaveLength(3);
  expect(result.split('--fs-table-compact-padding: 4px;')).toHaveLength(3);
});
