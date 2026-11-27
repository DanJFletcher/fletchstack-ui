import './popover-platform';
import { useState, type ReactElement } from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from '../../src/components/data-table/DataTable';
import type {
  DataTableProps,
  DataTableFilters,
  DataTableColumnVisibility,
  DataTablePagination,
} from '../../src/components/data-table/types';
import { createTableColumn } from '../../src/components/table/columns';
import type { TableSort, TableRowKey } from '../../src/components/table/types';

interface Row {
  id: string;
  name: string;
  count: number;
  active: boolean;
}
const rows: readonly Row[] = [
  { id: 'a', name: 'Alpha', count: 2, active: true },
  { id: 'b', name: 'Beta', count: 10, active: false },
  { id: 'c', name: 'Gamma', count: 3, active: true },
  { id: 'd', name: 'Delta', count: 1, active: false },
];
const column = createTableColumn<Row>();
const columns = [
  column({ id: 'name', header: 'Name', accessor: 'name', sortable: true }),
  column({
    id: 'count',
    header: 'Count',
    accessor: 'count',
    sortable: true,
    filterOptions: [
      { label: 'Two', value: 2 },
      { label: 'Ten', value: 10 },
    ],
  }),
  column({
    id: 'active',
    header: 'Active',
    accessor: 'active',
    filterOptions: [
      { label: 'Enabled', value: true },
      { label: 'Disabled', value: false },
    ],
  }),
];
const base: DataTableProps<Row> = {
  caption: 'Records',
  rows,
  columns,
  getRowKey: (row) => row.id,
  pagination: true,
  defaultPagination: { pageIndex: 0, pageSize: 2 },
  searchable: true,
  searchLabel: 'Find records',
};

/**
 * Read the visible first cell of native body rows in their displayed order.
 **/
function names(): string[] {
  return within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0]!.textContent!);
}

/**
 * Supply all public controlled states from a real consumer.
 **/
function Controlled() {
  const [sort, setSort] = useState<TableSort | null>(null);
  const [query, setQuery] = useState('');
  const [keys, setKeys] = useState<TableRowKey[]>([]);
  const [page, setPage] = useState<DataTablePagination>({ pageIndex: 0, pageSize: 2 });
  const [filters, setFilters] = useState<DataTableFilters>({});
  const [visibility, setVisibility] = useState<DataTableColumnVisibility>({});
  return (
    <DataTable
      {...base}
      sort={sort}
      onSortChange={setSort}
      searchValue={query}
      onSearchChange={setQuery}
      selectedRowKeys={keys}
      onSelectionChange={setKeys}
      paginationState={page}
      onPaginationChange={setPage}
      filters={filters}
      onFiltersChange={setFilters}
      columnVisibility={visibility}
      onColumnVisibilityChange={setVisibility}
      selectionMode="multiple"
    />
  );
}

/**
 * Exercise client rendering and independent server hydration with the same observable contract.
 **/
