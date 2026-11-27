import type { ReactNode } from 'react';
import type { TableCellContext, TableColumn, TableColumnFactory } from './types.js';

/**
 * Preserve accessor result inference in column renderers, without coupling the table to a dataset.
 **/
export function createTableColumn<T>(): TableColumnFactory<T> {
  // The identity helper binds each renderer's value to its own accessor before heterogeneous columns are stored.
  return ((definition: TableColumn<T>) => definition) as TableColumnFactory<T>;
}

/**
 * Read an underlying value independently of display formatting or selection state.
 **/
export function columnValue<T>(column: TableColumn<T>, row: T): unknown {
  if (typeof column.accessor === 'function') {
    return column.accessor(row);
  }
  return column.accessor === undefined ? undefined : row[column.accessor];
}

/**
 * Render scalar values predictably; rich values require an explicit cell renderer.
 **/
export function displayValue(value: unknown): ReactNode {
  return value === null || value === undefined ? null : String(value);
}

/**
 * Invoke the renderer paired with this column's accessor, retaining the original row and raw value.
 **/
export function renderCell<T>(column: TableColumn<T>, context: TableCellContext<T>): ReactNode {
  return column.cell ? column.cell(context) : displayValue(context.value);
}
