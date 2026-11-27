import type { ReactElement } from 'react';
import { columnStyle } from './table-slots.js';
import type { TableModel } from './useTable.js';
import type { TableProps } from './types.js';

/**
 * Summarize the displayed result set using consumer-owned footer content.
 **/
export function TableFooter<T>({
  props,
  model,
}: {
  props: TableProps<T>;
  model: TableModel<T>;
}): ReactElement | null {
  if (props.loading || !model.columns.some((column) => column.footer !== undefined)) {
    return null;
  }
  return (
    <tfoot className={props.classNames?.footer} style={props.styles?.footer}>
      <tr>
        {model.selection && <td />}
        {model.columns.map((column) => (
          <td key={column.id} style={columnStyle(column)}>
            {typeof column.footer === 'function'
              ? column.footer({ rows: model.rows })
              : column.footer}
          </td>
        ))}
      </tr>
    </tfoot>
  );
}
