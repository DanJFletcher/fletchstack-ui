# Cluster

The owner-provided Cluster design and request approve this optional passive horizontal wrapping layout. It owns direct-child gaps, alignment within each row and row justification. Container and Stack remain unchanged; ordinary flex/grid wrappers remain supported.

## Contract

`Cluster` renders a native div and supports native attributes, children, className, a forwarded HTMLDivElement ref and typed `ClusterStyle` overrides. Defaults are `gap="actions"`, `align="center"`, and `justify="start"`.

| Prop | Options | Meaning |
| --- | --- | --- |
| gap | none, actions, related | Zero, `--fs-space-gap-actions` (12px), or `--fs-space-gap-related` (16px), directly on both axes |
| align | start, center, end, baseline | Cross-axis alignment within each row |
| justify | start, center, end | Position each row within available inline space |

Start/end follow writing direction: in horizontal RTL, start justification begins at the right; row cross-axis start/end remain block start/end. Baseline aligns mixed typography on a common text baseline. DOM, reading and keyboard order are preserved. Native Tab moves through children in their source order, including across wrapped rows.

Cluster uses row flexbox with wrapping at every width. Wrapping depends on available parent width, not viewport breakpoints. Existing semantic gap variables support scoped overrides and consumer media queries, with identical theme defaults and explicit nested-theme resets. No new tokens or aliases are introduced. There is no direction switching, reverse, nowrap, breakpoint object, automatic separator or arbitrary styling-prop API.

Rows pack at block start. Extra height supplied by a parent does not stretch flex lines and add visible spacing beyond the selected row gap; alignment still operates within each row.

## Ownership and semantics

Parents own width, placement and inset. Children retain intrinsic widths and their own interactions; Cluster does not equalize widths or force growth. It can shrink in flex/grid parents. Normal flex shrinking and child contracts such as Button's maximum width/text wrapping handle oversized supported children. Unsupported fixed-width, unbreakable or fixed-minimum content still needs a consumer-owned fix; Cluster does not apply broad descendant styles or hide overflow/focus rings.

Gaps exist only between participating flex items. Native hidden/display:none children reserve no phantom gap; visibility:hidden still occupies layout. Consumer child margins are not reset and can add to gaps. Nested clusters own their direct-child relationships independently. React fragments add no grouping node; use a real wrapper for an item containing several related elements.

Cluster adds no padding, surface, border, shadow, fixed height or keyboard behavior. It is not a toolbar, ButtonGroup or selection group: it adds no roles, labels, tabindex, arrow-key navigation or focus management. Children keep native semantics and actions. Consumers own semantic group labels and any specialized interaction pattern.

Stack arranges vertical relationships; Cluster arranges wrapping rows of intrinsic items; CSS Grid aligns shared tracks/columns. None of these layout choices alone supplies toolbar semantics. Ordinary CSS wrappers remain a supported alternative.

```tsx
import { Container, Stack, Cluster, Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Container>
  <section aria-labelledby="project">
    <Stack gap="group">
      <h2 id="project">Project overview</h2>
      <Cluster><Button>Save changes</Button><Button variant="secondary">Preview</Button></Cluster>
    </Stack>
  </section>
</Container>
```

Import combined styles or tokens.css plus cluster.css and the composed components' styles. Library JavaScript imports no stylesheet and needs no browser global, provider, layout effect or hydration for CSS layout. Storybook: Components → Layout → Cluster. All outlines, measurement blocks and fixed demo widths/heights belong to example CSS; Cluster itself has no guides or surface.

## Verification

The native-description test failed against the initial wrapper because attributes were dropped, then passed with native div forwarding. Browser gap checks subsequently exposed default line stretching when a grid supplied extra height. A source-browser regression reproduced a selected 12px gap appearing as 36px (and a 12px leading offset); `align-content:flex-start` restored the expected zero leading offset and 12px row gap. The unchanged spacing assertions passed afterward. A keyword-serialization assertion was replaced with direct start-edge geometry, verifying behavior across browser CSS serialization differences.

All 484 unit tests and 193 integration tests passed, each independently reaching 100% per-file statements, branches, functions and lines. All 240 Storybook interaction/axe checks and 47 focused Chromium journeys passed after the row-packing correction. Lint, types, library/Storybook builds, packed React 18/19 exports/types/SSR/CSS/bundle isolation and strict OpenSpec validation passed. Token sources and generated outputs are unchanged from the prior commit and reproduce exactly. Both theme compositions were visually reviewed.

Browser checks cover both gap axes, intrinsic wide/narrow wrapping in the same viewport, mixed-height alignment and measured text baselines, independent wrapped-row justification, RTL/source order/native tab order, native interactions and focus clearance through wrapped rows, hidden children, consumer margins, nesting, scoped overrides and theme resets, flex/grid shrinking, both themes, and long labels at 320px with 200% text and user spacing. Source integration verifies CSS geometry before hydration, exact row packing with extra parent height, and visible overflow for unsupported child minima.

The full Chromium regression run completed with 483 passed and one Container story readiness timeout before its focus assertions ran; the independent browser coverage gate reached 100% per file across all enforced metrics. All 29 Container journeys then passed in isolation, including that focus-order and clearance check, with unchanged assertions and timeouts. The full run therefore retains a recorded readiness failure rather than a claimed clean pass.

Real screen-reader output and non-Chromium rendering remain unverified. Fixed or unbreakable unsupported child minima remain consumer-owned; Cluster does not conceal them or introduce toolbar behavior.
