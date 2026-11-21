import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DataTable } from '../DataTable';
import { paymentProps, type Payment, DataTableExample, ControlledDataTable, StockDataTable, RetryDataTable } from './data-table-examples';
import './data-table.stories.css';

const description = `A client-side composition of Table, with combined search and scalar filters, stable sorting, column visibility and optional pagination. Supply the complete dataset. Header selection affects this page; selected keys persist across pages and filters.

Reuse createTableColumn with your row type for inferred cell values. Add filterOptions: [{label, value}] for scalar filters and hideable: false to keep a column visible. Hidden columns still participate in filtering.

Defaults: pagination and column chooser off, page size 10, no filters, no selection. sort/defaultSort/onSortChange, searchValue/defaultSearchValue/onSearchChange and selectedRowKeys/defaultSelectedRowKeys/onSelectionChange follow Table. Pagination uses paginationState/defaultPagination/onPaginationChange; filters and columnVisibility have matching default and change props. User filter/sort changes request page zero. Loading precedes error; error/onRetry provides recovery. All Table styling slots remain available. Import table.css, data-table.css and the composed field/button/popover dependencies, or styles.css. See docs/data-table.md for the full contract.

\`\`\`tsx
<DataTable caption="Payments" rows={payments} columns={columns} getRowKey={row => row.id} searchable pagination columnChooser defaultPagination={{pageIndex: 0, pageSize: 3}} />
\`\`\``;
const meta = { id: 'components-data-table', title: 'Components/Data display/DataTable', component: DataTable<Payment>, tags: ['autodocs'], args: paymentProps, parameters: { a11y: { test: 'error' }, docs: { description: { component: description } } } } satisfies Meta<typeof DataTable<Payment>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = { render: () => <DataTableExample /> };
export const Controlled: Story = { render: () => <ControlledDataTable /> };
export const AnotherDataset: Story = { render: () => <StockDataTable /> };
export const Loading: Story = { args: { loading: true, loadingMessage: 'Loading payments…' } };
export const Empty: Story = { args: { rows: [], emptyState: 'No payments yet.' } };
export const NoResults: Story = { args: { defaultSearchValue: 'missing', noResultsState: 'No matching payments.' } };
export const LoadError: Story = { render: () => <RetryDataTable /> };
export const NoPagination: Story = { args: { pagination: false } };
export const CompactStriped: Story = { args: { density: 'compact', striped: true } };
export const Narrow: Story = { decorators: [Story => <div style={{ maxWidth: 320 }}><Story /></div>] };
export const Luna: Story = { globals: { theme: 'luna' } };
export const FilteredSelection: Story = { play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
  await userEvent.click(canvas.getByRole('checkbox', { name: 'Select all selectable rows on this page' }));
  await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Status' }), '0');
  await expect(canvas.getByRole('status')).toHaveTextContent('1–3 of 4 results');
  await expect(canvas.getByText('4 selected')).toBeVisible();
} };
