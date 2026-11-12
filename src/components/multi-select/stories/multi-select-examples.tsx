import { useState } from 'react';
import { MultiSelect } from '../MultiSelect';

export const topicOptions = [
  { value: 'react', label: 'React' }, { value: 'systems', label: 'Design systems' },
  { value: 'product', label: 'Product design' }, { value: 'accessibility', label: 'Accessibility' },
  { value: 'archived', label: 'Archived topic', disabled: true },
];

/**
 * Submit selected topics as repeated native fields and restore defaults with reset.
 **/
export function MultiSelectForm() {
  const [submitted, setSubmitted] = useState('Nothing submitted.');
  return <form onSubmit={event => { event.preventDefault(); setSubmitted(new FormData(event.currentTarget).getAll('topics').join(', ') || 'No topics.'); }}>
    <MultiSelect label="Article topics" name="topics" options={topicOptions} defaultValue={['react']} helperText="Choose topics for your article." />
    <div className="multi-select-demo__actions"><button type="submit">Save topics</button><button type="reset">Reset topics</button></div>
    <output aria-label="Saved topics">{submitted}</output>
  </form>;
}

/**
 * Demonstrate authoritative state owned by a parent, including an external update.
 **/
export function ControlledTopics() {
  const [value, setValue] = useState<readonly string[]>(['react']);
  return <><MultiSelect label="Controlled topics" options={topicOptions} value={value} onValueChange={setValue} />
    <button type="button" onClick={() => setValue(['product'])}>Choose product design</button><output aria-label="Current topics">{value.join(', ')}</output></>;
}

/**
 * Compare the reference themes and the cap/minimum/empty states in a real form layout.
 **/
export function MultiSelectExample() {
  return <main className="multi-select-demo"><p className="multi-select-demo__eyebrow">fletchstack-ui / Forms</p><h1>MultiSelect</h1>
    <div className="multi-select-demo__themes">{(['corporate', 'luna'] as const).map(theme => <section key={theme}><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><div data-theme={theme} className="multi-select-demo__panel"><MultiSelect label="Article topics" options={topicOptions} defaultValue={['react']} placeholder="Search topics" /></div></section>)}</div>
    <div className="multi-select-demo__comparisons"><section><h2>Selection limit</h2><MultiSelect label="Limited topics" options={topicOptions} defaultValue={['react', 'systems']} maxSelections={2} /></section>
      <section><h2>Minimum required</h2><MultiSelect label="Required topics" options={topicOptions} minSelections={1} minSelectionsMessage={() => 'Choose at least one topic.'} placeholder="Search topics" /></section>
      <section><h2>No results</h2><MultiSelect label="Unmatched topics" options={[]} noResultsMessage="No matching topics." placeholder="Search topics" /></section></div>
    <p className="multi-select-demo__note">↑ ↓ Navigate  /  Enter Toggle  /  Esc Close</p>
  </main>;
}
