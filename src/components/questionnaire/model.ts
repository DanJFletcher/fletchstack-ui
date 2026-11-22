import type { RefObject } from 'react';
import type { QuestionnaireAnswers, QuestionnaireItem, QuestionnaireLabels, QuestionnaireProps } from './types.js';

export type QuestionnaireState = {
  initial: { answers: QuestionnaireAnswers; value: string };
  answers: QuestionnaireAnswers;
  item: QuestionnaireItem | undefined;
  index: number;
  changeAnswers: (answers: QuestionnaireAnswers) => void;
  changeValue: (id: string) => void;
};
export type QuestionnaireSubmission = { running: RefObject<boolean>; pending: boolean; failed: boolean; run: (answers: QuestionnaireAnswers) => Promise<void>; clearFailure: () => void };
export type QuestionnaireFocus = { invalid: (id: string) => void; clear: () => void };
export type QuestionnaireValidation = { error: string | undefined; check: (ids: readonly string[]) => string | undefined; clear: () => void };
export type QuestionnaireModel = {
  props: QuestionnaireProps;
  state: QuestionnaireState;
  labels: QuestionnaireLabels;
  fieldset: RefObject<HTMLFieldSetElement | null>;
  submission: QuestionnaireSubmission;
  focus: QuestionnaireFocus;
  validation: QuestionnaireValidation;
};
