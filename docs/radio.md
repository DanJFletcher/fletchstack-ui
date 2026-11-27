# Radio

The supplied Radio reference is the approved pattern: choose one option from a mutually exclusive group, with a visible clickable label, optional description, errors, focus, hover, and disabled states. Corporate uses blue selection; Luna uses lavender on navy. Independent `radio.*` semantic roles use the existing palette and typography primitives, with 20px circular controls, a 10px selected dot, 44px minimum label hit areas, and an 8px label gap. A circle stays circular in both themes.

`Radio` owns one native `input type="radio"`. Pass the same `name` and distinct `value`s to related options. Use `defaultChecked` for uncontrolled selection or `checked`/`onChange` for consumer-owned state. Native behavior owns exclusivity, validation, submission/reset, Tab entry/exit, arrow-key selection, Space selection, and disabled skipping. There is no extra keyboard handler or group state. Do not switch between controlled and uncontrolled ownership.

Compose with `FormGroup` for a visible fieldset legend. Its render prop links shared descriptions and errors to each option. Per-option `description`, `error`, external `aria-describedby`, and `aria-invalid` are supported. Visible label text owns the accessible name; descriptions do not become part of it. Input refs, native form attributes, wrapper/input classes and styles, and scoped semantic custom properties are available. Parents own sibling placement and gaps. Read-only and indeterminate states are not supported by native radio controls.

```tsx
<FormGroup legend="Delivery method" description="Choose one option.">
  {(control) => (
    <>
      <Radio
        {...control}
        label="Standard delivery"
        description="Arrives in 3–5 business days."
        name="delivery"
        value="standard"
        defaultChecked
      />
      <Radio {...control} label="Express delivery" name="delivery" value="express" />
    </>
  )}
</FormGroup>
```

Import `fletchstack-ui/styles.css`, or tokens.css + field.css + radio.css (and form-group.css when composing FormGroup). Preserve contrast, focus clearance, visible labels, and minimum hit areas when customizing. Screen-reader and non-Chromium verification will be recorded separately from automated checks.

## Verification

The visible-name test failed against an unlabeled native radio, then passed after composing FieldLabel and an instance-specific label relationship. Full verification passed 349 unit tests, 137 integration tests, 142 Storybook interaction/axe checks, and 248 Chromium browser tests. Unit, integration, and browser coverage each independently reached 100% per file without changing thresholds or exclusions. Two pre-existing integration browser fixtures timed out while builds overlapped; the complete integration suite passed when rerun without overlapping builds, with timeouts and retries unchanged.

Browser journeys cover native Tab/arrow/Space behavior, disabled skipping, exclusive selection, shared invalid/description relationships, required validation, external form ownership, submission/reset, circular control dimensions, theme isolation, forced-colors dot visibility, and 320px reflow with 200% text and user text spacing. Both theme panels were visually inspected. Type checks, lint, package/Storybook builds, and packed React 18/19 public types/CSS/SSR and bundle-isolation checks passed. Real screen-reader output and non-Chromium browsers remain unverified.
