import { expect, it } from 'vitest';
import { inScope, sourcePath } from '../../e2e/coverage/report.mjs';

it.each([
  { given: 'src/components/textarea/Textarea.tsx', expected: true },
  { given: 'src/components/textarea/stories/Textarea.stories.tsx', expected: true },
  { given: 'src/components/icon/stories/icon-gallery.tsx', expected: true },
  { given: 'src/components/icon/stories/unvisited-helper.ts', expected: true },
  { given: 'stories/shared/preview-helper.tsx', expected: true },
  { given: '.storybook/preview.tsx', expected: true },
  { given: '.storybook/main.ts', expected: false },
  { given: 'src/components/textarea/__tests__/Textarea.test.tsx', expected: false },
  { given: 'src/components/textarea/fixtures/app.tsx', expected: false },
  { given: 'src/components/textarea/setup/dom.ts', expected: false },
  { given: 'src/components/textarea/Textarea.test.tsx', expected: false },
  { given: 'src/components/textarea/Textarea.d.ts', expected: false },
  { given: 'tests/support/dom.ts', expected: false },
  { given: 'tests/browser-harness/gallery/main.tsx', expected: true },
  { given: 'tests/browser-harness/scenarios/CodeBlock.tsx', expected: true },
  { given: 'tests/browser-harness/fixtures/test.ts', expected: false },
  { given: 'tests/browser-harness/selection/discover.mjs', expected: false },
])('classifies $given as browser runtime: $expected', ({ given, expected }) => {
  // arrange
  // The table includes an unvisited helper so loaded-only inventories cannot pass.

  // act
  const result = inScope(given);

  // assert
  expect(result).toBe(expected);
});

it.each([
  ['/gallery/main.tsx?t=1', 'tests/browser-harness/gallery/main.tsx'],
  ['scenarios/CodeBlock.tsx', 'tests/browser-harness/scenarios/CodeBlock.tsx'],
  ['/absolute/repo/tests/browser-harness/scenarios/Button.tsx', 'tests/browser-harness/scenarios/Button.tsx'],
  ['/absolute/repo/src/components/button/Button.tsx', 'src/components/button/Button.tsx'],
])('normalizes %s without losing harness identity', (given, expected) => {
  // act
  const result = sourcePath(given);

  // assert
  expect(result).toBe(expected);
});
