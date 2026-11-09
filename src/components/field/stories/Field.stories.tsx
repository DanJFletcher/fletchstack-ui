import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox, Field, FieldDescription, FieldError, FieldLabel, TextInput } from '../../../index';

const meta = {
  id: 'components-field', title: 'Components/Forms/Field', component: Field, tags: ['autodocs'],
  args: { label: 'Notes', helperText: 'A short project summary.', children: props => <textarea {...props} name="notes" rows={3} style={{ font: 'inherit', color: 'inherit', background: 'transparent' }} /> },
  parameters: { docs: { description: { component: 'A visible label and linked helper/error messages around one consumer-owned native control. Spread the render-prop attributes onto that control. FieldLabel, FieldDescription, and FieldError are available independently; messages support inline spans. Field adds no keyboard stop or control styling. Existing fully labeled library controls already compose these pieces.' } } },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;


export const Playground: Story = {
  render: args => <Field {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Notes'));
    await expect(canvas.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
    await userEvent.type(canvas.getByRole('textbox'), 'Launch checklist');
    await expect(canvas.getByRole('textbox')).toHaveValue('Launch checklist');
  },
};

export const States: Story = {
  render: () => <div className="theme-grid"><Field label="Default">{props => <input {...props} />}</Field><Field label="Error" helperText="Use a short name." error="Enter a project name.">{props => <input {...props} />}</Field><Field label="Disabled">{props => <input {...props} disabled defaultValue="Unavailable" />}</Field><Field label="Read-only" aria-invalid={false}>{props => <input {...props} readOnly defaultValue="Project" />}</Field><Field label="Hidden" hidden>{props => <input {...props} />}</Field></div>,
};

export const StandalonePrimitives: Story = {
  render: () => <div className="stack"><FieldLabel htmlFor="standalone-name">Project name</FieldLabel><input id="standalone-name" aria-describedby="standalone-help standalone-error" aria-invalid="true" /><FieldDescription id="standalone-help">Use a short name.</FieldDescription><FieldError id="standalone-error">Enter a project name.</FieldError></div>,
};

export const Customization: Story = {
  render: () => <Field id="custom-name" label="Project name" helperText="Custom hint." error="Enter a project name." className="custom-field" classNames={{ label: 'custom-label', helper: 'custom-hint', error: 'custom-error' }} style={{ '--fs-field-gap': '24px' }}>{props => <input {...props} />}</Field>,
};

export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} className="theme-panel stack" data-theme={theme}><h2>{theme}</h2><Field label="Notes" helperText="A short project summary." error="Enter a summary.">{props => <textarea {...props} rows={3} style={{ font: 'inherit', color: 'inherit', background: 'transparent' }} />}</Field><TextInput label="Project name" defaultValue="Website refresh" helperText="Existing component composition." /><Checkbox label="Email" description="Existing inline description." /></section>)}</div>,
};

export const InlineMessages: Story = {
  render: () => <div className="stack"><FieldLabel htmlFor="inline-email" className="inline-label"><input id="inline-email" type="checkbox" aria-describedby="inline-help inline-error" aria-invalid="true" /> Email <FieldDescription as="span" id="inline-help" className="inline-help">Product news.</FieldDescription></FieldLabel><FieldError as="span" id="inline-error" className="inline-error">Choose a channel.</FieldError></div>,
};

export const Descriptions: Story = {
  render: () => <><p id="field-context">Project settings.</p><p id="field-unit">Characters.</p><Field id="described-name" label="Project name" aria-describedby="field-context" descriptionIds={['field-unit']} helperText="Use a short name." error="Enter a project name.">{props => <input {...props} />}</Field></>,
};

export const LongLabels: Story = {
  render: () => <Field label="Enter a short summary that describes the project and its shared components" helperText="Descriptions remain associated and wrap with enlarged text in narrow containers." error="Enter the summary before continuing.">{props => <textarea {...props} rows={3} style={{ font: 'inherit', color: 'inherit', background: 'transparent' }} />}</Field>,
};
