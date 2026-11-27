import { describe, expect, it } from 'vitest';
import { cssValue, validateValue } from '../../../scripts/token-values.mjs';

describe('validateValue', () => {
  it.each([
    { name: 'zero pixels', type: 'dimension', value: { value: 0, unit: 'px' } },
    { name: 'relative typography', type: 'dimension', value: { value: 1.25, unit: 'rem' } },
    { name: 'opaque sRGB', type: 'color', value: { colorSpace: 'srgb', components: [0, 0.5, 1] } },
    {
      name: 'transparent sRGB',
      type: 'color',
      value: { colorSpace: 'srgb', components: [1, 0, 0], alpha: 0 },
    },
    { name: 'font fallback list', type: 'fontFamily', value: ['Example Sans', 'sans-serif'] },
    { name: 'minimum font weight', type: 'fontWeight', value: 1 },
    { name: 'maximum font weight', type: 'fontWeight', value: 1000 },
    { name: 'zero', type: 'number', value: 0 },
    { name: 'negative finite number', type: 'number', value: -1.5 },
  ])('accepts $name', ({ type, value }) => {
    // arrange
    const path = 'primitive.example';

    // act
    const act = () => validateValue(type, value, path);

    // assert
    expect(act).not.toThrow();
  });

  it.each([
    { name: 'missing dimension', type: 'dimension', value: undefined },
    { name: 'null dimension', type: 'dimension', value: null },
    { name: 'text dimension', type: 'dimension', value: { value: '8', unit: 'px' } },
    { name: 'infinite dimension', type: 'dimension', value: { value: Infinity, unit: 'px' } },
    { name: 'unsupported unit', type: 'dimension', value: { value: 8, unit: 'em' } },
    { name: 'missing color', type: 'color', value: undefined },
    {
      name: 'unsupported color space',
      type: 'color',
      value: { colorSpace: 'hsl', components: [0, 0, 0] },
    },
    { name: 'non-array channels', type: 'color', value: { colorSpace: 'srgb', components: '000' } },
    { name: 'too few channels', type: 'color', value: { colorSpace: 'srgb', components: [0, 0] } },
    { name: 'text channel', type: 'color', value: { colorSpace: 'srgb', components: ['0', 0, 0] } },
    {
      name: 'infinite channel',
      type: 'color',
      value: { colorSpace: 'srgb', components: [Infinity, 0, 0] },
    },
    {
      name: 'negative channel',
      type: 'color',
      value: { colorSpace: 'srgb', components: [-0.1, 0, 0] },
    },
    {
      name: 'channel above one',
      type: 'color',
      value: { colorSpace: 'srgb', components: [1.1, 0, 0] },
    },
    {
      name: 'negative opacity',
      type: 'color',
      value: { colorSpace: 'srgb', components: [0, 0, 0], alpha: -0.1 },
    },
    {
      name: 'opacity above one',
      type: 'color',
      value: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 1.1 },
    },
    { name: 'non-array font family', type: 'fontFamily', value: 'serif' },
    { name: 'empty font list', type: 'fontFamily', value: [] },
    { name: 'non-string font name', type: 'fontFamily', value: [42] },
    { name: 'empty font name', type: 'fontFamily', value: [''] },
    { name: 'nonfinite weight', type: 'fontWeight', value: NaN },
    { name: 'weight below one', type: 'fontWeight', value: 0 },
    { name: 'weight above 1000', type: 'fontWeight', value: 1001 },
    { name: 'text number', type: 'number', value: '8' },
    { name: 'nonfinite number', type: 'number', value: NaN },
    { name: 'unsupported token type', type: 'shadow', value: {} },
  ])('rejects $name with the token path', ({ type, value }) => {
    // arrange
    const expected = `Invalid ${type} value at primitive.example`;

    // act
    const act = () => validateValue(type, value, 'primitive.example');

    // assert
    expect(act).toThrow(expected);
  });
});

describe('cssValue', () => {
  it.each([
    {
      name: 'fixed spatial units',
      type: 'dimension',
      value: { value: 8, unit: 'px' },
      expected: '8px',
    },
    {
      name: 'relative typography units',
      type: 'dimension',
      value: { value: 1.25, unit: 'rem' },
      expected: '1.25rem',
    },
    {
      name: 'rounded sRGB channels with default opacity',
      type: 'color',
      value: { components: [0, 0.5, 1] },
      expected: 'rgb(0 128 255 / 1)',
    },
    {
      name: 'zero opacity',
      type: 'color',
      value: { components: [1, 0, 0], alpha: 0 },
      expected: 'rgb(255 0 0 / 0)',
    },
    {
      name: 'fractional opacity',
      type: 'color',
      value: { components: [0, 0, 1], alpha: 0.5 },
      expected: 'rgb(0 0 255 / 0.5)',
    },
    {
      name: 'quoted custom fonts and unquoted generic fallbacks',
      type: 'fontFamily',
      value: ['Example Sans', 'serif', 'sans-serif', 'monospace', 'system-ui'],
      expected: '"Example Sans", serif, sans-serif, monospace, system-ui',
    },
    {
      name: 'escaped quotes in a font name',
      type: 'fontFamily',
      value: ['Example "Display"'],
      expected: '"Example \\"Display\\""',
    },
    { name: 'unitless font weight', type: 'fontWeight', value: 600, expected: '600' },
    { name: 'unitless line height', type: 'number', value: 1.5, expected: '1.5' },
  ])('serializes $name', ({ type, value, expected }) => {
    // act
    const result = cssValue(type, value);

    // assert
    expect(result).toBe(expected);
  });
});
