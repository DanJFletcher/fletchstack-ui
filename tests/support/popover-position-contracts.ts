import { expect, it } from 'vitest';
import { placePopover, type Placement } from '../../src/components/popover/position';

const base: Placement = {
  anchor: { left: 100, top: 100, right: 180, bottom: 140, width: 80, height: 40 },
  width: 60,
  height: 30,
  viewport: { left: 0, top: 0, width: 500, height: 400 },
  side: 'bottom',
  align: 'start',
  offset: 8,
  padding: 8,
  rtl: false,
};

/**
 * Check independently worked-out coordinates for each edge and logical alignment.
 **/
export function popoverPositionContracts() {
  it.each([
    { side: 'top', align: 'start', left: 100, top: 62 },
    { side: 'top', align: 'center', left: 110, top: 62 },
    { side: 'top', align: 'end', left: 120, top: 62 },
    { side: 'bottom', align: 'start', left: 100, top: 148 },
    { side: 'bottom', align: 'center', left: 110, top: 148 },
    { side: 'bottom', align: 'end', left: 120, top: 148 },
    { side: 'left', align: 'start', left: 32, top: 100 },
    { side: 'left', align: 'center', left: 32, top: 105 },
    { side: 'left', align: 'end', left: 32, top: 110 },
    { side: 'right', align: 'start', left: 188, top: 100 },
    { side: 'right', align: 'center', left: 188, top: 105 },
    { side: 'right', align: 'end', left: 188, top: 110 },
  ] as const)('places a $side panel with $align alignment', ({ side, align, left, top }) => {
    // arrange
    const given = { ...base, side, align },
      expected = { side, left, top };

    // act
    const result = placePopover(given);

    // assert
    expect(result).toEqual(expected);
  });
  it.each([
    { align: 'start', left: 120 },
    { align: 'end', left: 100 },
    { align: 'center', left: 110 },
  ] as const)('mirrors logical $align alignment in RTL', ({ align, left }) => {
    // arrange
    const given = { ...base, align, rtl: true },
      expected = { side: 'bottom', left, top: 148 };

    // act
    const result = placePopover(given);

    // assert
    expect(result).toEqual(expected);
  });
  it('flips toward the opposite edge when it has more room', () => {
    // arrange
    const given = { ...base, side: 'top' as const, anchor: { ...base.anchor, top: 0, bottom: 40 } };
    const expected = { side: 'bottom', left: 100, top: 48 };

    // act
    const result = placePopover(given);

    // assert
    expect(result).toEqual(expected);
  });
  it('clamps an oversized panel when neither side offers more room', () => {
    // arrange
    const given = {
      ...base,
      height: 600,
      viewport: { left: 20, top: 40, width: 100, height: 200 },
    };
    const expected = { side: 'bottom', left: 52, top: 48 };

    // act
    const result = placePopover(given);

    // assert
    expect(result).toEqual(expected);
  });
  it('flips a right panel left at the viewport edge', () => {
    // arrange
    const given = {
      ...base,
      side: 'right' as const,
      anchor: { ...base.anchor, left: 450, right: 530 },
    };
    const expected = { side: 'left', left: 382, top: 100 };

    // act
    const result = placePopover(given);

    // assert
    expect(result).toEqual(expected);
  });
}
