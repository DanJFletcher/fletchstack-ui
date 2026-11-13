import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([{ theme: corporate, surface: 'rgb(255 255 255 / 1)', expanded: 'rgb(232 239 255 / 1)' }, { theme: luna, surface: 'rgb(41 36 66 / 1)', expanded: 'rgb(36 61 112 / 1)' }])('publishes Menu surfaces and stable navigation geometry', ({ theme, surface, expanded }) => {
  // arrange
  const expected = { '--fs-menu-surface': surface, '--fs-menu-expanded-surface': expanded, '--fs-menu-width': '200px', '--fs-menu-indent': '16px', '--fs-menu-focus-width': '2px', '--fs-menu-viewport-inset': '8px' };

  // act
  const result = compileTokens({ ...primitives, ...theme });

  // assert
  expect(result).toMatchObject(expected);
});
