import type { QuestionnaireLabels } from './types.js';

export const questionnaireLabels: QuestionnaireLabels = {
  previous: 'Previous',
  next: 'Next',
  skip: 'Skip',
  submit: 'Submit',
  submitting: 'Submitting...',
  submitError: 'Unable to save your answers. Please try again.',
  requiredError: 'Choose or enter an answer to continue.',
  optionalError: 'Answer this question or select Skip.',
  empty: 'No questions to answer.',
  progress: (position, total) => `Question ${position} of ${total}`,
};
