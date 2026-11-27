import { Checkbox } from '../../../src/components/checkbox/Checkbox';
import { FormGroup } from '../../../src/components/form-group/FormGroup';
import { Select } from '../../../src/components/select/Select';
import { TextInput } from '../../../src/components/text-input/TextInput';
import type { FormGroupProps } from '../../../src/components/form-group/FormGroup';
import type { Scenario } from '../gallery/types';
import '../../../src/components/form-group/form-group.css';
import '../../../src/components/field/field.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/checkbox/checkbox.css';
import '../../../src/components/select/select.css';
import '../../../src/components/text-input/text-input.css';

const Playground: Scenario<FormGroupProps> = {
  render: (args) => (
    <FormGroup {...args}>
      {(props) => (
        <>
          <Checkbox {...props} label="Email" name="channels" value="email" defaultChecked />
          <Checkbox {...props} label="SMS" name="channels" value="sms" />
        </>
      )}
    </FormGroup>
  ),
};

const States: Scenario<FormGroupProps> = {
  render: () => (
    <div className="theme-grid">
      {(['Default', 'Error', 'Disabled'] as const).map((state) => (
        <FormGroup
          key={state}
          legend={`${state} notifications`}
          description="Select at least one option."
          error={state === 'Error' ? 'Choose at least one channel.' : ''}
          disabled={state === 'Disabled'}
        >
          {(props) => (
            <>
              <Checkbox {...props} label={`${state} email`} defaultChecked={state !== 'Error'} />
              <Checkbox {...props} label={`${state} SMS`} />
            </>
          )}
        </FormGroup>
      ))}
    </div>
  ),
};

const Composition: Scenario<FormGroupProps> = {
  render: () => (
    <div className="stack">
      <FormGroup legend="Delivery method" description="Choose one option.">
        {(props) => (
          <>
            <label>
              <input {...props} type="radio" name="delivery" value="standard" defaultChecked />{' '}
              Standard
            </label>
            <label>
              <input {...props} type="radio" name="delivery" value="express" /> Express
            </label>
          </>
        )}
      </FormGroup>
      <FormGroup legend="Contact details" helperText="Use your project contact details.">
        {(props) => (
          <>
            <TextInput
              {...props}
              label="Full name"
              autoComplete="name"
              defaultValue="Example Person"
            />
            <TextInput
              {...props}
              label="Email address"
              type="email"
              defaultValue="test@example.com"
            />
            <Select {...props} label="Workspace">
              <option>Personal</option>
              <option>Design team</option>
            </Select>
          </>
        )}
      </FormGroup>
    </div>
  ),
};

const NativeChildren: Scenario<FormGroupProps> = {
  render: () => (
    <div className="stack">
      <FormGroup
        legend="Contact"
        className="custom-form-group"
        style={{ '--fs-form-group-control-gap': '24px' }}
      >
        <TextInput label="Project name" />
        <FormGroup legend="Nested settings" aria-invalid="false">
          <Checkbox label="Email updates" />
        </FormGroup>
      </FormGroup>
      <FormGroup legend="Empty group" />
    </div>
  ),
};

const BothThemes: Scenario<FormGroupProps> = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme}</h2>
          <FormGroup
            legend="Notifications"
            orientation="horizontal"
            helperText="You can change these later."
          >
            {(props) => (
              <>
                <Checkbox {...props} label="Email" defaultChecked />
                <Checkbox {...props} label="SMS" />
              </>
            )}
          </FormGroup>
          <FormGroup legend="Required channels" error="Choose at least one channel.">
            {(props) => <Checkbox {...props} label="Push notifications" />}
          </FormGroup>
        </section>
      ))}
    </div>
  ),
};

const Descriptions: Scenario<FormGroupProps> = {
  render: () => (
    <>
      <p id="settings-context">Project settings.</p>
      <FormGroup
        id="channels"
        legend="Notification channels"
        aria-describedby="settings-context"
        description="Choose how we contact you."
        helperText="Change these later."
        error="Choose one channel."
      >
        {(props) => <Checkbox {...props} label="Email" description="Product news." />}
      </FormGroup>
    </>
  ),
};

export const component = FormGroup;
export const defaults: FormGroupProps = {
  legend: 'Notification channels',
  description: 'Choose how you would like to hear from us.',
  helperText: 'You can change these later.',
};
export const scenarios = {
  Playground,
  Composition,
  States,
  BothThemes,
  NativeChildren,
  Descriptions,
};
