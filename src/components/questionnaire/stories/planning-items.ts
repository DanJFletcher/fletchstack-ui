import type { QuestionnaireAnswers, QuestionnaireItem } from '../types';

export const planningItems: readonly QuestionnaireItem[] = [
  {
    id: 'feature',
    type: 'single',
    title: 'What should the agent build next?',
    description: 'Choose a direction or describe another task.',
    options: [
      {
        value: 'timeline',
        label: 'Tool call timeline',
        description: 'Show what the agent ran and what came back.',
      },
      {
        value: 'approvals',
        label: 'Approval checkpoints',
        description: 'Ask before sensitive or destructive actions.',
      },
      {
        value: 'handoffs',
        label: 'Sub-agent handoffs',
        description: 'Make delegated work and results easier to follow.',
      },
    ],
    other: { label: 'Another feature', placeholder: 'Describe another feature...' },
  },
  {
    id: 'updates',
    type: 'multiple',
    required: false,
    title: 'What should every progress update include?',
    description: 'Select all that apply, or skip this question.',
    options: [
      { value: 'progress', label: 'Progress' },
      { value: 'decisions', label: 'Decisions' },
      { value: 'risks', label: 'Risks' },
      { value: 'next-step', label: 'Next step' },
    ],
  },
  {
    id: 'timing',
    type: 'single',
    title: 'When should work begin?',
    description: 'Choose when the agent should begin the work.',
    options: [
      { value: 'now', label: 'Start now' },
      { value: 'next-cycle', label: 'Next development cycle' },
      { value: 'backlog', label: 'Add it to the backlog' },
    ],
  },
];
export const planningDraft: QuestionnaireAnswers = {
  feature: { kind: 'choice', values: ['timeline'] },
  updates: { kind: 'choice', values: ['progress', 'decisions'] },
  timing: { kind: 'choice', values: ['now'] },
};
export const feedbackItems: readonly QuestionnaireItem[] = [
  {
    id: 'feedback',
    type: 'text',
    title: 'What should we improve?',
    description: 'Describe one change that would help your work.',
    input: {
      label: 'Your feedback',
      placeholder: 'Describe the change...',
      multiline: true,
      maxLength: 1000,
    },
  },
];
export const shortcutItems: readonly QuestionnaireItem[] = [
  {
    id: 'direction',
    type: 'single',
    title: 'Choose a direction',
    options: [
      { value: 'disabled', label: 'Unavailable direction', disabled: true },
      { value: 'build', label: 'Build components' },
      { value: 'test', label: 'Improve testing' },
    ],
    other: { label: 'Another direction' },
  },
];
