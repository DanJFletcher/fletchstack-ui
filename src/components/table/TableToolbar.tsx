import type { ReactElement } from 'react';
import { TextInput } from '../text-input/TextInput.js';
import type { TableModel } from './useTable.js';
import type { TableProps } from './types.js';

/**
 * Keep search editable in all content states and announce counts outside the table's busy subtree.
 **/
export function TableToolbar<T>({ props, model }: { props: TableProps<T>; model: TableModel<T> }): ReactElement {
  const announcement = props.loading ? (props.loadingMessage ?? 'Loading rows…') : `${model.rows.length} of ${props.rows.length} rows`;
  return <>{props.searchable && <div className={props.classNames?.toolbar} style={props.styles?.toolbar}><TextInput id={model.searchId} type="search" label={props.searchLabel ?? 'Search table'} placeholder={props.searchPlaceholder ?? 'Search…'} value={model.query} onChange={event => model.changeSearch(event.target.value)} /></div>}
    {(props.searchable || props.loading) && <p className="fs-table__sr-only" role="status">{announcement}</p>}</>;
}
