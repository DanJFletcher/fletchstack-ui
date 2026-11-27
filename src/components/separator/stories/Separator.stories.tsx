import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Separator, type SeparatorProps } from '../../../index';
import './separator.stories.css';

const meta = {
  id: 'components-separator',
  title: 'Components/Layout/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: { orientation: 'horizontal', decorative: true },
  argTypes: {
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    decorative: { control: 'boolean' },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'A neutral 1px static rule. Decorative grouping is hidden from assistive technology by default; set decorative=false for a meaningful separator with an explicit orientation. No focus, interaction, or adjustable value. Parent layouts own spacing and available width/height. Vertical rules stretch in flex/grid layouts; outside those layouts provide an explicit height.',
      },
    },
  },
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Separate meaningful account sections and visually group independent actions.
 **/
function AccountExample() {
  return (
    <section className="stack" aria-label="Account settings">
      <div>
        <h2>Profile</h2>
        <p>Your name and contact details.</p>
      </div>
      <Separator decorative={false} />
      <div>
        <h2>Preferences</h2>
        <p>Your display and notification settings.</p>
      </div>
      <div className="separator-actions">
        <Button variant="secondary">Edit</Button>
        <Separator orientation="vertical" />
        <Button variant="secondary">Duplicate</Button>
      </div>
    </section>
  );
}

export const Playground: Story = {};
export const Semantic: Story = { args: { decorative: false, 'aria-label': 'Section boundary' } };
export const Vertical: Story = {
  args: { decorative: false, orientation: 'vertical' },
  render: (args) => (
    <div className="separator-actions separator-height">
      <span>Overview</span>
      <Separator {...args} />
      <span>Activity</span>
    </div>
  ),
};
export const Composition: Story = {
  render: () => <AccountExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('separator')).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Edit' }));
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Duplicate' })).toHaveFocus();
  },
};
export const BothThemes: Story = {
  render: () => (
    <div className="theme-grid">
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="theme-panel stack">
          <h2>{theme}</h2>
          <AccountExample />
        </section>
      ))}
    </div>
  ),
};
export const Customization: Story = {
  args: {
    decorative: false,
    className: 'custom-separator',
    style: { '--fs-separator-thickness': '2px', '--fs-separator-color': 'var(--fs-text)' },
  },
};
export const Hidden: Story = {
  args: { hidden: true, decorative: false },
  render: (args) => (
    <div>
      <p>The native hidden attribute suppresses this separator.</p>
      <Separator {...args} />
    </div>
  ),
};
export const PassiveSemantics: Story = {
  render: () => (
    <Separator
      {...({
        role: 'slider',
        tabIndex: 0,
        'aria-orientation': 'vertical',
        'aria-hidden': true,
        'aria-valuenow': 50,
        onClick: 'ignored',
        title: 'Imported boundary',
      } as unknown as SeparatorProps)}
      decorative={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Untyped interactive and range-value overrides are ignored; native descriptions remain available.',
      },
    },
  },
};
