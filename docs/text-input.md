# TextInput

The user's Text Input reference approves a native single-line text field with a visible label, example placeholder, helper/error messages, optional textual prefix, clear hover/focus states, read-only selection, and disabled editing. Select establishes field conventions but cannot edit text. This records the new pattern and independent textInput.* token roles before implementation.

TextInput defaults to type="text" and supports text, email, password, search, tel, and url types. Native value/defaultValue, onChange, name, form, required, readOnly, disabled, autocomplete, pattern, inputMode, length constraints, selection, and the HTMLInputElement ref remain available. `size` selects small/medium/large geometry instead of native character width. The default control has a 44px minimum height, 16px text, and 12px horizontal padding. Dimensions grow with text; the parent owns field placement and external spacing.

`label` is required and remains visible. `placeholder` supplies an example, never the accessible name. `helperText` and `error` are optional strings. Error sets aria-invalid; descriptions append consumer aria-describedby, prefix/suffix text, helper text, and error text. React useId generates instance-specific IDs unless id is supplied. The consumer owns when validation messages appear; errors are not live regions by default.

Optional `prefix` and `suffix` are non-editable strings, such as https:// or kg. They are included in the accessible description and wrap when needed. They are not part of the input value or form submission: the consumer assembles a complete URL or quantity as needed. Interactive adornments and multiline editing are outside this pattern.

Native Tab, typing, cursor movement, selection, and form behavior are preserved. Read-only fields stay focusable/selectable and submit their value; disabled fields cannot be edited and do not submit. No custom keyboard handlers, filtering, formatting, or password reveal behavior is installed.

className/style apply to the native input. wrapperClassName/wrapperStyle customize the complete field, including its enclosing control border and semantic tokens. Both themes declare independent textInput.* roles for control surfaces/states, text, placeholder, adornments, typography, shape, spacing, focus, and size. Roles alias primitives directly. Corporate uses white/ink/blue focus and 4px corners; Luna uses navy/pale/gold focus and 12px corners.

```tsx
import { TextInput } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<TextInput label="Project name" name="project" placeholder="Enter a project name"
  helperText="Use a short, descriptive name." required />
<TextInput label="Website" name="domain" prefix="https://" defaultValue="example.com" />
```

Separate stylesheet consumers import tokens.css and text-input.css. Preserve visible labels, meaningful descriptions, contrast, and focus clearance when customizing.

## Verification

The test “names the field using its visible label” failed with an unnamed textbox before its native label association was implemented, then passed. Helper and combined consumer/prefix/suffix/helper/error description tests also failed before implementation and passed afterward. React Testing Library covers typing, read-only/disabled editing, refs, and hidden fields.

Unit and integration suites meet the repository's 100% per-file coverage gates. Server-rendered fields use the correct theme before hydration. Library and Storybook production builds, type checks, lint, and public consumer type/SSR/CSS-export checks pass. All 74 Storybook interaction/axe checks pass; the existing CI configuration treats accessibility violations as errors.

Focused Chromium checks pass for native keyboard editing, read-only text selection, disabled-field tab skipping, error-border hover precedence, described adornments, and all 17 documented examples. Reflow passes at 320px with 200% text and WCAG text-spacing overrides in both themes. The default control measures 44px high with 16px text and 12px horizontal padding. Corporate/Luna compositions were visually inspected in Chromium. Real screen-reader review remains unverified.

The complete Chromium regression suite passed all 124 tests and its 100% per-file browser coverage gate. A packaging check exposed unused ChevronDown artwork retained through Select's forwardRef registration; pure annotations on Select and TextInput allow bundlers to discard unused registrations without changing rendered behavior.
