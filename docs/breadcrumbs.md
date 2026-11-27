# Breadcrumbs

Approved from the one-page Home / Projects / Atlas / Settings design and [reference behavior](https://themed-react-ui-foundation.replit.app/?path=/docs/components-breadcrumbs--docs). A named native nav contains an ordered list, linked ancestors, a plain-text current page and decorative slash separators. The component uses supplied destinations and owns no routing.

At or below a CSS viewport width (collapseAt, default 40rem), trails with intermediate ancestors retain first/current items and replace the intermediate links with a count-aware ellipsis button. Enter/Space toggles them inline in their original order; the same native button retains focus before the revealed links. Hidden links are unmounted immediately. Wider viewports always show the full trail. Each instance preserves its disclosure preference when crossing the breakpoint. Server rendering exposes the complete trail; hydration applies the actual viewport without a mismatch.

Existing Link owns ancestor color, underline and focus styling. Text/body typography and focus come from the enclosing theme; new Breadcrumbs roles provide muted separators, 8px spacing, current-page emphasis and a compact disclosure target. Content wraps; parents own placement and sibling spacing. No animation is needed for this immediate disclosure.

## Usage

```tsx
import { Breadcrumbs, type BreadcrumbItem } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

const items = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Atlas', href: '/projects/atlas' },
  { label: 'Settings', current: true },
] satisfies BreadcrumbItem[];

<Breadcrumbs items={items} />;
```

For selective CSS imports, include `tokens.css`, `link.css` and `breadcrumbs.css`. Apply the enclosing theme as usual; nested theme regions work without additional component configuration.

## Props and customization

| Prop         | Type                        | Default        | Purpose                                                        |
| ------------ | --------------------------- | -------------- | -------------------------------------------------------------- |
| `items`      | `readonly BreadcrumbItem[]` | Required       | Ordered ancestors followed by exactly one current page.        |
| `collapseAt` | `string`                    | `"40rem"`      | CSS viewport width, inclusive, such as `"640px"` or `"56rem"`. |
| `aria-label` | `string`                    | `"Breadcrumb"` | Name the navigation landmark.                                  |
| `className`  | `string`                    | Unset          | Style this instance through a scoped class.                    |
| `style`      | `BreadcrumbsStyle`          | Unset          | Native inline styles and typed `--fs-*` token overrides.       |
| `ref`        | `Ref<HTMLElement>`          | Unset          | Reference the native navigation element.                       |

Other native navigation attributes are forwarded. `children`, `dangerouslySetInnerHTML` and role overrides are excluded to preserve the ordered trail and landmark semantics. Ancestors require a non-empty `href`; the current item accepts no `href`. Empty trails, blank labels, blank ancestor destinations and misplaced current items are rejected.

```tsx
<Breadcrumbs
  items={items}
  aria-label="Project breadcrumb"
  collapseAt="48rem"
  style={{ '--fs-breadcrumbs-gap': '12px', '--fs-link-text': 'rebeccapurple' }}
/>
```

Overrides inherit only through that instance and leave neighboring trails unchanged. Use a scoped class on the root to target `.fs-breadcrumbs__current` or `.fs-breadcrumbs__toggle` while preserving focus visibility and native semantics. One- and two-item trails never show a disclosure. Breakpoints use viewport width rather than container width; setting a narrow parent alone does not collapse the trail.

## Verification

See [verification results](./breadcrumbs-verification.md) and the [browser ownership matrix](../tests/browser-behavior-matrix.md#breadcrumbs). Automated accessibility checks do not establish actual screen-reader speech; manual assistive-technology verification remains a gap.
