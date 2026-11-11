import { useState } from 'react';
import { Checkbox } from '../../../src/components/checkbox/Checkbox';
import type { CheckboxProps } from '../../../src/components/checkbox/Checkbox';
import type { Scenario } from '../gallery/types';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/field/field.css';
import '../../../src/components/icon/icon.css';

const channels = [{ value: 'email', label: 'Email' }, { value: 'sms', label: 'SMS' }, { value: 'push', label: 'Push notifications' }];

/**
 * Derive the Select all checkbox's checked/mixed state from its child choices.
 **/
function ChannelGroup() {
  const [selected, setSelected] = useState(['email', 'push']);
  const all = selected.length === channels.length;
  const some = selected.length > 0 && !all;

  return <fieldset className="checkbox-demo__group"><legend>Notification channels</legend>
    <Checkbox label="Select all" checked={all} indeterminate={some} onChange={event => setSelected(event.target.checked ? channels.map(channel => channel.value) : [])} />
    <div className="checkbox-demo__children">{channels.map(channel => <Checkbox key={channel.value} label={channel.label} value={channel.value} checked={selected.includes(channel.value)} onChange={event => { const checked = event.target.checked; setSelected(current => checked ? [...current, channel.value] : current.filter(value => value !== channel.value)); }} />)}</div>
    <p>Indeterminate means some options are selected.</p>
  </fieldset>;
}

const Playground: Scenario<CheckboxProps> = {  };

const Checked: Scenario<CheckboxProps> = { args: { defaultChecked: true } };

const Invalid: Scenario<CheckboxProps> = { args: { error: 'Choose at least one channel.', required: true } };

const GroupSelection: Scenario<CheckboxProps> = { render: () => <ChannelGroup /> };

const Keyboard: Scenario<CheckboxProps> = { render: () => <div><Checkbox label="Email updates" /><Checkbox label="Unavailable channel" disabled /><Checkbox label="SMS" /></div> };

const LongLabels: Scenario<CheckboxProps> = { render: () => <div style={{ maxWidth: '320px' }}><Checkbox label="Receive notifications about updates to every shared component in this workspace" description="ThisLongUnbrokenDescriptionMustWrapWithoutWideningThePage" error="Choose at least one notification channel before continuing." /></div> };

export const component = Checkbox;
export const defaults: CheckboxProps = { label: 'Email updates', description: 'Receive product news and tips.' };
export const scenarios = { Keyboard, LongLabels, Invalid, GroupSelection, Playground, Checked };
