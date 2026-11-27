# Checkbox

The user's Checkbox reference approves independent boolean choices, a clickable visible label and description, checked/unchecked/indeterminate states, validation errors, disabled choices, clear keyboard focus, and Corporate/Luna themes. Existing Select and TextInput establish field conventions but do not express independent choices. This records the new pattern before implementation.

Checkbox wraps a native input type="checkbox". It requires a visible `label`, accepts optional `description` and `error` strings, and forwards native checked/defaultChecked, onChange, name, value, required, disabled, form, and HTMLInputElement ref behavior. `type`, children, native character size, readOnly, and ARIA naming/checked overrides are excluded: the visible label and native state own these semantics. Use disabled to prevent changes; native checkbox readOnly does not prevent toggling.

The native label includes control, text, and description and supplies at least a 44px hit area. The control is 20px with an 8px label gap. The checkbox owns internal spacing; parents own placement and spacing between options. Text wraps and the target grows. The control's vertical alignment derives from the current label's 1em font basis and semantic line height, centering it against the first line even with enlarged text.

React useId creates instance-specific label/description/error relationships unless id is supplied. aria-labelledby names only the label text; descriptions remain supplementary. Consumer aria-describedby is preserved before the description/error IDs. Errors set aria-invalid; consumers own when errors appear. Errors are not live regions by default. The complete field follows hidden. className/style apply to the native control; wrapperClassName/wrapperStyle customize all field tokens.

`indeterminate` synchronizes the native input property on mount and when the prop changes. Native activation clears that property; derive checked and indeterminate from the selected children for a Select all control. Mixed state affects presentation/accessibility, not form submission, which follows checked. HTML cannot encode native indeterminate: server markup starts with the checked/defaultChecked value and gains mixed state after client mounting/hydration. No conflicting aria-checked surrogate is emitted.

Space toggles the focused control, Tab follows document order, clicking anywhere in the label toggles, and disabled options cannot change. Use native fieldset/legend to group related choices. Group validation and Select all logic belong to the consumer, not this atomic component. The Storybook group example demonstrates none/some/all choices without extra keyboard conventions.

Independent checkbox.* semantics in both themes define surfaces, text, borders, selected/hover/disabled palettes, check/dash colors, errors, focus, typography, hit area, control geometry, and spacing. All alias primitives directly. The shared CheckIcon and Icon draw decorative marks. Forced colors use system colors for native-like boundaries, marks, and focus. Leave clearance around focus outlines when placing the component.

```tsx
import { Checkbox } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Checkbox
  label="Email updates"
  name="channels"
  value="email"
  description="Receive product news and tips."
  defaultChecked
/>;
```

Separate stylesheet consumers import tokens.css, icon.css, and checkbox.css. Marks are decorative and create no keyboard stops.

## Verification

The visible-name, description/error relationship, label/description activation, and mixed-state tests were observed failing before implementation, then passing. React Testing Library also verifies disabled choices, controlled change notifications, native refs, prop-driven mixed-state changes, and complete-field hiding. Unit and integration suites meet the repository's 100% per-file coverage gates.

Integration checks hydrate real server-rendered markup in Chromium, verify both themes' mixed-state palettes, confirm native activation clears mixed state, and exercise the forwarded input ref. A DOM hydration check also verifies the client-only native property through the instrumented React entry point. No recoverable hydration errors were observed.

All 91 Storybook interaction/axe checks pass; the existing CI configuration treats accessibility violations as errors. Production library/Storybook builds, type checks, lint, public consumer type/SSR/CSS-export checks, and icon tree-shaking checks pass. Corporate/Luna compositions were visually inspected in Chromium.

Browser checks verify native Space and Tab, label/description clicks, disabled-field skipping, group none/partial/all transitions, errors on hover, 20px controls, 44px minimum targets, 8px gaps, and hovered selected controls in forced colors. Reflow passes at 320px with 200% text and WCAG text-spacing overrides in both themes. Real screen-reader review remains unverified.

The final complete Chromium regression run passed all 150 tests and the 100% per-file browser coverage gate. The earlier focused group run was interrupted by a Storybook reload during concurrent token generation; its standalone rerun and the final complete run passed.
