import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Table } from '../../../index';
import { portfolioProps, type Project, TableExample, InventoryTable, SelectionTable, ControlledTable, StickyTable, StyledTable, TableStates } from './table-examples';
import './table.stories.css';

const introduction = `A generic native table. Columns own access, rendering, sorting and summaries. Search, key-based selection and sticky headers are opt-in; themes supply every palette value.

\`\`\`tsx
import { Table, createTableColumn } from 'fletchstack-ui';
type Project = { id: string; name: string; seats: number };
const column = createTableColumn<Project>();
const columns = [
  column({ id: 'name', header: 'Project', accessor: 'name' }),
  column({ id: 'seats', header: 'Seats', accessor: 'seats', sortable: true, align: 'end' }),
];
<Table rows={projects} columns={columns} getRowKey={row => row.id} caption="Project portfolio" />
\`\`\`

Defaults: comfortable density, horizontal dividers, visible caption, no search/selection/sort, and no sticky header. Sort buttons cycle ascending → descending → unsorted. createTableColumn<Row>() infers property and computed values for renderers; manual sorting preserves supplied order. See docs/table.md for all prop types/defaults and row/column/instance customization examples.`;

const meta = { id: 'components-table', title: 'Components/Data display/Table', component: Table<Project>, tags: ['autodocs'], args: portfolioProps, parameters: { a11y: { test: 'error' }, docs: { description: { component: introduction } } } } satisfies Meta<typeof Table<Project>>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Composition: Story = { render: () => <TableExample><Table {...portfolioProps} /></TableExample> };
export const Inventory: Story = { render: () => <InventoryTable /> };
export const CompactStriped: Story = { args: { density: 'compact', striped: true, hover: true, borders: 'all' } };
export const CustomCellsAndFooters: Story = { render: () => <InventoryTable /> };
export const InstanceStyling: Story = { render: () => <StyledTable /> };
export const Controlled: Story = { render: () => <ControlledTable /> };
export const ManualSorting: Story = { render: () => <ControlledTable manual /> };
export const FilteredSelection: Story = { render: () => <SelectionTable />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByRole('searchbox', { name: 'Search projects' }), 'Atlas');
  await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all selectable rows' }));
  await expect(canvas.getByLabelText('Selected projects')).toHaveTextContent('beacon, atlas');
} };
export const SingleSelection: Story = { args: { selectionMode: 'single', getSelectionLabel: row => `Select ${row.name}` } };
export const StickyHeader: Story = { render: () => <StickyTable /> };
export const Narrow: Story = { decorators: [Story => <div style={{ maxWidth: 320 }}><Story /></div>] };
export const ContentStates: Story = { render: () => <TableStates /> };
export const Loading: Story = { args: { loading: true, loadingMessage: 'Loading projects…' } };
export const CustomStates: Story = { args: { rows: [], loading: true, loadingMessage: 'Fetching projects', loadingState: <strong>Fetching the latest portfolio…</strong> } };
export const Empty: Story = { args: { rows: [], emptyState: 'No projects yet.' } };
export const NoResults: Story = { args: { searchable: true, defaultSearchValue: 'Maple', searchLabel: 'Search projects', noResultsState: 'No matching projects.' } };
export const HiddenColumns: Story = { args: { columns: portfolioProps.columns.map(column => ({ ...column, hidden: column.id === 'owner' })), borders: 'none' } };
export const Luna: Story = { globals: { theme: 'luna' } };
