import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import legacy from '../../fixtures/spatial-legacy-tokens.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([{ name: 'Corporate', theme: corporate }, { name: 'Luna', theme: luna }])('$name exposes independent spatial roles beside legacy leaves', ({ theme }) => {
  // arrange
  const given = { ...primitives, ...theme };
  const expected = {
    '--fs-space-gap-label': '8px', '--fs-space-gap-actions': '12px', '--fs-space-gap-related': '16px',
    '--fs-space-stack-group': '24px', '--fs-space-inset-container': '24px', '--fs-layout-section-gap': '64px',
    '--fs-gallery-search-padding-inline': '36px', '--fs-gallery-search-padding-block': '8px',
    '--fs-gallery-heading-gap': '16px', '--fs-gallery-preview-inset': '1px',
    '--fs-space-inline': '12px', '--fs-space-stack': '24px', '--fs-space-inset': '24px',
  };

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toMatchObject(expected);
});

it.each([{ name: 'corporate', theme: corporate }, { name: 'luna', theme: luna }])('$name preserves every previously published token default', ({ name, theme }) => {
  // arrange
  const given = { ...primitives, ...theme };
  const expected = legacy[name];

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toMatchObject(expected);
});

it.each([
  { given: 'px0', expected: { value: 0, unit: 'px' } },
  { given: 'px2', expected: { value: 2, unit: 'px' } },
  { given: 'px4', expected: { value: 4, unit: 'px' } },
  { given: 'px8', expected: { value: 8, unit: 'px' } },
  { given: 'px12', expected: { value: 12, unit: 'px' } },
  { given: 'px16', expected: { value: 16, unit: 'px' } },
  { given: 'px20', expected: { value: 20, unit: 'px' } },
  { given: 'px24', expected: { value: 24, unit: 'px' } },
  { given: 'px32', expected: { value: 32, unit: 'px' } },
  { given: 'px40', expected: { value: 40, unit: 'px' } },
  { given: 'px48', expected: { value: 48, unit: 'px' } },
  { given: 'px64', expected: { value: 64, unit: 'px' } },
  { given: 'px80', expected: { value: 80, unit: 'px' } },
  { given: 'px96', expected: { value: 96, unit: 'px' } },
])('supplies the raw scale or precision value $given', ({ given, expected }) => {
  // arrange
  const token = primitives.primitive[given];

  // act
  const result = token.$value;

  // assert
  expect(result).toEqual(expected);
});
