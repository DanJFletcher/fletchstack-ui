import { describe, it, expect } from 'vitest';
import { cssValue, validateValue } from '../../scripts/token-values.mjs';

/**
 * Verify the DTCG motion types at their validation/serialization boundary in both independent gates.
 **/
export function motionContracts() {
  describe('DTCG motion values', () => {
    it.each([
      ['duration', { value: 160, unit: 'ms' }, '160ms'],
      ['duration', { value: 0.16, unit: 's' }, '0.16s'],
      ['duration', { value: 0, unit: 'ms' }, '0ms'],
      ['cubicBezier', [0.2, 0.8, 0.2, 1], 'cubic-bezier(0.2, 0.8, 0.2, 1)'],
      ['cubicBezier', [0, -1, 1, 2], 'cubic-bezier(0, -1, 1, 2)'],
    ])('serializes valid %s %j', (type, value, expected) => {
      // arrange
      validateValue(type, value, 'primitive.motion');
      // act
      const result = cssValue(type, value);
      // assert
      expect(result).toBe(expected);
    });
    it.each([
      ['duration', undefined],
      ['duration', { value: '160', unit: 'ms' }],
      ['duration', { value: Infinity, unit: 'ms' }],
      ['duration', { value: -1, unit: 'ms' }],
      ['duration', { value: 1, unit: 'px' }],
      ['cubicBezier', undefined],
      ['cubicBezier', [0, 0, 1]],
      ['cubicBezier', ['0', 0, 1, 1]],
      ['cubicBezier', [0, Number.NaN, 1, 1]],
      ['cubicBezier', [-0.1, 0, 1, 1]],
      ['cubicBezier', [0, 0, 1.1, 1]],
    ])('rejects invalid %s %j', (type, value) => {
      // arrange
      // act
      const result = () => validateValue(type, value, 'primitive.motion');
      // assert
      expect(result).toThrow(Error);
    });
  });
}
