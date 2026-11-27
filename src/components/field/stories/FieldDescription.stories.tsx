import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { FieldDescription, FieldLabel } from '../FieldPrimitives';

const meta = {
  id: 'components-field-description',
  title: 'Components/Forms/FieldDescription',
  component: FieldDescription,
  tags: ['autodocs'],
  args: { id: 'project-hint', children: 'Use a short, descriptive name.', as: 'p' },
  argTypes: { as: { control: 'select', options: ['p', 'span'] } },
  parameters: {
    docs: {
      description: {
        component:
          'Supporting text rendered as a paragraph by default or an inline span. Link its unique id through the control’s aria-describedby. Native message attributes, className, typed semantic styles, and a paragraph/span ref are forwarded. Use the Explore composed Field link in the example.',
      },
    },
  },
  render: (args) => {
    const id = `${args.id}-${useId()}`;

    return (
      <div className="fs-field field-atom-demo">
        <FieldLabel htmlFor={`${id}-control`}>Project name</FieldLabel>
        <input id={`${id}-control`} type="text" aria-describedby={id} />
        <FieldDescription {...args} id={id} />
        <a href="./?path=/docs/components-field--docs" target="_top">
          Explore composed Field
        </a>
      </div>
    );
  },
} satisfies Meta<typeof FieldDescription>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Project name' })).toHaveAccessibleDescription(
      'Use a short, descriptive name.',
    );
  },
};
export const Inline: Story = { args: { as: 'span' } };

export const BothThemes: Story = {
  render: () => {
    const scope = useId();

    return (
      <div className="theme-grid">
        {(['corporate', 'luna'] as const).map((theme) => (
          <section key={theme} className="theme-panel stack" data-theme={theme}>
            <h2>{theme}</h2>
            <div className="fs-field field-atom-demo">
              <FieldLabel htmlFor={`${scope}-described-${theme}`}>Project name</FieldLabel>
              <input
                id={`${scope}-described-${theme}`}
                type="text"
                aria-describedby={`${scope}-hint-${theme}`}
              />
              <FieldDescription id={`${scope}-hint-${theme}`}>
                Use a short, descriptive name.
              </FieldDescription>
            </div>
          </section>
        ))}
      </div>
    );
  },
};
