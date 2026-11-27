import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

export type QuestionnaireStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};

export type QuestionnaireOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type QuestionnaireTextField = {
  label: string;
  placeholder?: string;
  multiline?: boolean;
  maxLength?: number;
};

type QuestionnaireItemBase = {
  id: string;
  title: string;
  description?: string;
  /** Defaults to true. False enables explicit Skip. */
  required?: boolean;
};

export type QuestionnaireItem =
  | (QuestionnaireItemBase & {
      type: 'single' | 'multiple';
      options: readonly QuestionnaireOption[];
      other?: QuestionnaireTextField;
    })
  | (QuestionnaireItemBase & {
      type: 'text';
      input: QuestionnaireTextField;
    });

export type QuestionnaireAnswer =
  | {
      kind: 'choice';
      values: readonly string[];
      other?: string;
    }
  | {
      kind: 'text';
      value: string;
    }
  | {
      kind: 'skipped';
    };

export type QuestionnaireAnswers = Readonly<Partial<Record<string, QuestionnaireAnswer>>>;

export type QuestionnaireErrors = Readonly<Partial<Record<string, string>>>;

export type QuestionnaireLabels = {
  previous: string;
  next: string;
  skip: string;
  submit: string;
  submitting: string;
  submitError: string;
  requiredError: string;
  optionalError: string;
  empty: string;
  progress: (position: number, total: number) => string;
};

export type QuestionnaireProps = Omit<
  ComponentPropsWithoutRef<'form'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'style'
  | 'defaultValue'
  | 'onSubmit'
  | 'action'
  | 'method'
  | 'encType'
  | 'target'
  | 'noValidate'
> & {
  items: readonly QuestionnaireItem[];
  answers?: QuestionnaireAnswers;
  defaultAnswers?: QuestionnaireAnswers;
  onAnswersChange?: (answers: QuestionnaireAnswers) => void;

  /** Current question ID. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;

  shortcuts?: 'none' | 'letters' | 'numbers';
  labels?: Partial<QuestionnaireLabels>;
  style?: QuestionnaireStyle;

  /** Optional synchronous application validation, keyed by question ID. */
  validate?: (answers: QuestionnaireAnswers) => QuestionnaireErrors;

  /** Receives a validated, normalized snapshot. */
  onSubmit: (answers: QuestionnaireAnswers) => void | Promise<void>;
};
