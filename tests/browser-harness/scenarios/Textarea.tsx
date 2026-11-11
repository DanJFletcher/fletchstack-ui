import { Textarea } from '../../../src/components/textarea/Textarea';
import { useRef } from 'react';
import { useState } from 'react';
import { Button } from '../../../src/components/button/Button';
import type { TextareaProps } from '../../../src/components/textarea/Textarea';
import type { Scenario } from '../gallery/types';
import '../../../src/components/textarea/textarea.css';
import '../../../src/components/field/field.css';
import '../../../src/components/button/button.css';

/**
 * Exercise changed defaults, external ownership, and removal during native reset.
 **/
function ResetOwnershipExample() {
  const [form, setForm] = useState('first');
  const [defaultValue, setDefaultValue] = useState('First');
  const [visible, setVisible] = useState(true);

  return <div className="stack"><form id="first" /><form id="second" onReset={() => setVisible(false)}><Button type="reset">Reset and remove</Button></form>{visible && <Textarea form={form} label="Description" defaultValue={defaultValue} showCount />}<Button onClick={() => { setForm('second'); setDefaultValue('New default'); }}>Move to second form</Button></div>;
}

/**
 * Demonstrate native submission, reset, and canceled reset with an uncontrolled counter.
 **/
function FormExample() {
  const [cancelReset, setCancelReset] = useState(false);
  const [submitted, setSubmitted] = useState('Not submitted');

  return <form className="stack" onReset={event => { if (cancelReset) { event.preventDefault(); } }} onSubmit={event => { event.preventDefault(); setSubmitted(String(new FormData(event.currentTarget).get('description'))); }}><Textarea label="Description" name="description" defaultValue="First" showCount maxLength={200} /><Textarea label="Read-only description" name="reference" readOnly defaultValue="Reference" /><Textarea label="Unavailable description" name="unavailable" disabled defaultValue="Unavailable" /><label><input type="checkbox" checked={cancelReset} onChange={event => setCancelReset(event.target.checked)} /> Cancel reset</label><div className="actions"><Button type="submit">Save</Button><Button type="reset">Reset</Button></div><output aria-label="Submitted description">{submitted}</output></form>;
}

/**
 * Demonstrate consumer-controlled multiline editing and programmatic value changes.
 **/
function ControlledExample() {
  const [value, setValue] = useState('First');
  const input = useRef<HTMLTextAreaElement>(null);

  return <div className="stack">
    <Textarea ref={input} label="Description" value={value} onChange={event => setValue(event.target.value)} showCount />
    <Button onClick={() => setValue('Updated summary')}>Use suggested summary</Button>
    <Button onClick={() => input.current!.focus()}>Focus description</Button>
    <output aria-label="Current description">{value}</output>
  </div>;
}

const Playground: Scenario<TextareaProps> = {  };

const Invalid: Scenario<TextareaProps> = { args: { error: 'Enter a description.', required: true } };

const ReadOnly: Scenario<TextareaProps> = { args: { readOnly: true, defaultValue: 'A simpler experience, from start to finish.' } };

const LengthGuidance: Scenario<TextareaProps> = { args: { label: 'Short description', helperText: 'Keep it under 200 characters.', maxLength: 200, showCount: true, defaultValue: 'A clearer checkout.' } };

const UnlimitedCount: Scenario<TextareaProps> = { args: { showCount: true } };

const Controlled: Scenario<TextareaProps> = { render: () => <ControlledExample /> };

const NativeForm: Scenario<TextareaProps> = { render: () => <FormExample /> };

const ResetOwnership: Scenario<TextareaProps> = { render: () => <ResetOwnershipExample /> };

const LongLabels: Scenario<TextareaProps> = { render: () => <Textarea label="Describe the goals of your project and the improvements you want to make for everyone who uses it" helperText="Labels, descriptions, counters, and errors wrap with enlarged text in narrow containers." error="Enter a description before continuing." maxLength={200} showCount /> };

export const component = Textarea;
export const defaults: TextareaProps = { label: 'Project description', placeholder: 'Describe your project...', helperText: 'Describe the goals of your project.' };
export const scenarios = { NativeForm, LongLabels, Invalid, Playground, Controlled, ResetOwnership, UnlimitedCount, LengthGuidance, ReadOnly };
