import { useEffect, useMemo, useRef, useState } from 'react';
import type { PopoverElements } from './usePopoverPosition.js';
import type { PopoverProps } from './types.js';

/**
 * Focus the first usable descendant, skipping hidden or disabled controls.
 **/
function focusContent(panel: HTMLDivElement) {
  const candidates = panel.querySelectorAll<HTMLElement>(
    'button:not(:disabled), a[href], input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]:not(:disabled)',
  );
  for (const candidate of candidates) {
    if (candidate.closest('[hidden]')) {
      continue;
    }
    candidate.focus();
    if (panel.ownerDocument.activeElement === candidate) {
      return;
    }
  }
  panel.focus();
}

/**
 * Keep one mounted panel, request controlled changes and restore focus only from inside.
 **/
export function usePopover(props: PopoverProps): {
  elements: PopoverElements;
  open: boolean;
  change: (next: boolean) => void;
} {
  const root = useRef<HTMLDivElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    panel = useRef<HTMLDivElement>(null);
  const elements = useMemo(() => ({ root, trigger, panel }), []);
  const [internal, setInternal] = useState(props.defaultOpen ?? false);
  const open = props.open ?? internal;
  const change = (next: boolean) => {
    if (props.open === undefined) {
      setInternal(next);
    }
    props.onOpenChange?.(next);
  };
  useEffect(() => {
    if (open) {
      panel.current!.showPopover();
      if (props.autoFocus) {
        focusContent(panel.current!);
      }
    } else {
      panel.current!.hidePopover();
    }
  }, [open, props.autoFocus]);

  return { elements, open, change };
}
