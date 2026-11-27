# SimpleGrid

SimpleGrid is an optional passive layout for collections in equal-width columns. It defaults to auto-fit columns with a 240px preferred minimum and a 16px related gap on both axes. Columns respond to **available parent width**, without viewport breakpoints, JavaScript measurement or hydration. Below 240px the single column shrinks to fit its parent. Sparse collections expand occupied tracks rather than reserving empty columns.

```tsx
import { Container, SimpleGrid, Card, CardContent, CardTitle } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Container>
  <SimpleGrid gap="group">
    <Card>
      <CardContent>
        <CardTitle>First project</CardTitle>
      </CardContent>
    </Card>
    <Card>
      <CardContent>
        <CardTitle>Second project</CardTitle>
      </CardContent>
    </Card>
  </SimpleGrid>
</Container>;
```

## API and ownership

Exports: SimpleGrid, SimpleGridProps and SimpleGridStyle. Renders a div with native attributes, children, className, a forwarded HTMLDivElement ref, and typed `--fs-*` style overrides. `gap` accepts `none`, `related` (default) and `group`, resolving to 0, `--fs-space-gap-related` (16px) and `--fs-space-stack-group` (24px). One role controls rows and columns. There are no column-count, spanning, direction, breakpoint or arbitrary sizing props.

SimpleGrid owns tracks and direct-child gaps. It supplies no padding, background, border, shadow, fixed height, clipping, roles or keyboard behavior. Parents own placement and vertical separation; cards own their appearance and insets. Example outlines and measurement blocks are demonstration guides only.

Items stretch within their own row; each row grows to its tallest item, and different rows can have different heights. Hidden or display:none children occupy no grid cells or gaps. Consumer-owned child margins are retained and can add to spacing or reduce usable track space. Nested grids independently own their direct children. Fields stay composed children so their labels, controls and helper/error relationships remain together.

SimpleGrid preserves DOM, reading and native keyboard order in LTR and RTL. It is not an interactive ARIA grid: collection headings, list/section semantics and specialized interaction patterns belong to the consumer. It adds no keyboard stop or focus management and leaves focus rings visible.

Stack owns vertical gaps; Cluster wraps intrinsic-width items; SimpleGrid distributes equal-width columns. Use ordinary CSS Grid for unequal tracks, spanning or precise placement. Ordinary CSS flex/grid wrappers remain fully supported.

## Scoped sizing and spacing

Both themes share layout values. The component-specific semantic role `--fs-simple-grid-min-item-width` defaults to 240px and references an internal raw dimension directly. It is a preferred minimum, not a fixed width, breakpoint or guarantee of reading line length. It must resolve to a valid positive CSS length. Override it and existing gap roles through scoped CSS; nested explicit theme boundaries reset the complete token contract.

```css
.compact-collection {
  --fs-simple-grid-min-item-width: 180px;
  --fs-space-gap-related: 24px;
}
@media (max-width: 600px) {
  .compact-collection {
    --fs-space-gap-related: 16px;
  }
}
```

The example media query belongs to the consumer. Column reflow itself needs no breakpoint. Import combined styles or `tokens.css` plus `simple-grid.css` and styles for child components. Library JavaScript imports no stylesheet or browser global and needs no provider or layout effect.

SimpleGrid can shrink in flex/grid parents. A flex parent that wants it to consume remaining inline space supplies the child's `flex: 1`; SimpleGrid does not own its placement. It cannot fix an unsupported fixed-width child, unbreakable content or a consumer's minimum size. Keep those problems visible and adapt the child; do not clip overflow or focus rings. Representative cards and their native actions should reflow at 320px with enlarged text and user spacing.

## Verification

The native-description test failed against the initial stub because native attributes were dropped, then passed after forwarding props. A source-browser test initially rendered one column at all three parent widths; after adding the auto-fit CSS and generated semantic role, the unchanged assertions passed for three columns at 800px, two at 520px and one at 200px before hydration.

All 495 unit tests and 198 integration tests passed with independent 100% per-file coverage gates. Packed React 18/19 consumers verified public JS/types, CSS imports and deterministic SSR; existing bundle-isolation checks passed. Lint, types, library and static Storybook builds passed. All existing primitive and semantic token values were preserved; generated CSS/reference reproduction passed.

All 35 focused Chromium checks passed. A first run exposed a demo sizing assumption: a flex item without consumer growth occupied its intrinsic content width rather than all remaining space. The parent demonstration now supplies `flex:1`; production layout and the original 200px assertions were retained. Geometry checks cover both gap axes, equal tracks, same-viewport parent reflow, sparse/single/empty collections, row heights, scoped overrides and theme resets, hidden children, nesting, RTL/source/tab order, child margins, narrow flex/grid parents, both themes and wrapped focus clearance. Real cards reflow at 320px with 200% text plus user text-spacing overrides. Theme and enlarged narrow layouts were also visually reviewed.

The complete Chromium regression run passed all 519 tests and the independent 100% per-file browser coverage gate. All 255 Storybook interaction/axe checks passed after the demo correction. Built-package browser verification also passed contrast, focus states, 320px reflow, 200% text and user spacing checks. Strict OpenSpec validation passed and all four tracked tasks are complete.

Real screen-reader output and non-Chromium rendering require separate manual verification.
