import { useState } from 'react';
import { Button } from '../../../src/components/button/Button';
import { FormGroup } from '../../../src/components/form-group/FormGroup';
import { Radio } from '../../../src/components/radio/Radio';
import type { RadioProps } from '../../../src/components/radio/Radio';
import type { Scenario } from '../gallery/types';
import '../../../src/components/radio/radio.css';
import '../../../src/components/field/field.css';
import '../../../src/components/button/button.css';
import '../../../src/components/form-group/form-group.css';

/**
 * Exercise native validation, successful form values, external ownership, and reset.
 **/
function NativeFormExample() {
  const [result, setResult] = useState('Not submitted');

  return <div className="stack"><form id="radio-delivery-form" className="stack" onSubmit={event => { event.preventDefault(); setResult(String(new FormData(event.currentTarget).get('delivery'))); }}><FormGroup legend="Delivery method"><Radio label="Standard delivery" name="delivery" value="standard" required defaultChecked /><Radio label="Express delivery" name="delivery" value="express" required /><Radio label="Unavailable delivery" name="delivery" value="unavailable" disabled /></FormGroup><div className="actions"><Button type="submit">Save delivery</Button><Button type="reset" variant="secondary">Reset</Button></div><output aria-label="Submitted delivery">{result}</output></form><Radio label="Collection" name="delivery" value="collection" form="radio-delivery-form" /></div>;
}

/**
 * Show a named native group with a disabled option between selectable choices.
 **/
function DeliveryGroup() {
  return <FormGroup legend="Delivery method" description="Choose one option."><Radio label="Standard delivery" name="delivery" value="standard" defaultChecked /><Radio label="Next-day delivery" name="delivery" value="next-day" disabled /><Radio label="Express delivery" name="delivery" value="express" /></FormGroup>;
}

const Playground: Scenario<RadioProps> = {  };

const Selected: Scenario<RadioProps> = { args: { defaultChecked: true } };

const GroupSelection: Scenario<RadioProps> = { render: () => <DeliveryGroup /> };

const NativeForm: Scenario<RadioProps> = { render: () => <NativeFormExample /> };

const BothThemes: Scenario<RadioProps> = { render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme}</h2><FormGroup legend="Delivery method"><Radio label="Standard delivery" name={`${theme}-delivery`} value="standard" defaultChecked /><Radio label="Express delivery" name={`${theme}-delivery`} value="express" description="Arrives tomorrow." /><Radio label="Unavailable" disabled /></FormGroup></section>)}</div> };

const SharedError: Scenario<RadioProps> = { render: () => <FormGroup legend="Delivery method" error="Choose a delivery method.">{control => <><Radio {...control} label="Standard delivery" name="required-delivery" value="standard" required /><Radio {...control} label="Express delivery" name="required-delivery" value="express" required /></>}</FormGroup> };

const LongLabels: Scenario<RadioProps> = { args: { label: 'Receive the delivery at the address associated with your shared workspace', description: 'ThisLongUnbrokenDescriptionMustWrapWithoutWideningThePage', error: 'Choose a delivery method before continuing.' } };

export const component = Radio;
export const defaults: RadioProps = { label: 'Standard delivery', description: 'Arrives in 3–5 business days.' };
export const scenarios = { GroupSelection, LongLabels, SharedError, Playground, NativeForm, Selected, BothThemes };
