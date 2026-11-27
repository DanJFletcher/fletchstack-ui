import type { ReactElement } from 'react';
import { useId } from 'react';
import { Button } from '../button/Button.js';
import { FieldDescription, FieldError } from '../field/FieldPrimitives.js';
import { QuestionnaireFields } from './QuestionnaireFields.js';
import { chooseAnswer, readAnswer, replaceAnswer, writeAnswer } from './answers.js';
import { previousQuestionnaire, skipQuestionnaire } from './actions.js';
import type { QuestionnaireModel } from './useQuestionnaire.js';

/**
 * Associate one legend, description and error with the active native answer controls.
 **/
function Question({ model, prefix }: { model: QuestionnaireModel; prefix: string }) {
  const { state, validation, submission, props } = model;
  const item = state.item!;
  const answer = readAnswer(state.answers, item.id);
  const describedBy = [
    item.description && `${prefix}-description`,
    validation.error && `${prefix}-error`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <fieldset
      key={item.id}
      ref={model.fieldset}
      className="fs-questionnaire__question"
      tabIndex={-1}
      disabled={submission.pending}
      aria-describedby={describedBy}
      aria-invalid={Boolean(validation.error)}
    >
      <legend className="fs-questionnaire__title">{item.title}</legend>
      {item.description && (
        <FieldDescription id={`${prefix}-description`} className="fs-questionnaire__description">
          {item.description}
        </FieldDescription>
      )}
      <QuestionnaireFields
        item={item}
        answer={answer}
        prefix={prefix}
        describedBy={describedBy}
        error={validation.error}
        pending={submission.pending}
        shortcuts={props.shortcuts ?? 'none'}
        choose={(value) =>
          state.changeAnswers(
            replaceAnswer(
              state.answers,
              item.id,
              chooseAnswer(item as Exclude<typeof item, { type: 'text' }>, answer, value),
            ),
          )
        }
        write={(text) =>
          state.changeAnswers(
            replaceAnswer(state.answers, item.id, writeAnswer(item, answer, text)),
          )
        }
      />
      {validation.error && (
        <FieldError id={`${prefix}-error`} role="alert" className="fs-questionnaire__error">
          {validation.error}
        </FieldError>
      )}
    </fieldset>
  );
}

/**
 * Keep backward navigation at the leading edge and skip/continue at the trailing edge when actions wrap.
 **/
function QuestionnaireActions({ model }: { model: QuestionnaireModel }) {
  const { state, labels, submission, props } = model;
  const final = state.index === props.items.length - 1;
  const actionLabel = final ? labels.submit : labels.next;

  return (
    <div className="fs-questionnaire__actions">
      {state.index > 0 && (
        <Button
          type="button"
          variant="secondary"
          disabled={submission.pending}
          onClick={() => previousQuestionnaire(model)}
        >
          {labels.previous}
        </Button>
      )}
      <div className="fs-questionnaire__forward">
        {state.item!.required === false && (
          <Button
            type="button"
            variant="secondary"
            disabled={submission.pending}
            onClick={() => skipQuestionnaire(model)}
          >
            {labels.skip}
          </Button>
        )}
        <Button type="submit" disabled={submission.pending}>
          {submission.pending ? labels.submitting : actionLabel}
        </Button>
      </div>
    </div>
  );
}

/**
 * Present position once, an active fieldset and persistent action placement, with a friendly save-failure alert.
 **/
export function QuestionnaireView({ model }: { model: QuestionnaireModel }): ReactElement {
  const prefix = useId();
  const { state, labels, submission } = model;
  if (!state.item) {
    return <p className="fs-questionnaire__empty">{labels.empty}</p>;
  }

  return (
    <>
      <p className="fs-questionnaire__progress" role="status" aria-live="polite" aria-atomic="true">
        {labels.progress(state.index + 1, model.props.items.length)}
      </p>
      <Question model={model} prefix={prefix} />
      {submission.failed && (
        <FieldError role="alert" className="fs-questionnaire__error">
          {labels.submitError}
        </FieldError>
      )}
      <QuestionnaireActions model={model} />
    </>
  );
}
