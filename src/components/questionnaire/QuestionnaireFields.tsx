import type { ReactElement } from 'react';
import type { QuestionnaireAnswer, QuestionnaireItem, QuestionnaireOption, QuestionnaireProps, QuestionnaireTextField } from './types.js';
import { Radio } from '../radio/Radio.js';
import { Checkbox } from '../checkbox/Checkbox.js';
import { TextInput } from '../text-input/TextInput.js';
import { Textarea } from '../textarea/Textarea.js';
import { Kbd } from '../kbd/Kbd.js';
import { answerText, displayedValues } from './answers.js';
import { shortcutLabel } from './shortcuts.js';

type FieldsProps = { item: QuestionnaireItem; answer: QuestionnaireAnswer | undefined; prefix: string; describedBy: string; error: string | undefined; pending: boolean; shortcuts: NonNullable<QuestionnaireProps['shortcuts']>; choose: (value: string) => void; write: (text: string) => void };

/**
 * Keep hint glyphs decorative so native choice names remain the supplied visible option labels.
 **/
function ChoiceLabel({ option, hint }: { option: QuestionnaireOption; hint: string | undefined }) {
  return <span className="fs-questionnaire__choice-heading"><span>{option.label}</span>{hint && <Kbd aria-hidden="true">{hint}</Kbd>}</span>;
}

/**
 * Reuse native labeled radios and checkboxes while the complete label supplies the card's tap target.
 **/
function Choice({ fields, option, index }: { fields: FieldsProps; option: QuestionnaireOption; index: number }) {
  const item = fields.item as Exclude<QuestionnaireItem, { type: 'text' }>;
  const Control = item.type === 'single' ? Radio : Checkbox;
  const enabledIndex = item.options.filter(candidate => !candidate.disabled).indexOf(option);
  const hint = option.disabled ? undefined : shortcutLabel(fields.shortcuts, enabledIndex);
  const description = option.description === undefined ? {} : { description: option.description };

  return <Control {...description} id={`${fields.prefix}-option-${index}`} name={`${fields.prefix}-choice`} value={option.value} checked={displayedValues(item, fields.answer).includes(option.value)}
    disabled={fields.pending || option.disabled} label={<ChoiceLabel option={option} hint={hint} />} wrapperClassName="fs-questionnaire__choice"
    aria-invalid={Boolean(fields.error)} aria-describedby={fields.describedBy} onChange={() => fields.choose(option.value)} />;
}

/**
 * Reuse Field-backed text inputs with one shared group error rather than repeating visible error messages.
 **/
function TextAnswer({ fields, input }: { fields: FieldsProps; input: QuestionnaireTextField }) {
  const Control = input.multiline ? Textarea : TextInput;
  const attributes = { ...(input.placeholder === undefined ? {} : { placeholder: input.placeholder }), ...(input.maxLength === undefined ? {} : { maxLength: input.maxLength }) };

  return <Control {...attributes} id={`${fields.prefix}-text`} label={input.label} value={answerText(fields.answer)} disabled={fields.pending}
    aria-describedby={fields.describedBy} aria-invalid={Boolean(fields.error)} onChange={event => fields.write(event.currentTarget.value)} />;
}

/**
 * Render only the active question's answer controls while their drafts remain in form state.
 **/
export function QuestionnaireFields(fields: FieldsProps): ReactElement {
  if (fields.item.type === 'text') { return <TextAnswer fields={fields} input={fields.item.input} />; }

  return <><div className="fs-questionnaire__choices">{fields.item.options.map((option, index) => <Choice key={option.value} fields={fields} option={option} index={index} />)}</div>
    {fields.item.other && <TextAnswer fields={fields} input={fields.item.other} />}</>;
}
