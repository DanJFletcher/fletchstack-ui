import type { PopoverAlign, PopoverSide } from './types.js';

type Rect = Pick<DOMRect, 'left' | 'top' | 'right' | 'bottom' | 'width' | 'height'>;
export interface Placement {
  anchor: Rect;
  width: number;
  height: number;
  viewport: { left: number; top: number; width: number; height: number };
  side: PopoverSide;
  align: PopoverAlign;
  offset: number;
  padding: number;
  rtl: boolean;
}
const opposite = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' } as const;

/**
 * Calculate one candidate using logical alignment on horizontal edges.
 **/
function candidate(input: Placement, side: PopoverSide) {
  const { anchor, width, height, align, offset, rtl } = input;
  const horizontal = side === 'top' || side === 'bottom';
  const start = horizontal ? anchor.left : anchor.top,
    span = horizontal ? anchor.width - width : anchor.height - height;
  const mirrored = align === 'start' ? 'end' : 'start';
  const alignment = horizontal && rtl && align !== 'center' ? mirrored : align;
  const fraction = alignment === 'end' ? 1 : 0;
  const cross = start + (alignment === 'center' ? span / 2 : span * fraction);

  return horizontal
    ? { left: cross, top: side === 'top' ? anchor.top - height - offset : anchor.bottom + offset }
    : { left: side === 'left' ? anchor.left - width - offset : anchor.right + offset, top: cross };
}

/**
 * Measure room on the requested edge without changing cross-axis alignment.
 **/
function space(input: Placement, side: PopoverSide) {
  const { anchor, viewport, padding } = input;
  const edges = {
    top: anchor.top - viewport.top,
    bottom: viewport.top + viewport.height - anchor.bottom,
    left: anchor.left - viewport.left,
    right: viewport.left + viewport.width - anchor.right,
  };

  return edges[side] - padding;
}

/**
 * Flip toward greater space, then clamp the panel inside the visual viewport.
 **/
export function placePopover(input: Placement): { side: PopoverSide; left: number; top: number } {
  const { viewport, padding, width, height, offset } = input;
  const required = (input.side === 'top' || input.side === 'bottom' ? height : width) + offset;
  const flipped = opposite[input.side];
  const side =
    space(input, input.side) < required && space(input, flipped) > space(input, input.side)
      ? flipped
      : input.side;
  const point = candidate(input, side);

  return {
    side,
    left: Math.max(
      viewport.left + padding,
      Math.min(point.left, viewport.left + viewport.width - padding - width),
    ),
    top: Math.max(
      viewport.top + padding,
      Math.min(point.top, viewport.top + viewport.height - padding - height),
    ),
  };
}
