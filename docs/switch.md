# Switch

The supplied Switch reference approves an immediate on/off setting with a stable visible label, optional description, clickable label area, and off/on/hover/focus/disabled states. Use Checkbox for selecting items in a list. Independent `switch.*` semantic roles provide a 40 × 24px pill track, 20px circular thumb, 44px minimum label hit area, and an 8px label gap. Corporate uses blue on-state tracks and light thumbs; Luna uses lavender on-state tracks and dark thumbs. Off tracks retain a visible boundary and thumb contrast. Position and color both convey state; no animation is required.

`Switch` renders a native `input type="checkbox" role="switch"`. Its checked property supplies the exposed on/off state; there is no independent ARIA state or mixed state. Use `defaultChecked` for uncontrolled settings or `checked`/`onChange` for consumer-owned settings. Keep the label unchanged across both states. Space and label/description clicks toggle the setting; Tab moves between enabled controls. Disabled controls retain their state and native form omission behavior. Native name/value/form, submission/reset, required validation, refs, and compatible input attributes remain available. Read-only and indeterminate are unsupported.

Switch composes the existing field label and description primitives. IDs remain instance-specific across server rendering and hydration. External `aria-describedby` context is preserved. Native input classes/styles and wrapper classes/styles support scoped token customization. Parents own placement and sibling spacing. No new validation/error visual pattern is introduced; FormGroup can provide shared context through its render prop.

```tsx
<Switch
  label="Email notifications"
  description="Receive updates about your projects."
  name="notifications"
  value="email"
  defaultChecked
/>
```

Import `fletchstack-ui/styles.css`, or tokens.css + field.css + switch.css. Keep track/thumb contrast, focus clearance, and usable hit areas when customizing. Custom dimensions should preserve a thumb that fits inside the track.

## Verification

The named off-switch test failed against a plain unlabeled checkbox, then passed after adding the visible label relationship and native switch role. Full unit verification passed 374 tests; integration passed 148 tests, including SSR and controlled hydration. Both independently reached 100% per-file statements, branches, functions, and lines. All 171 Storybook interaction/axe checks passed. Lint, type checks, package/Storybook builds, and packed React 18/19 public types/CSS/SSR/bundle-isolation checks passed.

Both theme panels were visually inspected. Browser journeys exercise native Space/Tab, stable names, label/description activation, on/off thumb movement, 40 × 24px track and 20px thumb sizing, track/thumb/focus contrast, disabled fieldsets, controlled consumer state, successful form values, external ownership/reset, theme isolation, forced colors, RTL placement, customization, and 320px reflow with 200% text and user text spacing. The disabled-fieldset check uses real pointer coordinates because Playwright's locator actionability guard rejects disabled descendants before a click can occur; state assertions remain unchanged. Real screen-reader output and non-Chromium behavior remain unverified.

The final full Chromium run passed all 303 tests with `npm run test:e2e -- --workers=3`, and every scoped library/Storybook module reached 100% statements, branches, functions, and lines. At default concurrency, a preceding run passed all Switch checks but encountered two existing Storybook readiness timeouts (Foundation documentation and Button theme coexistence). The final run reduced simultaneous browser workers; no assertions, coverage scopes, timeouts, or retry settings were relaxed.
