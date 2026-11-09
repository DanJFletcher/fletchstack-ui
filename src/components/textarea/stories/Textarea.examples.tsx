import { useRef, useState } from 'react';
import { Button, Textarea } from '../../../index';


/**
 * Demonstrate consumer-controlled multiline editing and programmatic value changes.
 **/
export function ControlledExample() {
  const [value, setValue] = useState('First');
  const input = useRef<HTMLTextAreaElement>(null);

  return <div className="stack">
    <Textarea ref={input} label="Description" value={value} onChange={event => setValue(event.target.value)} showCount />
    <Button onClick={() => setValue('Updated summary')}>Use suggested summary</Button>
    <Button onClick={() => input.current!.focus()}>Focus description</Button>
    <output aria-label="Current description">{value}</output>
  </div>;
}


/**
 * Demonstrate native submission, reset, and canceled reset with an uncontrolled counter.
 **/
export function FormExample() {
  const [cancelReset, setCancelReset] = useState(false);
  const [submitted, setSubmitted] = useState('Not submitted');

  return <form className="stack" onReset={event => { if (cancelReset) { event.preventDefault(); } }} onSubmit={event => { event.preventDefault(); setSubmitted(String(new FormData(event.currentTarget).get('description'))); }}><Textarea label="Description" name="description" defaultValue="First" showCount maxLength={200} /><Textarea label="Read-only description" name="reference" readOnly defaultValue="Reference" /><Textarea label="Unavailable description" name="unavailable" disabled defaultValue="Unavailable" /><label><input type="checkbox" checked={cancelReset} onChange={event => setCancelReset(event.target.checked)} /> Cancel reset</label><div className="actions"><Button type="submit">Save</Button><Button type="reset">Reset</Button></div><output aria-label="Submitted description">{submitted}</output></form>;
}


/**
 * Exercise changed defaults, external ownership, and removal during native reset.
 **/
export function ResetOwnershipExample() {
  const [form, setForm] = useState('first');
  const [defaultValue, setDefaultValue] = useState('First');
  const [visible, setVisible] = useState(true);

  return <div className="stack"><form id="first" /><form id="second" onReset={() => setVisible(false)}><Button type="reset">Reset and remove</Button></form>{visible && <Textarea form={form} label="Description" defaultValue={defaultValue} showCount />}<Button onClick={() => { setForm('second'); setDefaultValue('New default'); }}>Move to second form</Button></div>;
}
