import { useState } from 'react';
import { Button } from '../../../src/components/button/Button';
import { FormGroup } from '../../../src/components/form-group/FormGroup';
import { Switch } from '../../../src/components/switch/Switch';
import type { SwitchProps } from '../../../src/components/switch/Switch';
import type { Scenario } from '../gallery/types';
import '../../../src/components/switch/switch.css';
import '../../../src/components/field/field.css';
import '../../../src/components/button/button.css';
import '../../../src/components/form-group/form-group.css';

/**
 * Demonstrate native successful values, external form ownership, and reset defaults.
 **/
function NativeFormExample() {
  const [result, setResult] = useState('Not submitted');

  return (
    <div className="stack">
      <form
        id="switch-settings-form"
        className="stack"
        onSubmit={(event) => {
          event.preventDefault();
          setResult(new FormData(event.currentTarget).getAll('notifications').join(', ') || 'None');
        }}
      >
        <FormGroup legend="Notification settings">
          <Switch label="Email notifications" name="notifications" value="email" defaultChecked />
          <Switch
            label="Unavailable notifications"
            name="notifications"
            value="disabled"
            disabled
            defaultChecked
          />
        </FormGroup>
        <div className="actions">
          <Button type="submit">Save settings</Button>
          <Button type="reset" variant="secondary">
            Reset
          </Button>
        </div>
        <output aria-label="Submitted settings">{result}</output>
      </form>
      <Switch
        label="Push notifications"
        name="notifications"
        value="push"
        form="switch-settings-form"
      />
    </div>
  );
}

const Playground: Scenario<SwitchProps> = {};

const BothThemes: Scenario<SwitchProps> = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme}</h2>
          <Switch label="Email notifications" description="Receive updates about your projects." />
          <Switch label="Push notifications" defaultChecked />
          <Switch label="Unavailable notifications" disabled defaultChecked />
        </section>
      ))}
    </div>
  ),
};

const Keyboard: Scenario<SwitchProps> = {
  render: () => (
    <div className="stack">
      <Switch label="Email notifications" />
      <Switch label="Unavailable notifications" disabled />
      <Switch label="Push notifications" />
    </div>
  ),
};

const NativeForm: Scenario<SwitchProps> = { render: () => <NativeFormExample /> };

const Composition: Scenario<SwitchProps> = {
  render: () => (
    <FormGroup legend="Notification settings" description="Control project updates.">
      {(control) => (
        <Switch
          {...control}
          label="Email notifications"
          description="Receive updates about your projects."
        />
      )}
    </FormGroup>
  ),
};

const DisabledGroup: Scenario<SwitchProps> = {
  render: () => (
    <FormGroup legend="Notification settings" disabled>
      <Switch label="Email notifications" defaultChecked />
      <Switch label="Push notifications" />
    </FormGroup>
  ),
};

const Customization: Scenario<SwitchProps> = {
  args: {
    className: 'custom-switch',
    wrapperClassName: 'custom-switch-field',
    wrapperStyle: { '--fs-switch-track-width': '48px', '--fs-switch-label-gap': '16px' },
    style: { borderWidth: '2px' },
  },
};

const LongLabels: Scenario<SwitchProps> = {
  args: {
    label: 'Receive notifications about updates to every shared component in this workspace',
    description: 'ThisLongUnbrokenDescriptionMustWrapWithoutWideningThePage',
  },
};

const RightToLeft: Scenario<SwitchProps> = {
  render: () => (
    <div dir="rtl">
      <Switch label="Email notifications" description="A setting within a right-to-left layout." />
    </div>
  ),
};

export const component = Switch;
export const defaults: SwitchProps = {
  label: 'Email notifications',
  description: 'Receive updates about your projects.',
};
export const scenarios = {
  Keyboard,
  Playground,
  LongLabels,
  NativeForm,
  RightToLeft,
  Composition,
  DisabledGroup,
  BothThemes,
  Customization,
};
