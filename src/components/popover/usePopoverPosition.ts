import { useEffect, type RefObject } from 'react';
import { placePopover, type Placement } from './position.js';
import type { PopoverProps } from './types.js';

export interface PopoverElements { root: RefObject<HTMLDivElement | null>; trigger: RefObject<HTMLButtonElement | null>; panel: RefObject<HTMLDivElement | null> }

/**
 * Read the visible viewport so pinch zoom and virtual keyboard resizing remain bounded.
 **/
function viewportOf(view: Window): Placement['viewport'] {
  const visual = view.visualViewport;

  return { left: visual?.offsetLeft ?? 0, top: visual?.offsetTop ?? 0, width: visual?.width ?? view.innerWidth, height: visual?.height ?? view.innerHeight };
}

/**
 * Position against the visual viewport while allowing a long panel to scroll.
 **/
function updatePosition(elements: PopoverElements, props: PopoverProps) {
  const panel = elements.panel.current!, trigger = elements.trigger.current!, view = trigger.ownerDocument.defaultView!;
  const css = view.getComputedStyle(panel), viewport = viewportOf(view);
  const padding = props.collisionPadding ?? parseFloat(css.getPropertyValue('--fs-popover-viewport-inset'));
  const maxWidth = typeof props.panelMaxWidth === 'number' ? `${props.panelMaxWidth}px` : props.panelMaxWidth;
  const offset = props.offset ?? parseFloat(css.getPropertyValue('--fs-popover-offset'));
  panel.style.maxWidth = maxWidth ?? 'var(--fs-popover-width)';
  panel.style.maxHeight = `${Math.max(0, viewport.height - padding * 2)}px`;
  const width = props.matchTriggerWidth ? `${trigger.getBoundingClientRect().width}px` : 'var(--fs-popover-width)';
  panel.style.width = `min(${width}, ${Math.max(0, viewport.width - padding * 2)}px)`;
  const rect = panel.getBoundingClientRect();
  const point = placePopover({ anchor: trigger.getBoundingClientRect(), width: rect.width, height: rect.height, viewport, padding, offset, side: props.side ?? 'bottom', align: props.align ?? 'start', rtl: css.direction === 'rtl' });
  Object.assign(panel.style, { left: `${point.left}px`, top: `${point.top}px` });
  panel.dataset['side'] = point.side;
}

/**
 * Track viewport, ancestor scrolling and content size without polling.
 **/
export function usePopoverPosition(elements: PopoverElements, props: PopoverProps, open: boolean): void {
  useEffect(() => {
    if (!open) { return; }
    const update = () => updatePosition(elements, props), view = elements.root.current!.ownerDocument.defaultView!;
    const observer = new ResizeObserver(update);
    observer.observe(elements.trigger.current!); observer.observe(elements.panel.current!);
    view.addEventListener('resize', update); view.addEventListener('scroll', update, true);
    view.visualViewport?.addEventListener('resize', update); view.visualViewport?.addEventListener('scroll', update);
    update();

    return () => { observer.disconnect(); view.removeEventListener('resize', update); view.removeEventListener('scroll', update, true); view.visualViewport?.removeEventListener('resize', update); view.visualViewport?.removeEventListener('scroll', update); };
  }, [open, elements, props.side, props.align, props.offset, props.collisionPadding, props.matchTriggerWidth, props.panelMaxWidth]);
}
