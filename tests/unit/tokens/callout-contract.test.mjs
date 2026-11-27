import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([
  { theme: corporate, surface: 'rgb(255 237 191 / 1)' },
  { theme: luna, surface: 'rgb(26 27 52 / 1)' },
])('publishes warning guidance roles with stable layout dimensions', ({ theme, surface }) => {
  // arrange
  const expected = {
    '--fs-callout-warning-surface': surface,
    '--fs-callout-accent-width': '6px',
    '--fs-callout-icon-gap': '12px',
    '--fs-callout-content-gap': '8px',
    '--fs-callout-padding-block': '12px',
  };

  // act
  const result = compileTokens({ ...primitives, ...theme });

  // assert
  expect(result).toMatchObject(expected);
});
