# DataTable

DataTable composes the public Table with searchable and scalar-filtered complete client data, optional pagination and a column chooser. It retains native table semantics. No router or table-engine dependency is required.

```tsx
import { DataTable, createTableColumn } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';
type Payment = { id: string; email: string; amount: number; status: string };
const column = createTableColumn<Payment>();
const columns = [
  column({ id: 'email', header: 'Email', accessor: 'email', sortable: true, hideable: false }),
  column({
    id: 'amount',
    header: 'Amount',
    accessor: 'amount',
    sortable: true,
    align: 'end',
    cell: ({ value }) => value.toFixed(2),
  }),
  column({
    id: 'status',
    header: 'Status',
    accessor: 'status',
    filterOptions: [{ label: 'Paid', value: 'paid' }],
  }),
];
<DataTable
  caption="Payments"
  rows={payments}
  columns={columns}
  getRowKey={(row) => row.id}
  searchable
  searchableColumns={['email']}
  searchLabel="Search email"
  defaultSort={{ columnId: 'email', direction: 'asc' }}
  selectionMode="multiple"
  pagination
  defaultPagination={{ pageIndex: 0, pageSize: 3 }}
  columnChooser
/>;
```

Reuse [Table's API and styling slots](table.md). The visible caption appears before the toolbar and names the native table through its hidden caption. `captionHidden` hides the visible heading; an `aria-label` can name a captionless table. Row-specific menus and cell formatting belong to the consumer. Menus need record-specific accessible labels.

| Prop                                                                      | Type / default                                                           |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `rows`, `columns`, `getRowKey`                                            | Required complete dataset, `TableColumn<T>[]`, stable string/number keys |
| `pagination`                                                              | boolean; false                                                           |
| `paginationState`, `defaultPagination`                                    | `{pageIndex, pageSize}`; default `{pageIndex:0,pageSize:10}`             |
| `onPaginationChange`                                                      | requested page callback; controlled mode waits for the parent            |
| `filters`, `defaultFilters`, `onFiltersChange`                            | column ID → string/number/boolean; undefined means All                   |
| `columnChooser`                                                           | boolean; false                                                           |
| `columnVisibility`, `defaultColumnVisibility`, `onColumnVisibilityChange` | column ID → visible boolean; otherwise use column.hidden                 |
| `error`, `onRetry`                                                        | renderable load error and optional recovery handler                      |
| `loading`, `loadingMessage`, `loadingState`                               | inherited Table feedback; takes precedence over error                    |
| `emptyState`, `noResultsState`                                            | separate custom messages; no results also offers Clear filters           |

Columns additionally accept `filterOptions: readonly {label:string,value:string|number|boolean}[]`, optional `filterLabel`, and `hideable` (true by default). `createTableColumn<T>()` retains accessor and cell-value inference. Non-hideable columns stay visible. The last visible column cannot be hidden; an all-hidden controlled map falls back to the first column.

Search (case-insensitive by default) and scalar filters combine, followed by stable sorting, then pagination. Hiding columns does not change search or filters. Sorting/filtering/clearing requests page zero. For external controlled state updates, the parent should supply page zero with the new filter/sort; shrinking datasets clamp the displayed page to the last available page. Page indices are nonnegative integers; sizes must be positive integers.

Selection uses stable row keys. Header select-all affects selectable records on this page only. Total selected counts include keys outside the current results; consumers remove stale keys if records are deleted. Disabling pagination displays all matching records. Manual/server-side pagination and sorting are outside this component's complete-dataset scope; use Table's manual sorting for a server-owned projection.

Table's `className`, `style`, `classNames` and `styles` remain available, including data-dependent row/cell overrides. Table semantic tokens style the shared surface and spacing; fields/buttons/popovers retain their own tokens. Instance style variables are scoped to the composition, including its toolbar. Parent layout owns placement. The toolbar wraps and the named scroll region preserves table column relationships at narrow widths.

For split CSS imports include tokens, field, icon, button, checkbox, select, text-input, spinner, popover, table and data-table styles; consumer row menus additionally need menu styles. Combined styles.css includes these in order.

Keyboard follows native form controls and links. Sort buttons expose aria-sort; checkboxes identify records and mixed page selection. Columns opens a named non-modal dialog; Escape restores its trigger. Loading is announced; load errors use an alert. Automated DOM/hydration and browser tests cover behaviors; real screen-reader and device testing remains a manual verification step.
