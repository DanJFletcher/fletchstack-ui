import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test.for(['corporate', 'luna'])(
  'publishes the complete icon contract for $0',
  async (theme, { root }) => {
    // arrange
    await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });

    // act
    await buildTokens(root);

    // assert
    const css = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
    const scope = css.split(`[data-theme="${theme}"] {`)[1].split('}')[0];
    expect(scope).toContain('--fs-icon-size-small: 16px;');
    expect(scope).toContain('--fs-icon-size-medium: 20px;');
    expect(scope).toContain('--fs-icon-size-large: 24px;');
    expect(scope).toContain('--fs-icon-stroke-width: 2;');
  },
);
