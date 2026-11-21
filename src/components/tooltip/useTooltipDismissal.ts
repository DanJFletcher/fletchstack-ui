import { useEffect } from 'react';
import type { TooltipElements } from './useTooltipLayer.js';

/**
 * Escape works while hovering even when keyboard focus is elsewhere; outside taps never take focus.
 **/
export function useTooltipDismissal(elements: TooltipElements, open: boolean, dismiss: () => void): void {
  useEffect(() => {
    if (!open) { return; }
    const anchor = elements.anchor.current!, document = anchor.ownerDocument;
    const pointer = (event: PointerEvent) => { if (event.target instanceof Node && !anchor.contains(event.target)) { dismiss(); } };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); dismiss(); } };
    document.addEventListener('pointerdown', pointer); document.addEventListener('keydown', key);

    return () => { document.removeEventListener('pointerdown', pointer); document.removeEventListener('keydown', key); };
  }, [elements, open, dismiss]);
}
