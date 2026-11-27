import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, waitFor } from 'storybook/test';
import { Dialog } from '../Dialog';
import {
  DeferredDialog,
  DialogDemo,
  DialogExample,
  DialogOverrides,
  NestedDialog,
} from './dialog-examples';
import docs from '../../../../docs/dialog.md?raw';
import './dialog.stories.css';

const meta = {
  id: 'components-dialog',
  title: 'Components/Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { open: false, onOpenChange: () => {}, heading: 'Confirm the changes?' },
  argTypes: {
    open: { control: false },
    onOpenChange: { control: false },
    size: { options: ['sm', 'md', 'lg'], control: 'select' },
    motion: { options: ['none', 'fade', 'slide'], control: 'select' },
  },
  render: (args) => <DialogDemo {...args} />,
  parameters: { a11y: { test: 'error' }, docs: { description: { component: docs } } },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <DialogExample /> };
export const KeyboardFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement),
      body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Open dialog' });
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(body.getByRole('dialog', { name: 'Confirm the changes?' })).toBeVisible(),
    );
    await userEvent.click(body.getByRole('button', { name: 'Close dialog' }));
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
// Auto-opening examples remain standalone so Docs never creates stacked native modals.
export const InitiallyOpen: Story = {
  tags: ['!autodocs'],
  render: () => <DialogDemo initialOpen />,
};
export const InitiallyOpenLuna: Story = {
  tags: ['!autodocs'],
  render: () => (
    <section data-theme="luna" className="dialog-demo__theme">
      <DialogDemo initialOpen />
    </section>
  ),
};
export const Small: Story = { render: () => <DialogDemo size="sm" /> };
export const Large: Story = { render: () => <DialogDemo size="lg" /> };
export const Fade: Story = { render: () => <DialogDemo motion="fade" /> };
export const Slide: Story = { render: () => <DialogDemo motion="slide" /> };
export const Immediate: Story = { render: () => <DialogDemo motion="none" /> };
export const EscapeDisabled: Story = { render: () => <DialogDemo closeOnEscape={false} /> };
export const BackdropDismissal: Story = {
  name: 'Backdrop Dismissal Disabled',
  render: () => <DialogDemo closeOnBackdropClick={false} />,
};
export const NativeCloseForm: Story = { render: () => <DialogDemo nativeForm /> };
export const ScrollableContent: Story = { render: () => <DialogDemo long /> };
export const ControlledDismissal: Story = { render: () => <DeferredDialog /> };
export const ScopedOverrides: Story = { render: () => <DialogOverrides /> };
export const Nested: Story = { render: () => <NestedDialog /> };
