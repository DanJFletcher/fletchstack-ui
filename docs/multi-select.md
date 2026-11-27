# MultiSelect

Search and choose several named values from a fixed set of options. Each selection becomes a removable tag. The query filters labels; it never becomes a submitted value.

```tsx
import { MultiSelect } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/field.css';
import 'fletchstack-ui/icon.css';
import 'fletchstack-ui/multi-select.css';

<MultiSelect
  label="Article topics"
  name="topics"
  options={[
    { value: 'react', label: 'React' },
    { value: 'design', label: 'Design systems' },
    { value: 'archive', label: 'Archived', disabled: true },
  ]}
  defaultValue={['react']}
  maxSelections={3}
  helperText="Choose up to three topics."
/>;
```

Use `styles.css` instead of the three individual imports when including the whole library. Both Corporate and Luna themes support the same contract.

## Selection and forms

`value` and `onValueChange` provide controlled state; `defaultValue` initializes uncontrolled state. Callbacks receive a fresh string array. The forwarded ref points to the search input. `name` generates one hidden input per selection, preserving selection order. `FormData.getAll(name)` retrieves the values. `form` associates both search and hidden inputs with an external form. Native reset restores the uncontrolled mount defaults and clears the query; controlled values remain parent-owned. A cancelled reset changes nothing. Disabled values are omitted when the component or its fieldset is disabled.

Options and selected values must have unique values. Unknown selected values are rejected unless `loading` is true; pending tags then display their raw values until labels arrive. Option labels are plain strings. Explicitly disabled options cannot be toggled or removed, including by Clear or Backspace.

`required` requires at least one selection. `minSelections` sets a greater minimum and `maxSelections` caps additions. Limits must be nonnegative integers and the effective minimum cannot exceed the maximum. A parent can retain existing controlled values above a reduced maximum; the component never silently discards them. At the cap, unselected options expose `aria-disabled` and cannot be added, but remain navigable. Selected enabled options can still be removed.

Minimum violations are immediately visible, associated with the input, and applied through native custom validity. Typing without selecting never satisfies validation. An explicit `error` takes precedence. `helperText` and external `aria-describedby` descriptions compose with error and limit descriptions.

## Keyboard and accessibility

The visible label names a combobox controlling a multiselectable listbox. Focus stays on the input; `aria-activedescendant` identifies the active option. Focus opens the popup; arrows navigate and wrap, skipping explicitly disabled options. Home/End navigate boundaries while open. Enter toggles the active option and clears the query. Escape closes; Tab leaves normally. Empty-query Backspace removes the last enabled selection. Tag removal and Clear return focus to the input. Leaving the composite closes the popup. IME composition and prevented keyboard events retain their native behavior.

Use `filterOptions(options, query)` for custom matching. The default performs trimmed, case-insensitive label substring matching. `loading`, `loadingMessage`, `noResultsMessage`, `minSelectionsMessage(count)`, `maxSelectionsMessage(count)`, `removeLabel(option)` and `clearLabel` support asynchronous data and localization. `allowClear={false}` hides the clear action. Disabled and read-only states block editing. `small`, `medium` (default), and `large` size the control; tags wrap and the popup scrolls inside the control width.

`className` and `style` customize the control; `wrapperClassName` and `wrapperStyle` customize the field. The component owns input type, role, naming, query, and popup ARIA attributes. Override semantic `--fs-multi-select-*` properties for scoped customization; no JavaScript theme state is required.

## Verification boundaries

DOM unit contracts verify selection policy and interactions. Integration contracts render on the server and hydrate before exercising those same public behaviors, rejecting recovery errors. Harness browser journeys verify native validity, repeated form values/reset, real keyboard/pointer focus, theme contrast, forced colors and 320px reflow with enlarged text. Storybook render/play/axe checks exercise the documented states. Packed-package checks cover CSS exports, types and deterministic SSR under React 18 and 19. Automated accessible-name and relationship checks do not replace testing with a screen reader.

The Corporate/Luna composition was visually inspected at a 1152px viewport. Real Chromium journeys exercise keyboard focus, active-option scrolling, 320px reflow with 200% text and spacing overrides, and forced colors. Storybook axe checks cover the documented loading, empty, disabled, error, minimum, limit and selected states. Spoken output with a screen reader has not been manually verified.
