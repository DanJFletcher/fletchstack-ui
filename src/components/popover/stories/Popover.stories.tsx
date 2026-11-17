import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Popover } from '../Popover';
import { ControlledPopover, EdgePopover, PopoverDemo, PopoverExample, PopoverInDialog, PopoverOverrides } from './popover-examples';
import docs from '../../../../docs/popover.md?raw';
import './popover.stories.css';

const meta = { id: 'components-popover', title: 'Components/Overlays/Popover', component: Popover, tags: ['autodocs'], args: { triggerLabel: 'Project details', heading: 'Project details' }, render: args => <PopoverDemo {...args} />, argTypes: { side: { options: ['top', 'right', 'bottom', 'left'], control: 'select' }, align: { options: ['start', 'center', 'end'], control: 'select' } }, parameters: { a11y: { test: 'error' }, docs: { description: { component: docs } } } } satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <PopoverExample /> };
export const KeyboardDismissal: Story = { play: async ({ canvasElement }) => {
  const canvas = within(canvasElement), trigger = canvas.getByRole('button', { name: 'Project details' });
  await userEvent.click(trigger);
  await waitFor(() => expect(canvas.getByRole('dialog', { name: 'Project details' })).toBeVisible());
  await userEvent.keyboard('{Tab}');
  await expect(canvas.getByRole('button', { name: 'Close popover' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await expect(trigger).toHaveFocus();
  await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
} };
export const AutofocusContent: Story = { args: { autoFocus: true, showCloseButton: false } };
export const ControlledOpenState: Story = { render: () => <ControlledPopover /> };
export const OutsideDismissalDisabled: Story = { args: { closeOnOutsideClick: false, closeOnFocusOutside: false } };
export const EscapeDisabled: Story = { args: { closeOnEscape: false } };
export const AllPlacements: Story = { render: () => <div className="popover-demo">{(['top', 'right', 'bottom', 'left'] as const).map(side => <PopoverDemo key={side} side={side} triggerLabel={`${side} panel`} />)}</div> };
export const EdgePositioning: Story = { render: () => <EdgePopover /> };
export const MatchTriggerWidth: Story = { args: { matchTriggerWidth: true } };
export const NestedThemeBoundary: Story = { render: () => <section data-theme="corporate" className="popover-demo__theme"><section data-theme="luna" className="popover-demo__theme"><PopoverDemo /></section></section> };
export const InsideDialog: Story = { render: () => <PopoverInDialog /> };
export const ScopedPanelStyle: Story = { render: () => <PopoverOverrides /> };
// Initial-open demonstrations stay out of Docs so landing never opens overlays.
export const InitiallyOpen: Story = { tags: ['!autodocs'], args: { defaultOpen: true } };
