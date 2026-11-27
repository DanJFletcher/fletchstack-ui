import { expect, it } from 'vitest';
import corporate from '../../../tokens/corporate.json' with { type: 'json' };
import luna from '../../../tokens/luna.json' with { type: 'json' };
import primitives from '../../../tokens/primitives.json' with { type: 'json' };
import { compileTokens } from '../../../scripts/token-compiler.mjs';

it.each([corporate, luna])(
  'publishes navigation geometry and theme-aware current roles',
  (theme) => {
    // arrange
    const expected = {
      '--fs-bottom-navigation-icon-size': '24px',
      '--fs-bottom-navigation-indicator-width': '48px',
      '--fs-bottom-navigation-indicator-height': '32px',
      '--fs-bottom-navigation-padding-block': '8px',
    };

    // act
    const result = compileTokens({ ...primitives, ...theme });

    // assert
    expect(result).toMatchObject(expected);
    expect(result['--fs-bottom-navigation-current']).toBe(result['--fs-link-text']);
  },
);
