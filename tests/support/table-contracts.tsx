import { useState, type ReactElement } from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Table, type TableProps, type TableSort } from '../../src/components/table/Table';
import { createTableColumn } from '../../src/components/table/columns';

interface RecordRow { id: string; label: string; count: number; date: string; secret: string; enabled: boolean }
const rows: RecordRow[] = [
  { id: 'a', label: 'Alpha', count: 2, date: '2026-01-03', secret: 'Hidden word', enabled: true },
  { id: 'b', label: 'Beta', count: 10, date: '2025-12-31', secret: 'Private', enabled: true },
  { id: 'c', label: 'Gamma', count: 3, date: '2026-02-01', secret: 'Private', enabled: false },
];
const column = createTableColumn<RecordRow>();
const columns = [column({ id: 'label', header: 'Name', accessor: 'label', sortable: true }), column({ id: 'count', header: 'Count', accessor: 'count', sortable: true, align: 'end' }), column({ id: 'date', header: 'Date', accessor: row => new Date(`${row.date}T00:00:00Z`), sortable: true, cell: ({ value }) => value.toISOString().slice(0, 10) }), column({ id: 'secret', header: 'Secret', accessor: 'secret', hidden: true })];
const base = { rows, columns, getRowKey: (row: RecordRow) => row.id, caption: 'Records' } satisfies TableProps<RecordRow>;

/**
 * Read the ordered native body cells as the public visible dataset.
 **/
function names(): string[] {
  return within(screen.getByRole('table')).getAllByRole('row').slice(1).map(row => within(row).getAllByRole('cell')[0]!.textContent!);
}

/**
 * Check the public native-table contract through independent client and hydrated rendering boundaries.
 **/
