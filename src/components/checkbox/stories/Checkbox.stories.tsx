import { createRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Checkbox } from '../../../index';

const meta = {
  id: 'components-checkbox',
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { label: 'Email updates', description: 'Receive product news and tips.' },
  parameters: {
    docs: {
      description: {
        component:
          'A native independent choice with a clickable visible label and description. Supports controlled/uncontrolled checked state, native mixed state, errors, disabled choices, forms, refs, and scoped checkbox.* token overrides. Use fieldset/legend to group choices. Indeterminate is applied on client mount and prop changes; native activation clears it. Parents own group state and external spacing.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;
export default meta;
type Story = StoryObj<typeof meta>;

const channels = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push notifications' },
];

/**
 * Derive the Select all checkbox's checked/mixed state from its child choices.
 **/
function ChannelGroup() {
  const [selected, setSelected] = useState(['email', 'push']);
  const all = selected.length === channels.length;
  const some = selected.length > 0 && !all;

  return (
    <fieldset className="checkbox-demo__group">
      <legend>Notification channels</legend>
      <Checkbox
        label="Select all"
        checked={all}
        indeterminate={some}
        onChange={(event) =>
          setSelected(event.target.checked ? channels.map((channel) => channel.value) : [])
        }
      />
      <div className="checkbox-demo__children">
        {channels.map((channel) => (
          <Checkbox
            key={channel.value}
            label={channel.label}
            value={channel.value}
            checked={selected.includes(channel.value)}
            onChange={(event) => {
              const checked = event.target.checked;
              setSelected((current) =>
                checked
                  ? [...current, channel.value]
                  : current.filter((value) => value !== channel.value),
              );
            }}
          />
        ))}
      </div>
      <p>Indeterminate means some options are selected.</p>
    </fieldset>
  );
}

/**
 * Keep controlled checkbox changes visible to the consumer.
 **/
function ControlledExample() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="stack">
      <Checkbox
        label="Email updates"
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
      />
      <output aria-label="Email preference">{checked ? 'Enabled' : 'Disabled'}</output>
    </div>
  );
}

/**
 * Submit successful native choices and reset them to their initial state.
 **/
function FormExample() {
  const [result, setResult] = useState('Not submitted');

  return (
    <form
      className="stack"
      onSubmit={(event) => {
        event.preventDefault();
        setResult(new FormData(event.currentTarget).getAll('channels').join(', '));
      }}
    >
      <fieldset className="checkbox-demo__group">
        <legend>Notification channels</legend>
        <Checkbox label="Email" name="channels" value="email" defaultChecked />
        <Checkbox label="SMS" name="channels" value="sms" />
        <Checkbox label="Push notifications" name="channels" value="push" disabled defaultChecked />
      </fieldset>
      <Checkbox label="Accept terms" name="terms" required />
      <div className="actions">
        <Button type="submit">Save preferences</Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
      <output aria-label="Submitted channels">{result}</output>
    </form>
  );
}

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="theme-grid">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Error" error="Choose at least one channel." />
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" disabled defaultChecked />
      <Checkbox label="Disabled mixed" disabled indeterminate />
    </div>
  ),
};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = { args: { indeterminate: true } };
export const Invalid: Story = { args: { error: 'Choose at least one channel.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };

export const GroupSelection: Story = {
  render: () => <ChannelGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const all = canvas.getByRole('checkbox', { name: 'Select all' });

    await expect(all).toBePartiallyChecked();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Email' }));
    await expect(all).toBePartiallyChecked();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Email' }));
    await userEvent.click(all);
    await expect(canvas.getAllByRole('checkbox', { checked: true })).toHaveLength(4);
    await expect(all).not.toBePartiallyChecked();
    await userEvent.click(all);
    await expect(canvas.getAllByRole('checkbox', { checked: false })).toHaveLength(4);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'SMS' }));
    await expect(all).toBePartiallyChecked();
  },
};

export const Customization: Story = {
  render: () => (
    <Checkbox
      label="Custom choice"
      description="Scoped shape and spacing overrides."
      defaultChecked
      className="custom-checkbox"
      wrapperClassName="custom-checkbox-field"
      wrapperStyle={{
        '--fs-checkbox-control-size': '24px',
        '--fs-checkbox-label-gap': '16px',
        '--fs-checkbox-radius': '8px',
      }}
      style={{ borderWidth: '2px' }}
    />
  ),
};

export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme}</h2>
          <Checkbox
            label={`${theme} email updates`}
            description="Receive product news and tips."
            defaultChecked
          />
          <Checkbox label={`${theme} select all`} indeterminate />
          <Checkbox
            label={`${theme} required choice`}
            error="Choose at least one channel."
            required
          />
        </section>
      ))}
    </div>
  ),
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText('Email updates'));
    await expect(canvas.getByLabelText('Email preference')).toHaveTextContent('Enabled');
    await userEvent.click(canvas.getByText('Email updates'));
    await expect(canvas.getByLabelText('Email preference')).toHaveTextContent('Disabled');
  },
};

export const NativeForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('checkbox', { name: 'SMS' }));
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Accept terms' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save preferences' }));
    await expect(canvas.getByLabelText('Submitted channels')).toHaveTextContent('email, sms');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByRole('checkbox', { name: 'SMS' })).not.toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Email' })).toBeChecked();
  },
};

export const Keyboard: Story = {
  render: () => (
    <div>
      <Checkbox label="Email updates" />
      <Checkbox label="Unavailable channel" disabled />
      <Checkbox label="SMS" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Email updates' });

    await userEvent.tab();
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole('checkbox', { name: 'SMS' })).toHaveFocus();
  },
};

export const Descriptions: Story = {
  render: () => (
    <div>
      <p id="checkbox-context">Notification settings.</p>
      <Checkbox
        id="email-channel"
        label="Email updates"
        aria-describedby="checkbox-context"
        description="Receive product news and tips."
        error="Choose at least one channel."
      />
    </div>
  ),
};

export const RefAccess: Story = {
  render: () => {
    const input = createRef<HTMLInputElement>();

    return (
      <div className="stack">
        <Button onClick={() => input.current?.focus()}>Focus preference</Button>
        <Checkbox label="Email updates" ref={input} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Email updates' });

    await userEvent.click(canvas.getByRole('button', { name: 'Focus preference' }));
    await expect(checkbox).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(checkbox).toBeChecked();
  },
};

export const LongLabels: Story = {
  render: () => (
    <div style={{ maxWidth: '320px' }}>
      <Checkbox
        label="Receive notifications about updates to every shared component in this workspace"
        description="ThisLongUnbrokenDescriptionMustWrapWithoutWideningThePage"
        error="Choose at least one notification channel before continuing."
      />
    </div>
  ),
};

export const LunaGroup: Story = { ...GroupSelection, globals: { theme: 'luna' } };
export const LunaStates: Story = { ...States, globals: { theme: 'luna' } };
