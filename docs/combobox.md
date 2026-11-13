# Combobox

Combobox owns one searchable selection. The supplied one-page design and [reference behavior](https://themed-react-ui-foundation.replit.app/?path=/docs/components-combobox--docs) approve the inset field label, aligned single-select popup, active-row accent and feedback states. TextInput supplies the field roles, MultiSelect supplies the existing search/navigation helpers and popup tokens, Field primitives supply labels/messages, and Spinner/CloseIcon supply decorative artwork. No new theme tokens or motion are introduced.

```tsx
<Combobox
  label="Service region"
  name="region"
  options={[{ label: 'United Kingdom', value: 'gb' }]}
  required
/>
```

## Selection and query

`options` contains unique, nonempty string `value`s, visible nonblank `label`s and optional `disabled`. Invalid option identities, missing selected identities and invalid custom-filter output throw clear errors. An empty string represents no selection. `value` with `onValueChange(value)` controls selection; `defaultValue` initializes an uncontrolled field. Defaults are read at mount. Options may include disabled selected values, which retain their labels but cannot be chosen again.

Query text is separate from selection. Focus opens all choices when a selection is committed. Typing filters labels case-insensitively and immediately clears the selected identity, notifying `onValueChange('')` once. Only choosing an enabled option commits its value, replaces the query with the full label and closes the list while keeping input focus. `filterOptions(options, query)` can customize matching/order; it must return unique options from the original collection, whose canonical labels and disabled flags remain authoritative.

The unnamed search input never submits query text. A hidden successful input exists under `name` only while an option is selected. Editing or clearing removes that entry immediately, including while a controlled parent is acknowledging the cleared value. The controlled parent should accept the empty sentinel. New controlled selections replace the draft. `form` supports external form ownership. Native reset restores the mount default without notifying a selection change, honors cancellation, and preserves controlled authority.

`allowClear` defaults to true. `clearLabel` defaults to “Clear selection”; clearing empties the field, opens the list and returns focus to the input. It also clears uncommitted query text. `disabled` retains visible text, prevents changes and removes the value from submission. `readOnly` retains text with no popup or enabled clear action.

## Keyboard and accessibility

A visible native label names the editable combobox. The popup is a single-select listbox, with instance-unique option IDs and `aria-activedescendant`; focus remains on the input. Arrow keys wrap through enabled matches, Home/End choose the first/last highlight while open, and Enter commits. Highlighting alone never changes selection. Escape closes and restores the current selected label, or empties a draft whose selection was cleared. Tab closes and continues normally. Ordinary text-editing keys and IME composition remain native. Consumer keyboard handlers may prevent the component action.

`description`, `error`, `invalid`, `aria-describedby` and `aria-invalid` follow the field conventions. Errors imply invalid presentation and native custom validity. `required` stays natively invalid until an option is chosen, even when a typed label exactly matches. The caller owns when to show validation errors. Native invalid events and browser focus behavior remain available.

`loading` replaces choices with a decorative small Spinner beside one announced `loadingMessage` (default “Loading options…”). Once loading finishes, zero matches show `noResultsMessage` (default “No matching options.”). Loading cannot commit a highlighted choice. Status text remains outside the listbox's option collection.

## Styling and examples

`size` is `small`, `medium` (default), or `large`. `className`/`style` customize the control; `wrapperClassName`/`wrapperStyle` customize the field wrapper. `ComboboxStyle` permits semantic CSS variable overrides. Reuse TextInput roles for control text, boundaries, focus, spacing and sizes, and MultiSelect roles for popup placement, active tint and row padding. Labels wrap; the popup remains field-width; long option labels wrap without horizontal scrolling. Forced colors preserve the active accent and focus outline. No animation is added; the reused Spinner respects the motion foundation.

Storybook includes the Corporate/Luna `uni` search, selected/clear, loading, no results, required validation, invalid/disabled fields, disabled options, long labels, custom filtering and controlled state. The paired design sheet uses independently interactive fields; each popup follows its own focus. The [browser behavior matrix](../tests/browser-behavior-matrix.md) records verification ownership. Actual screen-reader speech remains a manual verification gap; semantic assertions and automated accessibility checks do not certify it.

See the [verification record](combobox-verification.md) for commands, observed timings, repaired checks and remaining manual verification limits.
