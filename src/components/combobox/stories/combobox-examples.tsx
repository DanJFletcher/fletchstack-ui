import { useState } from 'react';
import { Combobox, type ComboboxProps } from '../Combobox';

export const regions = [{ value: 'ca', label: 'Canada' }, { value: 'gb', label: 'United Kingdom' }, { value: 'us', label: 'United States' }, { value: 'ae', label: 'United Arab Emirates' }];
export const baseCombobox = { label: 'Service region', options: regions, placeholder: 'Search regions', loadingMessage: 'Loading regions…', noResultsMessage: 'No matching regions.' } satisfies ComboboxProps;

/**
 * Submit canonical identities and expose native required validation and reset in a complete form.
 **/
export function ComboboxForm({ required = false }: { required?: boolean }) {
  const [submitted, setSubmitted] = useState('Not submitted');
  return <form onSubmit={event => { event.preventDefault(); setSubmitted(new FormData(event.currentTarget).get('region')?.toString() ?? 'No selection'); }}>
    <button type="button">Before region</button><Combobox {...baseCombobox} name="region" required={required} description="Choose the region where your team works." />
    <button type="submit">Submit region</button><button type="reset">Reset region</button><output aria-label="Submitted region">{submitted}</output>
  </form>;
}

/**
 * Keep a controlled selection in the parent and demonstrate external updates.
 **/
export function ControlledCombobox() {
  const [value, setValue] = useState('gb');
  return <><Combobox {...baseCombobox} value={value} onValueChange={setValue} /><button type="button" onClick={() => setValue('ca')}>Choose Canada</button></>;
}

/**
 * Show the design sheet in both themes with independent live search fields and feedback examples.
 **/
export function ComboboxExample() {
  return <div className="combobox-demo"><p>fletchstack-ui / Forms</p><h1>Combobox</h1>
    <div className="combobox-demo__themes">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="combobox-demo__panel" aria-label={theme === 'corporate' ? 'Corporate' : 'Luna'}><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><Combobox {...baseCombobox} /></section>)}</div>
    <div className="combobox-demo__states"><section><h2>Selected</h2><Combobox {...baseCombobox} label="Selected region" defaultValue="gb" /></section>
      <section><h2>Loading</h2><Combobox {...baseCombobox} label="Loading region" loading /></section><section><h2>No results</h2><Combobox {...baseCombobox} label="Find a region" /></section></div>
    <p className="combobox-demo__keys">↑ ↓ Navigate · Enter Select · Esc Close</p>
  </div>;
}
