import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from '../Tabs';
import { ControlledTabs, DynamicTabsDemo, NestedTabs, OverflowTabs, PersistentTabs, TabsExample, TabsOverrides, WorkspaceTabs, workspaceItems } from './tabs-examples';
import docs from '../../../../docs/tabs.md?raw';
import './tabs.stories.css';

const meta = { id: 'components-tabs', title: 'Components/Navigation/Tabs', component: Tabs, tags: ['autodocs'],
  args: { label: 'Workspace', items: workspaceItems }, argTypes: { items: { control: false }, variant: { options: ['line', 'pills'], control: 'select' }, activationMode: { options: ['automatic', 'manual'], control: 'select' }, orientation: { options: ['horizontal', 'vertical'], control: 'select' } },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: docs } } },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <TabsExample />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getAllByRole('tab', { name: 'Overview' })[3]!.focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect(canvas.getAllByRole('tab', { name: 'Activity' })[3]!).toHaveFocus();
  await expect(canvas.getAllByRole('tab', { name: 'Overview' })[3]!).toHaveAttribute('aria-selected', 'true');
} };
export const ManualActivation: Story = { args: { variant: 'pills', activationMode: 'manual' }, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getByRole('tab', { name: 'Overview' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveFocus();
  await expect(canvas.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
} };
export const Controlled: Story = { render: () => <ControlledTabs /> };
export const DelayedControlled: Story = { render: () => <ControlledTabs deferred /> };
export const DynamicItems: Story = { render: () => <DynamicTabsDemo /> };
export const PersistentPanels: Story = { render: () => <PersistentTabs />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.clear(canvas.getByRole('textbox', { name: 'Draft' }));
  await userEvent.type(canvas.getByRole('textbox', { name: 'Draft' }), 'Remember this');
  await userEvent.click(canvas.getByRole('tab', { name: 'Preview' }));
  await userEvent.click(canvas.getByRole('tab', { name: 'Draft' }));
  await expect(canvas.getByRole('textbox', { name: 'Draft' })).toHaveValue('Remember this');
} };
export const Vertical: Story = { args: { orientation: 'vertical' } };
export const RightToLeft: Story = { render: () => <div dir="rtl"><WorkspaceTabs /></div> };
export const Overflow: Story = { render: () => <OverflowTabs /> };
export const FullWidth: Story = { args: { fullWidth: true } };
export const FullWidthOverflow: Story = { render: () => <OverflowTabs fullWidth /> };
export const Nested: Story = { render: () => <NestedTabs /> };
export const ScopedOverrides: Story = { render: () => <TabsOverrides /> };
export const Empty: Story = { args: { items: [] } };
export const AllDisabled: Story = { args: { items: workspaceItems.map(item => ({ ...item, disabled: true })) } };
