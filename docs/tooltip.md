# Tooltip

Short supplementary, non-interactive help. Use a visible label for an action's name and keep essential instructions on the page. For links or controls inside an overlay, use Popover or Dialog.

```tsx
<Tooltip content="Review the current workspace settings." placement="top">
  <Button variant="secondary">Workspace settings</Button>
</Tooltip>
```

Import `tokens.css`, `tooltip.css` and the styles required by the child, or the combined `styles.css`. Tooltip adds no runtime dependency.

| Prop                                                  | Default         | Purpose                                                             |
| ----------------------------------------------------- | --------------- | ------------------------------------------------------------------- |
| `content`                                             | required        | Supplementary description as a React node; no interactive content   |
| `children`                                            | required        | Exactly one element that forwards `aria-describedby` to its trigger |
| `placement`                                           | `top`           | Preferred `top`, `right`, `bottom` or `left` side                   |
| `className`, `style`, native span attributes/handlers | forwarded       | Wrapper customization, including typed `--fs-*` overrides           |
| ref                                                   | HTMLSpanElement | Native anchor wrapper                                               |

The child stays mounted and keeps its ref, handlers, URL, attributes, accessible name and tab order. Tooltip appends its own unique ID to existing `aria-describedby` IDs. Router links and custom trigger components must forward this attribute. Fragments and multiple children are unsupported. The wrapper does not add a tab stop or make a non-focusable/disabled trigger keyboard accessible; use a focusable control when help is needed by keyboard users. A hidden tooltip remains available as its trigger's referenced description, while the tooltip itself is absent from normal keyboard navigation and the accessibility tree.

Mouse/pen hover and keyboard focus reveal the description immediately without moving focus. Moving the pointer onto the tooltip keeps it visible; a short 100ms pointer-transfer grace bridges the visual gap. It remains visible while the trigger has focus, even after the pointer leaves. Escape dismisses without moving focus and does not reopen until a fresh hover/focus interaction. Touch taps toggle help; tapping elsewhere dismisses it. Native activation and consumer click handlers still run. Blur closes help unless pointer hover still owns it. Consumer wrapper event handlers run first and may cancel Tooltip's corresponding interaction with `preventDefault()`.

The browser's native manual Popover API escapes transformed/clipped ancestors while retaining the authored DOM and theme boundary. Current evergreen browser support for Popover and ResizeObserver is required. Panels flip toward more available space, clamp to the visual viewport, follow resizing/scrolling, and wrap long descriptions. Height is limited to the space beside the trigger, preserving its focus ring; if neither horizontal side fits, placement falls back vertically. Very long descriptions scroll within the available region; keep tooltips brief. The parent owns layout placement. Nothing opens on a Docs page until interaction.

Both themes define `--fs-tooltip-surface`, `--fs-tooltip-text`, `--fs-tooltip-border`, `--fs-tooltip-border-width`, `--fs-tooltip-radius`, `--fs-tooltip-padding-block`, `--fs-tooltip-padding-inline`, `--fs-tooltip-max-width`, `--fs-tooltip-font-size`, `--fs-tooltip-offset` and `--fs-tooltip-viewport-inset`. Corporate uses an ink surface, white text and 6px corners; Luna uses pale/navy and 32px corners. Override these on one wrapper or a theme region; nested themes reset tokens. Viewport spacing tokens use CSS pixels. No animation runs, so reduced motion remains immediate. Forced colors retains a visible boundary.

Stories demonstrate both themes, all placements, pre-existing descriptions, native links and named icon actions, transformed/clipped panels, scrolling, long content, scoped styles, nested themes, and composition within Popover and Dialog.
