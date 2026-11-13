import { useState, type ReactNode } from 'react';
import { Badge } from '../../badge/index';
import { Table, createTableColumn, type TableProps, type TableSort } from '../index';

export interface Project { id: string; name: string; owner: string; status: 'Active' | 'In review' | 'Draft'; updated: string; seats: number }
export const projects: Project[] = [
  { id: 'atlas', name: 'Atlas', owner: 'Maya Chen', status: 'Active', updated: '2026-11-12', seats: 24 },
  { id: 'beacon', name: 'Beacon', owner: 'Theo Park', status: 'In review', updated: '2026-11-10', seats: 16 },
  { id: 'cedar', name: 'Cedar', owner: 'Nia Woods', status: 'Draft', updated: '2026-11-08', seats: 8 },
];
const column = createTableColumn<Project>();
const statusTones = { Active: 'success', 'In review': 'info', Draft: 'neutral' } as const;
const dateFormat = new Intl.DateTimeFormat('en-CA', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' });
export const portfolioColumns = [
  column({ id: 'project', header: 'Project', accessor: 'name', sortable: true, minWidth: 140, cell: ({ value }) => <strong>{value}</strong> }),
  column({ id: 'owner', header: 'Owner', accessor: 'owner', sortable: true, minWidth: 150 }),
  column({ id: 'status', header: 'Status', accessor: 'status', minWidth: 120, cell: ({ value }) => <Badge tone={statusTones[value]} style={{ '--fs-badge-font-size': 'var(--fs-table-font-size)', '--fs-badge-radius': 'var(--fs-table-radius)' }}>{value}</Badge> }),
  column({ id: 'updated', header: 'Updated', accessor: project => new Date(`${project.updated}T00:00:00Z`), sortable: true, minWidth: 160, cell: ({ value }) => <time dateTime={value.toISOString()}>{dateFormat.format(value)}</time> }),
  column({ id: 'seats', header: 'Seats', accessor: 'seats', sortable: true, align: 'end', minWidth: 90, cellStyle: { fontVariantNumeric: 'tabular-nums' } }),
];
export const portfolioProps = { rows: projects, columns: portfolioColumns, getRowKey: (project: Project) => project.id, caption: 'Project portfolio', captionHidden: true, defaultSort: { columnId: 'seats', direction: 'desc' } } satisfies TableProps<Project>;

/**
 * Consume only the public Table and Badge APIs; themes provide every palette value.
 **/
export function Portfolio(props: Partial<TableProps<Project>>) {
  return <Table {...portfolioProps} {...props} caption={props.caption ?? portfolioProps.caption} />;
}

/**
 * Recreate the complete five-column portfolio with shared data, columns and markup in both themes.
 **/
export function TableExample({ children = <Portfolio /> }: { children?: ReactNode }) {
  return <div className="table-demo"><p>fletchstack-ui / Data display</p><h1>Table</h1><p className="table-demo__subtitle">Project portfolio</p>
    {(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} aria-label={theme === 'corporate' ? 'Corporate' : 'Luna'} className="table-demo__theme"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>{children}</section>)}
  </div>;
}

interface Product { sku: string; title: string; stock: number; price: number }
const productColumn = createTableColumn<Product>();
export const products: Product[] = [{ sku: 'pencil', title: 'Pencils', stock: 30, price: 1.5 }, { sku: 'pad', title: 'Notepads', stock: 2, price: 8 }, { sku: 'clip', title: 'Binder clips', stock: 10, price: 3 }];
export const productColumns = [
  productColumn({ id: 'title', header: 'Product', accessor: 'title', sortable: true, compare: (a, b) => a.title.length - b.title.length, footer: 'Total' }),
  productColumn({ id: 'stock', header: 'Stock', accessor: 'stock', sortable: true, align: 'end', footer: ({ rows }) => rows.reduce((sum, row) => sum + row.stock, 0) }),
  productColumn({ id: 'cost', header: 'Inventory value', accessor: row => row.price * row.stock, sortable: true, align: 'end', cell: ({ value }) => `$${value.toFixed(2)}`, footer: ({ rows }) => `$${rows.reduce((sum, row) => sum + row.stock * row.price, 0).toFixed(2)}` }),
];

