import { columnValue } from './columns.js';
import type { TableColumn, TableProps, TableRowKey, TableSort } from './types.js';

/**
 * Reject ambiguous column/row identities and invalid sorting before generating semantic relationships.
 **/
export function validateTable<T>(props: TableProps<T>, sort: TableSort | null): void {
  const ids = props.columns.map(column => column.id);
  const keys = props.rows.map(props.getRowKey);
  if (!ids.length || ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) { throw new Error('Table columns require unique, nonempty ids.'); }
  if (props.columns.every(column => column.hidden)) { throw new Error('Table requires at least one visible column.'); }
  if (keys.some(key => typeof key === 'string' ? !key.trim() : !Number.isFinite(key)) || new Set(keys).size !== keys.length) { throw new Error('Table rows require unique, nonempty stable keys.'); }
  if (sort && !props.columns.some(column => column.id === sort.columnId && column.sortable)) { throw new Error('Table sort must identify a sortable column.'); }
}

/**
 * Cycle each header through ascending, descending and unsorted without changing other columns.
 **/
export function nextSort(sort: TableSort | null, columnId: string): TableSort | null {
  if (sort?.columnId !== columnId) { return { columnId, direction: 'asc' }; }
  return sort.direction === 'asc' ? { columnId, direction: 'desc' } : null;
}

/**
 * Compare numbers and dates naturally, strings lexically and unanswered values before populated values.
 **/
function compareValues(a: unknown, b: unknown): number {
  const left = a instanceof Date ? a.getTime() : a;
  const right = b instanceof Date ? b.getTime() : b;
  if (left === right) { return 0; }
  if (left === null || left === undefined) { return -1; }
  if (right === null || right === undefined) { return 1; }
  if (typeof left === 'number' && typeof right === 'number') { return left - right; }
  return String(left).localeCompare(String(right));
}

/**
 * Sort a copy stably; manual mode keeps the consumer's supplied order.
 **/
export function sortRows<T>(rows: readonly T[], columns: readonly TableColumn<T>[], sort: TableSort | null, manual: boolean): readonly T[] {
  if (!sort || manual) { return rows; }
  const column = columns.find(candidate => candidate.id === sort.columnId)!;
  const compare = column.compare ?? ((a: T, b: T) => compareValues(column.sortValue ? column.sortValue(a) : columnValue(column, a), column.sortValue ? column.sortValue(b) : columnValue(column, b)));
  return [...rows].sort((a, b) => compare(a, b) * (sort.direction === 'asc' ? 1 : -1));
}

/**
 * Search visible accessors only unless the consumer deliberately supplies a custom matcher.
 **/
export function filterRows<T>(props: TableProps<T>, query: string): readonly T[] {
  if (!props.searchable || !query.trim()) { return props.rows; }
  const columns = props.columns.filter(column => !column.hidden && column.accessor !== undefined && (!props.searchableColumns || props.searchableColumns.includes(column.id)));
  const normalized = query.trim().toLowerCase();
  return props.rows.filter(row => props.searchFunction ? props.searchFunction(row, query, columns) : columns.some(column => String(columnValue(column, row) ?? '').toLowerCase().includes(normalized)));
}

/**
 * Toggle the filtered selectable keys without discarding selections outside the current result set.
 **/
export function toggleKeys(selected: readonly TableRowKey[], keys: readonly TableRowKey[]): TableRowKey[] {
  const next = new Set(selected);
  const remove = keys.every(key => next.has(key));
  for (const key of keys) { if (remove) { next.delete(key); } else { next.add(key); } }
  return [...next];
}

/**
 * Keep single selection optional while allowing multiple selection to toggle independently.
 **/
export function toggleRow(selected: readonly TableRowKey[], key: TableRowKey, single: boolean): TableRowKey[] {
  if (single) { return selected.includes(key) ? [] : [key]; }
  return toggleKeys(selected, [key]);
}
