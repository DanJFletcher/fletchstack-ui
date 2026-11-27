import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea } from '../../../index';
import { ControlledExample, FormExample, ResetOwnershipExample } from './Textarea.examples';

const meta = {
  id: 'components-textarea',
  title: 'Components/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    label: 'Project description',
    placeholder: 'Describe your project...',
    helperText: 'Describe the goals of your project.',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A labeled native multiline field composed from Field. Supports controlled and uncontrolled strings, vertical resizing, linked messages, read-only selection, native form behavior and refs, and optional character guidance using native UTF-16 length semantics. Counter text is described without a live announcement on every keystroke. Default minimum height 120px, text 16px, padding 12px.',
      },
    },
  },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="theme-grid">
      <Textarea label="Default" placeholder="Describe your project..." />
      <Textarea label="Filled" defaultValue="Improve navigation and simplify checkout." />
      <Textarea label="Error" error="Enter a description." />
      <Textarea label="Disabled" disabled defaultValue="Project overview" />
      <Textarea label="Read-only" readOnly defaultValue="A simpler experience." />
    </div>
  ),
};
export const Filled: Story = {
  args: { defaultValue: 'A refreshed website with clearer navigation and a simpler checkout.' },
};
export const Invalid: Story = { args: { error: 'Enter a description.', required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Project overview' } };
export const ReadOnly: Story = {
  args: { readOnly: true, defaultValue: 'A simpler experience, from start to finish.' },
};
export const Customization: Story = {
  render: () => (
    <Textarea
      label="Custom description"
      rows={8}
      wrapperClassName="custom-textarea-field"
      className="custom-textarea"
      wrapperStyle={{ '--fs-textarea-radius': '24px', '--fs-textarea-padding-inline': '24px' }}
      style={{ resize: 'none' }}
    />
  ),
};

export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme}</h2>
          <Textarea
            label="Description"
            defaultValue="A simpler experience, from start to finish."
            helperText="Describe the goals of your project."
          />
          <Textarea
            label="Short description"
            maxLength={200}
            showCount
            defaultValue="A clearer checkout."
          />
          <Textarea label="Required description" error="Enter a description." />
        </section>
      ))}
    </div>
  ),
};
export const LengthGuidance: Story = {
  args: {
    label: 'Short description',
    helperText: 'Keep it under 200 characters.',
    maxLength: 200,
    showCount: true,
    defaultValue: 'A clearer checkout.',
  },
};
export const UnlimitedCount: Story = { args: { showCount: true } };

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Use suggested summary' }));
    await expect(canvas.getByRole('textbox')).toHaveAccessibleDescription('15');
  },
};

export const NativeForm: Story = { render: () => <FormExample /> };

export const ResetOwnership: Story = { render: () => <ResetOwnershipExample /> };
export const Descriptions: Story = {
  render: () => (
    <>
      <p id="description-context">Project settings.</p>
      <Textarea
        id="description"
        label="Description"
        aria-describedby="description-context"
        helperText="Use a short summary."
        error="Enter a description."
        showCount
        maxLength={200}
      />
    </>
  ),
};
export const LongLabels: Story = {
  render: () => (
    <Textarea
      label="Describe the goals of your project and the improvements you want to make for everyone who uses it"
      helperText="Labels, descriptions, counters, and errors wrap with enlarged text in narrow containers."
      error="Enter a description before continuing."
      maxLength={200}
      showCount
    />
  ),
};
