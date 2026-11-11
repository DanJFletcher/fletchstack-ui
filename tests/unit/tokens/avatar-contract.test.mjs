import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([corporate, luna])('publishes the reference Avatar footprints and shape radii', theme => {
  // arrange
  const expected = { '--fs-avatar-size-small': '24px', '--fs-avatar-size-medium': '32px', '--fs-avatar-size-large': '48px', '--fs-avatar-size-xlarge': '64px', '--fs-avatar-radius-rounded': '8px', '--fs-avatar-radius-square': '0px' };
  // act
  const result = compileTokens({ ...primitives, ...theme });
  // assert
  expect(result).toMatchObject(expected);
});
