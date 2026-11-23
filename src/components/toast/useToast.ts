import { useEffect, useRef, useState, type RefObject } from 'react';
import type { ToastProps } from './types.js';

type ToastState = { open: boolean; dismiss: () => void; element: RefObject<HTMLDivElement | null> };

/**
 * Remember the latest outside target without stealing focus after the user has moved away.
 **/
function trackDismissFocus(element: HTMLDivElement): () => void {
  let outside = document.activeElement as HTMLElement;
  let focused = false;
  const track = (event: FocusEvent) => {
    focused = element.contains(event.target as Node);
    if (!focused) { outside = event.target as HTMLElement; }
  };
  document.addEventListener('focusin', track);

  return () => {
    document.removeEventListener('focusin', track);
    if (focused && outside.isConnected) { outside.focus(); }
  };
}

/**
 * Restore focus when a focused toast closes or is removed by its parent.
 **/
function useDismissFocus(element: RefObject<HTMLDivElement | null>, open: boolean): void {
  useEffect(() => {
    if (!open) { return; }
    return trackDismissFocus(element.current!);
  }, [open, element]);
}

/**
 * Keep controlled visibility authoritative and notify the consumer for dismissal requests.
 **/
export function useToast(props: { open: boolean | undefined; defaultOpen: boolean | undefined; onOpenChange: ToastProps['onOpenChange']; hidden: boolean | undefined }): ToastState {
  const [local, setLocal] = useState(props.defaultOpen ?? true);
  const element = useRef<HTMLDivElement>(null);
  const open = (props.open ?? local) && !props.hidden;
  useDismissFocus(element, open);
  const dismiss = () => {
    if (props.open === undefined) { setLocal(false); }
    props.onOpenChange?.(false);
  };

  return { open, dismiss, element };
}
