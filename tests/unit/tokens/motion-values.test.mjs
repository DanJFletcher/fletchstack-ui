import { describe, it, expect } from 'vitest';
import { compileTokens } from '../../../scripts/token-compiler.mjs';
import { motionContracts } from '../../support/motion-contracts.mjs';

describe('motion token boundary', motionContracts);
it('compiles aliased shared duration and easing roles', () => {
  // arrange
  const given = {
    primitive: {
      duration: { $type: 'duration', $value: { value: 160, unit: 'ms' } },
      easing: { $type: 'cubicBezier', $value: [0.2, 0.8, 0.2, 1] },
    },
    semantic: {
      motion: {
        duration: { $type: 'duration', $value: '{primitive.duration}', $description: 'Duration.' },
        easing: { $type: 'cubicBezier', $value: '{primitive.easing}', $description: 'Easing.' },
      },
    },
  };
  // act
  const result = compileTokens(given);
  // assert
  expect(result).toEqual({
    '--fs-motion-duration': '160ms',
    '--fs-motion-easing': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  });
});
