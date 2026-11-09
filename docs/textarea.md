# Textarea

Approved from the supplied Textarea reference: a visible-label native multiline field with linked helper/error text, vertical resizing, read-only selection, disabled editing, and Corporate/Luna themes. Default sizing is a 120px minimum height, 16px text, and 12px padding. Parents own external spacing.

Textarea composes Field. It accepts native textarea attributes and a native ref, plus required `label`, optional `helperText`, `error`, `showCount`, `wrapperClassName`, and token-aware `style`/`wrapperStyle`. Controlled `value` and uncontrolled `defaultValue` accept strings. `rows` defaults to 4; native rows can grow beyond the minimum. CSS token overrides customize height, padding, radius, colors, and typography. Vertical resizing is the default; native CSS `style.resize` can override it.

`showCount` displays the UTF-16 code-unit length, matching native maxLength semantics, followed by `/ maxLength` when a nonnegative limit is supplied. Counter text is associated with the control without a live region on every keystroke. Native maxLength constrains user input; existing controlled or initial values are never silently truncated. Count follows typing, controlled updates, default-value changes, native form resets (including canceled resets), and form ownership changes. Programmatic value mutations must dispatch an input event to update an uncontrolled count.

```tsx
<Textarea label="Project description" name="description"
  placeholder="Describe your project..." helperText="Describe the goals of your project."
  maxLength={200} showCount />
```

Import combined styles, or tokens.css plus textarea.css. Existing Field styles are included in the textarea stylesheet's component-specific rules. Real screen-reader output requires a separate assistive-technology check.

## Verification

The initial visible-label test failed before implementation and passed afterward. A real Chromium test reproduced a counter reading the old value during a native form reset; reset synchronization now runs after the native default action and cancels its pending timer when unmounted.

All 322 unit tests and 115 integration tests passed with 100% per-file coverage. Checks include SSR and hydration, multiline editing, controlled updates, external form ownership, normal/canceled resets, unmount cleanup, refs, native disabled/read-only semantics, and message relationships. All 120 Storybook interaction and axe checks passed with accessibility failures configured as errors. Both themes were visually reviewed. Browser checks exercise actual resize-handle dragging, native maxLength, read-only selection, keyboard focus, Enter/Tab, and 320px reflow with 200% text and user spacing.

All 191 full browser regression tests passed with 100% per-file browser coverage, including native ref-based focusing. Package and Storybook builds, TypeScript, lint, public package consumers, and icon tree-shaking passed. Real screen-reader output remains unverified.
