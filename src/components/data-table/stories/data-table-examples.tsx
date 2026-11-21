import { useState } from 'react';
import { DataTable } from '../DataTable';
import type { DataTableProps, DataTablePagination, DataTableFilters, DataTableColumnVisibility } from '../types';
import { createTableColumn } from '../../table/columns';
import type { TableRowKey, TableSort } from '../../table/types';
import { Menu } from '../../menu/Menu';

export interface Payment { id: string; email: string; status: 'Paid' | 'Processing' | 'Failed'; amount: number }
export const payments: readonly Payment[] = [
  { id: 'payment-1', email: 'member-01@example.test', status: 'Paid', amount: 128 },
  { id: 'payment-2', email: 'member-02@example.test', status: 'Processing', amount: 85.5 },
  { id: 'payment-3', email: 'member-03@example.test', status: 'Failed', amount: 242 },
  { id: 'payment-4', email: 'member-04@example.test', status: 'Paid', amount: 64 },
  { id: 'payment-5', email: 'member-05@example.test', status: 'Processing', amount: 300 },
  { id: 'payment-6', email: 'member-06@example.test', status: 'Failed', amount: 19 },
  { id: 'payment-7', email: 'member-07@example.test', status: 'Paid', amount: 99 },
  { id: 'payment-8', email: 'member-08@example.test', status: 'Processing', amount: 42 },
  { id: 'payment-9', email: 'member-09@example.test', status: 'Failed', amount: 120 },
  { id: 'payment-10', email: 'member-10@example.test', status: 'Paid', amount: 10 },
  { id: 'payment-11', email: 'member-11@example.test', status: 'Processing', amount: 88 },
  { id: 'payment-12', email: 'member-12@example.test', status: 'Failed', amount: 560 },
];
const column = createTableColumn<Payment>();
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/**
 * Keep record actions and currency formatting in the consumer rather than the generic table.
 **/
function PaymentActions({ row }: { row: Payment }) {
  const [revealed, setRevealed] = useState(false);
  return <><Menu className="payment-actions" trigger={<span aria-hidden="true">…</span>} triggerLabel={`Actions for ${row.email}`} menuLabel={`Payment ${row.email}`} items={[{ id: 'view', type: 'item', label: 'View payment ID', onSelect: () => { setRevealed(true); } }]} />{revealed && <span role="status">Payment ID: {row.id}</span>}</>;
}
export const paymentColumns = [
  column({ id: 'status', header: 'Status', accessor: 'status', filterOptions: [{ label: 'Paid', value: 'Paid' }, { label: 'Processing', value: 'Processing' }, { label: 'Failed', value: 'Failed' }], cell: ({ value }) => <strong className={`payment-status payment-status--${value.toLowerCase()}`}>{value}</strong> }),
  column({ id: 'email', header: 'Email', accessor: 'email', sortable: true, hideable: false }),
  column({ id: 'amount', header: 'Amount', accessor: 'amount', sortable: true, align: 'end', cell: ({ value }) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{currency.format(value)}</span> }),
  column({ id: 'actions', header: <span className="fs-table__sr-only">Actions</span>, cell: ({ row }) => <PaymentActions row={row} /> }),
];
export const paymentProps: DataTableProps<Payment> = { caption: 'Payments', rows: payments, columns: paymentColumns, getRowKey: row => row.id, searchable: true, searchableColumns: ['email'], searchLabel: 'Search email', searchPlaceholder: 'Search by email', defaultSort: { columnId: 'email', direction: 'asc' }, selectionMode: 'multiple', defaultSelectedRowKeys: ['payment-1'], getSelectionLabel: row => `Select ${row.email}`, pagination: true, defaultPagination: { pageIndex: 0, pageSize: 3 }, columnChooser: true };

/**
 * Share all markup and data while allowing nested theme regions to supply palette values.
 **/
export function DataTableExample() {
  return <div className="data-table-demo">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme}><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><DataTable {...paymentProps} /></section>)}</div>;
}

/**
 * Demonstrate every controlled state without introducing a second rendering path.
 **/
export function ControlledDataTable() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<TableSort | null>(null);
  const [selected, setSelected] = useState<TableRowKey[]>([]);
  const [pagination, setPagination] = useState<DataTablePagination>({ pageIndex: 0, pageSize: 3 });
  const [filters, setFilters] = useState<DataTableFilters>({});
  const [visibility, setVisibility] = useState<DataTableColumnVisibility>({});
  return <DataTable {...paymentProps} searchValue={query} onSearchChange={setQuery} sort={sort} onSortChange={setSort} selectedRowKeys={selected} onSelectionChange={setSelected} paginationState={pagination} onPaginationChange={setPagination} filters={filters} onFiltersChange={setFilters} columnVisibility={visibility} onColumnVisibilityChange={setVisibility} />;
}

/**
 * Confirm that data fields and rendering remain unrelated to the Payments demonstration.
 **/
export function StockDataTable() {
  return <DataTable caption="Stock" rows={[{ sku: 'chair', units: 12 }, { sku: 'desk', units: 4 }]} getRowKey={row => row.sku} columns={[{ id: 'sku', header: 'Product', accessor: 'sku' }, { id: 'units', header: 'Units', accessor: 'units', sortable: true }]} pagination defaultPagination={{ pageIndex: 0, pageSize: 1 }} />;
}

/**
 * Demonstrate recovery using a consumer-owned loading failure.
 **/
export function RetryDataTable() {
  const [failed, setFailed] = useState(true);
  return <DataTable {...paymentProps} error={failed ? 'Payments could not be loaded.' : null} onRetry={() => setFailed(false)} />;
}
