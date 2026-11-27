import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type TableRowKey = string | number;
export type TableSortValue = string | number | boolean | Date | null | undefined;
export interface TableSort {
  columnId: string;
  direction: 'asc' | 'desc';
}
export type TableStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export interface TableRowContext<T> {
  row: T;
  rowKey: TableRowKey;
  rowIndex: number;
  selected: boolean;
}
export interface TableCellContext<T, V = unknown> extends TableRowContext<T> {
  value: V;
  columnId: string;
}
export interface TableFooterContext<T> {
  rows: readonly T[];
}
type RowOverride<T, R> = R | ((context: TableRowContext<T>) => R | undefined);
type CellOverride<T, R> = R | ((context: TableCellContext<T>) => R | undefined);

export interface TableColumn<T> {
  id: string;
  header: ReactNode;
  readonly accessor?: keyof T | ((row: T) => unknown);
  readonly cell?: (context: TableCellContext<T>) => ReactNode;
  footer?: ReactNode | ((context: TableFooterContext<T>) => ReactNode);
  /** Optional client-side scalar choices used by DataTable. */
  filterOptions?: readonly { label: string; value: string | number | boolean }[];
  filterLabel?: string;
  hideable?: boolean;
  hidden?: boolean;
  align?: 'start' | 'center' | 'end';
  width?: CSSProperties['width'];
  minWidth?: CSSProperties['minWidth'];
  maxWidth?: CSSProperties['maxWidth'];
  sortable?: boolean;
  sortValue?: (row: T) => TableSortValue;
  compare?: (a: T, b: T) => number;
  headerClassName?: string;
  cellClassName?: CellOverride<T, string>;
  cellStyle?: CellOverride<T, TableStyle>;
}

type ColumnDefinition<T, V> = Omit<TableColumn<T>, 'accessor' | 'cell'> & {
  cell?: (context: TableCellContext<T, V>) => ReactNode;
};
export interface TableColumnFactory<T> {
  <K extends keyof T>(definition: ColumnDefinition<T, T[K]> & { accessor: K }): TableColumn<T>;
  <V>(definition: ColumnDefinition<T, V> & { accessor: (row: T) => V }): TableColumn<T>;
  (definition: ColumnDefinition<T, undefined> & { accessor?: never }): TableColumn<T>;
}

export interface TableClassNames<T> {
  wrapper?: string;
  scrollRegion?: string;
  table?: string;
  caption?: string;
  toolbar?: string;
  headerRow?: string;
  headerCell?: string;
  bodyRow?: RowOverride<T, string>;
  cell?: CellOverride<T, string>;
  footer?: string;
  stateContent?: string;
}
export interface TableStyles<T> {
  wrapper?: TableStyle;
  scrollRegion?: TableStyle;
  table?: TableStyle;
  caption?: TableStyle;
  toolbar?: TableStyle;
  headerRow?: TableStyle;
  headerCell?: TableStyle;
  bodyRow?: RowOverride<T, TableStyle>;
  cell?: CellOverride<T, TableStyle>;
  footer?: TableStyle;
  stateContent?: TableStyle;
}

type NamedTable =
  { caption: ReactNode; 'aria-label'?: string } | { caption?: ReactNode; 'aria-label': string };
export type TableProps<T> = Omit<
  ComponentPropsWithoutRef<'table'>,
  'children' | 'style' | 'role' | 'dangerouslySetInnerHTML' | 'aria-busy'
> &
  NamedTable & {
    rows: readonly T[];
    columns: readonly TableColumn<T>[];
    getRowKey: (row: T) => TableRowKey;
    captionHidden?: boolean;
    density?: 'comfortable' | 'compact';
    borders?: 'horizontal' | 'all' | 'none';
    striped?: boolean;
    hover?: boolean;
    stickyHeader?: boolean;
    maxHeight?: CSSProperties['maxHeight'];
    scrollLabel?: string;
    style?: TableStyle;
    classNames?: TableClassNames<T>;
    styles?: TableStyles<T>;
    sort?: TableSort | null;
    defaultSort?: TableSort | null;
    onSortChange?: (sort: TableSort | null) => void;
    sortMode?: 'client' | 'manual';
    selectionMode?: 'none' | 'single' | 'multiple';
    selectedRowKeys?: readonly TableRowKey[];
    defaultSelectedRowKeys?: readonly TableRowKey[];
    onSelectionChange?: (keys: TableRowKey[]) => void;
    isRowSelectable?: (row: T) => boolean;
    getSelectionLabel?: (row: T) => string;
    selectAllLabel?: string;
    searchable?: boolean;
    searchValue?: string;
    defaultSearchValue?: string;
    onSearchChange?: (value: string) => void;
    searchableColumns?: readonly string[];
    searchFunction?: (row: T, query: string, columns: readonly TableColumn<T>[]) => boolean;
    searchLabel?: string;
    searchPlaceholder?: string;
    loading?: boolean;
    loadingMessage?: string;
    loadingState?: ReactNode;
    emptyState?: ReactNode;
    noResultsState?: ReactNode;
  };
