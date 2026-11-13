import { useEffect, useRef, useState, type RefObject } from 'react';
import type { RatingProps } from './types.js';
import { validateRating } from './rating-policy.js';

/**
 * Restore one group's mount default on native reset, preserving cancellation and controlled authority.
 **/
function useRatingReset(group: RefObject<HTMLFieldSetElement | null>, value: number, restore: () => void) {
  useEffect(() => {
    const form = group.current?.form;
    const reset = (event: Event) => { queueMicrotask(() => {
      if (event.defaultPrevented) { return; }
      restore();
      group.current?.querySelectorAll<HTMLInputElement>('input').forEach(input => { input.checked = Number(input.value) === value; });
    }); };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [group, value, restore]);
}

export interface RatingModel { value: number; group: RefObject<HTMLFieldSetElement | null>; select: (value: number) => void }

/**
 * Own an uncontrolled score while keeping controlled selection and native reset authoritative.
 **/
export function useRating(props: RatingProps): RatingModel {
  const [stored, setStored] = useState(props.defaultValue ?? 0);
  const initial = useRef(stored);
  const group = useRef<HTMLFieldSetElement>(null);
  const value = props.value ?? stored;
  validateRating(props, value);
  useRatingReset(group, props.value ?? initial.current, () => setStored(initial.current));
  const select = (next: number) => {
    if (props.value === undefined) { setStored(next); }
    props.onValueChange?.(next);
  };

  return { value, group, select };
}
