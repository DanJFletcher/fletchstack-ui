import { columnValue } from '../table/columns.js';
import { filterRows, sortRows, validateTable } from '../table/table-policy.js';
import type { TableColumn, TableSort } from '../table/types.js';
import type { DataTableFilters, DataTablePagination, DataTableProps } from './types.js';

/**
 * Validate complete-dataset identities and pagination before taking any page projection.
 **/
export function validateDataTable<T>(
  props: DataTableProps<T>,
  sort: TableSort | null,
  pagination: DataTablePagination,
): void {
  validateTable(props, sort);
  if (
    !Number.isInteger(pagination.pageIndex) ||
    pagination.pageIndex < 0 ||
    !Number.isInteger(pagination.pageSize) ||
    pagination.pageSize < 1
  ) {
    throw new Error(
      'DataTable requires a nonnegative integer pageIndex and a positive integer pageSize.',
    );
  }
}

/**
 * Apply search and exact scalar filters before sorting, independent of user column visibility.
 **/
export function matchingRows<T>(
  props: DataTableProps<T>,
  query: string,
  filters: DataTableFilters,
  sort: TableSort | null,
): readonly T[] {
  const searchable = {
    ...props,
    columns: props.columns.map((column) => ({ ...column, hidden: false })),
  };
  const rows = filterRows(searchable, query).filter((row) =>
    props.columns.every(
      (column) =>
        filters[column.id] === undefined || columnValue(column, row) === filters[column.id],
    ),
  );

  return sortRows(rows, props.columns, sort, false);
}

/**
 * Clamp the displayed page after dataset changes without requesting state updates during render.
 **/
export function currentPage(rows: number, pagination: DataTablePagination): DataTablePagination {
  return {
    pageSize: pagination.pageSize,
    pageIndex: Math.min(
      pagination.pageIndex,
      Math.max(0, Math.ceil(rows / pagination.pageSize) - 1),
    ),
  };
}

/**
 * Keep at least one column visible while respecting a consumer's non-hideable columns.
 **/
export function visibleColumns<T>(
  columns: readonly TableColumn<T>[],
  visibility: Readonly<Record<string, boolean>>,
): TableColumn<T>[] {
  const projected = columns.map((column) => ({
    ...column,
    hidden: column.hideable === false ? false : !(visibility[column.id] ?? !column.hidden),
  }));
  if (projected.every((column) => column.hidden)) {
    return projected.map((column, index) => ({ ...column, hidden: index !== 0 }));
  }

  return projected;
}
