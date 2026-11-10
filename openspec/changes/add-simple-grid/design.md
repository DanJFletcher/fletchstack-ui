# Design

## Context

See proposal.md for motivation. Container, Stack and Cluster establish passive forwarded native div components, typed --fs-* overrides, family-local CSS/stories/tests, explicit exports and copied standalone/combined styles. Tokens have two layers and generated CSS/reference. The supplied sheet approves auto-fit tracks and a 240px preferred minimum.

## Goals / Non-Goals

**Goals:** Equal tracks responding to parent width with no measurement or hydration requirement; reuse existing gaps; preserve child semantics and content growth.

**Non-Goals:** Fixed column counts, span props, masonry, viewport breakpoint APIs, alignment props, polymorphism, descendant resets, or an interactive ARIA grid. Ordinary CSS Grid remains supported for unequal tracks and spanning.

## Decisions

- Public API: SimpleGrid, SimpleGridProps and SimpleGridStyle; gap none/related/group (default related), plus native div props/ref/styles. Keep the preferred width token-driven instead of adding arbitrary sizing props.
- Use grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--fs-simple-grid-min-item-width)), 1fr)); min-inline-size:0; grid-auto-flow defaults preserve source order. Auto-fit collapses empty tracks, unlike auto-fill. The min() cap permits parents narrower than 240px.
- Reuse --fs-space-gap-related and --fs-space-stack-group directly. Add semantic simple-grid.minItemWidth referencing a new internal size240 primitive only if missing, in both themes; regenerate CSS and token documentation. A separate role is justified because gallery column sizing and general spacing serve different purposes.
- Do not set grid-auto-rows:1fr: rows grow independently to their tallest content. Do not style descendants; unsupported fixed widths/unbreakable content remain consumer-owned and overflow stays visible. Child margins can affect usable space; document them.
- Demonstration outlines and measurement blocks live only in story CSS. Include the same six cards in 800/520/200px parents in one viewport, sparse auto-fit, unequal content height, all gaps, RTL, hidden children, nesting, scopes/themes, narrow parents and Container → Stack → SimpleGrid composition with native actions.
- Add source-browser SSR geometry, hydration/native API, unit tests and real Storybook/browser coverage. Preserve independent 100% coverage gates and all unrelated work, including uncommitted Cluster changes.

## Risks / Trade-offs

- Unsupported child fixed minima can overflow → keep overflow visible and document child responsibility; verify supported card/button content at 320px, 200% text and user spacing.
- 240px is a preference rather than a guaranteed width or reading measure → explain track expansion and the below-minimum fallback; allow scoped semantic overrides.
- Grid may suggest interactive grid semantics → render a passive div; consumers supply collection/section semantics when needed.

## Migration Plan

Adopt optionally with standalone or combined styles. Existing wrappers and tokens remain valid. Consumers can replace SimpleGrid with equivalent CSS Grid without data migration or new runtime dependencies.
