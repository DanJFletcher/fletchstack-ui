import { expect, it } from 'vitest';
import type { Placement } from '../../src/components/popover/position';
import { fitTooltip } from '../../src/components/tooltip/position';

const base: Placement = {
  anchor: { left: 100, top: 100, right: 180, bottom: 140, width: 80, height: 40 },
  width: 60,
  height: 30,
  viewport: { left: 0, top: 0, width: 500, height: 400 },
  side: 'top',
  align: 'center',
  offset: 8,
  padding: 8,
  rtl: false,
};

/**
 * Verify focus-safe placement with independently worked-out side limits.
 **/
export function tooltipPositionContracts() {
  it.each([
    { side: 'top', expected: { side: 'top', left: 110, top: 62, maxHeight: 84 } },
    { side: 'bottom', expected: { side: 'bottom', left: 110, top: 148, maxHeight: 244 } },
    { side: 'left', expected: { side: 'left', left: 32, top: 105, maxHeight: 384 } },
    { side: 'right', expected: { side: 'right', left: 188, top: 105, maxHeight: 384 } },
  ] as const)('retains $side when the tooltip fits beside its trigger', ({ side, expected }) => {
    // arrange
    const given = { ...base, side };

    // act
    const result = fitTooltip(given);

    // assert
    expect(result).toEqual(expected);
  });
  it('limits long vertical content below its focused trigger', () => {
    // arrange
    const given = { ...base, height: 600 };
    const expected = { side: 'bottom', left: 110, top: 148, maxHeight: 244 };

    // act
    const result = fitTooltip(given);

    // assert
    expect(result).toEqual(expected);
  });
  it.each(['left', 'right'] as const)(
    'falls back vertically when %s cannot fit without covering the trigger',
    (side) => {
      // arrange
      const given = { ...base, side, width: 400 };
      const expected = { side: 'top', left: 8, top: 62, maxHeight: 84 };

      // act
      const result = fitTooltip(given);

      // assert
      expect(result).toEqual(expected);
    },
  );
  it('clamps a viewport offset without allowing a height greater than the viewport', () => {
    // arrange
    const given = {
      ...base,
      height: 600,
      viewport: { left: 20, top: 40, width: 100, height: 200 },
    };
    const expected = { side: 'bottom', left: 52, top: 148, maxHeight: 84 };

    // act
    const result = fitTooltip(given);

    // assert
    expect(result).toEqual(expected);
  });
  it('falls back above a trigger when the left side would overlap after clamping', () => {
    // arrange
    const given = {
      ...base,
      side: 'left' as const,
      width: 400,
      anchor: { ...base.anchor, left: 300, right: 380 },
    };
    const expected = { side: 'top', left: 92, top: 62, maxHeight: 84 };

    // act
    const result = fitTooltip(given);

    // assert
    expect(result).toEqual(expected);
  });
}
