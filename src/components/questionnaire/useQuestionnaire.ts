import type { QuestionnaireModel } from './model.js';
import { useMemo, useRef } from 'react';
import { questionnaireLabels } from './labels.js';
import { useQuestionnaireState } from './useQuestionnaireState.js';
import { useQuestionnaireSubmission } from './useQuestionnaireSubmission.js';
import { useQuestionnaireFocus } from './focus.js';
import { useQuestionnaireValidation } from './useQuestionnaireValidation.js';
import type { QuestionnaireProps } from './types.js';

/**
 * Compose independent state slices, validation, focus and save lifecycle for one native form instance.
 **/
export function useQuestionnaire(props: QuestionnaireProps): QuestionnaireModel {
  const state = useQuestionnaireState(props);
  const labels = useMemo(() => ({ ...questionnaireLabels, ...props.labels }), [props.labels]);
  const fieldset = useRef<HTMLFieldSetElement>(null);
  const submission = useQuestionnaireSubmission(props.onSubmit);
  const focus = useQuestionnaireFocus(fieldset, state.item?.id);
  const validation = useQuestionnaireValidation(props, state, labels);

  return { props, state, labels, fieldset, submission, focus, validation };
}
export type { QuestionnaireModel } from './model.js';
