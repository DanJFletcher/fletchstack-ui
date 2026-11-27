import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([corporate, luna])('publishes themed modal surfaces with shared geometry', (theme) => {
  // arrange
  const expected = {
    '--fs-dialog-padding': '24px',
    '--fs-dialog-width-sm': '400px',
    '--fs-dialog-width-md': '512px',
    '--fs-dialog-width-lg': '720px',
    '--fs-dialog-radius': '12px',
  };

  // act
  const result = compileTokens({ ...primitives, ...theme });

  // assert
  expect(result).toMatchObject(expected);
  expect(result['--fs-dialog-surface']).toBe(result['--fs-card-surface']);
});
