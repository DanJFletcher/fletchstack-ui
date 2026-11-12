import { useEffect, useId, useState } from 'react';
import type { AccordionProps } from './types.js';

/**
 * Reject duplicate item identities and ambiguous initial or controlled selections.
 **/
export function validateAccordion(props: AccordionProps, open: readonly string[]): void {
  const ids = props.items.map(item => item.id);
  if (ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) { throw new Error('Accordion items need unique nonempty IDs.'); }
  if (new Set(open).size !== open.length || open.some(id => !ids.includes(id))) { throw new Error('Open items must be unique IDs from items.'); }
  if (!props.multiple && open.length > 1) { throw new Error('Enable multiple to open more than one item.'); }
}

export interface AccordionModel { id: string; open: readonly string[]; motionReady: boolean; toggle: (id: string) => void }

/**
 * Preserve controlled authority; keep closed animated SSR content hidden until inert is installed.
 **/
export function useAccordion(props: AccordionProps): AccordionModel {
  const [stored, setStored] = useState<readonly string[]>(props.defaultOpenItems ?? []);
  const [motionReady, setMotionReady] = useState(false);
  const generated = useId();
  const open = props.openItems ?? stored;
  validateAccordion(props, open);
  useEffect(() => { if (props.panelMotion === 'expand') { setMotionReady(true); } }, [props.panelMotion]);
  const toggle = (id: string) => {
    const next = nextOpenItems(open, id, Boolean(props.multiple));
    if (props.openItems === undefined) { setStored(next); }
    props.onOpenItemsChange?.([...next]);
  };

  return { id: `${props.id ?? 'accordion'}-${generated}`, open, motionReady, toggle };
}

/**
 * Close an active item or open it with the requested single/multiple expansion policy.
 **/
function nextOpenItems(open: readonly string[], id: string, multiple: boolean): string[] {
  if (open.includes(id)) { return open.filter(value => value !== id); }
  return multiple ? [...open, id] : [id];
}
