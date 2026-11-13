import type { ReactElement } from 'react';
import { Checkbox } from '../checkbox/Checkbox.js';
import { cellContext, classes, resolveSlot } from './table-slots.js';
import type { TableModel } from './useTable.js';
import type { TableProps, TableRowContext } from './types.js';

/**
 * Toggle only selectable filtered rows and expose the native checkbox's mixed state.
 **/
export function TableSelectAll<T>({ props, model }: { props: TableProps<T>; model: TableModel<T> }): ReactElement {
  const count = model.selectable.filter(key => model.selected.includes(key)).length;
  return <th scope="col" className={classes('fs-table__header-cell', 'fs-table__selection', props.classNames?.headerCell)} style={props.styles?.headerCell}>{props.selectionMode === 'multiple'
    ? <Checkbox label={<span className="fs-table__sr-only">{props.selectAllLabel ?? 'Select all selectable rows'}</span>} checked={count > 0 && count === model.selectable.length} indeterminate={count > 0 && count < model.selectable.length} disabled={!model.selectable.length || props.loading} onChange={model.toggleAll} />
    : <span className="fs-table__sr-only">Selection</span>}</th>;
}

/**
 * Name each native row checkbox without making row clicks or cell links change selection.
 **/
export function TableSelectRow<T>({ props, model, context }: { props: TableProps<T>; model: TableModel<T>; context: TableRowContext<T> }): ReactElement {
  const cell = cellContext(context, '$selection', context.selected);
  return <td className={classes('fs-table__cell', 'fs-table__selection', resolveSlot(props.classNames?.cell, cell))} style={resolveSlot(props.styles?.cell, cell)}><Checkbox label={<span className="fs-table__sr-only">{props.getSelectionLabel?.(context.row) ?? `Select row ${context.rowKey}`}</span>}
    checked={context.selected} disabled={!(props.isRowSelectable?.(context.row) ?? true)} onChange={() => model.toggle(context.rowKey)} /></td>;
}
