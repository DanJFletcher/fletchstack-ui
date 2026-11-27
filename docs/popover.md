# Popover

Anchored, non-modal supplementary content. Use Dialog for blocking decisions and Menu for action lists. Popover composes the library Button; it does not trap focus or block the page. Import `tokens.css`, `button.css`, `icon.css`, and `popover.css`, or the combined `styles.css`.

```tsx
<Popover
  triggerLabel="Project details"
  heading="Project details"
  description="A quick view of the current workspace."
>
  <p>Three drafts are ready for review.</p>
  <a href="/drafts">Review drafts</a>
</Popover>
```

## API

| Prop                                                          | Default                 | Purpose                                                  |
| ------------------------------------------------------------- | ----------------------- | -------------------------------------------------------- |
| `triggerLabel`                                                | required                | Accessible name and default visible Button text          |
| `trigger`                                                     | label                   | Custom visible trigger content; compose icons here       |
| `triggerVariant`, `triggerSize`                               | `secondary`, `medium`   | Existing Button variants and sizes                       |
| `heading`, `description`, `children`                          | omitted                 | Panel heading, description and body                      |
| `open`, `onOpenChange`                                        | uncontrolled            | Controlled state and interaction requests                |
| `defaultOpen`                                                 | `false`                 | Initial uncontrolled state                               |
| `side`                                                        | `bottom`                | Preferred `top`, `right`, `bottom` or `left` edge        |
| `align`                                                       | `start`                 | Logical `start`, `center` or `end` alignment             |
| `offset`, `collisionPadding`                                  | theme tokens (8px)      | Trigger gap and viewport inset in CSS pixels             |
| `panelMaxWidth`                                               | theme width (400px)     | CSS maximum width; numbers mean pixels                   |
| `matchTriggerWidth`                                           | `false`                 | Match the trigger width, constrained by the viewport     |
| `autoFocus`                                                   | `false`                 | Focus first enabled control, falling back to the panel   |
| `closeOnEscape`, `closeOnOutsideClick`, `closeOnFocusOutside` | `true`                  | Independent dismissal policies                           |
| `showCloseButton`, `closeLabel`                               | `true`, `Close popover` | Optional explicit close action                           |
| `panelClassName`, `panelStyle`                                | omitted                 | Scoped panel customization                               |
| native div props, `style`, ref                                | forwarded               | Wrapper attributes, scoped tokens and HTMLDivElement ref |

A labeled non-modal `dialog` is connected to its native trigger through `aria-controls`, `aria-haspopup` and `aria-expanded`. Enter/Space activate the trigger. Tab follows normal source order; focus leaving closes by default. Escape and the close button return focus from inside the panel to the trigger. Outside activation and focus navigation retain their destination. Consumers can prevent Escape through the wrapper's `onKeyDown`. Controlled props remain authoritative until the parent accepts a change.

The native manual popover layer escapes clipping and works inside Dialog without portals or losing the authored theme boundary. Requires native Popover API and ResizeObserver support (current evergreen browsers). Content stays mounted while hidden, preserving local form state. It is unavailable to keyboard and assistive technology when closed. On SSR, open state is rendered but the browser top layer activates after hydration. Position flips toward more available room, clamps to the visual viewport and updates on scroll, resize and element size changes. Long panels scroll internally. Positive finite pixel offsets/insets are recommended.

The panel uses `--fs-popover-surface`, `--fs-popover-text`, `--fs-popover-muted`, `--fs-popover-border`, `--fs-popover-border-width`, `--fs-popover-radius`, `--fs-popover-padding`, `--fs-popover-gap`, `--fs-popover-width`, `--fs-popover-offset`, and `--fs-popover-viewport-inset`. Override on one wrapper or through `panelStyle`; sibling instances remain independent. Layout placement belongs to the parent. A fast entrance fade uses shared motion tokens; closure and reduced motion are immediate. Forced colors retains panel boundaries and existing Button focus styling.

Examples cover both themes, optional autofocus, controlled requests, all placements, edge collisions, matching width, nested Luna content, native Dialog composition, and scoped overrides. Docs examples start closed; the initially-open example is standalone.
