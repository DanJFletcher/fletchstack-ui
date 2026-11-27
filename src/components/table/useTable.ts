import { useId, useState } from 'react';
import {
  filterRows,
  nextSort,
  sortRows,
  toggleKeys,
  toggleRow,
  validateTable,
} from './table-policy.js';
import type { TableColumn, TableProps, TableRowKey, TableSort } from './types.js';

export interface TableModel<T> {
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  selected: readonly TableRowKey[];
  selectable: TableRowKey[];
  sort: TableSort | null;
  query: string;
  searchId: string;
  selection: boolean;
  span: number;
  changeSort: (columnId: string) => void;
  changeSearch: (value: string) => void;
  toggle: (key: TableRowKey) => void;
  toggleAll: () => void;
}

/**
 * Keep opt-in state controlled when supplied, otherwise retain its mount default.
 **/
function useValue<V>(
  controlled: V | undefined,
  initial: V,
  onChange: ((value: V) => void) | undefined,
): [V, (value: V) => void] {
  const [stored, setStored] = useState(initial);
  return [
    controlled === undefined ? stored : controlled,
    (value) => {
      if (controlled === undefined) {
        setStored(value);
      }
      onChange?.(value);
    },
  ];
}

/**
 * Compose local filtering, stable sorting and key-based selection without mutating consumer data.
 **/
export function useTable<T>(props: TableProps<T>): TableModel<T> {
  const [sort, setSort] = useValue(props.sort, props.defaultSort ?? null, props.onSortChange);
  const [query, setQuery] = useValue(
    props.searchValue,
    props.defaultSearchValue ?? '',
    props.onSearchChange,
  );
  const [selected, setSelected] = useValue<TableRowKey[]>(
    props.selectedRowKeys === undefined ? undefined : [...props.selectedRowKeys],
    [...(props.defaultSelectedRowKeys ?? [])],
    props.onSelectionChange,
  );
  const searchId = useId();
  validateTable(props, sort);
  if (props.selectionMode === 'single' && selected.length > 1) {
    throw new Error('Single-selection tables accept at most one selected key.');
  }
  const columns = props.columns.filter((column) => !column.hidden);
  const rows = sortRows(filterRows(props, query), props.columns, sort, props.sortMode === 'manual');
  const selectable = rows
    .filter((row) => props.isRowSelectable?.(row) ?? true)
    .map(props.getRowKey);
  const selection = props.selectionMode !== undefined && props.selectionMode !== 'none';
  return {
    columns,
    rows,
    sort,
    query,
    selected,
    selectable,
    searchId,
    selection,
    span: columns.length + Number(selection),
    changeSort: (id) => setSort(nextSort(sort, id)),
    changeSearch: setQuery,
    toggle: (key) => setSelected(toggleRow(selected, key, props.selectionMode === 'single')),
    toggleAll: () => setSelected(toggleKeys(selected, selectable)),
  };
}
