# Textarea

Approved from the supplied Textarea reference: a visible-label native multiline field with linked helper/error text, vertical resizing, read-only selection, disabled editing, and Corporate/Luna themes. Default sizing is a 120px minimum height, 16px text, and 12px padding. Parents own external spacing.

Textarea composes Field. It accepts native textarea attributes and a native ref, plus required `label`, optional `helperText`, `error`, `showCount`, `wrapperClassName`, and token-aware `style`/`wrapperStyle`. Controlled `value` and uncontrolled `defaultValue` accept strings. `rows` defaults to 4; native rows can grow beyond the minimum. CSS token overrides customize height, padding, radius, colors, and typography. Vertical resizing is the default; native CSS `style.resize` can override it.

`showCount` displays the UTF-16 code-unit length, matching native maxLength semantics, followed by `/ maxLength` when a nonnegative limit is supplied. Counter text is associated with the control without a live region on every keystroke. Native maxLength constrains user input; existing controlled or initial values are never silently truncated. Count follows typing, controlled updates, default-value changes, native form resets (including canceled resets), and form ownership changes. Programmatic value mutations must dispatch an input event to update an uncontrolled count.

For controlled usage, update `value` from `onChange`; the count derives directly from that supplied value. Native input/reset observation is reserved for uncontrolled values so counter updates do not interrupt consumer-controlled editing.

```tsx
<Textarea label="Project description" name="description"
  placeholder="Describe your project..." helperText="Describe the goals of your project."
  maxLength={200} showCount />
```

Import combined styles, or tokens.css plus textarea.css. Existing Field styles are included in the textarea stylesheet's component-specific rules. Real screen-reader output requires a separate assistive-technology check.

## Verification

The initial visible-label test failed before implementation and passed afterward. A real Chromium test reproduced a counter reading the old value during a native form reset; reset synchronization now runs after the native default action and cancels its pending timer when unmounted.

The controlled-counter keyboard regression subsequently exposed native counter observation interrupting React's controlled change callback. It failed before the fix and passed after controlled counters stopped subscribing to native input/reset observation. Exact multiline editing and the derived count are checked in both themes, with additional unit and jsdom hydration checks for consumer-owned React state.

The complete library verification passed 336 unit tests, 132 integration tests, 128 Storybook interaction/accessibility checks, and 224 Chromium E2E tests. Unit, integration, and browser coverage each independently reached 100% per file. Existing checks retain native reset/canceled-reset behavior, refs, resizing, maxLength, read-only/disabled behavior, keyboard focus, and 320px reflow with enlarged/spaced text. Package and Storybook builds, TypeScript, lint, packed React 18/19 consumers, CSS entrypoints, and icon tree-shaking passed. Real screen-reader output remains unverified.
