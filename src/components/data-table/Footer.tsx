import type { ReactElement } from 'react';
import { Button } from '../button/Button.js';
import type { DataTableProps } from './types.js';
import type { DataTableModel } from './useDataTable.js';

/**
 * Announce the full result count and retain total selection independently of visible rows.
 **/
export function DataTableFooter<T>({ props, model }: { props: DataTableProps<T>; model: DataTableModel<T> }): ReactElement {
  const { pageIndex, pageSize } = model.page;
  const offset = props.pagination ? pageIndex * pageSize : 0;
  const first = model.total === 0 ? 0 : offset + 1;
  const last = props.pagination ? Math.min((pageIndex + 1) * pageSize, model.total) : model.total;
  const pending = Boolean(props.loading || props.error);
  return <div className="fs-data-table__footer">{props.selectionMode && props.selectionMode !== 'none' && <strong>{model.selected.length} selected</strong>}
    <span role="status">{props.loading ? (props.loadingMessage ?? 'Loading rows…') : `${first}–${last} of ${model.total} results`}</span>
    {props.pagination && <div className="fs-data-table__pagination" role="group" aria-label="Pagination"><Button variant="secondary" disabled={pending || pageIndex === 0} onClick={() => model.changePage({ pageIndex: pageIndex - 1, pageSize })}>Previous</Button>
      <Button variant="secondary" disabled={pending || last >= model.total} onClick={() => model.changePage({ pageIndex: pageIndex + 1, pageSize })}>Next</Button></div>}
  </div>;
}
