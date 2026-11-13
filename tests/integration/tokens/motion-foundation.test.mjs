import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test('publishes all approved motion roles in each real theme', async ({ root }) => {
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });

  await buildTokens(root);

  const css = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
  for (const declaration of [
    '--fs-motion-duration-fast: 100ms;', '--fs-motion-duration-standard: 160ms;',
    '--fs-motion-duration-slow: 240ms;', '--fs-motion-duration-spinner: 1000ms;',
    '--fs-motion-easing-standard: cubic-bezier(0.2, 0.8, 0.2, 1);',
    '--fs-motion-easing-enter: cubic-bezier(0.2, 1, 0.3, 1);',
    '--fs-motion-easing-exit: cubic-bezier(0.5, 0, 0.9, 0.3);',
  ]) { expect(css.split(declaration)).toHaveLength(3); }
  const reference = await readFile(new URL('docs/tokens.md', root), 'utf8');
  expect(reference).toContain('--fs-motion-duration-spinner');
});
