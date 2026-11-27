# FormGroup

Approved from the supplied Form Group reference: related controls share a visible legend, optional description, helper text, and error message. Use a native fieldset, without adding a keyboard stop. Disabled groups disable their native descendants and exclude them from submission. Controls retain their own keyboard behavior.

The default layout stacks controls with a 12px gap; `orientation="horizontal"` wraps them. Legend/context spacing is 8px. The parent supplies the proposed 24px between groups. The dashed boundaries in the anatomy reference are explanatory, so the component has no decorative border or background by default. Both themes use semantic text and error colors.

```tsx
<FormGroup
  legend="Notification channels"
  description="Choose how to hear from us."
  helperText="You can change these later."
  error={error}
>
  {(controlProps) => (
    <>
      <Checkbox {...controlProps} label="Email" name="channels" value="email" />
      <Checkbox {...controlProps} label="SMS" name="channels" value="sms" />
    </>
  )}
</FormGroup>
```

The render prop supplies `aria-describedby` linking all group messages and any consumer-supplied description IDs. Spread it onto each control, merging with any additional consumer IDs as needed. It supplies `aria-invalid` when the group has an error (or an explicit invalid state). Each library control preserves these attributes alongside its own messages. Ordinary React children are supported too; those controls must receive their own description relationships when needed. Nested groups are independent; explicitly pass the outer relationships when they apply.

`legend` is required. Optional `description`, `helperText`, and `error` accept strings. Native fieldset attributes, a native ref, `className`, and token-aware `style` are supported. Put controls in children, not in the legend, so native disabled fieldset semantics apply consistently. Import `fletchstack-ui/styles.css`, or tokens plus `form-group.css` and the styles for composed controls.

Verification: the initial native-group test failed before implementation and passed afterward. All 281 unit tests and 105 integration tests passed with 100% per-file coverage. All 97 Storybook interaction/accessibility checks passed with axe failures configured as errors. Eight focused browser checks passed across Corporate and Luna: native Tab/Space and radio arrow keys, shared message associations, disabled descendants, layout tokens, 320px reflow with 200% text and user spacing overrides. All 158 browser regression tests passed with 100% per-file browser coverage. Both theme layouts were visually reviewed. Package build, Storybook build, TypeScript, lint, public consumer fixtures, and icon tree-shaking passed. Real screen-reader output remains unverified.
