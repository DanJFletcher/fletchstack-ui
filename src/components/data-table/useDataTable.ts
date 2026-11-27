import { useState } from 'react';
import type { TableColumn, TableRowKey, TableSort } from '../table/types.js';
import { currentPage, matchingRows, validateDataTable, visibleColumns } from './policy.js';
import type {
  DataTableColumnVisibility,
  DataTableFilters,
  DataTablePagination,
  DataTableProps,
} from './types.js';

/**
 * Retain an uncontrolled default while reporting the same requests in controlled use.
 **/
function useValue<V>(
  value: V | undefined,
  initial: V,
  onChange: ((next: V) => void) | undefined,
): [V, (next: V) => void] {
  const [stored, setStored] = useState(initial);
  return [
    value === undefined ? stored : value,
    (next) => {
      if (value === undefined) {
        setStored(next);
      }
      onChange?.(next);
    },
  ];
}

export interface DataTableModel<T> {
  sort: TableSort | null;
  query: string;
  filters: DataTableFilters;
  visibility: DataTableColumnVisibility;
  page: DataTablePagination;
  selected: TableRowKey[];
  rows: readonly T[];
  total: number;
  columns: TableColumn<T>[];
  changePage: (value: DataTablePagination) => void;
  changeVisibility: (value: DataTableColumnVisibility) => void;
  changeSelection: (value: TableRowKey[]) => void;
  changeSort: (value: TableSort | null) => void;
  changeQuery: (value: string) => void;
  changeFilters: (value: DataTableFilters) => void;
  clearFilters: () => void;
}
type Controls<T> = Omit<DataTableModel<T>, 'rows' | 'total' | 'columns'>;

/**
 * Keep controlled requests and uncontrolled defaults consistent across toolbar and table controls.
 **/
function useControls<T>(props: DataTableProps<T>): Controls<T> {
  const [sort, changeSort] = useValue<TableSort | null>(
    props.sort,
    props.defaultSort ?? null,
    props.onSortChange,
  );
  const [query, changeQuery] = useValue(
    props.searchValue,
    props.defaultSearchValue ?? '',
    props.onSearchChange,
  );
  const [filters, changeFilters] = useValue<DataTableFilters>(
    props.filters,
    props.defaultFilters ?? {},
    props.onFiltersChange,
  );
  const [visibility, changeVisibility] = useValue<DataTableColumnVisibility>(
    props.columnVisibility,
    props.defaultColumnVisibility ?? {},
    props.onColumnVisibilityChange,
  );
  const [page, changePage] = useValue<DataTablePagination>(
    props.paginationState,
    props.defaultPagination ?? { pageIndex: 0, pageSize: 10 },
    props.onPaginationChange,
  );
  const [selected, changeSelection] = useValue<TableRowKey[]>(
    props.selectedRowKeys === undefined ? undefined : [...props.selectedRowKeys],
    [...(props.defaultSelectedRowKeys ?? [])],
    props.onSelectionChange,
  );
  const reset = () => changePage({ ...page, pageIndex: 0 });

  return {
    sort,
    query,
    filters,
    visibility,
    page,
    selected,
    changePage,
    changeVisibility,
    changeSelection,
    changeSort: (value) => {
      changeSort(value);
      reset();
    },
    changeQuery: (value) => {
      changeQuery(value);
      reset();
    },
    changeFilters: (value) => {
      changeFilters(value);
      reset();
    },
    clearFilters: () => {
      changeQuery('');
      changeFilters({});
      reset();
    },
  };
}

/**
 * Project the complete dataset through filters and sorting before taking the requested page.
 **/
export function useDataTable<T>(props: DataTableProps<T>): DataTableModel<T> {
  const controls = useControls(props);
  validateDataTable(props, controls.sort, controls.page);
  const matches = matchingRows(props, controls.query, controls.filters, controls.sort);
  const page = currentPage(matches.length, controls.page);
  const rows = props.pagination
    ? matches.slice(page.pageIndex * page.pageSize, (page.pageIndex + 1) * page.pageSize)
    : matches;

  return {
    ...controls,
    page,
    rows,
    total: matches.length,
    columns: visibleColumns(props.columns, controls.visibility),
  };
}
