import type { QuestionnaireValidation } from './model.js';
import { useState } from 'react';
import { validateAnswers } from './validation.js';
import type { QuestionnaireLabels, QuestionnaireProps } from './types.js';
import type { QuestionnaireState } from './useQuestionnaireState.js';

/**
 * Retain attempted question IDs and revalidate the displayed error from authoritative current answers.
 **/
export function useQuestionnaireValidation(
  props: QuestionnaireProps,
  state: QuestionnaireState,
  labels: QuestionnaireLabels,
): QuestionnaireValidation {
  const [checked, setChecked] = useState<readonly string[]>([]);
  const options = { items: props.items, answers: state.answers, labels, validate: props.validate };
  const active = state.item?.id;
  const errors =
    active !== undefined && checked.includes(active) ? validateAnswers(options, [active]) : {};
  /**
   * Mark an explicit validation scope and return its first invalid question in display order.
   **/
  const check = (ids: readonly string[]) => {
    const result = validateAnswers(options, ids);
    setChecked((previous) => [...new Set([...previous, ...ids])]);

    return ids.find((id) => Object.hasOwn(result, id));
  };

  return {
    error: active !== undefined && Object.hasOwn(errors, active) ? errors[active] : undefined,
    check,
    clear: () => setChecked([]),
  };
}
