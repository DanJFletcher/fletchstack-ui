import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([corporate, luna])('publishes the AvatarGroup geometry and scalable disclosure typography', theme => {
  // arrange
  const expected = { '--fs-avatar-group-overlap': '8px', '--fs-avatar-group-ring-width': '2px', '--fs-avatar-group-list-width': '240px', '--fs-avatar-group-list-font-size': '1rem' };
  // act
  const result = compileTokens({ ...primitives, ...theme });
  // assert
  expect(result).toMatchObject(expected);
});
