import type { ReactElement } from 'react';
import { TextInput } from '../text-input/TextInput.js';
import { Select } from '../select/Select.js';
import { Checkbox } from '../checkbox/Checkbox.js';
import { Popover } from '../popover/Popover.js';
import type { DataTableProps } from './types.js';
import type { DataTableModel } from './useDataTable.js';

/**
 * Use option indices as DOM values so boolean, number and string filters remain distinct.
 **/
function Filters<T>({ props, model }: { props: DataTableProps<T>; model: DataTableModel<T> }) {
  return props.columns.filter(column => column.filterOptions).map(column => <Select key={column.id} label={column.filterLabel ?? column.header} value={String(column.filterOptions!.findIndex(option => option.value === model.filters[column.id]))}
    onChange={event => model.changeFilters({ ...model.filters, [column.id]: column.filterOptions![Number(event.target.value)]?.value })}>
    <option value="-1">All</option>{column.filterOptions!.map((option, index) => <option key={index} value={index}>{option.label}</option>)}
  </Select>);
}

/**
 * Present persistent checkboxes in a named disclosure; prevent hiding the last visible column.
 **/
function ColumnChooser<T>({ model }: { model: DataTableModel<T> }) {
  const count = model.columns.filter(column => !column.hidden).length;
  return <Popover triggerLabel="Columns" heading="Visible columns"><div className="fs-data-table__choices">{model.columns.map(column => <Checkbox key={column.id} label={column.header} checked={!column.hidden}
    disabled={column.hideable === false || (!column.hidden && count === 1)} onChange={event => model.changeVisibility({ ...model.visibility, [column.id]: event.target.checked })} />)}</div></Popover>;
}

/**
 * Keep all filters editable in empty, loading and error states and wrap controls at narrow widths.
 **/
export function DataTableToolbar<T>({ props, model }: { props: DataTableProps<T>; model: DataTableModel<T> }): ReactElement {
  return <div className={['fs-data-table__toolbar', props.classNames?.toolbar].filter(Boolean).join(' ')} style={props.styles?.toolbar}>{props.searchable && <TextInput type="search" label={props.searchLabel ?? 'Search table'} placeholder={props.searchPlaceholder ?? 'Search…'} value={model.query} onChange={event => model.changeQuery(event.target.value)} />}
    <Filters props={props} model={model} />{props.columnChooser && <ColumnChooser model={model} />}
  </div>;
}
