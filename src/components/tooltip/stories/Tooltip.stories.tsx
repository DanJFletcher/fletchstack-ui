import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Tooltip } from '../Tooltip';
import {
  ClippedTooltip,
  DescribedTooltip,
  IconTooltip,
  LinkTooltip,
  ScrollableTooltip,
  TooltipDemo,
  TooltipExample,
  TooltipInDialog,
  TooltipInPopover,
  TooltipOverrides,
  TooltipPlacements,
} from './tooltip-examples';
import docs from '../../../../docs/tooltip.md?raw';
import './tooltip.stories.css';

const meta = {
  id: 'components-tooltip',
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: {
    content: 'Brief contextual help appears on hover or keyboard focus.',
    children: <button>More information</button>,
  },
  argTypes: {
    children: { control: false },
    placement: { options: ['top', 'right', 'bottom', 'left'], control: 'select' },
  },
  render: (args) => <TooltipDemo {...args} />,
  parameters: { a11y: { test: 'error' }, docs: { description: { component: docs } } },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <TooltipExample /> };
export const KeyboardDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      trigger = canvas.getByRole('button', { name: 'More information' });
    trigger.focus();
    await waitFor(() => expect(canvas.getByRole('tooltip')).toBeVisible());
    await expect(trigger).toHaveAccessibleDescription(
      'Brief contextual help appears on hover or keyboard focus.',
    );
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
    trigger.blur();
  },
};
// Leave both themed descriptions visible for the post-play accessibility scan.
export const VisibleThemeDescriptions: Story = {
  render: () => <TooltipExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const corporate = within(canvas.getByRole('heading', { name: 'Corporate' }).parentElement!);
    const luna = within(canvas.getByRole('heading', { name: 'Luna' }).parentElement!);
    await userEvent.hover(corporate.getByRole('button', { name: 'More information' }));
    luna.getByRole('button', { name: 'More information' }).focus();
    await waitFor(() => expect(corporate.getByRole('tooltip')).toBeVisible());
    await waitFor(() => expect(luna.getByRole('tooltip')).toBeVisible());
  },
};
export const PlacementExamples: Story = { render: () => <TooltipPlacements /> };
export const ExistingDescription: Story = { render: () => <DescribedTooltip /> };
export const IconOnlyAction: Story = { render: () => <IconTooltip /> };
export const NativeLink: Story = { render: () => <LinkTooltip /> };
export const ViewportEdge: Story = {
  render: () => (
    <div className="tooltip-demo__edge">
      <TooltipDemo />
    </div>
  ),
};
export const TransformedClippedPanel: Story = { render: () => <ClippedTooltip /> };
export const ScrollablePanel: Story = { render: () => <ScrollableTooltip /> };
export const ScopedOverrides: Story = { render: () => <TooltipOverrides /> };
export const NestedThemeBoundary: Story = {
  render: () => (
    <section className="tooltip-demo__theme" data-theme="corporate">
      <section className="tooltip-demo__theme" data-theme="luna">
        <TooltipDemo />
      </section>
    </section>
  ),
};
export const InsidePopover: Story = { render: () => <TooltipInPopover /> };
export const InsideDialog: Story = { render: () => <TooltipInDialog /> };
export const LongContent: Story = {
  args: {
    content:
      'Supplementary help can wrap across multiple lines in a narrow viewport. Essential instructions must remain visible in the page instead of depending on this tooltip.',
  },
};
