import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type RefObject } from 'react';
import { useNavbarWidth } from './useNavbarWidth.js';
import type { NavbarProps } from './types.js';

export interface NavbarModel {
  root: RefObject<HTMLElement | null>; trigger: RefObject<HTMLButtonElement | null>; panel: RefObject<HTMLDivElement | null>;
  resizeFocus: RefObject<HTMLElement | null>;
  compact: boolean; expanded: boolean; panelId: string;
  change: (open: boolean) => void; escape: (event: KeyboardEvent<HTMLElement>) => void; select: (event: MouseEvent<HTMLElement>) => void;
}

/**
 * Repair focus only when responsive visibility hides the currently focused region.
 **/
function useNavbarFocus(model: NavbarModel): void {
  useEffect(() => {
    const focused = model.resizeFocus.current ?? document.activeElement;
    model.resizeFocus.current = null;
    if (model.compact && !model.expanded && model.panel.current?.contains(focused)) { model.trigger.current!.focus(); }
    else if (!model.compact && focused === model.trigger.current) {
      model.panel.current!.querySelector<HTMLElement>('a[href],button,input,select,textarea,[tabindex="0"]')?.focus();
    }
    else if (focused instanceof HTMLElement && model.root.current!.contains(focused)) { focused.focus(); }
  }, [model.compact, model.expanded, model.panel, model.trigger, model.root, model.resizeFocus]);
}

/**
 * Keep native child handlers intact while handling only compact disclosure interactions.
 **/
function navbarInteractions(model: Omit<NavbarModel, 'escape' | 'select'>): Pick<NavbarModel, 'escape' | 'select'> {
  return {
    escape: event => {
      if (event.defaultPrevented || event.key !== 'Escape' || !model.compact || !model.expanded) { return; }
      event.preventDefault(); model.change(false); model.trigger.current!.focus();
    },
    select: event => {
      const link = (event.target as Element).closest('a[href]');
      if (model.compact && model.expanded && link) { model.change(false); }
    },
  };
}

/**
 * Own uncontrolled expansion while treating a supplied open prop as the only controlled truth.
 **/
export function useNavbar(props: { open: NavbarProps['open']; defaultOpen: NavbarProps['defaultOpen']; onOpenChange: NavbarProps['onOpenChange'] }): NavbarModel {
  const root = useRef<HTMLElement>(null), trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const width = useNavbarWidth(root), panelId = `${useId()}-navbar-panel`;
  const [stored, setStored] = useState(props.defaultOpen ?? false);
  const change = (open: boolean) => { if (props.open === undefined) { setStored(open); } props.onOpenChange?.(open); };
  const model = { root, trigger, panel, ...width, expanded: props.open ?? stored, panelId, change };
  const result = { ...model, ...navbarInteractions(model) };
  useNavbarFocus(result);

  return result;
}
