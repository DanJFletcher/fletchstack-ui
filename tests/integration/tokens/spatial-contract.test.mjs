import { readFile } from 'node:fs/promises';
import { expect } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { buildTokens } from '../../../scripts/token-build.mjs';
import { test, writeProject } from '../fixtures/token-project.mjs';

test.for(['corporate', 'luna'])(
  'publishes additive spatial CSS in $0 without hiding legacy leaves',
  async (theme, { root }) => {
    // arrange
    await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });

    // act
    await buildTokens(root);

    // assert
    const css = await readFile(new URL('src/generated/tokens.css', root), 'utf8');
    const scope = css.split(`[data-theme="${theme}"] {`)[1].split('}')[0];
    expect(scope).toContain('--fs-space-gap-label: 8px;');
    expect(scope).toContain('--fs-space-gap-actions: 12px;');
    expect(scope).toContain('--fs-space-gap-related: 16px;');
    expect(scope).toContain('--fs-space-stack-group: 24px;');
    expect(scope).toContain('--fs-space-inset-container: 24px;');
    expect(scope).toContain('--fs-layout-section-gap: 64px;');
    expect(scope).toContain('--fs-gallery-search-padding-inline: 36px;');
    expect(scope).toContain('--fs-gallery-search-padding-block: 8px;');
    expect(scope).toContain('--fs-gallery-heading-gap: 16px;');
    expect(scope).toContain('--fs-gallery-preview-inset: 1px;');
    expect(scope).toContain('--fs-space-stack: 24px;');
    expect(scope).toContain('--fs-space-inset: 24px;');
  },
);

test('publishes role-selection guidance beside the token reference', async ({ root }) => {
  // arrange
  await writeProject(root, { ...primitives, ...corporate });

  // act
  await buildTokens(root);

  // assert
  const result = await readFile(new URL('docs/tokens.md', root), 'utf8');
  expect(result).toContain('[Spatial system](spatial-system.md)');
  expect(result).toContain('Choose a role by its purpose');
});

test('repeated generation produces identical spatial CSS and reference', async ({ root }) => {
  // arrange
  await writeProject(root, { ...primitives, ...corporate }, { 'luna.json': luna });
  await buildTokens(root);
  const expected = await Promise.all(
    ['src/generated/tokens.css', 'docs/tokens.md'].map((path) =>
      readFile(new URL(path, root), 'utf8'),
    ),
  );

  // act
  await buildTokens(root);

  // assert
  const result = await Promise.all(
    ['src/generated/tokens.css', 'docs/tokens.md'].map((path) =>
      readFile(new URL(path, root), 'utf8'),
    ),
  );
  expect(result).toEqual(expected);
});
