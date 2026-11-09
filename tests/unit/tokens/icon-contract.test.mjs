import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([{ name: 'Corporate', theme: corporate }, { name: 'Luna', theme: luna }])('$name supplies the shared icon contract', ({ theme }) => {
  // arrange
  const given = { ...primitives, ...theme };
  const expected = {
    '--fs-icon-size-small': '16px', '--fs-icon-size-medium': '20px',
    '--fs-icon-size-large': '24px', '--fs-icon-stroke-width': '2',
  };

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toMatchObject(expected);
});
