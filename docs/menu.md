# Menu

The approved action-menu pattern follows the Project actions design sheet and [reference Storybook](https://themed-react-ui-foundation.replit.app/?path=/docs/components-menu--docs). This is an ARIA application action menu, not a site-navigation replacement for ordinary links in a nav.

Contract: named menu button, recursive item/submenu/divider entries with sibling-unique IDs, controlled or uncontrolled opening, native link navigation, cancellable selection and immediate removal of closed branches. One submenu branch per level remains open. Keyboard focus stays within the current level until entering/leaving a child. Tab dismisses and continues from the trigger's position in normal document order. Outside pointer activation dismisses without stealing focus.

Semantic menu roles cover surface/text/border, expanded and hover fills, disabled text, focus, padding/gaps/radius, width, viewport inset and typography. Both themes reuse approved palette/spacing primitives. Desktop panels align to parent rows, flip horizontally and clamp vertically to the viewport; at 600px and below children appear inline with an indented vertical guide and downward chevron. Parents own placement; menu panels remain inside the wrapper DOM and inherit its theme. Ancestor transforms/containing blocks can constrain fixed positioning; use an unclipped, untransformed containing region.

Opening panels fade using the shared fast duration and enter easing. No exit animation delays semantics. Reduced-motion preferences remove animation, including live preference changes. Storybook-only motion overrides stay outside consumer styles.

## Public API

```tsx
import { Menu, type MenuItem } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

const items: MenuItem[] = [
  { type: 'item', id: 'rename', label: 'Rename', onSelect: () => renameProject() },
  {
    type: 'submenu',
    id: 'export',
    label: 'Export',
    items: [
      { type: 'item', id: 'pdf', label: 'Download PDF', href: '/exports/project.pdf' },
      { type: 'item', id: 'csv', label: 'Download CSV', onSelect: () => downloadCsv() },
    ],
  },
  { type: 'divider', id: 'divider' },
  {
    type: 'item',
    id: 'archive',
    label: 'Archive',
    disabled: true,
    onSelect: () => archiveProject(),
  },
];
<Menu triggerLabel="Project actions" menuLabel="Project actions" items={items} />;
```

| Prop                     | Type                                                        | Default               |
| ------------------------ | ----------------------------------------------------------- | --------------------- |
| triggerLabel / menuLabel | visible trigger text / accessible panel name, both strings  | required              |
| items                    | readonly MenuItem[]                                         | required              |
| open / onOpenChange      | controlled boolean / requested expansion callback           | uncontrolled          |
| defaultOpen              | boolean                                                     | false                 |
| closeOnSelect            | boolean                                                     | true                  |
| emptyMessage             | ReactNode; displayed as a disabled, non-focusable menu item | No actions available. |
| className / style        | root class / MenuStyle (CSSProperties and --fs-* hooks)     | omitted               |
| ref                      | HTMLDivElement                                              | omitted               |

`MenuItem` discriminates on `type`: item, submenu or divider. `MenuActionItem` requires onSelect; `MenuLinkItem` requires href and supports optional onSelect, target and rel. `MenuSubmenuItem` requires its recursive items; `MenuDividerItem` requires only its type and ID. Item labels are visible strings; optional icon nodes are decorative and must not contain controls. Actions, links and submenu triggers support disabled. Empty IDs, duplicate sibling IDs and blank item labels throw; IDs may repeat in separate sibling sets.

Selection handlers receive `MenuSelectEvent`, a React mouse event originating from the native button or anchor, including keyboard activation. `event.preventDefault()` prevents dismissal and also cancels native link navigation. `closeOnSelect={false}` keeps the menu open while allowing normal links to navigate. Leaf activation restores trigger focus by default; callers can prevent dismissal to manage their own subsequent focus. Disabled links have no href and cannot activate.

Use Enter/Space on the trigger to focus the first enabled item, or ArrowUp to focus the last. Arrows move within one level and wrap; Home/End choose boundaries. Typeahead buffers a case-insensitive prefix for 700ms and repeated initials cycle. Right Arrow opens a branch; Enter/Space toggles it. Escape/Left return one level; Escape at the root restores trigger focus. Tab/Shift Tab dismiss from any level and continue normal page navigation. Outside pointer activation dismisses without cancelling native focus.

## Styling and themes

The wrapper and all panels inherit the enclosing theme, including nested Corporate/Luna regions. Override one instance with `style={{ '--fs-menu-radius': '0px', '--fs-menu-width': '240px' }}` or a scoped consumer class. Surface, text, border, expanded/hover surface, disabled text, focus color/width/inset, item padding, width and geometry are independent semantic hooks. These values inherit through the component; unrelated neighboring instances remain unchanged. Load tokens.css, button.css and menu.css for individual styles, plus icon.css when supplying library icons, or use combined styles.

Panels stay within the viewport with a semantic inset and scroll vertically if necessary. Long labels wrap rather than changing column relationships or clipping actions. At narrow viewports children use static flow with indentation and a guide; closed branches are unmounted immediately. No hover-only expansion or delayed closing is required for touch access.

See [verification evidence](menu-verification.md) for executed checks, visual review and remaining manual accessibility limitations.

`trigger` accepts optional visual React content (for example, a decorative ellipsis). `triggerLabel` remains the native button’s accessible name.
