import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Chip } from '../Chip';
import { ChipExample, ChipFilters, SelectableRemovableChip } from './chip-examples';
import './chip.stories.css';

const meta = {
  id: 'components-chip',
  title: 'Components/Identity/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Design systems' },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Compact content tags with optional controlled selection and an independent, localized removal action. Selection and removal are sibling native buttons. Parents own selection, removal and focus restoration. Load chip.css with tokens, or use combined styles.',
      },
    },
  },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Sizes: Story = {
  render: () => (
    <div className="chip-demo__row">
      {(['small', 'medium', 'large'] as const).map((size) => (
        <Chip key={size} size={size}>
          Design · {size}
        </Chip>
      ))}
    </div>
  ),
};
export const SelectableAndRemovable: Story = {
  render: () => <SelectableRemovableChip />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'React' }));
    await expect(canvas.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Remove React' }));
    await expect(canvas.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    await expect(canvas.getByLabelText('Removal requested')).toHaveTextContent(
      'React removal requested.',
    );
  },
};
export const KeyboardSelection: Story = {
  render: () => <ChipFilters />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Design systems' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Design systems' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('button', { name: 'Design systems' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  },
};
export const Disabled: Story = {
  render: () => (
    <div className="chip-demo__row">
      <Chip disabled>Static disabled</Chip>
      <Chip
        disabled
        selected
        onSelect={() => {}}
        onRemove={() => {}}
        removeLabel="Remove disabled tag"
      >
        Disabled tag
      </Chip>
    </div>
  ),
};
export const LongLabel: Story = {
  args: { children: 'ALongUnbrokenContentTagThatWrapsWithinItsContainer' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export const Composition: Story = { render: () => <ChipExample /> };
export const ThemeCoverage: Story = { render: () => <ChipExample /> };
export const Customization: Story = { args: { style: { '--fs-chip-radius': '4px' } } };
export const Hidden: Story = { args: { hidden: true } };
