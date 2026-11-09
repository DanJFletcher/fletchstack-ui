import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Select } from '../../../index';

/**
 * Synthetic workspace choices, including one unavailable option.
 **/
function Options() {
  return <><option value="personal">Personal</option><option value="design">Design team</option><option value="engineering">Engineering</option><option value="archived" disabled>Archived</option></>;
}

const meta = {
  id: 'components-select', title: 'Components/Forms/Select', component: Select, tags: ['autodocs'],
  args: { label: 'Workspace', placeholder: 'Choose a workspace', helperText: 'Choose where your project lives.', children: <Options /> },
  argTypes: { size: { control: 'select', options: ['small', 'medium', 'large'] }, children: { control: false } },
  parameters: { docs: { description: { component: 'A labeled native single select. Supports option/optgroup children, controlled and uncontrolled values, linked helper/error messages, native form behavior, disabled choices, refs, and semantic token overrides. The popup is browser/OS rendered. Parents own placement; Select owns field spacing and chevron clearance.' } } },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Keep controlled selection visible as a public consumer outcome.
 **/
function ControlledExample() {
  const [value, setValue] = useState('personal');

  return <div className="stack"><Select label="Workspace" value={value} onChange={event => setValue(event.target.value)} helperText="Changes appear below."><Options /></Select><output aria-label="Selected workspace">{value}</output></div>;
}

/**
 * Submit and reset a native select inside a real consumer form.
 **/
function FormExample() {
  const [result, setResult] = useState('Not submitted');

  return <form className="stack" onSubmit={event => { event.preventDefault(); setResult(String(new FormData(event.currentTarget).get('workspace'))); }}><Select label="Workspace" name="workspace" defaultValue="personal" required><Options /></Select><div className="actions"><Button type="submit">Save workspace</Button><Button type="reset" variant="secondary">Reset</Button></div><output aria-label="Submitted workspace">{result}</output></form>;
}


export const Playground: Story = {};

export const States: Story = {
  render: () => <div className="theme-grid"><Select label="Default" placeholder="Choose a workspace"><Options /></Select><Select label="Selected" defaultValue="personal"><Options /></Select><Select label="Error" placeholder="Choose a workspace" error="Select a workspace." required><Options /></Select><Select label="Disabled" placeholder="Unavailable" disabled><Options /></Select></div>,
};
export const Selected: Story = { args: { defaultValue: 'personal' } };
export const Invalid: Story = { args: { error: 'Select a workspace.', required: true } };
export const Disabled: Story = { args: { disabled: true, placeholder: 'Unavailable' } };

export const Sizes: Story = {
  render: () => <div className="stack">{(['small', 'medium', 'large'] as const).map(size => <Select key={size} size={size} label={`${size} workspace`} defaultValue="personal"><Options /></Select>)}</div>,
};

export const Customization: Story = {
  render: () => <Select label="Custom workspace" defaultValue="personal" wrapperClassName="custom-select" wrapperStyle={{ '--fs-select-radius': '24px', '--fs-select-padding-inline': '24px', '--fs-select-chevron-clearance': '56px' }} className="custom-select-control" style={{ '--fs-select-font-size': '1.125rem' }}><Options /></Select>,
};

export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section data-theme={theme} className="theme-panel stack" key={theme}><h2>{theme}</h2><Select label={`${theme} workspace`} defaultValue="personal" helperText="Choose where your project lives."><Options /></Select><Select label={`${theme} required workspace`} placeholder="Choose a workspace" error="Select a workspace." required><Options /></Select></section>)}</div>,
};
export const BrowserDefault: Story = { render: () => <Select label="Workspace"><Options /></Select> };

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Workspace' }), 'design');
    await expect(canvas.getByLabelText('Selected workspace')).toHaveTextContent('design');
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Workspace' }), 'archived');
    await expect(canvas.getByLabelText('Selected workspace')).toHaveTextContent('design');
  },
};

export const NativeForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Workspace' }), 'engineering');
    await userEvent.click(canvas.getByRole('button', { name: 'Save workspace' }));
    await expect(canvas.getByLabelText('Submitted workspace')).toHaveTextContent('engineering');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByRole('combobox', { name: 'Workspace' })).toHaveValue('personal');
  },
};

export const GroupsAndDescriptions: Story = {
  render: () => <div className="stack"><p id="select-context">Only active workspaces can be selected.</p><Select id="grouped-workspace" label="Workspace" aria-describedby="select-context" helperText="Choose a team." error="Review your selection." defaultValue="personal"><optgroup label="Private"><option value="personal">Personal</option></optgroup><optgroup label="Teams"><option value="design">Design team</option><option disabled value="archived">Archived</option></optgroup></Select></div>,
};

export const LongLabels: Story = {
  render: () => <div style={{ maxWidth: '320px' }}><Select label="Choose the workspace where your project and its shared components will live" helperText="Labels and descriptions wrap in narrow containers and with enlarged text." placeholder="Choose a workspace"><option value="long">WorkspaceWithAnExtremelyLongUnbrokenNameThatMustNotWidenThePage</option></Select></div>,
};

export const LunaStates: Story = { ...States, globals: { theme: 'luna' } };
