import type { FormEvent } from 'react';
import { answerSnapshot } from './validation.js';
import { copyAnswers } from './answers.js';
import type { QuestionnaireModel as ActionsContext } from './model.js';

/**
 * Validate an intermediate answer without advancing on selection or on a rejected controlled update.
 **/
function advance(context: ActionsContext) {
  const { state, validation, focus, props } = context;
  const id = state.item!.id;
  if (validation.check([id])) { focus.invalid(id); return; }
  focus.clear();
  state.changeValue(props.items[state.index + 1]!.id);
}

/**
 * Validate the full flow and pass a fresh normalized snapshot to the serialized submission boundary.
 **/
function save(context: ActionsContext) {
  const { state, validation, focus, props, submission } = context;
  const invalid = validation.check(props.items.map(item => item.id));
  if (invalid) { focus.invalid(invalid); if (invalid !== state.item!.id) { state.changeValue(invalid); } return; }

  void submission.run(answerSnapshot(props.items, state.answers));
}

/**
 * Prevent native document submission and route implicit Enter through the same current-step rules as the action.
 **/
export function submitQuestionnaire(event: FormEvent<HTMLFormElement>, context: ActionsContext): void {
  if (event.defaultPrevented) { return; }
  event.preventDefault();
  if (context.submission.running.current || !context.state.item) { return; }
  if (context.state.index < context.props.items.length - 1) { advance(context); } else { save(context); }
}

/**
 * Honor canceled resets and block resets while persistence is running before restoring mount-time defaults.
 **/
export function resetQuestionnaire(event: FormEvent<HTMLFormElement>, context: ActionsContext): void {
  context.props.onReset?.(event);
  if (context.submission.running.current) { event.preventDefault(); }
  if (event.defaultPrevented) { return; }
  event.preventDefault();
  context.focus.clear(); context.validation.clear(); context.submission.clearFailure();
  context.state.changeAnswers(copyAnswers(context.state.initial.answers));
  context.state.changeValue(context.state.initial.value);
}

/**
 * Replace optional answers with an explicit skip, leaving a final optional question available for submission.
 **/
export function skipQuestionnaire(context: ActionsContext): void {
  const { state, props, focus } = context;
  state.changeAnswers({ ...state.answers, [state.item!.id]: { kind: 'skipped' } });
  focus.clear();
  if (state.index < props.items.length - 1) { state.changeValue(props.items[state.index + 1]!.id); }
}

/**
 * Return to an earlier question without validating or discarding drafts.
 **/
export function previousQuestionnaire(context: ActionsContext): void {
  context.focus.clear();
  context.state.changeValue(context.props.items[context.state.index - 1]!.id);
}
