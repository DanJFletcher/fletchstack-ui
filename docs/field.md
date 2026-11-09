# Field primitives

Approved by the extraction request: expose FieldLabel, FieldDescription, FieldError, and a composed Field using the existing visible-label and helper/error patterns. Preserve the existing Checkbox, TextInput, Select, and FormGroup APIs, layouts, native semantics, IDs, message ordering, and component token overrides.

FieldLabel is a native label with required htmlFor. FieldDescription and FieldError render paragraphs by default and accept `as="span"` for inline content inside a checkbox label. They accept native attributes, refs, classes, and typed token overrides. They do not announce on mount or add keyboard stops. FieldError styles a message; association and invalid state belong to the field composition.

Field supplies a visible label, optional helper/error messages, wrapper attributes/ref, and a required children render prop. Spread the supplied id, aria-describedby, and aria-invalid onto exactly one native labelable control. The Field `id` identifies that control; its ref points to the wrapper. Additional consumer description IDs precede helper/error IDs. `descriptionIds` links additional context such as adornments. `classNames` customizes label/helper/error slots. The caller owns the control, native disabled/required/value behavior, and any control border/focus styling. Do not nest the existing fully labeled controls inside Field.

```tsx
<Field label="Notes" helperText="A short project summary." error={error}>
  {controlProps => <textarea {...controlProps} name="notes" />}
</Field>

<FieldLabel htmlFor="custom-name">Project name</FieldLabel>
<input id="custom-name" aria-describedby="name-hint name-error" aria-invalid="true" />
<FieldDescription id="name-hint">Use a short name.</FieldDescription>
<FieldError id="name-error">Enter a project name.</FieldError>
```

The internal accessibility hook generates instance-specific IDs and combines description references and validation state. It is shared by Field, Checkbox, and FormGroup; TextInput and Select compose Field. Checkbox keeps its clickable label and inline description; FormGroup keeps native fieldset/legend semantics. TextAdornment remains private.

Both themes provide independent `field.*` semantic roles matching current form typography, muted/error colors, and 8px internal spacing. Existing component styles retain their own token roles and class hooks. Import combined styles or tokens plus field.css for standalone primitives; existing separate component stylesheet imports continue working without adding field.css.

## Verification

The pre-refactor component baseline passed all 142 tests. The initial Field label-association test failed with an unnamed textbox before implementation and passed afterward. All 300 unit tests and 108 integration tests passed with 100% per-file statement, branch, function, and line coverage. Existing component tests retain their public assertions. Integration tests exercise existing separate stylesheets without field.css.

All 105 Storybook interaction/axe checks passed with accessibility failures configured as errors. Focused browser checks passed in both themes for native editing and label activation, default/error/disabled/read-only/hidden states, linked messages, slot/token customization, inline checkbox descriptions, and reflow at 320 CSS pixels with 200% text and user spacing. Both theme layouts were visually reviewed; the refactored FormGroup screenshot is byte-for-byte identical to its prior screenshot. Storybook's prose margin rule excludes field messages so it cannot change their internal gaps.

All 168 full browser regression tests passed with 100% per-file browser statement, branch, function, and line coverage. Package and Storybook builds, TypeScript, lint, public consumer fixtures, and icon tree-shaking passed. Real screen-reader output remains unverified.
