# Select

The user's Select design authorizes a single-choice field with a visible label, selected value or placeholder, chevron, helper text, linked validation error, hover/focus/disabled states, and Corporate/Luna themes. Existing Button and Icon cover action/artwork semantics but do not provide a form field. This records the new field pattern before implementation.

Use a native select for keyboard navigation, typeahead, disabled options, form submission/reset, and browser validation. Its popup remains browser/OS rendered: option-row geometry, highlight, checkmark, and popup placement are platform controlled. The closed field follows the provided 44px minimum height and 16px body size. Font sizes use rem; the control grows with enlarged text. No custom popup, search, multi-selection, or asynchronous option loading is included.

`Select` requires `label` and accepts native `option`/`optgroup` children. Optional `placeholder` renders an empty, disabled prompt; use an actual empty option instead when clearing is allowed. `value`/`defaultValue` are strings; `onChange`, `name`, `form`, `required`, `disabled`, native attributes, and the HTMLSelectElement ref remain available. `size` selects small/medium/large field geometry, rather than native listbox rows. Native multiple selection is excluded from this single-choice pattern.

`helperText` and `error` are optional strings. Error sets aria-invalid and is appended to the field's aria-describedby alongside helper text and any consumer description. IDs use React useId unless an explicit id is supplied. Visible labels use native label/htmlFor; label activation focuses the select. Consumers own when errors appear and should not communicate validity through color alone. The field is not a live region by default.

The field owns its label/control/message spacing and chevron clearance; the parent owns placement, width, and spacing between fields. className and style apply to the native control; wrapperClassName and wrapperStyle customize the complete field, including inherited semantic overrides. Use independent select.* semantic roles for shape, type, spacing, control states, muted text, errors, and focus. Both themes define the same contract using direct primitive aliases.

```tsx
import { Select } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Select label="Workspace" name="workspace" placeholder="Choose a workspace"
  helperText="Choose where your project lives." required>
  <option value="personal">Personal</option>
  <option value="design">Design team</option>
  <option value="engineering">Engineering</option>
  <option value="archived" disabled>Archived</option>
</Select>
```

For separate styles import tokens.css, select.css, and icon.css (Select composes ChevronDownIcon). Preserve native accessible naming, target size, and contrast when customizing. Real screen-reader and cross-platform native-popup review supplement automated checks.

## Verification

The visible-label test failed with an unnamed combobox before its native association was implemented, then passed. Helper/error descriptions, invalid state, prompt selection, and whole-field hiding were also observed failing before implementation and passing afterward. Native choice, disabled-option handling, controlled change notification, and forwarded focus are covered through React Testing Library.

Unit and integration suites meet the repository's 100% per-file coverage gates. Integration checks render Select on the server and confirm both themes before hydration. Library and Storybook production builds, type checks, lint, and package-consumer checks pass. All 57 Storybook interaction/axe checks pass; the CI workflow runs accessibility checks as errors. The final full Chromium run passed all 99 tests and the 100% per-file browser coverage gate. Corporate and Luna compositions were visually inspected, and the default field measured 44px high with 16px text.

Chromium checks cover native typeahead, focus traversal, linked consumer/helper/error descriptions, all documented compositions, and 320px reflow with 200% text and WCAG text-spacing overrides. Popup arrow/Enter/Escape behavior could not be verified in macOS headless Chromium: the same failure to change selection with popup arrow keys was reproduced on a bare native select. This remains a platform verification gap; Select installs no keyboard handlers and retains native behavior. Real screen-reader and cross-platform popup review remain unverified.
