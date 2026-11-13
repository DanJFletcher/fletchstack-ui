import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([{ theme: corporate, separator: 'rgb(76 89 109 / 1)' }, { theme: luna, separator: 'rgb(184 177 205 / 1)' }])('publishes muted Breadcrumbs separators and stable disclosure geometry', ({ theme, separator }) => {
  // arrange
  const expected = { '--fs-breadcrumbs-separator': separator, '--fs-breadcrumbs-gap': '8px', '--fs-breadcrumbs-current-weight': '700', '--fs-breadcrumbs-toggle-size': '24px' };

  // act
  const result = compileTokens({ ...primitives, ...theme });

  // assert
  expect(result).toMatchObject(expected);
});
