# ButtonGroup

The supplied design sheet and public contract approve a named collection of related Button actions. ButtonGroup renders a div with role="group" and requires aria-label or aria-labelledby; prefer the latter when a visible heading names the actions. It is not a toolbar or selection group. Each enabled Button remains a native Tab stop in source order. No arrow handling, focus management, surface, outer padding or selection state is added.

## API and layout

Public exports are `ButtonGroup`, `ButtonGroupProps`, and `ButtonGroupStyle`.

- `appearance`: separated (default) or joined.
- `orientation`: horizontal (default) or vertical.
- `align`: start (default), center or end, along the logical inline axis. It places the group within its parent and its buttons within the available group width.
- `wrap`: true by default for horizontal separated groups. False keeps a row together; joined groups always ignore wrap and remain on one row or a vertical stack.
- `fullWidth`: false by default. True fills the parent's inline width.
- `equalWidth`: false by default. In a row, buttons divide that row's available width equally and can wrap at their minimum target widths; the last row expands its remaining buttons equally. In a separated column, all buttons stretch to the group's width. Joined columns always stretch their actions to keep one continuous boundary. This does not imply fullWidth: use both to fill the parent.
- `size` and `variant`: optional Button defaults. Explicit child values win; omission preserves Button's existing defaults.
- `disabled`: false by default. Group or child disabled disables the action; child disabled={false} cannot enable a disabled group.

Supports direct Button children, arrays, null/false conditional children, native div attributes, forwarded HTMLDivElement refs, className and typed `--fs-*` style overrides. Fragments, text, custom wrappers and other elements are outside this initial contract and are rejected. Name IDs must reference actual naming elements. TypeScript enforces the presence of a naming prop, and empty/missing names are rejected at runtime.

Separated groups use `--fs-space-gap-actions` for both gap axes. Joined groups overlap adjacent borders by `--fs-button-border-width` and round only the outside corners using each Button's active `--fs-button-radius`. Native hidden and conditionally omitted buttons do not affect visible edge selection. Use `hidden`, rather than arbitrary display:none CSS, to remove an action from joined edge calculations. A single visible action keeps all corners. Focused buttons paint above neighbors without clipping their offset rings.

The group constrains its own width, allows buttons to shrink and wrap their labels, and uses CSS without measurement or effects. It cannot fit arbitrarily many minimum-size actions into a tiny unwrapped row; use separated wrapping or a vertical group. Parents own surrounding spacing and focus clearance. Standalone Button behavior is unchanged. Child refs, handlers, attributes, type, form association and hidden state are preserved.

## Composition

```tsx
import { Button, ButtonGroup, Heading } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/button.css';
import 'fletchstack-ui/button-group.css';

<Heading id="page-actions">Page actions</Heading>
<ButtonGroup aria-labelledby="page-actions" variant="secondary">
  <Button>Save draft</Button>
  <Button>Preview</Button>
  <Button variant="primary" type="submit" form="article">Publish</Button>
</ButtonGroup>
```

Combined styles also include ButtonGroup. Corporate and Luna use existing Button geometry and states, with no new tokens. Use Cluster for general wrapping content (badges, links, unrelated children); use ButtonGroup when related actions need a shared accessible name and optional joined edges. Each Button still owns its content, interaction and native form behavior.
