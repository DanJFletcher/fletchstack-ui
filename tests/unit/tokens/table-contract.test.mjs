import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([{ theme: corporate, header: 'rgb(228 232 239 / 1)', selected: 'rgb(232 239 255 / 1)', focus: 'rgb(36 75 176 / 1)' }, { theme: luna, header: 'rgb(36 61 112 / 1)', selected: 'rgb(36 61 112 / 1)', focus: 'rgb(242 213 139 / 1)' }])('publishes Table semantic surfaces and focus with stable spacing', ({ theme, header, selected, focus }) => {
  // arrange
  const expected = { '--fs-table-header-surface': header, '--fs-table-row-selected': selected, '--fs-table-focus-color': focus, '--fs-table-padding': '12px', '--fs-table-compact-padding': '4px', '--fs-table-gap': '8px' };

  // act
  const result = compileTokens({ ...primitives, ...theme });

  // assert
  expect(result).toMatchObject(expected);
});
