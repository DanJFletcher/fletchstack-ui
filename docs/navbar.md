# Navbar

Approved pattern: the supplied `../output/pdf/navbar-design.pdf` and accompanying public contract. A native navigation landmark composes a persistent brand, items assigned to the bar, a compact disclosure trigger and menu items. Children own links, controls, routing, styling and handlers. Menu items and bar items retain JSX order within their group. Every item stays mounted through resizing and disclosure changes.

The Navbar's content width selects compact layout at 720px or below; a ResizeObserver observes the component rather than the viewport. The semantic `--fs-navbar-collapse-width` role allows an instance to adjust that boundary. The brand is optional. When no menu items exist, neither trigger nor disclosure is rendered. Native links dismiss the compact disclosure; other controls leave it open. Escape requests dismissal and restores trigger focus. Controlled `open` remains the source of truth.

Semantic roles approved for this pattern: themed surface, text, border, border width, radius, internal padding, bar/item gaps and compact menu spacing. Reuse existing Button roles for the native disclosure and consumer CTA, and existing typography/focus roles. Disclosure is immediate; no animation is needed. The PDF's wordmark, links, toggle and CTA belong to the example consumer, not the reusable component.

## Usage and public API

```tsx
import { Navbar, type NavbarMobilePlacement } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

type Destination = { href: string; label: string; mobilePlacement?: NavbarMobilePlacement };
const destinations: Destination[] = [
  { href: '/services', label: 'What we do' },
  { href: '/approach', label: 'How we work' },
  { href: '/contact', label: 'Let’s talk', mobilePlacement: 'bar' },
];

<Navbar aria-label="Primary">
  <Navbar.Brand>
    <a href="/">FletchStack</a>
  </Navbar.Brand>
  {destinations.map(({ href, label, mobilePlacement }) => (
    <Navbar.Item key={href} mobilePlacement={mobilePlacement}>
      <a href={href}>{label}</a>
    </Navbar.Item>
  ))}
</Navbar>;
```

| API                           | Type/default                | Responsibility                                                       |
| ----------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `Navbar.children`             | Required `ReactNode`        | Brand/Item slots, mapped arrays, conditional children and fragments. |
| `Navbar.menuLabel`            | `string`, `"Menu"`          | Visible and accessible trigger label in both open states.            |
| `Navbar.open`                 | Optional `boolean`          | Controlled state; changes only after the parent supplies it.         |
| `Navbar.defaultOpen`          | `boolean`, `false`          | Initial uncontrolled state.                                          |
| `Navbar.onOpenChange`         | `(open: boolean) => void`   | An interaction requests expansion or dismissal.                      |
| `Navbar.style`                | `NavbarStyle`               | Native CSS properties and scoped `--fs-*` overrides.                 |
| `Navbar.Brand.children`       | Required `ReactNode`        | Optional persistent brand, supplied by the consumer.                 |
| `Navbar.Item.children`        | Required `ReactNode`        | Consumer-owned link, control or content.                             |
| `Navbar.Item.mobilePlacement` | `"bar" \| "menu"`, `"menu"` | Compact placement; explicit `undefined` also defaults to menu.       |

The root forwards its ref as `HTMLElement` to the native nav and forwards native attributes, including `id`, `className`, `aria-label`, `aria-labelledby`, `hidden`, and event handlers. Supply a meaningful navigation name. Children, styles and `dangerouslySetInnerHTML` follow the requested public restrictions. Exported types are `NavbarProps`, `NavbarBrandProps`, `NavbarItemProps`, `NavbarMobilePlacement` and `NavbarStyle`.

Brand/Item are placement slots; they do not inject link attributes, clone child elements, replace refs or intercept child handlers. Root children must be these slots or arrays/fragments containing them; unrelated direct content is rejected. Keep stable keys on mapped items. Item placement is normally a declaration; dynamically changing `mobilePlacement` moves an item between groups and is outside the layout/state-retention guarantee.

## State, keyboard and identity

```tsx
const [open, setOpen] = useState(false);

<Navbar aria-label="Workspace" open={open} onOpenChange={setOpen}>
  <Navbar.Item>
    <ThemeToggle />
  </Navbar.Item>
  <Navbar.Item>
    <button
      type="button"
      onClick={() => {
        selectWorkspace('studio');
        setOpen(false);
      }}
    >
      Switch to Studio
    </button>
  </Navbar.Item>
</Navbar>;
```

The same keyed groups stay siblings of the same React parent. Wide order is brand, menu items, bar items; compact order is brand, bar items, trigger, disclosure. Reordering whole groups updates DOM/Tab order without reparenting the items inside them. Both local React state and native input state survive. Container changes repair focus when an active control would otherwise be hidden or its group is moved.

The native trigger has `type="button"`, `aria-expanded` and an instance-specific `aria-controls`. Hidden panels use native `hidden` rather than unmounting their children, keeping them out of the Tab sequence and accessibility tree. Enter/Space uses native button behavior. Escape requests dismissal and returns focus to the trigger; a child or root handler can consume Escape with `preventDefault`. Normal links, including brand/bar destinations, request dismissal after their existing handlers run. This also works for client-router links that prevent native navigation. Buttons, switches and other controls leave the disclosure open. No menu roles, arrow-key navigation or focus trap are added.

Uncontrolled expansion is remembered across width changes. A controlled parent may accept, defer or reject any request. Closing from a custom control is an explicit consumer action, as shown above. To show “Close” instead of “Menu” while open, a controlled consumer can pass `menuLabel={open ? 'Close' : 'Menu'}`.

## Styling and rendering

For selective CSS, import `tokens.css`, `button.css` and `navbar.css`; consumer controls bring their own styles. Combined `styles.css` includes them. Corporate, Luna and nested theme regions resolve the same semantic roles. Consumer links and CTA classes own their appearance; the Navbar does not turn every anchor into a library link or button.

```tsx
<Navbar
  aria-label="Resources"
  className="project-navigation"
  style={{ '--fs-navbar-radius': '12px', '--fs-navbar-collapse-width': '800px' }}
>
  {/* Navbar.Brand and Navbar.Item children */}
</Navbar>
```

Use pixel values for the width role. The measurement is the nav content box, excluding its border/padding, and does not depend on window width. Parents own placement, maximum width and external spacing. Items wrap and may grow vertically on extremely narrow screens or with enlarged text. Server rendering supplies the full wide navigation; after hydration, ResizeObserver applies the actual container width without recovery errors or recreating children. Native disclosure changes are immediate and introduce no motion to suppress.

See [verification results](./navbar-verification.md) and [browser ownership](../tests/browser-behavior-matrix.md#navbar). Actual assistive-technology speech and physical devices remain manual verification gaps.
