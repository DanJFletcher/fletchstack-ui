import { placePopover, type Placement } from '../popover/position.js';
import type { TooltipPlacement } from './types.js';

/**
 * Fall back vertically when horizontal clamping would cover the described control.
 **/
function tooltipSide(input: Placement) {
  const point = placePopover(input);
  const fitsLeft = point.left + input.width + input.offset <= input.anchor.left;
  const fitsRight = point.left >= input.anchor.right + input.offset;
  if ((point.side === 'left' && !fitsLeft) || (point.side === 'right' && !fitsRight)) {
    return placePopover({ ...input, side: 'top' }).side;
  }

  return point.side;
}

/**
 * Bound the tooltip to its chosen side so long help never obscures its focused trigger.
 **/
export function fitTooltip(input: Placement): { side: TooltipPlacement; left: number; top: number; maxHeight: number } {
  const side = tooltipSide(input), { viewport, anchor, padding, offset } = input;
  const height = viewport.height - padding * 2;
  const available = { top: anchor.top - viewport.top - padding - offset, bottom: viewport.top + viewport.height - anchor.bottom - padding - offset, left: height, right: height };
  const maxHeight = Math.max(0, Math.min(height, available[side]));

  return { ...placePopover({ ...input, side, height: Math.min(input.height, maxHeight) }), maxHeight };
}
