import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { checkItems } from './definitions.js';
import { useQuestionnaire } from './useQuestionnaire.js';
import { QuestionnaireView } from './QuestionnaireView.js';
import { resetQuestionnaire, submitQuestionnaire } from './actions.js';
import { activateShortcut } from './shortcuts.js';
import type { QuestionnaireProps } from './types.js';

/**
 * Remove questionnaire-owned props before forwarding applicable native form attributes.
 **/
function formAttributes(props: QuestionnaireProps) {
  const attributes = { ...props };
  for (const name of ['items', 'answers', 'defaultAnswers', 'onAnswersChange', 'value', 'defaultValue', 'onValueChange', 'shortcuts', 'labels', 'validate', 'onSubmit', 'onReset', 'onKeyDown', 'className', 'children', 'dangerouslySetInnerHTML', 'action', 'method', 'encType', 'target', 'noValidate']) {
    Reflect.deleteProperty(attributes, name);
  }

  return attributes;
}

/**
 * Coordinate a sequential questionnaire while the application owns persistence and the success destination.
 **/
export const Questionnaire: ForwardRefExoticComponent<QuestionnaireProps & RefAttributes<HTMLFormElement>> = /* @__PURE__ */ forwardRef<HTMLFormElement, QuestionnaireProps>(function Questionnaire(props, ref) {
  checkItems(props.items);
  const model = useQuestionnaire(props);
  const attributes = formAttributes(props);
  const name = props['aria-labelledby'] ? undefined : props['aria-label'] ?? 'Questionnaire';

  return <form {...attributes} ref={ref} noValidate aria-label={name} aria-busy={model.submission.pending} className={['fs-questionnaire', props.className].filter(Boolean).join(' ')}
    onSubmit={event => submitQuestionnaire(event, model)} onReset={event => resetQuestionnaire(event, model)}
    onKeyDown={event => { props.onKeyDown?.(event); if (!model.submission.running.current) { activateShortcut(event, props.shortcuts ?? 'none', model.fieldset.current); } }}>
    <QuestionnaireView model={model} />
  </form>;
});
