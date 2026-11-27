import type { TableCellContext, TableColumn, TableRowContext, TableStyle } from './types.js';

/**
 * Resolve a data-aware class/style override without accepting semantic attributes or event handlers.
 **/
export function resolveSlot<C, V>(
  slot: V | ((context: C) => V | undefined) | undefined,
  context: C,
): V | undefined {
  return typeof slot === 'function' ? (slot as (context: C) => V | undefined)(context) : slot;
}

/**
 * Combine built-in and consumer classes without dropping the component's semantic hooks.
 **/
export function classes(...values: (string | false | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}

/**
 * Apply column constraints before explicit instance and data-aware cell overrides.
 **/
export function columnStyle<T>(column: TableColumn<T>): TableStyle {
  return {
    textAlign: column.align ?? 'start',
    width: column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
  };
}

/**
 * Attach the original row and underlying value to each data-aware cell customization.
 **/
export function cellContext<T>(
  context: TableRowContext<T>,
  columnId: string,
  value: unknown,
): TableCellContext<T> {
  return { ...context, columnId, value };
}
