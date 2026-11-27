# Item

A compact, composable content row inspired by [shadcn Item](https://ui.shadcn.com/docs/components/base/item). Use Card for larger surfaces and form fields for labeled inputs. Item registers no keyboard handlers, selection state, live region or motion.

```tsx
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  Button,
  InboxIcon,
} from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/item.css';
import 'fletchstack-ui/button.css';
import 'fletchstack-ui/icon.css';

<Item variant="outline">
  <ItemMedia variant="icon">
    <InboxIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Workspace invitation</ItemTitle>
    <ItemDescription>Maya invited you to Atlas.</ItemDescription>
  </ItemContent>
  <ItemActions>
    <Button onClick={review}>Review</Button>
  </ItemActions>
</Item>;
```

## Public API

| Export                 | Props and defaults                                                                                                                         | Native element |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| Item                   | `variant="default"` (`default`, `outline`, `muted`); `size="default"` (`default`, `sm`, `xs`); `as="div"` or `as="a"` with required `href` | div or a       |
| ItemGroup              | Native div props; vertical arrangement only                                                                                                | div            |
| ItemMedia              | `variant="default"` (`default`, `icon`, `image`, `avatar`); caller-owned media and alternative text                                        | div            |
| ItemContent            | Growing content column                                                                                                                     | div            |
| ItemTitle              | Emphasized text; consumers may supply their own heading                                                                                    | div            |
| ItemDescription        | Supporting text; do not place block content inside it                                                                                      | p              |
| ItemActions            | Wrapping action region                                                                                                                     | div            |
| ItemHeader, ItemFooter | Full-width wrapping introductory and trailing regions                                                                                      | div            |
| ItemSeparator          | Decorative rule, hidden from assistive technology                                                                                          | div            |

All parts forward native props, handlers, className, style and refs. Item forwards an HTMLElement ref, description an HTMLParagraphElement ref, and other regions an HTMLDivElement ref. Exported types: ItemProps, ItemVariant, ItemSize, ItemStyle, ItemPartProps, ItemMediaProps and ItemDescriptionProps. ItemStyle extends CSSProperties with scoped `--fs-*` overrides. Import combined styles.css instead of split styles when preferred.

## Destinations and actions

```tsx
<Item as="a" href="/guide">
  <ItemContent>
    <ItemTitle>Read the guide</ItemTitle>
    <ItemDescription>Get started.</ItemDescription>
  </ItemContent>
</Item>
```

The library uses native `as="a"` and `href` rather than the reference's `render` API. This preserves link handlers, refs, modified clicks and native attributes without cloning children. For router integration, compose a router link inside a passive Item. Never put interactive descendants inside a whole-row link. Embedded buttons keep normal Enter/Space activation and Tab order. ItemTitle is not an implicit heading: choose a native heading inside it to fit the page outline. Groups impose no list/menu roles; use native ul/li wrappers when the content is a list. Icon accessibility and image alternative text belong to the consumer; project icons are decorative by default.

## Layout and themes

Parents own placement and sibling spacing. Item owns padding and internal region gaps; ItemGroup owns inter-row spacing. Content and actions wrap without truncation, including RTL, narrow layouts, enlarged text and text-spacing preferences. Header/footer occupy full rows; omitted regions allocate no space. Native hidden is respected. No interactive state or disabled styling is invented for a passive row; disable the actual embedded control when needed.

Both Corporate and Luna supply `--fs-item-text`, `--fs-item-muted`, `--fs-item-surface`, `--fs-item-hover`, `--fs-item-border`, `--fs-item-border-width`, `--fs-item-radius`, `--fs-item-padding`, `--fs-item-padding-small`, `--fs-item-padding-xs`, `--fs-item-gap`, `--fs-item-content-gap`, `--fs-item-media-size`, `--fs-item-icon-size`, `--fs-item-weight`, `--fs-item-font-{family,size,line-height}` and `--fs-item-focus-{color,width,offset}`. They inherit through nested theme regions.

```tsx
<Item variant="outline" style={{ '--fs-item-radius': '0px', '--fs-item-padding': '32px' }}>Custom row</Item>
<Item variant="outline">Neighbor retains theme defaults</Item>
```

Overrides apply only to that instance and descendants. Whole-row links show a visible keyboard focus outline; selection is never implied. Storybook demonstrates both themes, all variants and sizes, media, group separators, actions, destinations, RTL, hidden rows and wrapping.
