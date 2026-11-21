import type { ReactNode } from 'react';
import type { TableProps, TableStyle } from '../table/types.js';

export type DataTableStyle = TableStyle;
export type DataTableFilterValue = string | number | boolean;
export type DataTableFilters = Readonly<Record<string, DataTableFilterValue | undefined>>;
export type DataTableColumnVisibility = Readonly<Record<string, boolean>>;
export interface DataTablePagination { pageIndex: number; pageSize: number }
type ClientTable<P> = P extends unknown ? Omit<P, 'sortMode'> : never;
export type DataTableProps<T> = ClientTable<TableProps<T>> & {
  /** Client-side pagination; disabled by default. Default page size is ten. */
  pagination?: boolean;
  paginationState?: DataTablePagination;
  defaultPagination?: DataTablePagination;
  onPaginationChange?: (pagination: DataTablePagination) => void;
  filters?: DataTableFilters;
  defaultFilters?: DataTableFilters;
  onFiltersChange?: (filters: DataTableFilters) => void;
  columnChooser?: boolean;
  columnVisibility?: DataTableColumnVisibility;
  defaultColumnVisibility?: DataTableColumnVisibility;
  onColumnVisibilityChange?: (visibility: DataTableColumnVisibility) => void;
  /** Loading takes precedence over errors. A supplied error replaces data rows. */
  error?: ReactNode;
  onRetry?: () => void;
};
