# Table

The supplied five-column portfolio design and [reference Table behavior](https://themed-react-ui-foundation.replit.app/?path=/docs/components-table--docs) authorize a generic semantic table with optional sorting, selection and search. The portfolio remains a consumer: project fields, Badge tones and date formatting belong to its example rather than production Table code.

The component owns native table structure, accessible sortable header buttons, named row controls, filtering/sorting state and scroll containment. Column definitions own access, display, widths, alignment, summaries and sorting policy. Parents own placement, data loading and server-side sorting. The approved table-specific semantic roles cover surface/text/dividers, header/stripe/hover/selected surfaces, selected text/control boundary, padding, typography and focus. They reuse the existing Corporate and Luna palettes and dimensions. No new primitive palette or motion is introduced.

`createTableColumn<Row>()` pairs property-key or computed accessors with precisely inferred cell values. `Table<Row>` also accepts direct `TableColumn<Row>` definitions with typed rows and unknown underlying values. The helper preserves value inference across heterogeneous column arrays without using `any`. Examples and installed-consumer type checks establish the generic boundary.

## Minimal usage

```tsx
import { Table, createTableColumn } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

type Usage = { id: string; team: string; seats: number; updated: Date };
const column = createTableColumn<Usage>();
const columns = [
  column({ id: 'team', header: 'Team', accessor: 'team' }),
  column({
    id: 'updated',
    header: 'Updated',
    accessor: (row) => row.updated,
    sortable: true,
    cell: ({ value }) => value.toLocaleDateString(),
  }),
  column({
    id: 'seats',
    header: 'Seats',
    accessor: 'seats',
    sortable: true,
    align: 'end',
    cell: ({ value }) => value.toFixed(0),
    cellStyle: { fontVariantNumeric: 'tabular-nums' },
  }),
];

export function UsageTable({ rows }: { rows: Usage[] }) {
  return (
    <Table
      rows={rows}
      columns={columns}
      getRowKey={(row) => row.id}
      caption="Team usage"
      defaultSort={{ columnId: 'seats', direction: 'desc' }}
    />
  );
}
```

For individual stylesheets, import `tokens.css`, `field.css`, `icon.css`, `checkbox.css`, `text-input.css`, `spinner.css` and `table.css`; consumer-rendered badges also need `badge.css`. The combined stylesheet includes these in dependency order. The public exports include `Table`, `createTableColumn`, `TableProps<T>`, `TableColumn<T>`, `TableColumnFactory<T>`, `TableCellContext<T, V>`, `TableRowContext<T>`, `TableFooterContext<T>`, `TableSort`, `TableSortValue`, `TableRowKey`, `TableStyle`, `TableStyles<T>` and `TableClassNames<T>`.

## Props and defaults

| Prop                                           | Type / default                                                           | Behavior                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `rows`                                         | Required `readonly T[]`                                                  | Consumer-owned original records; never mutated                                                 |
| `columns`                                      | Required `readonly TableColumn<T>[]`                                     | Ordered column definitions; at least one must be visible                                       |
| `getRowKey`                                    | Required `(row: T) => string \| number`                                  | Stable identity for rendering and selection; finite numbers and nonblank strings are supported |
| `caption` / `aria-label`                       | At least one required                                                    | Names the native table; caption may contain renderable content                                 |
| `captionHidden`                                | `false`                                                                  | Visually hides the caption while retaining its accessible name                                 |
| `density`                                      | `'comfortable'` / `'compact'`                                            | Comfortable 12px or compact 4px vertical cell padding                                          |
| `borders`                                      | `'horizontal'` / `'all'` / `'none'`                                      | Subtle horizontal dividers by default                                                          |
| `striped`, `hover`                             | Both `false`                                                             | Alternate-row and hover surfaces; selected rows keep precedence                                |
| `stickyHeader`                                 | `false`                                                                  | Native header cells remain sticky inside the scroll region                                     |
| `maxHeight`                                    | Optional CSS `maxHeight`                                                 | Constrains vertical scrolling; horizontal scrolling is always available when needed            |
| `scrollLabel`                                  | `'Scrollable table'`                                                     | Accessible name of the keyboard-focusable scroll region                                        |
| `className`, `style`                           | Optional wrapper class / `TableStyle`                                    | Scope one instance, including semantic variable overrides                                      |
| `classNames`, `styles`                         | Typed slot maps                                                          | Customize structure without replacing native elements or component handlers                    |
| `sort`, `defaultSort`                          | `TableSort \| null`; default `null`                                      | Controlled or initial uncontrolled sorting                                                     |
| `onSortChange`                                 | `(sort: TableSort \| null) => void`                                      | Reports the requested column/direction, including unsorted `null`                              |
| `sortMode`                                     | `'client'` / `'manual'`                                                  | Client reorders a copy; manual preserves supplied row order                                    |
| `selectionMode`                                | `'none'` / `'single'` / `'multiple'`; default `'none'`                   | Enables named native row checkboxes                                                            |
| `selectedRowKeys`, `defaultSelectedRowKeys`    | `readonly TableRowKey[]`; default `[]`                                   | Controlled or initial stable selection                                                         |
| `onSelectionChange`                            | `(keys: TableRowKey[]) => void`                                          | Reports a new selection array without mutating the old one                                     |
| `isRowSelectable`                              | `(row: T) => boolean`; default all                                       | Disables unavailable row controls and excludes them from select-all                            |
| `getSelectionLabel`                            | `(row: T) => string`                                                     | Defaults to `Select row {key}`; use meaningful domain labels when keys are opaque              |
| `selectAllLabel`                               | `'Select all selectable rows'`                                           | Names the multiple-mode header checkbox                                                        |
| `searchable`                                   | `false`                                                                  | Enables local filtering and the visible, labeled search field                                  |
| `searchValue`, `defaultSearchValue`            | `string`; default `''`                                                   | Controlled or initial query                                                                    |
| `onSearchChange`                               | `(query: string) => void`                                                | Reports the editable query                                                                     |
| `searchableColumns`                            | Optional `readonly string[]`                                             | Restricts default matching to those visible accessor-column IDs                                |
| `searchFunction`                               | `(row: T, query: string, columns: readonly TableColumn<T>[]) => boolean` | Replaces default matching; receives the raw query and eligible columns                         |
| `searchLabel`, `searchPlaceholder`             | `'Search table'`, `'Search…'`                                            | Name and visible hint for the search input                                                     |
| `loading`, `loadingMessage`                    | `false`, `'Loading rows…'`                                               | Gives loading precedence; the status is announced outside the busy table                       |
| `loadingState`, `emptyState`, `noResultsState` | Optional `ReactNode`                                                     | Defaults to a decorative Spinner/message, `No rows yet.`, and `No matching rows.`              |

Ordinary native table attributes such as `id`, `title`, `data-*` and ARIA descriptions go to the table; `className` and `style` scope its wrapper. Native semantic structure, busy state, caption, sort buttons and selection controls remain component-owned. Children, injected HTML and custom table roles are excluded.

## Column definitions

Each column has required `id: string` and `header: ReactNode`. `accessor` is an optional property key or `(row: T) => value`. Without an accessor, supply `cell` for a display/action column; otherwise the cell is blank. `cell` receives `{ row, value, rowKey, rowIndex, selected, columnId }`; the row is the original object, `value` is unformatted, and `rowIndex` is its displayed position. The factory pairs the renderer with its property/computed value before storing heterogeneous columns. Direct `TableColumn<T>` renderers receive `unknown` values and must narrow them; row fields remain inferred. No `any` is needed.

`footer` accepts a node or `({ rows }) => ReactNode` over displayed, filtered/sorted rows. Footers are hidden while loading. `hidden` omits a column everywhere, including message spans and default search. `align` is `'start'` (default), `'center'` or `'end'`. `width`, `minWidth` and `maxWidth` use native CSS property types and apply to headers and cells within the browser's intrinsic table layout. Long content may wrap, and the region scrolls horizontally when column constraints exceed the available width.

`sortable` defaults to false. Default sorting compares numbers numerically, Date values chronologically and other values lexically, with missing values first in ascending order. Equal values retain source order. `sortValue(row)` supplies an independent primitive/Date sort value; `compare(a, b)` compares original rows and takes precedence. Cell formatting never changes the value being sorted. Header and cell overrides use `headerClassName`, `cellClassName` and `cellStyle`; cell overrides may be static or data-aware.

Column IDs must be unique/nonblank, row keys must be unique/nonblank/finite, a sort must identify a sortable column, and single selection accepts at most one selected key. Invalid structural input throws rather than silently changing identities or rendering invalid empty headers. Use immutable column/row definitions; replace them when data changes.

## Opt-in state behavior

Sortable native header buttons cycle ascending → descending → unsorted; choosing another column starts ascending. Only the active header exposes `aria-sort`. Enter and Space use native button activation. Manual mode reports the same sort requests and still filters locally, but leaves ordering to the consumer. A controlled `null` sort stays unsorted until the parent accepts a change.

Selection never depends on rendered row position and is not pruned by search, sorting or server-supplied subsets. Multiple-mode select-all toggles only selectable rows in the current filtered result. It preserves other keys and shows a native mixed state when some current selectable rows are chosen. Single mode permits zero or one selected row; checking another replaces the old key, and unchecking clears it. Row/cell clicks do not select; embedded links and buttons keep their own actions.

Default search trims the query for matching, compares visible underlying accessor values case-insensitively, and ignores formatted cell content. Explicit column IDs further restrict that visible set. A custom matcher may deliberately inspect other row fields. Empty/whitespace queries show all records. Search-disabled tables ignore an initial query. The field stays editable while loading or showing no results, and a polite status announces result counts. Loading takes precedence over empty/no-results content, keeps headers mounted and disables header select-all. A state cell spans visible columns plus the optional selection column.

## Styling specific columns, rows and instances

The slot keys are `wrapper`, `scrollRegion`, `table`, `caption`, `toolbar`, `headerRow`, `headerCell`, `bodyRow`, `cell`, `footer` and `stateContent`. `bodyRow` accepts a static override or a callback receiving `TableRowContext<T>`; `cell` accepts a static override or a callback receiving `TableCellContext<T>`. Other slots are static. Header-cell slots also apply to the selection header. Body-cell callbacks receive `columnId: '$selection'` and the boolean checked value for selection cells, with the same original row/selection context. Styles accept semantic `--fs-*` variables as well as ordinary CSS properties.

```tsx
const columns = [
  column({ id: 'team', header: 'Team', accessor: 'team' }),
  column({
    id: 'seats',
    header: 'Seats',
    accessor: 'seats',
    align: 'end',
    headerClassName: 'seat-heading',
    cellClassName: 'seat-count',
    cellStyle: ({ row }) => ({ fontWeight: row.seats < 10 ? 700 : 400 }),
  }),
];

<Table
  rows={rows}
  columns={columns}
  getRowKey={(row) => row.id}
  caption="Team usage"
  style={{ '--fs-table-header-surface': 'var(--fs-badge-info-background)' }}
  classNames={{ bodyRow: ({ row }) => (row.id === 'review' ? 'needs-review' : undefined) }}
  styles={{ bodyRow: ({ selected }) => (selected ? { fontWeight: 600 } : undefined) }}
/>;
```

Built-in classes remain alongside supplied classes. Column constraints/alignment apply first, instance cell styles next, and column-specific cell styles last. Wrapper slot styles override the top-level `style`. Use theme-aware semantic variables rather than fixed light/dark colors. Selected surface/foreground/control-accent roles are `--fs-table-row-selected`, `--fs-table-row-selected-fg`, and `--fs-table-row-selected-border`; focus uses `--fs-table-focus-*`. Theme boundaries reset the same complete token contract. The portfolio uses existing success/info/neutral Badge tones, with display-only size/radius overrides in its story.

## Examples and accessibility

Storybook includes the exact five portfolio fields in both themes, unrelated inventory columns, computed cells/footers, compact stripes/borders/hover, instance/row/column styling, controlled and manual sorting, filtered/single selection, sticky headers, narrow scrolling and loading/empty/no-results states. The main portfolio story renders the package-root Table export with shared columns and markup; installed React 18/19 consumers independently verify package-root imports and generic inference, including rejected invalid accessor keys and renderer types.

Native table, caption, header, body, cell and footer relationships remain intact. A focusable named scroll region supplies keyboard access to overflow without replacing the table with a grid. Selection controls have row-specific labels and disabled states; sorting remains a native button. A hidden caption uses visual clipping rather than `hidden`/`display:none`. Forced colors preserve selected-row boundaries and keyboard focus. No motion is added; the existing decorative Spinner follows the motion foundation. Actual screen-reader speech remains a manual verification gap alongside automated semantic, keyboard and accessibility checks.

See the [verification record](table-verification.md) for executed commands, scope, timings, regression evidence and remaining manual limits.
