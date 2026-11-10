import { createRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, FormGroup, Switch } from '../../../index';

const meta = {
  id: 'components-switch', title: 'Components/Forms/Switch', component: Switch, tags: ['autodocs'],
  args: { label: 'Email notifications', description: 'Receive updates about your projects.' },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'A native checkbox with switch semantics for turning a setting on or off. Keep the label stable; use Checkbox for selection in a list. Native checked state supplies the exposed on/off state, Space toggles, and Tab skips disabled settings. Supports controlled/uncontrolled state, native form submission/reset, refs, descriptions, and independent switch.* token overrides. Parents own sibling spacing.' } } },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Show immediate controlled setting changes independently from the stable label.
 **/
function ControlledExample() {
  const [checked, setChecked] = useState(false);

  return <div className="stack"><Switch label="Email notifications" checked={checked} onChange={event => setChecked(event.target.checked)} /><output aria-label="Notification state">{checked ? 'On' : 'Off'}</output></div>;
}

/**
 * Demonstrate native successful values, external form ownership, and reset defaults.
 **/
function NativeFormExample() {
  const [result, setResult] = useState('Not submitted');

  return <div className="stack"><form id="switch-settings-form" className="stack" onSubmit={event => { event.preventDefault(); setResult(new FormData(event.currentTarget).getAll('notifications').join(', ') || 'None'); }}><FormGroup legend="Notification settings"><Switch label="Email notifications" name="notifications" value="email" defaultChecked /><Switch label="Unavailable notifications" name="notifications" value="disabled" disabled defaultChecked /></FormGroup><div className="actions"><Button type="submit">Save settings</Button><Button type="reset" variant="secondary">Reset</Button></div><output aria-label="Submitted settings">{result}</output></form><Switch label="Push notifications" name="notifications" value="push" form="switch-settings-form" /></div>;
}

export const Playground: Story = {};
export const On: Story = { args: { defaultChecked: true } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
export const States: Story = {
  render: () => <div className="theme-grid">{[{ name: 'Off', checked: false, disabled: false }, { name: 'On', checked: true, disabled: false }, { name: 'Disabled off', checked: false, disabled: true }, { name: 'Disabled on', checked: true, disabled: true }].map(state => <section key={state.name}><h2>{state.name}</h2><Switch label="Notifications" defaultChecked={state.checked} disabled={state.disabled} /></section>)}</div>,
};
export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme}</h2><Switch label="Email notifications" description="Receive updates about your projects." /><Switch label="Push notifications" defaultChecked /><Switch label="Unavailable notifications" disabled defaultChecked /></section>)}</div>,
};
export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('switch', { name: 'Email notifications' }));
    await expect(canvas.getByLabelText('Notification state')).toHaveTextContent('On');
    await userEvent.click(canvas.getByRole('switch', { name: 'Email notifications' }));
    await expect(canvas.getByLabelText('Notification state')).toHaveTextContent('Off');
  },
};
export const Keyboard: Story = {
  render: () => <div className="stack"><Switch label="Email notifications" /><Switch label="Unavailable notifications" disabled /><Switch label="Push notifications" /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('switch', { name: 'Email notifications' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('switch', { name: 'Email notifications' })).toBeChecked();
    await userEvent.tab();
    await expect(canvas.getByRole('switch', { name: 'Push notifications' })).toHaveFocus();
  },
};
export const NativeForm: Story = {
  render: () => <NativeFormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('switch', { name: 'Push notifications' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }));
    await expect(canvas.getByLabelText('Submitted settings')).toHaveTextContent('email, push');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByRole('switch', { name: 'Email notifications' })).toBeChecked();
    await expect(canvas.getByRole('switch', { name: 'Push notifications' })).not.toBeChecked();
    await userEvent.click(canvas.getByRole('switch', { name: 'Email notifications' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save settings' }));
    await expect(canvas.getByLabelText('Submitted settings')).toHaveTextContent('None');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
  },
};
export const Composition: Story = {
  render: () => <FormGroup legend="Notification settings" description="Control project updates.">{control => <Switch {...control} label="Email notifications" description="Receive updates about your projects." />}</FormGroup>,
};
export const DisabledGroup: Story = { render: () => <FormGroup legend="Notification settings" disabled><Switch label="Email notifications" defaultChecked /><Switch label="Push notifications" /></FormGroup> };
export const Customization: Story = { args: { className: 'custom-switch', wrapperClassName: 'custom-switch-field', wrapperStyle: { '--fs-switch-track-width': '48px', '--fs-switch-label-gap': '16px' }, style: { borderWidth: '2px' } } };
export const RefAccess: Story = {
  render: () => {
    const input = createRef<HTMLInputElement>();

    return <div className="stack"><Button onClick={() => input.current?.focus()}>Focus notifications</Button><Switch label="Email notifications" ref={input} /></div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Focus notifications' }));
    await expect(canvas.getByRole('switch')).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('switch')).toBeChecked();
  },
};
export const LongLabels: Story = { args: { label: 'Receive notifications about updates to every shared component in this workspace', description: 'ThisLongUnbrokenDescriptionMustWrapWithoutWideningThePage' } };
export const RightToLeft: Story = { render: () => <div dir="rtl"><Switch label="Email notifications" description="A setting within a right-to-left layout." /></div> };
