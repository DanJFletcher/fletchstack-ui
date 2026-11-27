import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Toast } from '../Toast';
import {
  ControlledToast,
  PositionedToast,
  NarrowToast,
  TimedToast,
  ToastExample,
  ToastOverrides,
  ToastQueue,
  ToastTones,
} from './toast-examples';

const meta = {
  id: 'components-toast',
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    title: 'Changes saved',
    children: 'Your team can see the latest version.',
    announcement: 'off',
  },
  argTypes: {
    tone: { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
    announcement: { control: 'select', options: ['polite', 'assertive', 'off'] },
    duration: { control: 'number' },
    position: {
      control: 'select',
      options: [
        undefined,
        'top',
        'top-right',
        'right',
        'bottom-right',
        'bottom',
        'bottom-left',
        'left',
        'top-left',
        'top-start',
        'top-end',
        'bottom-start',
        'bottom-end',
      ],
    },
    action: { control: false },
    icon: { control: false },
  },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Dismissible action feedback with optional title, icon and action nodes. Defaults: tone="info", defaultOpen=true, duration=0 (persistent), announcement="polite", dismissLabel="Dismiss notification". Control visibility with open/onOpenChange. Positive duration opts into a timeout that pauses on hover, focus and background tabs. Never steals focus. Escape inside or the dismiss button closes it and restores outside focus. Actions stay open unless the parent closes them. Toast position optionally fixes one notification to any of eight page edges/corners. ToastViewport stacks notifications at the same positions; its default is bottom-end, inline=false. Legacy start/end corners follow text direction. Toasts slide and fade in using standard motion tokens; reduced motion is immediate. Queues are application-owned. These static docs use announcement="off" and inline layout; Interactive Queue opens notifications only after activation. Import tokens.css, icon.css and toast.css (plus action styles), or styles.css. See docs/toast.md for API, timing accessibility and scoped overrides.',
      },
    },
  },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <ToastExample /> };
export const Tones: Story = { render: () => <ToastTones /> };
export const BodyOnly: Story = { args: { title: undefined, children: 'Draft saved.' } };
export const InteractiveQueue: Story = { render: () => <ToastQueue /> };
export const Timed: Story = { render: () => <TimedToast /> };
export const Controlled: Story = { render: () => <ControlledToast /> };
export const Narrow: Story = { render: () => <NarrowToast /> };
export const ScopedOverrides: Story = { render: () => <ToastOverrides /> };
export const KeyboardDismissal: Story = {
  render: () => <ControlledToast />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Archive project' });
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'View archived projects' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByLabelText('View requests')).toHaveTextContent('1 requests');
    await userEvent.keyboard('{Escape}');
    await expect(trigger).toHaveFocus();
    await expect(canvas.queryByRole('button', { name: 'Dismiss notification' })).toBeNull();
  },
};

export const Positions: Story = { render: () => <PositionedToast /> };
export const PositionedStack: Story = { render: () => <PositionedToast stacked /> };
