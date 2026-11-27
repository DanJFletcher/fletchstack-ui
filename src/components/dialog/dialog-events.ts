import { useRef, type MouseEvent, type PointerEvent, type SyntheticEvent } from 'react';
import type { DialogProps } from './types.js';

/**
 * Distinguish the native backdrop from padding or descendants within the panel.
 **/
export function outsideDialog(event: MouseEvent<HTMLDialogElement>): boolean {
  const box = event.currentTarget.getBoundingClientRect();

  return (
    event.target === event.currentTarget &&
    (event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom)
  );
}

/**
 * Keep native Escape cancellable while requesting controlled dismissal.
 **/
function cancelDialog(props: DialogProps, event: SyntheticEvent<HTMLDialogElement>): void {
  props.onCancel?.(event);
  const veto = event.defaultPrevented;
  event.preventDefault();
  if (!veto && props.closeOnEscape !== false) {
    props.onOpenChange(false);
  }
}

/**
 * Report native form or imperative closure, avoiding duplicate prop-driven notifications.
 **/
function closedDialog(props: DialogProps, event: SyntheticEvent<HTMLDialogElement>): void {
  props.onClose?.(event);
  if (props.open) {
    props.onOpenChange(false);
  }
}

/**
 * Preserve native handlers and distinguish an entire backdrop gesture from panel interaction.
 **/
export function useDialogEvents(
  props: DialogProps,
): Required<Pick<DialogProps, 'onCancel' | 'onClose' | 'onClick' | 'onPointerDown'>> {
  const backdropStart = useRef(false);
  const onPointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    backdropStart.current = outsideDialog(event);
    props.onPointerDown?.(event);
  };
  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    props.onClick?.(event);
    if (
      !event.defaultPrevented &&
      props.closeOnBackdropClick !== false &&
      backdropStart.current &&
      outsideDialog(event)
    ) {
      props.onOpenChange(false);
    }
    backdropStart.current = false;
  };

  return {
    onCancel: (event) => cancelDialog(props, event),
    onClose: (event) => closedDialog(props, event),
    onClick,
    onPointerDown,
  };
}
