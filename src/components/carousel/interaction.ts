import { useRef, type HTMLAttributes, type KeyboardEvent, type PointerEvent } from 'react';
import type { CarouselModel } from './useCarousel.js';

/**
 * Navigate only from the carousel itself, preserving embedded controls and text editing.
 **/
export function carouselKey(event: KeyboardEvent<HTMLElement>, model: CarouselModel, count: number): void {
  if (event.defaultPrevented || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) { return; }
  const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
  const targets: Record<string, number> = { ArrowRight: model.index + (rtl ? -1 : 1), ArrowLeft: model.index + (rtl ? 1 : -1), Home: 0, End: count - 1 };
  const target = targets[event.key];
  if (target === undefined) { return; }
  event.preventDefault();
  model.select(target);
}

/**
 * Recognize intentional horizontal touch gestures without capturing vertical scrolling or links.
 **/
export function useCarouselSwipe(model: CarouselModel): Pick<HTMLAttributes<HTMLDivElement>, 'onPointerDown' | 'onPointerUp' | 'onPointerCancel'> {
  const origin = useRef<{ x: number; y: number } | null>(null);
  /**
   * Begin only an unclaimed touch interaction.
   **/
  const start = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'touch' || (event.target as Element).closest('a, button, input, textarea, select, [contenteditable]')) { return; }
    origin.current = { x: event.clientX, y: event.clientY };
  };
  /**
   * Commit an intentional horizontal swipe.
   **/
  const end = (event: PointerEvent<HTMLDivElement>) => {
    const from = origin.current; origin.current = null;
    if (!from) { return; }
    const dx = event.clientX - from.x, dy = event.clientY - from.y;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) { return; }
    model.select(model.index + swipeDirection(dx, event.currentTarget));
  };
  return { onPointerDown: start, onPointerUp: end, onPointerCancel: () => { origin.current = null; } };
}

/**
 * Mirror a horizontal gesture to the reading direction of its own carousel.
 **/
function swipeDirection(dx: number, element: HTMLElement): number {
  const rtl = getComputedStyle(element).direction === 'rtl';
  return (dx < 0) !== rtl ? 1 : -1;
}
