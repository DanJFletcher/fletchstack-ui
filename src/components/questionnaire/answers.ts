import type { QuestionnaireAnswer, QuestionnaireAnswers, QuestionnaireItem } from './types.js';

/**
 * Copy mount-time defaults and callback snapshots without retaining consumer-owned choice arrays.
 **/
export function copyAnswers(answers: QuestionnaireAnswers): QuestionnaireAnswers {
  return Object.fromEntries(
    Object.entries(answers).map(([id, answer]) => [
      id,
      answer?.kind === 'choice'
        ? { ...answer, values: [...answer.values] }
        : answer && { ...answer },
    ]),
  );
}

/**
 * Read configured, enabled values in option order without modifying drafts supplied by a consumer.
 **/
export function choiceValues(
  item: Exclude<QuestionnaireItem, { type: 'text' }>,
  answer: QuestionnaireAnswer | undefined,
): string[] {
  if (answer?.kind !== 'choice') {
    return [];
  }

  return item.options
    .filter((option) => !option.disabled && answer.values.includes(option.value))
    .map((option) => option.value);
}

/**
 * Keep malformed exclusive answers visually unselected instead of silently choosing a radio.
 **/
export function displayedValues(
  item: Exclude<QuestionnaireItem, { type: 'text' }>,
  answer: QuestionnaireAnswer | undefined,
): string[] {
  if (
    item.type === 'single' &&
    answer?.kind === 'choice' &&
    (answer.values.length > 1 || answer.other?.trim())
  ) {
    return [];
  }

  return choiceValues(item, answer);
}

/**
 * Replace one draft answer, removing its key when a user clears its complete value.
 **/
export function replaceAnswer(
  answers: QuestionnaireAnswers,
  id: string,
  answer: QuestionnaireAnswer | undefined,
): QuestionnaireAnswers {
  const next = { ...answers, [id]: answer };
  if (answer === undefined) {
    delete next[id];
  }

  return next;
}

/**
 * Toggle an enabled native choice, preserving custom text only for multiple-selection questions.
 **/
export function chooseAnswer(
  item: Exclude<QuestionnaireItem, { type: 'text' }>,
  answer: QuestionnaireAnswer | undefined,
  value: string,
): QuestionnaireAnswer | undefined {
  if (item.type === 'single') {
    return { kind: 'choice', values: [value] };
  }
  const previous = choiceValues(item, answer);
  const values = previous.includes(value)
    ? previous.filter((choice) => choice !== value)
    : [...previous, value];
  const other = answer?.kind === 'choice' ? answer.other : undefined;

  return values.length || other
    ? { kind: 'choice', values, ...(other === undefined ? {} : { other }) }
    : undefined;
}

/**
 * Preserve draft strings exactly while enforcing exclusive custom answers only once text is nonblank.
 **/
export function writeAnswer(
  item: QuestionnaireItem,
  answer: QuestionnaireAnswer | undefined,
  text: string,
): QuestionnaireAnswer | undefined {
  if (item.type === 'text') {
    return text ? { kind: 'text', value: text } : undefined;
  }
  const values = item.type === 'single' && text.trim() ? [] : choiceValues(item, answer);

  return values.length || text ? { kind: 'choice', values, other: text } : undefined;
}

/**
 * Read a text draft without conflating a skipped answer with an entered value.
 **/
export function answerText(answer: QuestionnaireAnswer | undefined): string {
  if (answer?.kind === 'text') {
    return answer.value;
  }

  return answer?.kind === 'choice' ? (answer.other ?? '') : '';
}

/**
 * Treat opaque question IDs as own keys, including identifiers that also name Object prototype members.
 **/
export function readAnswer(
  answers: QuestionnaireAnswers,
  id: string,
): QuestionnaireAnswer | undefined {
  return Object.hasOwn(answers, id) ? answers[id] : undefined;
}