/**
 * Demonstrate unrelated row fields, computed values, custom comparison and filtered footer totals.
 **/
export function InventoryTable() {
  return <Table rows={products} columns={productColumns} getRowKey={row => row.sku} caption="Office inventory" searchable searchLabel="Search products" />;
}

/**
 * Preserve key-based selections outside a search and exclude an unavailable row from select-all.
 **/
export function SelectionTable() {
  const [selected, setSelected] = useState<(string | number)[]>(['beacon']);
  return <><Portfolio searchable searchLabel="Search projects" selectionMode="multiple" selectedRowKeys={selected} onSelectionChange={setSelected} getSelectionLabel={row => `Select ${row.name}`} isRowSelectable={row => row.id !== 'cedar'} />
    <output aria-label="Selected projects">{selected.join(', ') || 'None'}</output></>;
}

/**
 * Let the parent own sorting, query and selection; manual mode changes direction without reordering data.
 **/
export function ControlledTable({ manual = false }: { manual?: boolean }) {
  const [sort, setSort] = useState<TableSort | null>({ columnId: 'seats', direction: 'desc' });
  const [rows, setRows] = useState(projects);
  const [query, setQuery] = useState('');
  return <><Portfolio rows={rows} sort={sort} onSortChange={setSort} sortMode={manual ? 'manual' : 'client'} searchable searchValue={query} onSearchChange={setQuery} searchLabel="Search controlled projects" />
    <output aria-label="Requested sort">{sort ? `${sort.columnId}: ${sort.direction}` : 'Unsorted'}</output>
    {manual && <button type="button" onClick={() => setRows([...rows].reverse())}>Reverse supplied rows</button>}</>;
}

/**
 * Show opt-in height containment with a sticky native header and enough real rows to scroll.
 **/
export function StickyTable() {
  const rows = Array.from({ length: 30 }, (_, index) => ({ ...projects[index % projects.length]!, id: `project-${index}`, name: `${projects[index % projects.length]!.name} ${index + 1}` }));
  return <Portfolio rows={rows} stickyHeader maxHeight={240} />;
}

/**
 * Override one instance, one column and particular rows without replacing semantic elements or handlers.
 **/
export function StyledTable() {
  return <Portfolio searchable selectionMode="multiple" defaultSelectedRowKeys={['beacon']} style={{ '--fs-table-header-surface': 'var(--fs-badge-info-background)', '--fs-table-radius': '12px' }}
    columns={portfolioColumns.map(column => column.id === 'seats' ? { ...column, cellClassName: 'table-demo__seats' } : column)}
    classNames={{ bodyRow: ({ row }) => row.id === 'cedar' ? 'table-demo__draft' : undefined }}
    styles={{ bodyRow: ({ selected }) => selected ? { fontWeight: 600 } : undefined, cell: ({ columnId }) => columnId === 'owner' ? { fontStyle: 'italic' } : undefined }} />;
}

/**
 * Keep headers mounted during loading, empty data and editable searches with no matches.
 **/
export function TableStates() {
  const columns = portfolioColumns.filter(column => ['project', 'seats'].includes(column.id));
  return <div className="table-demo__states"><Portfolio caption="Loading" captionHidden={false} columns={columns} rows={[]} loading loadingMessage="Loading projects…" />
    <Portfolio caption="Empty" captionHidden={false} columns={columns} rows={[]} emptyState="No projects yet." />
    <Portfolio caption="No matches" captionHidden={false} columns={columns} searchable defaultSearchValue="Maple" searchLabel="Search projects" noResultsState="No matching projects." /></div>;
}
