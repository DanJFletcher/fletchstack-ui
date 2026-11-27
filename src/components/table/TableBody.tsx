import type { ReactElement } from 'react';
import { Spinner } from '../spinner/Spinner.js';
import { columnValue, renderCell } from './columns.js';
import { TableSelectRow } from './TableSelection.js';
import { cellContext, classes, columnStyle, resolveSlot } from './table-slots.js';
import type { TableModel } from './useTable.js';
import type { TableProps, TableRowContext } from './types.js';

/**
 * Place loading, empty or no-results content across the exact visible structural column count.
 **/
function StateRow<T>({ props, model }: { props: TableProps<T>; model: TableModel<T> }) {
  const empty =
    model.query.trim() && props.searchable
      ? (props.noResultsState ?? 'No matching rows.')
      : (props.emptyState ?? 'No rows yet.');
  const loading = props.loadingState ?? (
    <>
      <Spinner decorative size="small" />
      {props.loadingMessage ?? 'Loading rows…'}
    </>
  );
  return (
    <tr>
      <td className="fs-table__cell" colSpan={model.span}>
        <div
          className={classes('fs-table__state', props.classNames?.stateContent)}
          style={props.styles?.stateContent}
        >
          {props.loading ? loading : empty}
        </div>
      </td>
    </tr>
  );
}

/**
 * Render a row through data-aware style slots while preserving stable key identity and built-in controls.
 **/
function DataRow<T>({
  props,
  model,
  context,
}: {
  props: TableProps<T>;
  model: TableModel<T>;
  context: TableRowContext<T>;
}) {
  return (
    <tr
      data-selected={context.selected}
      className={resolveSlot(props.classNames?.bodyRow, context)}
      style={resolveSlot(props.styles?.bodyRow, context)}
    >
      {model.selection && <TableSelectRow props={props} model={model} context={context} />}
      {model.columns.map((column) => {
        const cell = cellContext(context, column.id, columnValue(column, context.row));
        return (
          <td
            key={column.id}
            className={classes(
              'fs-table__cell',
              resolveSlot(props.classNames?.cell, cell),
              resolveSlot(column.cellClassName, cell),
            )}
            style={{
              ...columnStyle(column),
              ...resolveSlot(props.styles?.cell, cell),
              ...resolveSlot(column.cellStyle, cell),
            }}
          >
            {renderCell(column, cell)}
          </td>
        );
      })}
    </tr>
  );
}

/**
 * Retain native body rows or show one message row while headers remain mounted.
 **/
export function TableBody<T>({
  props,
  model,
}: {
  props: TableProps<T>;
  model: TableModel<T>;
}): ReactElement {
  return (
    <tbody>
      {props.loading || !model.rows.length ? (
        <StateRow props={props} model={model} />
      ) : (
        model.rows.map((row, rowIndex) => {
          const rowKey = props.getRowKey(row);
          return (
            <DataRow
              key={`${typeof rowKey}:${rowKey}`}
              props={props}
              model={model}
              context={{ row, rowKey, rowIndex, selected: model.selected.includes(rowKey) }}
            />
          );
        })
      )}
    </tbody>
  );
}
