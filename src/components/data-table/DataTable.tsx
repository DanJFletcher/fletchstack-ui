import type { ReactElement } from 'react';
import { Button } from '../button/Button.js';
import type { TableProps } from '../table/types.js';
import { Table } from '../table/Table.js';
import { DataTableToolbar } from './Toolbar.js';
import { DataTableFooter } from './Footer.js';
import { useDataTable } from './useDataTable.js';
import type { DataTableProps } from './types.js';
export type {
  DataTableProps,
  DataTableStyle,
  DataTablePagination,
  DataTableFilters,
  DataTableFilterValue,
  DataTableColumnVisibility,
} from './types.js';

/**
 * Remove composition-only attributes before forwarding native table and presentation props.
 **/
function tableProps<T>(props: DataTableProps<T>): TableProps<T> {
  const table = { ...props };
  for (const key of [
    'pagination',
    'paginationState',
    'defaultPagination',
    'onPaginationChange',
    'filters',
    'defaultFilters',
    'onFiltersChange',
    'columnChooser',
    'columnVisibility',
    'defaultColumnVisibility',
    'onColumnVisibilityChange',
    'error',
    'onRetry',
  ]) {
    Reflect.deleteProperty(table, key);
  }
  return table as TableProps<T>;
}

/**
 * Add client-side filtering, visibility and pagination to the library's native typed Table.
 **/
export function DataTable<T>(props: DataTableProps<T>): ReactElement {
  const model = useDataTable(props);
  const empty =
    props.rows.length === 0 ? (
      (props.emptyState ?? 'No rows yet.')
    ) : (
      <>
        {props.noResultsState ?? 'No matching rows.'}
        <Button variant="secondary" onClick={model.clearFilters}>
          Clear filters
        </Button>
      </>
    );
  const error = (
    <>
      <span role="alert">{props.error}</span>
      {props.onRetry && (
        <Button variant="secondary" onClick={props.onRetry}>
          Retry
        </Button>
      )}
    </>
  );
  return (
    <div className="fs-data-table" style={props.style}>
      {props.caption !== undefined && !props.captionHidden && (
        <h2 className="fs-data-table__heading">{props.caption}</h2>
      )}
      <DataTableToolbar props={props} model={model} />
      <Table
        {...tableProps(props)}
        captionHidden
        rows={props.error ? [] : model.rows}
        columns={model.columns}
        searchable={false}
        sortMode="manual"
        sort={model.sort}
        onSortChange={model.changeSort}
        selectedRowKeys={model.selected}
        onSelectionChange={model.changeSelection}
        selectAllLabel={props.selectAllLabel ?? 'Select all selectable rows on this page'}
        loading={props.loading ?? false}
        loadingState={props.loadingState}
        emptyState={props.error ? error : empty}
      />
      <DataTableFooter props={props} model={model} />
    </div>
  );
}
