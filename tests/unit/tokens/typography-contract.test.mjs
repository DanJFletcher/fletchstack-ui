import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([
  { name: 'Corporate', theme: corporate },
  { name: 'Luna', theme: luna },
])('$name exposes the approved content typography scale', ({ theme }) => {
  // arrange
  const given = { ...primitives, ...theme };
  const expected = {
    '--fs-typography-heading-font-page': '2rem',
    '--fs-typography-heading-font-section': '1.5rem',
    '--fs-typography-heading-font-subheading': '1.125rem',
    '--fs-typography-heading-line-height': '1.25',
    '--fs-typography-heading-weight': '700',
    '--fs-typography-text-font-lead': '1.125rem',
    '--fs-typography-text-font-body': '1rem',
    '--fs-typography-text-font-small': '0.875rem',
    '--fs-typography-text-line-height': '1.5',
    '--fs-typography-text-weight': '400',
  };

  // act
  const result = compileTokens(given);

  // assert
  expect(result).toMatchObject(expected);
});
