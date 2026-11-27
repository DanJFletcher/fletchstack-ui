import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([
  { name: 'Corporate', theme: corporate },
  { name: 'Luna', theme: luna },
])('$name supplies the approved motion vocabulary and legacy Spinner default', ({ theme }) => {
  // arrange
  const given = { ...primitives, ...theme };
  const expected = {
    '--fs-motion-duration-fast': '100ms',
    '--fs-motion-duration-standard': '160ms',
    '--fs-motion-duration-slow': '240ms',
    '--fs-motion-duration-spinner': '1000ms',
    '--fs-motion-easing-standard': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    '--fs-motion-easing-enter': 'cubic-bezier(0.2, 1, 0.3, 1)',
    '--fs-motion-easing-exit': 'cubic-bezier(0.5, 0, 0.9, 0.3)',
    '--fs-spinner-rotation-seconds': '1',
  };

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toMatchObject(expected);
});
