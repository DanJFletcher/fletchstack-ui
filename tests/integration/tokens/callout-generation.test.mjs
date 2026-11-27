import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test('generates Callout roles for Corporate and Luna without implicit global style hooks', async ({
  root,
}) => {
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });
  await buildTokens(root);
  const result = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  expect(result.split('--fs-callout-accent-width: 6px;')).toHaveLength(3);
  expect(result).toContain('--fs-callout-info-surface: rgb(232 239 255 / 1);');
  expect(result).toContain('--fs-callout-info-surface: rgb(36 61 112 / 1);');
  expect(result).not.toContain('--fs-callout-surface:');
});
