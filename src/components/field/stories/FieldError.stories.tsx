import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { FieldError, FieldLabel } from '../FieldPrimitives';

const meta = {
  id: 'components-field-error', title: 'Components/Forms/FieldError', component: FieldError, tags: ['autodocs'],
  args: { id: 'project-error', children: 'Enter a project name.', as: 'p' },
  argTypes: { as: { control: 'select', options: ['p', 'span'] } },
  parameters: { docs: { description: { component: 'Validation text rendered as a paragraph or inline span. Link its unique id through aria-describedby and set aria-invalid on the control. This atom imposes no live region. Native message attributes, className, typed semantic styles, and a paragraph/span ref are forwarded. Use the Explore composed Field link in the example.' } } },
  render: args => {
    const id = `${args.id}-${useId()}`;

    return <div className="fs-field field-atom-demo"><FieldLabel htmlFor={`${id}-control`}>Project name</FieldLabel><input id={`${id}-control`} type="text" aria-invalid="true" aria-describedby={id} /><FieldError {...args} id={id} /><a href="./?path=/docs/components-field--docs" target="_top">Explore composed Field</a></div>;
  },
} satisfies Meta<typeof FieldError>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Project name' })).toHaveAccessibleDescription('Enter a project name.');
    await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  },
};
export const Inline: Story = { args: { as: 'span' } };

export const BothThemes: Story = {
  render: () => {
    const scope = useId();

    return <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} className="theme-panel stack" data-theme={theme}><h2>{theme}</h2><div className="fs-field field-atom-demo"><FieldLabel htmlFor={`${scope}-invalid-${theme}`}>Project name</FieldLabel><input id={`${scope}-invalid-${theme}`} type="text" aria-invalid="true" aria-describedby={`${scope}-error-${theme}`} /><FieldError id={`${scope}-error-${theme}`}>Enter a project name.</FieldError></div></section>)}</div>;
  },
};
