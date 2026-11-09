import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, TextInput } from '../../../index';

const meta = {
  id: 'components-textinput', title: 'Components/Forms/TextInput', component: TextInput, tags: ['autodocs'],
  args: { label: 'Project name', placeholder: 'Enter a project name', helperText: 'Use a short, descriptive name.' },
  argTypes: { size: { control: 'select', options: ['small', 'medium', 'large'] }, type: { control: 'select', options: ['text', 'email', 'password', 'search', 'tel', 'url'] } },
  parameters: { docs: { description: { component: 'A labeled native single-line input. Supports controlled/uncontrolled values, linked helper/error descriptions, read-only selection, disabled editing, native form attributes, textual prefix/suffix context, refs, and semantic token overrides. Adornments are described to assistive technology but excluded from the submitted value. Use wrapperStyle to customize the enclosing control border and field tokens.' } } },
} satisfies Meta<typeof TextInput>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Keep the controlled value observable as a consumer-facing outcome.
 **/
function ControlledExample() {
  const [value, setValue] = useState('Website refresh');

  return <div className="stack"><TextInput label="Project name" value={value} onChange={event => setValue(event.target.value)} /><output aria-label="Current project name">{value}</output></div>;
}

/**
 * Demonstrate native submission/reset and read-only versus disabled inclusion.
 **/
function FormExample() {
  const [result, setResult] = useState('Not submitted');

  return <form className="stack" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setResult(`${data.get('project')} / ${data.get('slug')} / ${data.get('disabled')}`); }}><TextInput label="Project name" name="project" defaultValue="Website refresh" required /><TextInput label="Project identifier" name="slug" readOnly defaultValue="project-1" /><TextInput label="Unavailable value" name="disabled" disabled defaultValue="unavailable" /><div className="actions"><Button type="submit">Save project</Button><Button type="reset" variant="secondary">Reset</Button></div><output aria-label="Submitted values">{result}</output></form>;
}


export const Playground: Story = {};

export const States: Story = {
  render: () => <div className="theme-grid"><TextInput label="Default" placeholder="Enter a project name" /><TextInput label="Filled" defaultValue="Website refresh" /><TextInput label="Error" error="Enter a project name." required /><TextInput label="Disabled" disabled defaultValue="Website refresh" /><TextInput label="Read-only" readOnly defaultValue="Website refresh" /></div>,
};
export const Filled: Story = { args: { defaultValue: 'Website refresh' } };
export const Invalid: Story = { args: { error: 'Enter a project name.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Website refresh' } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Website refresh' } };

export const Sizes: Story = {
  render: () => <div className="stack">{(['small', 'medium', 'large'] as const).map(size => <TextInput key={size} size={size} label={`${size} project name`} defaultValue="Website refresh" />)}</div>,
};

export const ContentPatterns: Story = {
  render: () => <div className="stack"><TextInput label="Project name" placeholder="Enter a project name" helperText="Keep labels visible. Use placeholders as examples." /><TextInput label="Website" prefix="https://" defaultValue="example.com" helperText="Enter the domain. The application adds the protocol." /><TextInput label="Weight" suffix="kg" inputMode="decimal" defaultValue="25" /></div>,
};

export const Customization: Story = {
  render: () => <TextInput label="Custom project" wrapperClassName="custom-text-field" className="custom-text-control" wrapperStyle={{ '--fs-text-input-radius': '24px', '--fs-text-input-padding-inline': '24px' }} style={{ fontWeight: 600 }} defaultValue="Website refresh" />,
};

export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme}</h2><TextInput label={`${theme} project name`} defaultValue="Website refresh" helperText="Use a short, descriptive name." /><TextInput label={`${theme} website`} prefix="https://" defaultValue="example.com" /><TextInput label={`${theme} required name`} error="Enter a project name." required /></section>)}</div>,
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Project name' });

    await userEvent.clear(input);
    await userEvent.type(input, 'Launch');
    await expect(canvas.getByLabelText('Current project name')).toHaveTextContent('Launch');
  },
};

export const NativeForm: Story = {
  render: () => <FormExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Project name' });

    await userEvent.clear(input);
    await userEvent.type(input, 'Launch');
    await userEvent.click(canvas.getByRole('button', { name: 'Save project' }));
    await expect(canvas.getByLabelText('Submitted values')).toHaveTextContent('Launch / project-1 / null');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(input).toHaveValue('Website refresh');
  },
};

export const KeyboardAndReadOnly: Story = {
  render: () => <div className="stack"><TextInput label="Read-only project" readOnly defaultValue="Website refresh" /><TextInput label="Disabled project" disabled defaultValue="Unavailable" /><TextInput label="Editable project" /></div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Read-only project' });

    await userEvent.tab();
    await expect(input).toHaveFocus();
    await userEvent.keyboard('Changed');
    await expect(input).toHaveValue('Website refresh');
    await userEvent.tab();
    await expect(canvas.getByRole('textbox', { name: 'Editable project' })).toHaveFocus();
  },
};

export const Descriptions: Story = {
  render: () => <div className="stack"><p id="website-context">Project settings.</p><TextInput id="website" label="Website" prefix="https://" suffix="/" aria-describedby="website-context" helperText="Enter a domain." error="Enter a website." /></div>,
};

export const InputTypes: Story = {
  render: () => <div className="stack">{(['email', 'password', 'search', 'tel', 'url'] as const).map(type => <TextInput key={type} type={type} label={`${type} input`} autoComplete="off" />)}</div>,
};

export const LongLabels: Story = {
  render: () => <div style={{ maxWidth: '320px' }}><TextInput label="Enter the website where your project and its shared components will live" prefix="https://" suffix=".example.test" defaultValue="projects" helperText="Labels, context, and descriptions wrap with enlarged text in narrow containers." /></div>,
};

export const LunaStates: Story = { ...States, globals: { theme: 'luna' } };
