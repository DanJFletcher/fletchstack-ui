# Design

## Context

See [proposal](./proposal.md). Container bounds/centers content and Stack arranges column relationships. Existing action/related semantic roles supply 12/16px defaults. Family-owned source/CSS/tests/CSF and central SSR/E2E/package inventories govern the additive component.

## Goals / Non-Goals

**Goals:** Native div portability, intrinsic wrapping, logical justification and row alignment; preserve existing spacing overrides, child sizes/order/margins and interactions.

**Non-Goals:** No toolbar or selection behavior, equal-width grid, direction switching, nowrap, separators, new tokens, viewport script, or implementation of missing components.

## Decisions

- Follow Container/Stack's forwardRef and native div props convention with only gap/align/justify unions and typed style. Introduce no semantics or input/focus logic.
- CSS sets display:flex, flex-direction:row, flex-wrap:wrap, align-items:center, justify-content:flex-start, gap using the existing actions variable, and min-inline-size:0. Modifier classes map shared roles and logical flex-start/end/center/baseline. No descendant rules, growth/equal-width rules, width constraints, overflow or margin resets.
- Rely on normal flex shrinking and each child's supported contract for oversized content. Button already provides max-inline-size:100%, text wrapping and growing heights. Unbreakable or fixed-minimum children remain consumer-owned; do not hide problems with clipping or broad descendant min-width/width overrides.
- Native hidden children do not participate in flex layout. Honor Cluster's own hidden attribute despite its explicit display:flex. Keep visibility:hidden semantics distinct: it still occupies layout.
- Pack rows with align-content:flex-start. A browser regression exposed default flex-line stretching inside a grid supplying extra height: a 12px row gap rendered as 36px in a constrained fixture. Packing lines preserves the selected gap without changing within-row alignment or adding a public option.
- Family-local demonstration CSS supplies measurement widths/heights, guide outlines, typography and explicit consumer margins. Show identical actions at two parent widths within the same viewport to prove parent-based wrapping; no component media queries.
- Source-browser integration covers pre-hydration geometry and visible overflowing unsupported children; browser journeys cover both gap axes, wrapped-row justification, baseline marker alignment, RTL, native keyboard order, focus clearance, scope/theme reset and 320px enlarged actions. Keep all existing independent 100% coverage gates.

## Risks / Trade-offs

- Child minimum widths may exceed available space → document child responsibility, exercise supported long Buttons and retain visible overflow for unsupported fixed content.
- Consumer margins add to gap → demonstrate additive spacing without resetting them.
- Row flexbox does not align columns like Grid → explain that Cluster preserves intrinsic widths; use ordinary CSS Grid for track alignment.
- Grouped actions can suggest toolbar semantics → document passive layout and preserve normal Tab order, leaving specialized labels and keyboard patterns to consumers.

## Migration Plan

Adopt optionally within existing Container/Stack/semantic sections. Existing wrappers and component APIs remain valid. Replacing Cluster with equivalent ordinary wrapping flex CSS rolls back adoption without data, dependency or token migration.
