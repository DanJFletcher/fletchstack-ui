# Toast

Toast reports the result of an action without moving keyboard focus. Use Callout for persistent page guidance and Dialog for a decision that blocks the workflow.

The design uses a compact tinted surface, a leading tone accent, optional decorative icon, a title/body/action column, and a trailing dismiss button. Corporate and Luna inherit the same semantic roles. A ToastViewport owns stacking and optional page-edge placement; it does not portal or create a global store.

## Contract

- `children` is the message; optional `title`, `icon`, and `action` accept React nodes. Put interactive content in `action`.
- `tone`: `info` (default), `success`, `warning`, `error`, or `neutral`.
- `open`, `defaultOpen` (true), and `onOpenChange` support controlled/uncontrolled visibility. Parent removal is also supported.
- `duration`: milliseconds, default 0 (persistent). Positive finite values enable automatic dismissal. Hover, focus within, and a hidden browser tab pause the remaining time. Invalid or non-positive values stay persistent. Changing duration or reopening starts a new timer.
- `announcement`: `polite` (default), `assertive`, or `off`, independent of tone. Only message/title text is announced, never action or dismiss labels. The live region is populated after mounting. Visual content also remains available for ordinary reading.
- `dismissLabel`: defaults to “Dismiss notification”. The close button and Escape while focus is inside request dismissal. Opening never steals focus; dismissing a focused toast returns focus to the last connected control outside it. Actions keep the toast open unless the consumer closes it.
- Root ref, native attributes/handlers, `className`, and `style` (including scoped `--fs-*` tokens) are supported. Hidden or closed toasts cannot be focused or announced.
- `position` on Toast fixes a single notification to the page; omitted, it stays in flow. Both Toast and ToastViewport accept `top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, and `top-left`. Top/bottom are horizontally centered; left/right are vertically centered. Physical directions stay fixed in RTL. The logical `top-start`, `top-end`, `bottom-start`, `bottom-end` alternatives follow text direction.
- ToastViewport: `position` defaults to `bottom-end`. `inline` defaults to false. `aria-label` defaults to “Notifications”. Root ref/native props/scoped style are forwarded.

## Usage

```tsx
import { Toast, ToastViewport, Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<ToastViewport>
  <Toast open={saved} onOpenChange={setSaved} tone="success" title="Changes saved"
    action={<Button size="small" onClick={viewChanges}>View changes</Button>}>
    Your team can see the latest version.
  </Toast>
</ToastViewport>
```

Keep stable keys when rendering a list. The application owns queue size, ordering, persistence, duplicate suppression, and asynchronous actions. Use `duration={5000}` only when the same information/action remains available elsewhere; pause-on-hover alone does not make a time-limited action accessible. Prefer persistent errors and undo actions. See [WCAG timing guidance](https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html) and [status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).

## Placement and customization

Positioning uses safe-area insets, a constrained width and vertical scrolling for long content. For one notification, use `<Toast position="top">Saved</Toast>`. For a queue, put `position` on ToastViewport and omit it on each child Toast so the stack controls spacing instead of overlapping fixed cards. It inherits the surrounding theme. Render it near the app root; transformed/clipping ancestors can affect fixed positioning. It is not a top-layer overlay: inside a modal dialog render an inline viewport within the dialog. Keep notification counts bounded and avoid covering important page actions. `inline` lets a parent own placement and keeps documentation examples in flow.

Use `--fs-toast-surface`, `--fs-toast-text`, `--fs-toast-accent`, `--fs-toast-border`, `--fs-toast-radius`, `--fs-toast-padding-inline`, and `--fs-toast-padding-block` for individual cards. Viewport hooks include `--fs-toast-viewport-width`, `--fs-toast-viewport-gap`, `--fs-toast-viewport-inset`, and `--fs-toast-viewport-layer`. Theme defaults are listed in [tokens](./tokens.md). Standalone CSS: tokens.css, icon.css and toast.css; also load styles used by consumer actions.

Toasts fade and slide inward when mounted or reopened: top positions descend, bottom positions rise, and side positions slide horizontally. The entrance uses the shared standard duration (160ms), enter easing, and viewport inset as travel distance. Centering is independent of the animation. Reduced-motion preferences disable both effects immediately, including preference changes while open. Closing immediately removes content from keyboard navigation and the accessibility tree; it never waits for an exit animation. No swipe gesture, focus shortcut, router integration, or automatic dismissal on action is imposed.

Verification scope and authoring observations: [Toast verification](./toast-verification.md).
