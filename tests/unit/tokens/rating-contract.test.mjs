import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([{ theme: corporate, fill: 'rgb(255 184 0 / 1)' }, { theme: luna, fill: 'rgb(255 158 0 / 1)' }])('publishes approved Rating geometry and theme fill', ({ theme, fill }) => {
  // arrange
  const expected = { '--fs-rating-fill': fill, '--fs-rating-size-sm': '20px', '--fs-rating-size-md': '32px', '--fs-rating-size-lg': '48px', '--fs-rating-target-size': '48px', '--fs-rating-gap': '8px' };
  // act
  const result = compileTokens({ ...primitives, ...theme });
  // assert
  expect(result).toMatchObject(expected);
});
