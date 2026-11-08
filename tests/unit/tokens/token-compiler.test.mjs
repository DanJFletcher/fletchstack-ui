import { describe, expect, it } from 'vitest';
import { compileTokens, cssName, flattenTokens } from '../../../scripts/token-compiler.mjs';

/**
 * Create a minimal two-layer DTCG document for compiler behavior tests.
 **/
function fixture(primitive, value = '{primitive.space}', type = 'dimension') {
  return { primitive, semantic: { gap: { $type: type, $value: value, $description: 'Space between controls.' } } };
}

describe('flattenTokens', () => {
  it('ignores DTCG metadata while retaining token values', () => {
    // arrange
    const given = { $description: 'Metadata', primitive: { $extensions: {}, count: { $type: 'number', $value: 2 } } };
    const expected = { 'primitive.count': { $type: 'number', $value: 2 } };

    // act
    const result = flattenTokens(given);

    // assert
    expect(result).toEqual(expected);
  });

  it('inherits group types through nested groups', () => {
    // arrange
    const given = { $type: 'number', primitive: { nested: { count: { $value: 2 } } } };
    const expected = { 'primitive.nested.count': { $type: 'number', $value: 2 } };

    // act
    const result = flattenTokens(given);

    // assert
    expect(result).toEqual(expected);
  });

  it('lets a leaf override its inherited type', () => {
    // arrange
    const given = { $type: 'number', space: { $type: 'dimension', $value: { value: 8, unit: 'px' } } };
    const expected = { space: { $type: 'dimension', $value: { value: 8, unit: 'px' } } };

    // act
    const result = flattenTokens(given);

    // assert
    expect(result).toEqual(expected);
  });

  it.each([null, false, 'invalid', [], 0])('rejects malformed groups: %j', value => {
    // arrange
    const given = { primitive: { broken: value } };

    // act
    const act = () => flattenTokens(given);

    // assert
    expect(act).toThrow('Invalid group');
  });
});

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

  it.each([
    { name: 'empty documents', given: {}, expected: {} },
    { name: 'internal primitives without public semantics', given: { primitive: { count: { $type: 'number', $value: 2 } } }, expected: {} },
    {
      name: 'group-level token types',
      given: { primitive: { $type: 'number', count: { $value: 2 } }, semantic: { $type: 'number', count: { $value: '{primitive.count}', $description: 'Count.' } } },
      expected: { '--fs-count': '2' },
    },
    {
      name: 'a font role at the end of a semantic path',
      given: { primitive: { size: { $type: 'dimension', $value: { value: 1.25, unit: 'rem' } } }, semantic: { button: { font: { $type: 'dimension', $value: '{primitive.size}', $description: 'Label size.' } } } },
      expected: { '--fs-button-font': '1.25rem' },
    },
  ])('compiles $name', ({ given, expected }) => {
    // act
    const result = compileTokens(given);

    // assert
    expect(result).toEqual(expected);
  });

  it.each([
    { name: 'unknown layers', given: { extra: { count: { $type: 'number', $value: 2 } } }, expected: 'Unknown token layer: extra' },
    { name: 'primitive aliases', given: { primitive: { count: { $type: 'number', $value: 2 }, alias: { $type: 'number', $value: '{primitive.count}' } } }, expected: 'Primitive must be raw' },
    {
      name: 'semantic-to-semantic aliases',
      given: { primitive: { count: { $type: 'number', $value: 2 } }, semantic: { count: { $type: 'number', $value: '{primitive.count}', $description: 'Count.' }, alias: { $type: 'number', $value: '{semantic.count}', $description: 'Alias.' } } },
      expected: 'Semantic must reference a primitive',
    },
    {
      name: 'semantics without a purpose',
      given: { primitive: { count: { $type: 'number', $value: 2 } }, semantic: { count: { $type: 'number', $value: '{primitive.count}' } } },
      expected: 'Missing purpose: semantic.count',
    },
    {
      name: 'colliding public property names',
      given: { primitive: { count: { $type: 'number', $value: 2 } }, semantic: { buttonGap: { $type: 'number', $value: '{primitive.count}', $description: 'Gap.' }, 'button-gap': { $type: 'number', $value: '{primitive.count}', $description: 'Other gap.' } } },
      expected: 'CSS name collision: --fs-button-gap',
    },
  ])('rejects $name', ({ given, expected }) => {
    // act
    const act = () => compileTokens(given);

    // assert
    expect(act).toThrow(expected);
  });
});

describe('cssName', () => {
  it.each([
    { given: 'semantic.button.fontSize', expected: '--fs-button-font-size' },
    { given: 'semantic.surface', expected: '--fs-surface' },
    { given: 'button.borderRadius', expected: '--fs-button-border-radius' },
  ])('maps $given to $expected', ({ given, expected }) => {
    // act
    const result = cssName(given);

    // assert
    expect(result).toBe(expected);
  });
});
