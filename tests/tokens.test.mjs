import { describe, expect, it } from 'vitest';
import { compileTokens } from '../scripts/token-compiler.mjs';

/**
 * Create a minimal two-layer DTCG document for compiler behavior tests.
 **/
function fixture(primitive, value = '{primitive.space}', type = 'dimension') {
  return { primitive, semantic: { gap: { $type: type, $value: value, $description: 'Space between controls.' } } };
}

describe('compileTokens', () => {
  it('resolves a primitive alias to a semantic CSS value', () => {
    // arrange
    const given = fixture({ space: { $type: 'dimension', $value: { value: 8, unit: 'px' } } });
    const expected = { '--fs-gap': '8px' };

    // act
    const result = compileTokens(given);

    // assert
    expect(result).toEqual(expected);
  });
});

it.each([
  { name: 'unresolved references', given: fixture({}, '{primitive.missing}'), expected: 'Unresolved reference' },
  { name: 'alias cycles', given: fixture({ space: { $type: 'dimension', $value: '{primitive.space}' } }), expected: 'Alias cycle' },
  { name: 'incompatible alias types', given: fixture({ space: { $type: 'number', $value: 8 } }), expected: 'Alias type mismatch' },
  { name: 'unsupported types', given: fixture({ space: { $type: 'unknown', $value: 8 } }, '{primitive.space}', 'unknown'), expected: 'Invalid unknown' },
  { name: 'invalid dimension units', given: fixture({ space: { $type: 'dimension', $value: { value: 8, unit: 'em' } } }), expected: 'Invalid dimension' },
  { name: 'relative spatial dimensions', given: fixture({ space: { $type: 'dimension', $value: { value: 1, unit: 'rem' } } }), expected: 'Spatial dimension must use px' },
  { name: 'raw semantic values', given: fixture({}, 8, 'number'), expected: 'Semantic must reference a primitive' },
  { name: 'invalid color channels', given: fixture({ space: { $type: 'color', $value: { colorSpace: 'srgb', components: [2, 0, 0] } } }, '{primitive.space}', 'color'), expected: 'Invalid color' },
])('rejects $name', ({ given, expected }) => {
  // act
  const act = () => compileTokens(given);

  // assert
  expect(act).toThrow(expected);
});

it('preserves rem typography when generating CSS', () => {
  // arrange
  const given = { primitive: { size: { $type: 'dimension', $value: { value: 1.125, unit: 'rem' } } }, semantic: { font: { size: { $type: 'dimension', $value: '{primitive.size}', $description: 'Body font size.' } } } };
  const expected = { '--fs-font-size': '1.125rem' };

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toEqual(expected);
});
