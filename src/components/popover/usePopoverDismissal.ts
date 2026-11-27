import { useEffect, useRef, type RefObject } from 'react';
import type { PopoverProps } from './types.js';
import type { PopoverElements } from './usePopoverPosition.js';

/**
 * Coordinate pointer and focus dismissal so one outside activation requests closure once.
 **/
function listenForDismissal(
  root: HTMLDivElement,
  props: PopoverProps,
  change: (next: boolean) => void,
  pointerTarget: RefObject<EventTarget | null>,
) {
  const document = root.ownerDocument;
  const outside = (target: EventTarget | null) => target instanceof Node && !root.contains(target);
  const pointer = (event: PointerEvent) => {
    pointerTarget.current = null;
    if (props.closeOnOutsideClick !== false && outside(event.target)) {
      pointerTarget.current = event.target;
      change(false);
    }
  };
  const focus = (event: FocusEvent) => {
    const fromPointer =
      event.target instanceof Node &&
      pointerTarget.current instanceof Node &&
      event.target.contains(pointerTarget.current);
    if (!fromPointer && props.closeOnFocusOutside !== false && outside(event.target)) {
      change(false);
    }
    pointerTarget.current = null;
  };
  document.addEventListener('pointerdown', pointer);
  document.addEventListener('focusin', focus);

  return () => {
    document.removeEventListener('pointerdown', pointer);
    document.removeEventListener('focusin', focus);
  };
}

/**
 * Dismiss an outside interaction without taking focus away from its destination.
 **/
export function usePopoverDismissal(
  elements: PopoverElements,
  props: PopoverProps,
  state: { open: boolean; change: (next: boolean) => void },
): void {
  const pointerTarget = useRef<EventTarget | null>(null);

  useEffect(() => {
    if (!state.open) {
      pointerTarget.current = null;
      return;
    }

    return listenForDismissal(elements.root.current!, props, state.change, pointerTarget);
  }, [elements, state.open, state.change, props.closeOnOutsideClick, props.closeOnFocusOutside]);
}
