import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { TableBody } from './TableBody.js';
import { TableFooter } from './TableFooter.js';
import { TableHead } from './TableHead.js';
import { TableToolbar } from './TableToolbar.js';
import { classes } from './table-slots.js';
import { useTable } from './useTable.js';
import type { TableProps } from './types.js';
export type {
  TableProps,
  TableColumn,
  TableColumnFactory,
  TableSort,
  TableSortValue,
  TableRowKey,
  TableRowContext,
  TableCellContext,
  TableFooterContext,
  TableStyle,
  TableStyles,
  TableClassNames,
} from './types.js';

/**
 * Preserve native table attributes while excluding composite state and owned semantics.
 **/
function tableAttributes<T>(props: TableProps<T>): ComponentPropsWithoutRef<'table'> {
  const native = { ...props } as Record<string, unknown>;
  for (const key of [
    'rows',
    'columns',
    'getRowKey',
    'caption',
    'captionHidden',
    'density',
    'borders',
    'striped',
    'hover',
    'stickyHeader',
    'maxHeight',
    'scrollLabel',
    'style',
    'className',
    'classNames',
    'styles',
    'sort',
    'defaultSort',
    'onSortChange',
    'sortMode',
    'selectionMode',
    'selectedRowKeys',
    'defaultSelectedRowKeys',
    'onSelectionChange',
    'isRowSelectable',
    'getSelectionLabel',
    'selectAllLabel',
    'searchable',
    'searchValue',
    'defaultSearchValue',
    'onSearchChange',
    'searchableColumns',
    'searchFunction',
    'searchLabel',
    'searchPlaceholder',
    'loading',
    'loadingMessage',
    'loadingState',
    'emptyState',
    'noResultsState',
    'children',
    'dangerouslySetInnerHTML',
    'role',
  ]) {
    Reflect.deleteProperty(native, key);
  }
  return native as ComponentPropsWithoutRef<'table'>;
}

/**
 * Present any typed dataset as an optionally searchable, sortable and selectable native table.
 **/
export function Table<T>(props: TableProps<T>): ReactElement {
  const model = useTable(props);
  return (
    <div
      className={classes('fs-table', props.className, props.classNames?.wrapper)}
      style={{ ...props.style, ...props.styles?.wrapper }}
      data-density={props.density ?? 'comfortable'}
      data-borders={props.borders ?? 'horizontal'}
      data-striped={props.striped}
      data-hover={props.hover}
      data-sticky={props.stickyHeader}
    >
      <TableToolbar props={props} model={model} />
      <div
        className={classes('fs-table__scroll', props.classNames?.scrollRegion)}
        style={{ maxHeight: props.maxHeight, ...props.styles?.scrollRegion }}
        role="region"
        aria-label={props.scrollLabel ?? 'Scrollable table'}
        tabIndex={0}
      >
        <table
          {...tableAttributes(props)}
          className={props.classNames?.table}
          style={props.styles?.table}
          aria-busy={props.loading}
        >
          {props.caption !== undefined && (
            <caption
              className={classes(
                props.captionHidden && 'fs-table__sr-only',
                props.classNames?.caption,
              )}
              style={props.styles?.caption}
            >
              {props.caption}
            </caption>
          )}
          <TableHead props={props} model={model} />
          <TableBody props={props} model={model} />
          <TableFooter props={props} model={model} />
        </table>
      </div>
    </div>
  );
}
