import type { QuestionnaireItem, QuestionnaireTextField } from './types.js';

/**
 * Reject ambiguous identifiers before rendering controls or looking up answers.
 **/
function uniqueIds(values: readonly string[], context: string) {
  if (values.some((value) => !value.trim()) || new Set(values).size !== values.length) {
    throw new Error(`Questionnaire ${context} must be nonempty and unique.`);
  }
}

/**
 * Require visible text labels and a native-compatible character limit.
 **/
function checkTextField(field: QuestionnaireTextField) {
  if (!field.label.trim()) {
    throw new Error('Questionnaire text fields require a visible label.');
  }
  if (
    field.maxLength !== undefined &&
    (!Number.isInteger(field.maxLength) || field.maxLength < 0)
  ) {
    throw new Error('Questionnaire maxLength must be a nonnegative integer.');
  }
}

/**
 * Validate choice definitions while allowing an exclusively custom answer when it can accept text.
 **/
function checkChoices(item: Extract<QuestionnaireItem, { options: unknown }>) {
  uniqueIds(
    item.options.map((option) => option.value),
    `option values for ${item.id}`,
  );
  if (item.options.some((option) => !option.label.trim())) {
    throw new Error('Questionnaire options require visible labels.');
  }
  if (item.other) {
    checkTextField(item.other);
  }
  if (
    !item.options.some((option) => !option.disabled) &&
    (!item.other || item.other.maxLength === 0)
  ) {
    throw new Error(
      `Questionnaire ${item.id} requires an enabled option or usable custom-answer field.`,
    );
  }
}

/**
 * Report malformed application definitions without manufacturing questions or default selections.
 **/
export function checkItems(items: readonly QuestionnaireItem[]): void {
  uniqueIds(
    items.map((item) => item.id),
    'question IDs',
  );
  for (const item of items) {
    if (!item.title.trim()) {
      throw new Error('Questionnaire questions require a visible title.');
    }
    if (item.type === 'text') {
      checkTextField(item.input);
    } else {
      checkChoices(item);
    }
  }
}
