import type { QuestionnaireFocus } from './model.js';
import { useEffect, useRef, useState, type RefObject } from 'react';

/**
 * Focus the active legend on navigation or its first enabled answer when validation needs attention.
 **/
export function focusQuestion(fieldset: HTMLFieldSetElement, invalid: boolean): void {
  const answer = invalid
    ? fieldset.querySelector<HTMLElement>('input:not(:disabled), textarea:not(:disabled)')
    : null;
  (answer ?? fieldset).focus();
}

/**
 * Wait for committed active-ID changes and defer controlled invalid-answer focus until the host accepts navigation.
 **/
export function useQuestionnaireFocus(
  fieldset: RefObject<HTMLFieldSetElement | null>,
  active: string | undefined,
): QuestionnaireFocus {
  const previous = useRef(active);
  const invalidTarget = useRef<string | undefined>(undefined);
  const [request, setRequest] = useState(0);
  useEffect(() => {
    const invalid = invalidTarget.current !== undefined && invalidTarget.current === active;
    if (fieldset.current && (invalid || previous.current !== active)) {
      focusQuestion(fieldset.current, invalid);
    }
    if (invalid) {
      invalidTarget.current = undefined;
    }
    previous.current = active;
  }, [active, request, fieldset]);

  return {
    invalid: (id: string) => {
      invalidTarget.current = id;
      setRequest((count) => count + 1);
    },
    clear: () => {
      invalidTarget.current = undefined;
    },
  };
}
