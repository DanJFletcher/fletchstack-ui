import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FieldLabel } from '../FieldPrimitives';

const meta = {
  id: 'components-field-label',
  title: 'Components/Forms/FieldLabel',
  component: FieldLabel,
  tags: ['autodocs'],
  args: { htmlFor: 'project-name', children: 'Project name' },
  parameters: {
    docs: {
      description: {
        component:
          'A visible native label. Set required htmlFor to the unique control ID; children provide its accessible name. Native label attributes, className, typed semantic styles, and a label ref are forwarded. Use Field when one control also needs linked descriptions or errors. Use the Explore composed Field link in the example.',
      },
    },
  },
  render: (args) => {
    const id = `${args.htmlFor}-${useId()}`;

    return (
      <div className="fs-field field-atom-demo">
        <FieldLabel {...args} htmlFor={id} />
        <input id={id} type="text" />
        <a href="./?path=/docs/components-field--docs" target="_top">
          Explore composed Field
        </a>
      </div>
    );
  },
} satisfies Meta<typeof FieldLabel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('Project name'));
    await expect(canvas.getByRole('textbox', { name: 'Project name' })).toHaveFocus();
  },
};

export const BothThemes: Story = {
  render: () => {
    const scope = useId();

    return (
      <div className="theme-grid">
        {(['corporate', 'luna'] as const).map((theme) => (
          <section key={theme} className="theme-panel stack" data-theme={theme}>
            <h2>{theme}</h2>
            <div className="fs-field field-atom-demo">
              <FieldLabel htmlFor={`${scope}-name-${theme}`}>Project name</FieldLabel>
              <input id={`${scope}-name-${theme}`} type="text" />
            </div>
          </section>
        ))}
      </div>
    );
  },
};
