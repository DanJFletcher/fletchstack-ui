import { createRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, FormGroup, Radio } from '../../../index';

const meta = {
  id: 'components-radio', title: 'Components/Forms/Radio', component: Radio, tags: ['autodocs'],
  args: { label: 'Standard delivery', description: 'Arrives in 3–5 business days.' },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'One native mutually exclusive choice. Give related options a shared name and distinct values, and compose FormGroup for their legend and shared messages. Native semantics own keyboard selection, forms, validation and reset. Supports refs, controlled/uncontrolled checked state, descriptions, errors, disabled choices, and independent radio.* token overrides. Parents own sibling spacing.' } } },
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Show a named native group with a disabled option between selectable choices.
 **/
function DeliveryGroup() {
  return <FormGroup legend="Delivery method" description="Choose one option."><Radio label="Standard delivery" name="delivery" value="standard" defaultChecked /><Radio label="Next-day delivery" name="delivery" value="next-day" disabled /><Radio label="Express delivery" name="delivery" value="express" /></FormGroup>;
}

/**
 * Keep consumer state visible as the selected option changes.
 **/
function ControlledExample() {
  const [value, setValue] = useState('standard');

  return <div className="stack"><FormGroup legend="Delivery method">{['standard', 'express'].map(option => <Radio key={option} label={option} name="controlled-delivery" value={option} checked={value === option} onChange={event => setValue(event.target.value)} />)}</FormGroup><output aria-label="Selected delivery">{value}</output></div>;
}

/**
 * Exercise native validation, successful form values, external ownership, and reset.
 **/
function NativeFormExample() {
  const [result, setResult] = useState('Not submitted');

  return <div className="stack"><form id="radio-delivery-form" className="stack" onSubmit={event => { event.preventDefault(); setResult(String(new FormData(event.currentTarget).get('delivery'))); }}><FormGroup legend="Delivery method"><Radio label="Standard delivery" name="delivery" value="standard" required defaultChecked /><Radio label="Express delivery" name="delivery" value="express" required /><Radio label="Unavailable delivery" name="delivery" value="unavailable" disabled /></FormGroup><div className="actions"><Button type="submit">Save delivery</Button><Button type="reset" variant="secondary">Reset</Button></div><output aria-label="Submitted delivery">{result}</output></form><Radio label="Collection" name="delivery" value="collection" form="radio-delivery-form" /></div>;
}

export const Playground: Story = {};
export const Selected: Story = { args: { defaultChecked: true } };
export const Invalid: Story = { args: { error: 'Choose a delivery method.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultChecked: true } };
export const States: Story = {
  render: () => <div className="theme-grid"><Radio label="Unselected" /><Radio label="Selected" defaultChecked /><Radio label="Error" error="Choose a delivery method." /><Radio label="Disabled unselected" disabled /><Radio label="Disabled selected" defaultChecked disabled /></div>,
};
export const GroupSelection: Story = {
  render: () => <DeliveryGroup />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText('Express delivery'));
    await expect(canvas.getByRole('radio', { name: 'Express delivery' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Standard delivery' })).not.toBeChecked();
  },
};
export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('radio', { name: 'express' }));
    await expect(canvas.getByLabelText('Selected delivery')).toHaveTextContent('express');
    await userEvent.click(canvas.getByRole('radio', { name: 'standard' }));
    await expect(canvas.getByLabelText('Selected delivery')).toHaveTextContent('standard');
  },
};
export const NativeForm: Story = {
  render: () => <NativeFormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('radio', { name: 'Express delivery' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save delivery' }));
    await expect(canvas.getByLabelText('Submitted delivery')).toHaveTextContent('express');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByRole('radio', { name: 'Standard delivery' })).toBeChecked();
    await userEvent.click(canvas.getByRole('radio', { name: 'Collection' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Save delivery' }));
    await expect(canvas.getByLabelText('Submitted delivery')).toHaveTextContent('collection');
  },
};
export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme}</h2><FormGroup legend="Delivery method"><Radio label="Standard delivery" name={`${theme}-delivery`} value="standard" defaultChecked /><Radio label="Express delivery" name={`${theme}-delivery`} value="express" description="Arrives tomorrow." /><Radio label="Unavailable" disabled /></FormGroup></section>)}</div>,
};
export const SharedError: Story = {
  render: () => <FormGroup legend="Delivery method" error="Choose a delivery method.">{control => <><Radio {...control} label="Standard delivery" name="required-delivery" value="standard" required /><Radio {...control} label="Express delivery" name="required-delivery" value="express" required /></>}</FormGroup>,
};
export const DisabledGroup: Story = {
  render: () => <FormGroup legend="Delivery method" disabled><Radio label="Standard delivery" name="disabled-delivery" defaultChecked /><Radio label="Express delivery" name="disabled-delivery" /></FormGroup>,
};
export const Customization: Story = {
  args: { defaultChecked: true, className: 'custom-radio', wrapperClassName: 'custom-radio-field', wrapperStyle: { '--fs-radio-control-size': '24px', '--fs-radio-label-gap': '16px' }, style: { borderWidth: '2px' } },
};
export const RefAccess: Story = {
  render: () => {
    const input = createRef<HTMLInputElement>();

    return <div className="stack"><Button onClick={() => input.current?.focus()}>Focus delivery</Button><Radio label="Standard delivery" ref={input} /></div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Focus delivery' }));
    await expect(canvas.getByRole('radio')).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('radio')).toBeChecked();
  },
};
export const LongLabels: Story = { args: { label: 'Receive the delivery at the address associated with your shared workspace', description: 'ThisLongUnbrokenDescriptionMustWrapWithoutWideningThePage', error: 'Choose a delivery method before continuing.' } };
