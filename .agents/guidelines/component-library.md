# Component library

## Design-system authority

Trace each component and supported variant to a recorded design-system pattern, including its purpose, states, and semantic tokens. When a request exposes a gap, describe the user need, the existing patterns considered, and what is missing. Obtain a recorded decision from the design-system owner before implementing the missing pattern, variant, or token.

For example, a request for a destructive action variant should identify the action and compare the existing button variants and confirmation patterns. The recorded decision determines the supported behavior, visual states, and semantic tokens for that variant.

## Component boundaries

Use direct implementation imports in focused component DOM, SSR and hydration tests and their fixture apps so affected unit/integration discovery follows real component dependencies. Preserve dedicated public-entrypoint and composed-consumer tests plus installed-package verification. During the development cycle, use focused red/green tests and affected related feedback as described in [the testing guidelines](testing-guidelines.md); complete the repository's full verification after implementation, repairing failures and repeating it before completion.

An atomic component has one coherent public responsibility. A composed component combines existing pieces to deliver a larger pattern and owns the relationships among those pieces. Document supported slots, variants, and behavior so consumers can compose components without relying on internal markup.

- A `Button` owns its padding, border, and gap between its label and icon. A native button supplies activation semantics. An icon-only button needs an accessible name.
- A `ButtonGroup` owns alignment and gaps between its buttons. Its enclosing layout owns where the group sits and the gap between the group and its siblings. Give the group keyboard behavior only when its design pattern calls for it.
- A composed form field associates its input with a label and any hint or error. Use instance-specific IDs so a second field keeps its own relationships. [React useId](https://react.dev/reference/react/useId)

Keep outer margin, sibling spacing, and placement in the parent layout. Use semantic tokens for internal and external design values. Keep spatial dimensions in CSS pixels while allowing content to wrap and controls to grow.

## Accessible behavior

Use native elements that match the interaction where possible. Define accessible names, labels and descriptions, states, keyboard behavior, and visible focus. For interactive composites, define focus entry, movement, and restoration as applicable. Preserve these behaviors when adding slots or composing controls. [WAI keyboard interface guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)

Default to WCAG 2.2 AA. Verify a component by itself and in a representative composition. Cover applicable states in Storybook and check keyboard operation, assistive technology, text enlargement, reflow, and user text-spacing overrides. Record manual evidence alongside automated results. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
