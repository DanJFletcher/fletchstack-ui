import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([corporate, luna])('publishes themed Tabs with shared geometry', theme => {
  // arrange
  const expected = { '--fs-tabs-padding-block': '8px', '--fs-tabs-padding-inline': '16px', '--fs-tabs-panel-gap': '24px', '--fs-tabs-pill-radius': '20px' };

  // act
  const result = compileTokens({ ...primitives, ...theme });

  // assert
  expect(result).toMatchObject(expected);
  expect(result['--fs-tabs-selected-text']).toBe(result['--fs-link-text']);
});
