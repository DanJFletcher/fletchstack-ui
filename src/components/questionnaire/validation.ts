import { choiceValues, readAnswer } from './answers.js';
import type { QuestionnaireAnswer, QuestionnaireAnswers, QuestionnaireErrors, QuestionnaireItem, QuestionnaireLabels, QuestionnaireTextField } from './types.js';

type Normalized = { answer?: QuestionnaireAnswer; error?: string };

/**
 * Reject overlong supplied drafts using the same native character-count convention as editable fields.
 **/
function lengthError(text: string, field: QuestionnaireTextField) {
  return field.maxLength !== undefined && text.length > field.maxLength ? `Use no more than ${field.maxLength} characters.` : undefined;
}

/**
 * Normalize text answers only after their kind and raw character limit have been validated.
 **/
function normalizeText(item: Extract<QuestionnaireItem, { type: 'text' }>, answer: QuestionnaireAnswer): Normalized {
  if (answer.kind !== 'text') { return { error: 'Enter a valid text answer for this question.' }; }
  const error = lengthError(answer.value, item.input);
  if (error) { return { error }; }

  return answer.value.trim() ? { answer: { kind: 'text', value: answer.value.trim() } } : {};
}

/**
 * Reject incompatible exclusive choices and unsupported custom text before reconciling obsolete values.
 **/
function choiceError(item: Exclude<QuestionnaireItem, { type: 'text' }>, answer: Extract<QuestionnaireAnswer, { kind: 'choice' }>) {
  if (answer.other?.trim() && !item.other) { return 'Custom answers are not available for this question.'; }
  if (item.type === 'single' && (answer.values.length > 1 || (answer.values.length > 0 && answer.other?.trim()))) {
    return 'Choose one option or enter a custom answer, not both.';
  }

  return item.other ? lengthError(answer.other ?? '', item.other) : undefined;
}

/**
 * Canonicalize enabled options and trimmed custom text without choosing a replacement for removed values.
 **/
function normalizeChoice(item: Exclude<QuestionnaireItem, { type: 'text' }>, answer: QuestionnaireAnswer): Normalized {
  if (answer.kind !== 'choice') { return { error: 'Choose a valid answer for this question.' }; }
  const error = choiceError(item, answer);
  if (error) { return { error }; }
  const values = choiceValues(item, answer);
  const other = answer.other?.trim();

  return values.length || other ? { answer: { kind: 'choice', values, ...(other ? { other } : {}) } } : {};
}

/**
 * Distinguish unanswered, explicitly skipped and malformed answers while retaining useful built-in errors.
 **/
export function normalizeAnswer(item: QuestionnaireItem, answer: QuestionnaireAnswer | undefined): Normalized {
  if (!answer) { return {}; }
  if (answer.kind === 'skipped') { return item.required === false ? { answer: { kind: 'skipped' } } : {}; }

  return item.type === 'text' ? normalizeText(item, answer) : normalizeChoice(item, answer);
}

/**
 * Create a fresh submission candidate containing only valid answers for current question IDs.
 **/
export function answerSnapshot(items: readonly QuestionnaireItem[], answers: QuestionnaireAnswers): QuestionnaireAnswers {
  return Object.fromEntries(items.flatMap(item => {
    const answer = normalizeAnswer(item, readAnswer(answers, item.id)).answer;

    return answer ? [[item.id, answer]] : [];
  }));
}

/**
 * Validate the requested question scope before application rules, ignoring unrelated or blank custom errors.
 **/
export function validateAnswers(options: { items: readonly QuestionnaireItem[]; answers: QuestionnaireAnswers; labels: QuestionnaireLabels; validate: ((answers: QuestionnaireAnswers) => QuestionnaireErrors) | undefined }, ids: readonly string[]): QuestionnaireErrors {
  const checked = options.items.filter(item => ids.includes(item.id));
  const builtIn = checked.flatMap(item => {
    const result = normalizeAnswer(item, readAnswer(options.answers, item.id));
    const missing = item.required === false ? options.labels.optionalError : options.labels.requiredError;

    return result.answer ? [] : [[item.id, result.error ?? missing]];
  });
  if (builtIn.length) { return Object.fromEntries(builtIn); }
  const custom = options.validate?.(answerSnapshot(options.items, options.answers)) ?? {};

  return Object.fromEntries(checked.flatMap(item => Object.hasOwn(custom, item.id) && custom[item.id]?.trim() ? [[item.id, custom[item.id]]] : []));
}
