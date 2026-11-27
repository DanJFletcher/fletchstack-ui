import { useEffect, type RefObject } from 'react';
import { fitTooltip } from './position.js';
import type { TooltipPlacement } from './types.js';

export interface TooltipElements {
  anchor: RefObject<HTMLSpanElement | null>;
  panel: RefObject<HTMLDivElement | null>;
}

/**
 * Reuse the proven edge-flipping policy while measuring the visible viewport and tooltip tokens.
 **/
function positionTooltip(elements: TooltipElements, placement: TooltipPlacement) {
  const panel = elements.panel.current!,
    anchor = elements.anchor.current!,
    view = anchor.ownerDocument.defaultView!;
  const visual = view.visualViewport,
    css = view.getComputedStyle(panel);
  const padding = parseFloat(css.getPropertyValue('--fs-tooltip-viewport-inset')),
    offset = parseFloat(css.getPropertyValue('--fs-tooltip-offset'));
  const viewport = {
    left: visual?.offsetLeft ?? 0,
    top: visual?.offsetTop ?? 0,
    width: visual?.width ?? view.innerWidth,
    height: visual?.height ?? view.innerHeight,
  };
  panel.style.maxWidth = `min(var(--fs-tooltip-max-width), ${Math.max(0, viewport.width - padding * 2)}px)`;
  panel.style.maxHeight = `${Math.max(0, viewport.height - padding * 2)}px`;
  const rect = panel.getBoundingClientRect();
  const point = fitTooltip({
    anchor: anchor.getBoundingClientRect(),
    width: rect.width,
    height: rect.height,
    viewport,
    padding,
    offset,
    side: placement,
    align: 'center',
    rtl: false,
  });
  panel.style.maxHeight = `${point.maxHeight}px`;
  Object.assign(panel.style, { left: `${point.left}px`, top: `${point.top}px` });
  panel.dataset['side'] = point.side;
}

/**
 * Subscribe to geometry changes only while the native top-layer description is visible.
 **/
function trackPosition(elements: TooltipElements, placement: TooltipPlacement) {
  const update = () => positionTooltip(elements, placement),
    view = elements.anchor.current!.ownerDocument.defaultView!;
  const observer = new ResizeObserver(update);
  observer.observe(elements.anchor.current!);
  observer.observe(elements.panel.current!);
  view.addEventListener('resize', update);
  view.addEventListener('scroll', update, true);
  view.visualViewport?.addEventListener('resize', update);
  view.visualViewport?.addEventListener('scroll', update);
  update();

  return () => {
    observer.disconnect();
    view.removeEventListener('resize', update);
    view.removeEventListener('scroll', update, true);
    view.visualViewport?.removeEventListener('resize', update);
    view.visualViewport?.removeEventListener('scroll', update);
  };
}

/**
 * Reveal content without a portal, autofocus, animation, modality or a new tab stop.
 **/
export function useTooltipLayer(
  elements: TooltipElements,
  open: boolean,
  placement: TooltipPlacement,
): void {
  useEffect(() => {
    const panel = elements.panel.current!;
    if (!open) {
      panel.hidePopover();
      return;
    }
    panel.showPopover();

    return trackPosition(elements, placement);
  }, [elements, open, placement]);
}