export function dataTableContracts(mount: (element: ReactElement) => unknown) {
  describe('DataTable', () => {
    it('renders only the first requested page', () => {
      // arrange
      // act
      mount(<DataTable {...base} />);
      // assert
      expect(names()).toEqual(['Alpha', 'Beta']);
      expect(screen.getByRole('status')).toHaveTextContent('1–2 of 4 results');
    });
    it('moves forward one page', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} />);
      // act
      await user.click(screen.getByRole('button', { name: 'Next' }));
      // assert
      expect(names()).toEqual(['Gamma', 'Delta']);
    });
    it('moves back one page', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} defaultPagination={{ pageIndex: 1, pageSize: 2 }} />);
      // act
      await user.click(screen.getByRole('button', { name: 'Previous' }));
      // assert
      expect(names()).toEqual(['Alpha', 'Beta']);
    });
    it('sorts numerically before taking a page and resets to page zero', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} defaultPagination={{ pageIndex: 1, pageSize: 2 }} />);
      // act
      await user.click(screen.getByRole('button', { name: /Count/ }));
      // assert
      expect(names()).toEqual(['Delta', 'Alpha']);
      expect(screen.getByRole('columnheader', { name: /Count/ })).toHaveAttribute(
        'aria-sort',
        'ascending',
      );
    });
    it('searches before taking a page and resets the current page', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} defaultPagination={{ pageIndex: 1, pageSize: 2 }} />);
      // act
      await user.type(screen.getByRole('searchbox', { name: 'Find records' }), 'BETA');
      // assert
      expect(names()).toEqual(['Beta']);
      expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });
    it('combines search with scalar filters', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} defaultSearchValue="a" />);
      // act
      await user.selectOptions(screen.getByRole('combobox', { name: 'Active' }), '0');
      // assert
      expect(names()).toEqual(['Alpha', 'Gamma']);
    });
    it('keeps numeric filter values distinct from DOM strings', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} />);
      // act
      await user.selectOptions(screen.getByRole('combobox', { name: 'Count' }), '0');
      // assert
      expect(names()).toEqual(['Alpha']);
    });
    it('removes a scalar filter when All is chosen', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} defaultFilters={{ active: true }} />);
      // act
      await user.selectOptions(screen.getByRole('combobox', { name: 'Active' }), '-1');
      // assert
      expect(names()).toEqual(['Alpha', 'Beta']);
    });
    it('selects the current page while retaining off-page keys', async () => {
      // arrange
      const user = userEvent.setup();
      const changed = vi.fn();
      mount(
        <DataTable
          {...base}
          selectionMode="multiple"
          defaultSelectedRowKeys={['d']}
          onSelectionChange={changed}
        />,
      );
      // act
      await user.click(
        screen.getByRole('checkbox', { name: 'Select all selectable rows on this page' }),
      );
      // assert
      expect(changed).toHaveBeenLastCalledWith(['d', 'a', 'b']);
      expect(screen.getByText('3 selected')).toBeVisible();
    });
    it('excludes unselectable records from page selection', async () => {
      // arrange
      const user = userEvent.setup();
      const changed = vi.fn();
      mount(
        <DataTable
          {...base}
          selectionMode="multiple"
          isRowSelectable={(row) => row.active}
          onSelectionChange={changed}
        />,
      );
      // act
      await user.click(
        screen.getByRole('checkbox', { name: 'Select all selectable rows on this page' }),
      );
      // assert
      expect(changed).toHaveBeenLastCalledWith(['a']);
    });
    it('reports total selection after filtering out a selected record', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} selectionMode="multiple" defaultSelectedRowKeys={['d']} />);
      // act
      await user.type(screen.getByRole('searchbox'), 'Alpha');
      // assert
      expect(screen.getByText('1 selected')).toBeVisible();
    });
    it('keeps controlled state authoritative until the parent updates it', async () => {
      // arrange
      const user = userEvent.setup();
      const changed = vi.fn();
      mount(
        <DataTable
          {...base}
          paginationState={{ pageIndex: 0, pageSize: 2 }}
          onPaginationChange={changed}
        />,
      );
      // act
      await user.click(screen.getByRole('button', { name: 'Next' }));
      // assert
      expect(names()).toEqual(['Alpha', 'Beta']);
      expect(changed).toHaveBeenLastCalledWith({ pageIndex: 1, pageSize: 2 });
    });
    it('accepts controlled sort updates from a consumer', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<Controlled />);
      // act
      await user.click(screen.getByRole('button', { name: /Count/ }));
      // assert
      expect(screen.getByRole('cell', { name: 'Delta' })).toBeVisible();
      expect(screen.queryByRole('cell', { name: 'Beta' })).not.toBeInTheDocument();
    });
    it('accepts controlled search updates from a consumer', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<Controlled />);
      // act
      await user.type(screen.getByRole('searchbox'), 'Beta');
      // assert
      expect(screen.getByRole('cell', { name: 'Beta' })).toBeVisible();
      expect(screen.queryByRole('cell', { name: 'Alpha' })).not.toBeInTheDocument();
    });
    it('accepts controlled filter updates from a consumer', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<Controlled />);
      // act
      await user.selectOptions(screen.getByRole('combobox', { name: 'Active' }), '1');
      // assert
      expect(screen.getByRole('cell', { name: 'Delta' })).toBeVisible();
    });
    it('accepts controlled selection from a consumer', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<Controlled />);
      // act
      await user.click(
        screen.getByRole('checkbox', { name: 'Select all selectable rows on this page' }),
      );
      // assert
      expect(screen.getByText('2 selected')).toBeVisible();
    });
    it('clamps an obsolete page index when the dataset shrinks', () => {
      // arrange
      // act
      mount(
        <DataTable
          {...base}
          rows={rows.slice(0, 1)}
          defaultPagination={{ pageIndex: 9, pageSize: 2 }}
        />,
      );
      // assert
      expect(names()).toEqual(['Alpha']);
      expect(screen.getByRole('status')).toHaveTextContent('1–1 of 1 results');
    });
    it('shows all rows when pagination is omitted', () => {
      // arrange
      // act
      mount(<DataTable caption="All" rows={rows} columns={columns} getRowKey={(row) => row.id} />);
      // assert
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta']);
      expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    });
    it('provides empty-dataset feedback without a clear action', () => {
      // arrange
      // act
      mount(<DataTable {...base} rows={[]} />);
      // assert
      expect(screen.getByText('No rows yet.')).toBeVisible();
      expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
    });
    it('clears both search and scalar filters after no matches', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} defaultSearchValue="Missing" defaultFilters={{ active: true }} />);
      // act
      await user.click(screen.getByRole('button', { name: 'Clear filters' }));
      // assert
      expect(names()).toEqual(['Alpha', 'Beta']);
      expect(screen.getByRole('searchbox')).toHaveValue('');
      expect(screen.getByRole('combobox', { name: 'Active' })).toHaveValue('-1');
    });
    it('spans the visible columns including selection for no matches', () => {
      // arrange
      // act
      mount(
        <DataTable
          {...base}
          defaultSearchValue="Missing"
          selectionMode="multiple"
          noResultsState="Nothing matches"
        />,
      );
      // assert
      expect(screen.getByText('Nothing matches').closest('td')).toHaveAttribute('colspan', '4');
    });
    it('gives loading precedence over an error', () => {
      // arrange
      // act
      mount(<DataTable {...base} loading error="Failed" />);
      // assert
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    });
    it('announces loading even without a search field', () => {
      // arrange
      // act
      mount(<DataTable {...base} searchable={false} loading loadingMessage="Fetching records" />);
      // assert
      expect(screen.getAllByRole('status')).toHaveLength(2);
      expect(screen.getAllByText('Fetching records')).toHaveLength(3);
    });
    it('renders custom loading content', () => {
      // arrange
      // act
      mount(<DataTable {...base} loading loadingState="Please wait" />);
      // assert
      expect(screen.getByText('Please wait')).toBeVisible();
    });
    it('calls the consumer retry action', async () => {
      // arrange
      const user = userEvent.setup();
      const retry = vi.fn();
      mount(<DataTable {...base} error="Network failed" onRetry={retry} />);
      // act
      await user.click(screen.getByRole('button', { name: 'Retry' }));
      // assert
      expect(retry).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('alert')).toHaveTextContent('Network failed');
    });
    it('renders an error without requiring a retry handler', () => {
      // arrange
      // act
      mount(<DataTable {...base} error="Failed" />);
      // assert
      expect(screen.getByRole('alert')).toHaveTextContent('Failed');
      expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'false');
      expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
    });
    it('searches initially hidden accessor values', () => {
      // arrange
      // act
      mount(
        <DataTable
          {...base}
          columns={columns.map((column) => ({ ...column, hidden: column.id === 'name' }))}
          defaultSearchValue="Beta"
        />,
      );
      // assert
      expect(screen.getByRole('status')).toHaveTextContent('1–1 of 1 results');
      expect(screen.queryByRole('columnheader', { name: /Name/ })).not.toBeInTheDocument();
    });
    it('keeps non-hideable columns visible', () => {
      // arrange
      // act
      mount(
        <DataTable
          {...base}
          columns={columns.map((column) => ({ ...column, hideable: false }))}
          defaultColumnVisibility={{ name: false }}
        />,
      );
      // assert
      expect(screen.getByRole('columnheader', { name: /Name/ })).toBeVisible();
    });
    it('retains one column when a controlled visibility map hides all of them', () => {
      // arrange
      // act
      mount(
        <DataTable {...base} columnVisibility={{ name: false, count: false, active: false }} />,
      );
      // assert
      expect(screen.getAllByRole('columnheader')).toHaveLength(1);
    });
    it('forwards native table attributes without leaking composition props', () => {
      // arrange
      // act
      mount(
        <DataTable
          {...base}
          id="records"
          data-owner="test"
          className="custom"
          style={{ '--fs-table-text': 'purple' }}
        />,
      );
      // assert
      expect(screen.getByRole('table')).toHaveAttribute('id', 'records');
      expect(screen.getByRole('table')).not.toHaveAttribute('pagination');
    });
    it('hides a column without removing it from search', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} columnChooser defaultSearchValue="Beta" />);
      await user.click(screen.getByRole('button', { name: 'Columns' }));
      // act
      await user.click(screen.getByRole('checkbox', { name: 'Name' }));
      // assert
      expect(screen.queryByRole('columnheader', { name: /Name/ })).not.toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('1–1 of 1 results');
    });
    it('shows a hidden column from the chooser', async () => {
      // arrange
      const user = userEvent.setup();
      mount(<DataTable {...base} columnChooser defaultColumnVisibility={{ name: false }} />);
      await user.click(screen.getByRole('button', { name: 'Columns' }));
      // act
      await user.click(screen.getByRole('checkbox', { name: 'Name' }));
      // assert
      expect(screen.getByRole('columnheader', { name: /Name/ })).toBeVisible();
    });
    it('disables the final visible column in the chooser', async () => {
      // arrange
      const user = userEvent.setup();
      mount(
        <DataTable {...base} columnChooser columnVisibility={{ count: false, active: false }} />,
      );
      // act
      await user.click(screen.getByRole('button', { name: 'Columns' }));
      // assert
      expect(screen.getByRole('checkbox', { name: 'Name' })).toBeDisabled();
    });
    it('uses a custom filter label independently of the header', () => {
      // arrange
      // act
      mount(
        <DataTable
          {...base}
          columns={columns.map((column) => ({ ...column, filterLabel: `Filter ${column.id}` }))}
        />,
      );
      // assert
      expect(screen.getByRole('combobox', { name: 'Filter count' })).toBeVisible();
    });
    it('gives the default search field an accessible name', () => {
      // arrange
      const props = { caption: 'Records', rows, columns, getRowKey: (row: Row) => row.id };
      // act
      mount(<DataTable {...props} searchable />);
      // assert
      expect(screen.getByRole('searchbox', { name: 'Search table' })).toBeVisible();
    });
    it.each([
      { pageIndex: -1, pageSize: 2 },
      { pageIndex: 0, pageSize: 0 },
      { pageIndex: 0.5, pageSize: 2 },
      { pageIndex: 0, pageSize: 1.5 },
    ])('rejects invalid pagination $pageIndex / $pageSize', (pagination) => {
      // arrange
      // act
      const act = () => mount(<DataTable {...base} defaultPagination={pagination} />);
      // assert
      expect(act).toThrow('DataTable requires');
    });
  });
}
