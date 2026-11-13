import type { ReactElement } from 'react';
import { TableSelectAll } from './TableSelection.js';
import { classes, columnStyle } from './table-slots.js';
import type { TableModel } from './useTable.js';
import type { TableColumn, TableProps } from './types.js';

/**
 * Keep the active sort direction on its owning native header only.
 **/
function sortDirection<T>(column: TableColumn<T>, model: TableModel<T>): 'ascending' | 'descending' | undefined {
  if (model.sort?.columnId !== column.id) { return undefined; }
  return model.sort.direction === 'asc' ? 'ascending' : 'descending';
}

/**
 * Keep a native header button inside each sortable column and expose direction only on its header.
 **/
function SortHeader<T>({ column, model }: { column: TableColumn<T>; model: TableModel<T> }) {
  const direction = model.sort?.columnId === column.id ? model.sort.direction : null;
  const arrow = direction === 'asc' ? '↑' : '↓';
  return <button type="button" className="fs-table__sort" onClick={() => model.changeSort(column.id)}>{column.header}<span aria-hidden="true">{direction ? arrow : '↕'}</span></button>;
}

/**
 * Render only visible columns while retaining stable native header semantics during every content state.
 **/
export function TableHead<T>({ props, model }: { props: TableProps<T>; model: TableModel<T> }): ReactElement {
  return <thead><tr className={props.classNames?.headerRow} style={props.styles?.headerRow}>{model.selection && <TableSelectAll props={props} model={model} />}
    {model.columns.map(column => <th key={column.id} scope="col" data-align={column.align ?? 'start'} aria-sort={sortDirection(column, model)}
      className={classes('fs-table__header-cell', props.classNames?.headerCell, column.headerClassName)} style={{ ...columnStyle(column), ...props.styles?.headerCell }}>
      {column.sortable ? <SortHeader column={column} model={model} /> : column.header}</th>)}
  </tr></thead>;
}
