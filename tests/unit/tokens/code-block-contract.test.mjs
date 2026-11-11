import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([{ name: 'Corporate', theme: corporate }, { name: 'Luna', theme: luna }])('$name exposes the approved CodeBlock geometry and typography', ({ theme }) => {
  // arrange
  const given = { ...primitives, ...theme };
  const expected = { '--fs-code-block-font-size': '0.875rem', '--fs-code-block-font-line-height': '1.5', '--fs-code-block-inset': '16px', '--fs-code-block-border-width': '1px' };

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toMatchObject(expected);
});

it.each([{ theme: corporate, surface: 'rgb(255 255 255 / 1)', text: 'rgb(23 35 56 / 1)' }, { theme: luna, surface: 'rgb(199 181 255 / 1)', text: 'rgb(17 19 41 / 1)' }])('defines copy action paint for the supplied theme', ({ theme, surface, text }) => {
  // arrange
  const given = { ...primitives, ...theme };
  const expected = { '--fs-code-block-copy-surface': surface, '--fs-code-block-copy-text': text };

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toMatchObject(expected);
});
