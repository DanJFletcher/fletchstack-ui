import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([
  { theme: corporate, surface: 'rgb(255 255 255 / 1)' },
  { theme: luna, surface: 'rgb(17 19 41 / 1)' },
])('publishes themed Navbar surfaces with a shared container boundary', ({ theme, surface }) => {
  // arrange
  const expected = {
    '--fs-navbar-surface': surface,
    '--fs-navbar-collapse-width': '720px',
    '--fs-navbar-padding': '16px',
    '--fs-navbar-radius': '6px',
    '--fs-navbar-compact-gap': '8px',
  };

  // act
  const result = compileTokens({ ...primitives, ...theme });

  // assert
  expect(result).toMatchObject(expected);
});
