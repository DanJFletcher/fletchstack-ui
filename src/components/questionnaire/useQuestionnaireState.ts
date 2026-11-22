import type { QuestionnaireState } from './model.js';
import { useEffect, useRef, useState } from 'react';
import { copyAnswers } from './answers.js';
import type { QuestionnaireProps, QuestionnaireAnswers, QuestionnaireItem } from './types.js';

/**
 * Keep one independently controlled state slice authoritative while notifying every requested change.
 **/
function useStateSlice<Value>(controlled: Value | undefined, initial: Value, notify: ((next: Value) => void) | undefined) {
  const [local, setLocal] = useState(initial);
  /**
   * Update local state only for an uncontrolled slice, then request the same value from its consumer.
   **/
  const request = (next: Value) => {
    if (controlled === undefined) { setLocal(next); }
    notify?.(next);
  };

  return [controlled ?? local, request, setLocal] as const;
}

/**
 * Retain a resolved replacement by ID after removal, repairing only an uncontrolled navigation value.
 **/
function useQuestionPosition(items: readonly QuestionnaireItem[], value: string, repair: ((id: string) => void) | undefined) {
  const previous = useRef({ id: value, index: 0 });
  const requested = items.findIndex(item => item.id === value);
  const found = requested < 0 ? items.findIndex(item => item.id === previous.current.id) : requested;
  const index = found < 0 ? Math.min(previous.current.index, Math.max(0, items.length - 1)) : found;
  const item = items[index];
  useEffect(() => {
    previous.current = { id: item?.id ?? '', index };
    if (repair && requested < 0 && item) { repair(item.id); }
  }, [index, item, requested, repair]);

  return { item, index };
}

/**
 * Initialize defaults once and keep answer drafts independent from the active navigation slice.
 **/
export function useQuestionnaireState(props: QuestionnaireProps): QuestionnaireState {
  const [initial] = useState(() => ({ answers: copyAnswers(props.defaultAnswers ?? {}), value: props.defaultValue ?? props.items[0]?.id ?? '' }));
  const [answers, changeAnswers] = useStateSlice<QuestionnaireAnswers>(props.answers, initial.answers, props.onAnswersChange);
  const [value, changeValue, repairValue] = useStateSlice(props.value, initial.value, props.onValueChange);
  const position = useQuestionPosition(props.items, value, props.value === undefined ? repairValue : undefined);

  return { initial, answers, ...position, changeAnswers, changeValue };
}
export type { QuestionnaireState } from './model.js';
