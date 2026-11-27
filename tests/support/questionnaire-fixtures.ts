import type {
  QuestionnaireAnswers,
  QuestionnaireItem,
} from '../../src/components/questionnaire/types';

export const singleQuestion: QuestionnaireItem = {
  id: 'feature',
  type: 'single',
  title: 'Choose a feature',
  description: 'Choose one direction.',
  options: [
    { value: 'a', label: 'Alpha', description: 'First direction' },
    { value: 'b', label: 'Beta' },
    { value: 'disabled', label: 'Unavailable', disabled: true },
  ],
  other: { label: 'Other feature', maxLength: 20 },
};
export const multipleQuestion: QuestionnaireItem = {
  id: 'updates',
  type: 'multiple',
  title: 'Choose updates',
  required: false,
  options: [
    { value: 'p', label: 'Progress' },
    { value: 'd', label: 'Decisions' },
    { value: 'disabled', label: 'Unavailable update', disabled: true },
  ],
  other: { label: 'Other update', multiline: true, maxLength: 20 },
};
export const finalQuestion: QuestionnaireItem = {
  id: 'when',
  type: 'single',
  title: 'When to begin?',
  options: [
    { value: 'now', label: 'Now' },
    { value: 'later', label: 'Later' },
  ],
};
export const textQuestion: QuestionnaireItem = {
  id: 'feedback',
  type: 'text',
  title: 'Share feedback',
  input: { label: 'Your feedback', multiline: true, maxLength: 20 },
};
export const questionnaireItems: readonly QuestionnaireItem[] = [
  singleQuestion,
  multipleQuestion,
  finalQuestion,
];
export const questionnaireDraft: QuestionnaireAnswers = {
  feature: { kind: 'choice', values: ['a'] },
  updates: { kind: 'choice', values: ['p', 'd'] },
  when: { kind: 'choice', values: ['now'] },
};
