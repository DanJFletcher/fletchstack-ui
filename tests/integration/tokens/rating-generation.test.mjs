import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test('publishes Rating colors in both themes and stable geometry in generated CSS', async ({ root }) => {
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });
  await buildTokens(root);
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result).toContain('--fs-rating-fill: rgb(255 184 0 / 1);');
  expect(result).toContain('--fs-rating-fill: rgb(255 158 0 / 1);');
  expect(result.split('--fs-rating-target-size: 48px;')).toHaveLength(3);
});