export function tableContracts(mount: (element: ReactElement) => unknown) {
  describe('Table', () => {
    it('names a native table using its visible caption', () => {
      // arrange

      // act
      mount(<Table {...base} />);

      // assert
      expect(screen.getByRole('table', { name: 'Records' }).tagName).toBe('TABLE');
      expect(screen.getByText('Records').tagName).toBe('CAPTION');
    });
    it('can use an accessible label without a caption', () => {
      // arrange
      const props = { rows, columns, getRowKey: base.getRowKey };

      // act
      mount(<Table {...props} aria-label="Named records" />);

      // assert
      expect(screen.getByRole('table', { name: 'Named records' })).toBeVisible();
    });
    it('preserves supplied row order before sorting', () => {
      // arrange

      // act
      mount(<Table {...base} />);

      // assert
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']);
    });
    it('omits hidden columns from the native header and body', () => {
      // arrange

      // act
      mount(<Table {...base} />);

      // assert
      expect(screen.getAllByRole('columnheader')).toHaveLength(3); expect(screen.queryByText('Hidden word')).not.toBeInTheDocument();
    });
    it('sorts numeric values numerically rather than lexically', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Count' }));

      // assert
      expect(names()).toEqual(['Alpha', 'Gamma', 'Beta']); expect(screen.getByRole('columnheader', { name: 'Count' })).toHaveAttribute('aria-sort', 'ascending');
    });
    it('sorts native Date accessor values chronologically', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Date' }));

      // assert
      expect(names()).toEqual(['Beta', 'Alpha', 'Gamma']);
    });
    it('starts from the requested descending default sort', () => {
      // arrange

      // act
      mount(<Table {...base} defaultSort={{ columnId: 'count', direction: 'desc' }} />);

      // assert
      expect(names()).toEqual(['Beta', 'Gamma', 'Alpha']); expect(screen.getByRole('columnheader', { name: 'Count' })).toHaveAttribute('aria-sort', 'descending');
    });
    it('cycles descending sort back to the original unsorted order', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} defaultSort={{ columnId: 'count', direction: 'desc' }} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Count' }));

      // assert
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']); expect(screen.getByRole('columnheader', { name: 'Count' })).not.toHaveAttribute('aria-sort');
    });
    it('cycles ascending to descending', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} defaultSort={{ columnId: 'count', direction: 'asc' }} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Count' }));

      // assert
      expect(names()).toEqual(['Beta', 'Gamma', 'Alpha']);
    });
    it('sorts a new column ascending without retaining the prior direction', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} defaultSort={{ columnId: 'count', direction: 'desc' }} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Name' }));

      // assert
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']); expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
    });
    it('reports manual sort requests without reordering supplied rows', async () => {
      // arrange
      const user = userEvent.setup(); const change = vi.fn(); mount(<Table {...base} sortMode="manual" onSortChange={change} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Count' }));

      // assert
      expect(change).toHaveBeenCalledExactlyOnceWith({ columnId: 'count', direction: 'asc' }); expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']);
    });
    it('keeps controlled sorting authoritative when a parent declines an update', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} sort={null} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Count' }));

      // assert
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']);
    });
    it('accepts controlled sorting updates from a parent', async () => {
      // arrange
      const user = userEvent.setup(); mount(<ControlledSort />);

      // act
      await user.click(screen.getByRole('button', { name: 'Count' }));

      // assert
      expect(names()).toEqual(['Alpha', 'Gamma', 'Beta']);
    });
    it('uses sortValue independently of formatted cell content', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} columns={[column({ id: 'label', header: 'Rank', accessor: 'label', sortable: true, sortValue: row => row.count, cell: ({ row, value }) => `${value}: ${row.id}` })]} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Rank' }));

      // assert
      expect(names()).toEqual(['Alpha: a', 'Gamma: c', 'Beta: b']);
    });
    it('supports a consumer comparator over original rows', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} columns={[column({ id: 'label', header: 'Name', accessor: 'label', sortable: true, compare: (a, b) => b.count - a.count })]} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Name' }));

      // assert
      expect(names()).toEqual(['Beta', 'Gamma', 'Alpha']);
    });
    it('preserves source order for equal sort values', () => {
      // arrange

      // act
      mount(<Table {...base} columns={[column({ id: 'label', header: 'Name', accessor: 'label', sortable: true, sortValue: () => 1 })]} defaultSort={{ columnId: 'label', direction: 'asc' }} />);

      // assert
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']);
    });
    it.each([{ order: 'asc' as const, expected: ['Gamma', 'Alpha', 'Beta'] }, { order: 'desc' as const, expected: ['Beta', 'Alpha', 'Gamma'] }])('orders missing sort values predictably in $order mode', ({ order, expected }) => {
      // arrange
      const sorted = column({ id: 'label', header: 'Name', accessor: 'label', sortable: true, sortValue: row => row.id === 'c' ? null : row.count });

      // act
      mount(<Table {...base} columns={[sorted]} defaultSort={{ columnId: 'label', direction: order }} />);

      // assert
      expect(names()).toEqual(expected);
    });
    it('filters visible accessor values case insensitively', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} searchable />);

      // act
      await user.type(screen.getByRole('searchbox', { name: 'Search table' }), 'BETA');

      // assert
      expect(names()).toEqual(['Beta']); expect(screen.getByRole('status')).toHaveTextContent('1 of 3 rows');
    });
    it('does not match values in hidden columns', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} searchable />);

      // act
      await user.type(screen.getByRole('searchbox'), 'Hidden word');

      // assert
      expect(screen.getByText('No matching rows.')).toBeVisible(); expect(screen.getByRole('searchbox')).toHaveValue('Hidden word');
    });
    it('limits search to explicitly requested visible column ids', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} searchable searchableColumns={['count']} />);

      // act
      await user.type(screen.getByRole('searchbox'), '10');

      // assert
      expect(names()).toEqual(['Beta']);
    });
    it('allows a custom row matcher', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} searchable searchFunction={(row, query) => row.id === query} />);

      // act
      await user.type(screen.getByRole('searchbox'), 'c');

      // assert
      expect(names()).toEqual(['Gamma']);
    });
    it('can initialize an uncontrolled query', () => {
      // arrange

      // act
      mount(<Table {...base} searchable defaultSearchValue="Alpha" />);

      // assert
      expect(names()).toEqual(['Alpha']); expect(screen.getByRole('searchbox')).toHaveValue('Alpha');
    });
    it('does not search until the feature is enabled', () => {
      // arrange

      // act
      mount(<Table {...base} defaultSearchValue="Alpha" />);

      // assert
      expect(names()).toEqual(['Alpha', 'Beta', 'Gamma']); expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
    });
    it('reports a controlled search request without replacing the parent query', async () => {
      // arrange
      const user = userEvent.setup(); const change = vi.fn(); mount(<Table {...base} searchable searchValue="" onSearchChange={change} />);

      // act
      await user.type(screen.getByRole('searchbox'), 'a');

      // assert
      expect(change).toHaveBeenCalledExactlyOnceWith('a'); expect(screen.getByRole('searchbox')).toHaveValue('');
    });
    it('can accept controlled search updates', async () => {
      // arrange
      const user = userEvent.setup(); mount(<ControlledSearch />);

      // act
      await user.type(screen.getByRole('searchbox'), 'Beta');

      // assert
      expect(names()).toEqual(['Beta']);
    });
    it('starts without selection controls by default', () => {
      // arrange

      // act
      mount(<Table {...base} />);

      // assert
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
    it('can explicitly disable selection', () => {
      // arrange

      // act
      mount(<Table {...base} selectionMode="none" />);

      // assert
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
    it('names each selectable row by its stable key', () => {
      // arrange

      // act
      mount(<Table {...base} selectionMode="multiple" />);

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row a' })).not.toBeChecked();
      expect(screen.getByRole('checkbox', { name: 'Select all selectable rows' })).not.toBeChecked();
    });
    it('toggles an uncontrolled row selection', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} selectionMode="multiple" />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row a' })).toBeChecked(); expect(screen.getByRole('checkbox', { name: 'Select all selectable rows' })).toBePartiallyChecked();
    });
    it('can clear a previously selected row', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} selectionMode="multiple" defaultSelectedRowKeys={['a']} />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row a' })).not.toBeChecked();
    });
    it('selects all selectable rows while excluding unavailable ones', async () => {
      // arrange
      const user = userEvent.setup(); const change = vi.fn(); mount(<Table {...base} selectionMode="multiple" isRowSelectable={row => row.enabled} onSelectionChange={change} />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select all selectable rows' }));

      // assert
      expect(change).toHaveBeenCalledExactlyOnceWith(['a', 'b']); expect(screen.getByRole('checkbox', { name: 'Select row c' })).toBeDisabled(); expect(screen.getByRole('checkbox', { name: 'Select all selectable rows' })).toBeChecked();
    });
    it('deselects the current filtered results while retaining offscreen selections', async () => {
      // arrange
      const user = userEvent.setup(); const change = vi.fn(); mount(<Table {...base} selectionMode="multiple" defaultSelectedRowKeys={['a', 'b']} searchable defaultSearchValue="Alpha" onSelectionChange={change} />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select all selectable rows' }));

      // assert
      expect(change).toHaveBeenCalledExactlyOnceWith(['b']);
    });
    it('adds filtered results without losing offscreen selected keys', async () => {
      // arrange
      const user = userEvent.setup(); const change = vi.fn(); mount(<Table {...base} selectionMode="multiple" defaultSelectedRowKeys={['b']} searchable defaultSearchValue="Alpha" onSelectionChange={change} />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select all selectable rows' }));

      // assert
      expect(change).toHaveBeenCalledExactlyOnceWith(['b', 'a']);
    });
    it('retains selection after sorting changes row positions', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} selectionMode="multiple" defaultSelectedRowKeys={['b']} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Count' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row b' })).toBeChecked();
    });
    it('keeps controlled selection authoritative', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} selectionMode="multiple" selectedRowKeys={['b']} />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row b' })).toBeChecked(); expect(screen.getByRole('checkbox', { name: 'Select row a' })).not.toBeChecked();
    });
    it('accepts controlled selection changes', async () => {
      // arrange
      const user = userEvent.setup(); mount(<ControlledSelection />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row a' })).toBeChecked();
    });
    it('replaces the prior single selection', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} selectionMode="single" defaultSelectedRowKeys={['a']} />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select row b' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row b' })).toBeChecked(); expect(screen.getByRole('checkbox', { name: 'Select row a' })).not.toBeChecked(); expect(screen.queryByRole('checkbox', { name: 'Select all selectable rows' })).not.toBeInTheDocument();
    });
    it('can clear the active single selection', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} selectionMode="single" defaultSelectedRowKeys={['a']} />);

      // act
      await user.click(screen.getByRole('checkbox', { name: 'Select row a' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row a' })).not.toBeChecked();
    });
    it('disables select-all when no filtered rows are selectable', () => {
      // arrange

      // act
      mount(<Table {...base} selectionMode="multiple" isRowSelectable={() => false} />);

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select all selectable rows' })).toBeDisabled();
    });
    it('supports customized row and header selection labels', () => {
      // arrange

      // act
      mount(<Table {...base} selectionMode="multiple" getSelectionLabel={row => `Choose ${row.label}`} selectAllLabel="Choose all records" />);

      // assert
      expect(screen.getByRole('checkbox', { name: 'Choose Alpha' })).toBeVisible(); expect(screen.getByRole('checkbox', { name: 'Choose all records' })).toBeVisible();
    });
    it('keeps headers during loading and spans only visible structural columns', () => {
      // arrange

      // act
      mount(<Table {...base} loading selectionMode="multiple" />);

      // assert
      expect(screen.getAllByRole('columnheader')).toHaveLength(4); expect(screen.getByRole('cell')).toHaveAttribute('colspan', '4'); expect(screen.getByRole('status')).toHaveTextContent('Loading rows…'); expect(screen.queryByText('Alpha')).not.toBeInTheDocument();
    });
    it('gives loading precedence over empty and no-results content', () => {
      // arrange

      // act
      mount(<Table {...base} rows={[]} loading searchable defaultSearchValue="missing" loadingMessage="Fetching records" emptyState="Empty records" noResultsState="No records found" />);

      // assert
      expect(screen.getByRole('status')).toHaveTextContent('Fetching records'); expect(screen.queryByText('No records found')).not.toBeInTheDocument(); expect(screen.getByRole('searchbox')).toHaveValue('missing');
    });
    it('supports custom loading content without duplicating its status announcement', () => {
      // arrange

      // act
      mount(<Table {...base} loading loadingState={<strong>Preparing report</strong>} loadingMessage="Preparing rows" />);

      // assert
      expect(screen.getByText('Preparing report')).toBeVisible(); expect(screen.getAllByRole('status')).toHaveLength(1); expect(screen.getByRole('status')).toHaveTextContent('Preparing rows');
    });
    it('shows default empty content with the original headers', () => {
      // arrange

      // act
      mount(<Table {...base} rows={[]} />);

      // assert
      expect(screen.getByRole('cell')).toHaveTextContent('No rows yet.'); expect(screen.getByRole('cell')).toHaveAttribute('colspan', '3');
    });
    it('can customize empty content', () => {
      // arrange

      // act
      mount(<Table {...base} rows={[]} emptyState={<em>Add a record</em>} />);

      // assert
      expect(screen.getByRole('cell')).toHaveTextContent('Add a record');
    });
    it('can customize no-results content while retaining the editable query', () => {
      // arrange

      // act
      mount(<Table {...base} searchable defaultSearchValue="missing" noResultsState="Try another name" />);

      // assert
      expect(screen.getByRole('cell')).toHaveTextContent('Try another name'); expect(screen.getByRole('searchbox')).toHaveValue('missing');
    });
    it('supports static and calculated footers over displayed rows', () => {
      // arrange
      const summary = [column({ id: 'label', header: 'Name', accessor: 'label', footer: 'Total' }), column({ id: 'count', header: 'Count', accessor: 'count', footer: ({ rows }) => rows.reduce((sum, row) => sum + row.count, 0) })];

      // act
      mount(<Table {...base} columns={summary} searchable defaultSearchValue="Alpha" />);

      // assert
      expect(screen.getByRole('cell', { name: 'Total' }).closest('tfoot')).not.toBeNull(); expect(screen.getAllByRole('cell', { name: '2' })[0]!.closest('tbody')).not.toBeNull(); expect(screen.getAllByRole('cell', { name: '2' })).toHaveLength(2);
    });
    it('keeps a selection footer aligned with the structural selection column', () => {
      // arrange

      // act
      mount(<Table {...base} columns={[column({ id: 'label', header: 'Name', accessor: 'label', footer: 'Total' })]} selectionMode="multiple" />);

      // assert
      expect(within(screen.getByRole('cell', { name: 'Total' }).closest('tr')!).getAllByRole('cell')).toHaveLength(2);
    });
    it('does not show a stale footer while loading', () => {
      // arrange

      // act
      mount(<Table {...base} columns={[column({ id: 'label', header: 'Name', accessor: 'label', footer: 'Total' })]} loading />);

      // assert
      expect(screen.queryByText('Total')).not.toBeInTheDocument();
    });
    it('renders a display-only column without requiring an accessor', () => {
      // arrange

      // act
      mount(<Table {...base} columns={[column({ id: 'action', header: 'Actions', cell: ({ row, value }) => <a href={`#${row.id}`}>{row.label}{value}</a> })]} />);

      // assert
      expect(screen.getByRole('link', { name: 'Alpha' })).toHaveAttribute('href', '#a');
    });
    it('keeps cell links independent of row selection', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} columns={[column({ id: 'action', header: 'Actions', cell: ({ row }) => <a href={`#${row.id}`}>{row.label}</a> })]} selectionMode="multiple" />);

      // act
      await user.click(screen.getByRole('link', { name: 'Alpha' }));

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row a' })).not.toBeChecked();
    });
    it('combines data-aware row/cell slots with native semantics', () => {
      // arrange

      // act
      mount(<Table {...base} selectionMode="multiple" defaultSelectedRowKeys={['a']} classNames={{ wrapper: 'custom-wrapper', bodyRow: ({ row, selected }) => selected ? `selected-${row.id}` : 'plain-row', cell: ({ columnId }) => `cell-${columnId}` }} styles={{ bodyRow: ({ selected }) => selected ? { fontWeight: 700 } : undefined, cell: { fontStyle: 'italic' } }} />);

      // assert
      expect(screen.getByRole('cell', { name: 'Alpha' }).closest('tr')).toHaveClass('selected-a'); expect(screen.getByRole('cell', { name: 'Alpha' })).toHaveClass('fs-table__cell', 'cell-label'); expect(screen.getByRole('cell', { name: 'Alpha' })).toHaveStyle({ fontStyle: 'italic' });
    });
    it('lets column-specific styles override instance cell styles', () => {
      // arrange

      // act
      mount(<Table {...base} columns={[column({ id: 'label', header: 'Name', accessor: 'label', headerClassName: 'name-header', cellClassName: ({ row }) => `name-${row.id}`, cellStyle: ({ selected }) => ({ fontWeight: selected ? 700 : 600 }) })]} styles={{ cell: { fontWeight: 400 } }} />);

      // assert
      expect(screen.getByRole('columnheader')).toHaveClass('name-header', 'fs-table__header-cell'); expect(screen.getByRole('cell', { name: 'Alpha' })).toHaveClass('name-a'); expect(screen.getByRole('cell', { name: 'Alpha' })).toHaveStyle({ fontWeight: '600' });
    });
    it('retains native forwarded table attributes', () => {
      // arrange

      // act
      mount(<Table {...base} id="records" data-purpose="report" />);

      // assert
      expect(screen.getByRole('table')).toHaveAttribute('id', 'records'); expect(screen.getByRole('table')).toHaveAttribute('data-purpose', 'report');
    });
    it('retains an accessible caption when its presentation is visually hidden', () => {
      // arrange

      // act
      mount(<Table {...base} captionHidden />);

      // assert
      expect(screen.getByRole('table', { name: 'Records' })).toBeInTheDocument(); expect(screen.getByText('Records')).not.toHaveAttribute('hidden');
    });
    it('uses only underlying accessor values for default matching', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Table {...base} columns={[column({ id: 'label', header: 'Name', accessor: 'label', cell: () => 'Formatted' }), column({ id: 'action', header: 'Actions', cell: () => 'Formatted' })]} searchable />);

      // act
      await user.type(screen.getByRole('searchbox'), 'Formatted');

      // assert
      expect(screen.getByText('No matching rows.')).toBeVisible();
    });
    it('renders blank cells for null or absent underlying values', () => {
      // arrange
      const given = [{ id: 'empty', value: null }];

      // act
      mount(<Table rows={given} getRowKey={row => row.id} caption="Empty cells" columns={[{ id: 'value', header: 'Value', accessor: 'value' }, { id: 'none', header: 'Unspecified' }]} />);

      // assert
      expect(screen.getAllByRole('cell').map(cell => cell.textContent)).toEqual(['', '']);
    });
    it('does not turn missing values into searchable text', () => {
      // arrange
      const given = [{ id: 'empty', value: null }];

      // act
      mount(<Table rows={given} getRowKey={row => row.id} caption="Empty values" columns={[{ id: 'value', header: 'Value', accessor: 'value' }]} searchable defaultSearchValue="null" />);

      // assert
      expect(screen.getByText('No matching rows.')).toBeVisible();
    });
    it.each([{ first: null, second: 2, expected: ['First', 'Second'] }, { first: undefined, second: 2, expected: ['First', 'Second'] }, { first: 2, second: undefined, expected: ['Second', 'First'] }])('orders missing raw values independently of formatted labels: %j', ({ first, second, expected }) => {
      // arrange
      const given = [{ id: 'First', value: first }, { id: 'Second', value: second }];

      // act
      mount(<Table rows={given} getRowKey={row => row.id} caption="Missing values" columns={[{ id: 'label', header: 'Label', accessor: 'id' }, { id: 'value', header: 'Value', accessor: 'value', sortable: true }]} defaultSort={{ columnId: 'value', direction: 'asc' }} />);

      // assert
      expect(names()).toEqual(expected);
    });
    it('accepts finite numeric stable keys', () => {
      // arrange

      // act
      mount(<Table {...base} getRowKey={row => row.count} selectionMode="single" />);

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row 2' })).not.toBeChecked();
    });
    it('exposes presentation slots without replacing semantic table elements', () => {
      // arrange
      const summary = [{ ...columns[0]!, footer: 'Total' }, columns[1]!];

      // act
      mount(<Table {...base} columns={summary} density="compact" borders="all" scrollLabel="Record results" maxHeight={200} className="record-instance" style={{ '--fs-table-padding': '16px' }} classNames={{ scrollRegion: 'scroll-slot', table: 'table-slot', caption: 'caption-slot', toolbar: 'toolbar-slot', headerRow: 'head-row-slot', headerCell: 'head-slot', bodyRow: 'row-slot', cell: 'cell-slot', footer: 'footer-slot', stateContent: 'state-slot' }} styles={{ wrapper: { padding: 4 }, scrollRegion: { maxHeight: 180 }, table: { width: '100%' }, caption: { fontStyle: 'italic' }, toolbar: { padding: 4 }, headerRow: { height: 40 }, headerCell: { fontWeight: 700 }, bodyRow: { height: 48 }, cell: { fontWeight: 600 }, footer: { fontWeight: 700 }, stateContent: { padding: 8 } }} searchable />);

      // assert
      expect(screen.getByRole('table')).toHaveClass('table-slot'); expect(screen.getByRole('region', { name: 'Record results' })).toHaveClass('fs-table__scroll', 'scroll-slot'); expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col'); expect(screen.getByRole('cell', { name: 'Total' }).closest('tfoot')).toHaveClass('footer-slot');
    });
    it('uses empty content when search is disabled even if an initial query was supplied', () => {
      // arrange

      // act
      mount(<Table {...base} rows={[]} defaultSearchValue="missing" />);

      // assert
      expect(screen.getByRole('cell')).toHaveTextContent('No rows yet.');
    });
    it('applies state-content overrides without losing the spanning native cell', () => {
      // arrange

      // act
      mount(<Table {...base} loading classNames={{ stateContent: 'custom-state' }} styles={{ stateContent: { padding: 16 } }} />);

      // assert
      expect(screen.getByRole('cell')).toHaveAttribute('colspan', '3'); expect(within(screen.getByRole('cell')).getByText('Loading rows…')).toHaveClass('fs-table__state', 'custom-state');
    });
    it('can localize the visible search placeholder and label', () => {
      // arrange

      // act
      mount(<Table {...base} searchable searchLabel="Rechercher" searchPlaceholder="Nom du dossier" />);

      // assert
      expect(screen.getByRole('searchbox', { name: 'Rechercher' })).toHaveAttribute('placeholder', 'Nom du dossier');
    });
    it('sorts a copy without mutating the supplied rows', () => {
      // arrange
      const given = Object.freeze([...rows]);

      // act
      mount(<Table {...base} rows={given} defaultSort={{ columnId: 'count', direction: 'desc' }} />);

      // assert
      expect(given.map(row => row.label)).toEqual(['Alpha', 'Beta', 'Gamma']);
    });
    it('applies the header-cell slot to the selection column', () => {
      // arrange

      // act
      mount(<Table {...base} selectionMode="multiple" classNames={{ headerCell: 'all-headers' }} styles={{ headerCell: { fontWeight: 700 } }} />);

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select all selectable rows' }).closest('th')).toHaveClass('all-headers');
    });
    it('exposes selection cells to data-aware body-cell slots', () => {
      // arrange

      // act
      mount(<Table {...base} selectionMode="multiple" defaultSelectedRowKeys={['b']} classNames={{ cell: ({ columnId, row, selected }) => columnId === '$selection' ? `control-${row.id}-${selected}` : undefined }} styles={{ cell: ({ columnId }) => columnId === '$selection' ? { padding: 8 } : undefined }} />);

      // assert
      expect(screen.getByRole('checkbox', { name: 'Select row b' }).closest('td')).toHaveClass('fs-table__cell', 'control-b-true');
      expect(screen.getByRole('checkbox', { name: 'Select row b' }).closest('td')).toHaveStyle({ padding: '8px' });
    });
    it.each([{ columns: [] }, { columns: [{ id: '', header: 'Empty' }] }, { columns: [columns[0]!, columns[0]!] }, { columns: [{ ...columns[0]!, hidden: true }] }, { getRowKey: () => 'duplicate' }, { getRowKey: () => '' }, { getRowKey: () => Infinity }, { defaultSort: { columnId: 'missing', direction: 'asc' as const } }, { columns: [{ id: 'label', header: 'Name', accessor: 'label' as const }], defaultSort: { columnId: 'label', direction: 'asc' as const } }, { selectionMode: 'single' as const, defaultSelectedRowKeys: ['a', 'b'] }])('rejects ambiguous data or state %j', extra => {
      // arrange
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      // act
      const result = () => mount(<Table {...base} {...extra} />);

      // assert
      expect(result).toThrow(); error.mockRestore();
    });
  });
}

/**
 * Demonstrate a parent accepting optional sort state.
 **/
function ControlledSort() {
  const [sort, setSort] = useState<TableSort | null>(null);
  return <Table {...base} sort={sort} onSortChange={setSort} />;
}

/**
 * Demonstrate a parent accepting the current query.
 **/
function ControlledSearch() {
  const [query, setQuery] = useState('');
  return <Table {...base} searchable searchValue={query} onSearchChange={setQuery} />;
}

/**
 * Demonstrate a parent accepting stable selected row keys.
 **/
function ControlledSelection() {
  const [selected, setSelected] = useState<(string | number)[]>([]);
  return <Table {...base} selectionMode="multiple" selectedRowKeys={selected} onSelectionChange={setSelected} />;
}
