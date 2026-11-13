import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Combobox } from '../Combobox';
import { baseCombobox, regions, ComboboxExample, ComboboxForm, ControlledCombobox } from './combobox-examples';
import './combobox.stories.css';

const meta = { id: 'components-combobox', title: 'Components/Forms/Combobox', component: Combobox, tags: ['autodocs'], args: baseCombobox, parameters: { a11y: { test: 'error' }, docs: { description: { component: 'A searchable single-select field. Query text is never submitted; editing or clearing removes the selected identity. Arrow keys highlight, Enter commits, and Escape closes. See docs/combobox.md.' } } } } satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Composition: Story = { render: () => <ComboboxExample />, play: async ({ canvasElement }) => {
  await userEvent.type(within(within(canvasElement).getByRole('region', { name: 'Luna' })).getByRole('combobox'), 'uni');
  const input = within(canvasElement).getByRole('region', { name: 'Corporate' });
  await userEvent.type(within(input).getByRole('combobox'), 'uni');
  await expect(within(input).getAllByRole('option')).toHaveLength(3);
} };
export const Luna: Story = { globals: { theme: 'luna' }, play: async ({ canvasElement }) => { await userEvent.type(within(canvasElement).getByRole('combobox'), 'uni'); } };
export const Selected: Story = { args: { defaultValue: 'gb' } };
export const Loading: Story = { args: { loading: true }, play: async ({ canvasElement }) => { await userEvent.type(within(canvasElement).getByRole('combobox'), 'uni'); } };
export const NoResults: Story = { play: async ({ canvasElement }) => { await userEvent.type(within(canvasElement).getByRole('combobox'), 'xyz'); } };
export const Required: Story = { render: () => <ComboboxForm required /> };
export const Invalid: Story = { args: { required: true, error: 'Choose a region.' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'gb' } };
export const DisabledOptions: Story = { args: { options: [...regions, { value: 'closed', label: 'Unavailable region', disabled: true }] } };
export const LongLabels: Story = { args: { options: [{ value: 'long', label: 'United Kingdom — Northern regional operations and international customer support headquarters' }] }, decorators: [Story => <div style={{ maxWidth: 260 }}><Story /></div>] };
export const Controlled: Story = { render: () => <ControlledCombobox /> };
export const Form: Story = { render: () => <ComboboxForm /> };
export const CustomFilter: Story = { args: { filterOptions: (options, query) => options.filter(option => option.value.startsWith(query.toLowerCase())) } };
