import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MultiSelect } from '../MultiSelect';
import { ControlledTopics, MultiSelectExample, MultiSelectForm, topicOptions } from './multi-select-examples';
import './multi-select.stories.css';

const meta = {
  id: 'components-multi-select', title: 'Components/Forms/MultiSelect', component: MultiSelect, tags: ['autodocs'],
  args: { label: 'Article topics', options: topicOptions },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Search and select multiple options. Focus stays in the input while arrows navigate the multiselectable listbox. Repeated hidden values support native forms. Import field.css and multi-select.css alongside tokens, or use styles.css.' } } },
} satisfies Meta<typeof MultiSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const SearchAndFormSubmission: Story = { render: () => <MultiSelectForm />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByRole('combobox'), 'des');
  await expect(canvas.getAllByRole('option')).toHaveLength(2);
  await userEvent.keyboard('{Enter}{Escape}');
  await userEvent.click(canvas.getByRole('button', { name: 'Save topics' }));
  await expect(canvas.getByLabelText('Saved topics')).toHaveTextContent('react, systems');
} };
export const RemoveSelections: Story = { args: { defaultValue: ['react', 'product'] }, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Remove React' }));
  await expect(canvas.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
  await userEvent.click(canvas.getByRole('button', { name: 'Clear selections' }));
  await expect(canvas.queryByRole('button', { name: 'Remove Product design' })).not.toBeInTheDocument();
} };
export const ControlledSelection: Story = { render: () => <ControlledTopics /> };
export const SelectionLimit: Story = { args: { defaultValue: ['react', 'systems'], maxSelections: 2 }, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('combobox'));
  await expect(canvas.getByRole('option', { name: 'Product design' })).toHaveAttribute('aria-disabled', 'true');
} };
export const MinimumSelection: Story = { args: { minSelections: 2, helperText: 'Pick at least two topics.' } };
export const Required: Story = { args: { required: true } };
export const Disabled: Story = { args: { disabled: true, defaultValue: ['react'] } };
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: ['react'] } };
export const Loading: Story = { args: { loading: true, options: [] }, play: async ({ canvasElement }) => { await userEvent.click(within(canvasElement).getByRole('combobox')); } };
export const NoResults: Story = { play: async ({ canvasElement }) => { await userEvent.type(within(canvasElement).getByRole('combobox'), 'zzzz'); } };
export const ValidationError: Story = { args: { error: 'Choose a supported topic.', helperText: 'Your editor can help.' } };
export const Sizes: Story = { render: () => <div className="theme-grid">{(['small', 'medium', 'large'] as const).map(size => <MultiSelect key={size} size={size} label={`${size} topics`} options={topicOptions} defaultValue={['react']} />)}</div> };
export const NarrowLongOptions: Story = { args: { defaultValue: ['long'], options: [{ value: 'long', label: 'LongUnbrokenTopicNameToDemonstrateWrappingInNarrowLayouts' }] }, decorators: [Story => <div style={{ maxWidth: 240 }}><Story /></div>] };
export const Composition: Story = { render: () => <MultiSelectExample /> };
export const Hidden: Story = { args: { hidden: true } };
