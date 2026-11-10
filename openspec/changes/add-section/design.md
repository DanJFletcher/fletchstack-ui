# Design

## Context

See proposal.md for motivation. Existing Container/Stack/SimpleGrid families provide passive native wrappers with typed --fs-* styles, explicit public exports, copied standalone/combined CSS and independent coverage gates. Card establishes a bounded native `as` choice and HTMLElement ref. Existing px32/px64/px96 primitives support the approved design without new raw values.

## Goals / Non-Goals

**Goals:** Independent section insets, optional native topic semantics, CSS-only responsive overrides, preserved content growth and native interactions.

**Non-Goals:** Automatic heading/landmark labels, surfaces, inline gutters, child stacking/columns, parent gaps, breakpoint props, arbitrary polymorphism, client measurements or clipping.

## Decisions

- API: spacing compact/default/spacious (default default), as section/div (default section), native section attributes/children/ref/classes/styles. Export Section, SectionProps and SectionStyle; use HTMLElement refs like the bounded Card API instead of introducing generic polymorphic machinery.
- Add section.padding.compact/default/spacious in both themes, directly aliasing primitive.px32/px64/px96. Do not alias layout.section.gap: sibling separation and padding are different roles despite sharing 64px today. Regenerate CSS/reference; preserve all existing tokens and primitive values.
- CSS uses logical padding-block, zero padding-inline, border-box sizing and min-inline-size:0. Do not add width, layout display modes, margins, descendant resets or overflow handling. Positive block padding naturally contains child margins; consumer margins can add to the visible breathing room.
- Render only the selected native wrapper with forwarded props/ref. Consumers supply visible headings and aria-labelledby for meaningful sections; purely visual wrappers use div without artificial region roles. No automatic role, tabIndex, heading level or ID generation.
- Example-only outlines/measurement blocks stay in story CSS. Show all presets, independent scopes/themes, native semantics, adjacent padding edges, child margins, nested sections, no-breakpoint default behavior and an explicit responsive override. Compose Section → Container → Stack/SimpleGrid with native actions and real card content.
- Verify exact padding before hydration, native/ref/style behavior, both themes, scope resets and role independence, RTL/logical properties, native tab order/focus,320px and enlarged text. Retain all 100% gates; preserve prior uncommitted component work and unrelated edits.

## Risks / Trade-offs

- Adjacent sections contribute two padding edges → demonstrate 128px between default-section content edges before any parent gap; parent owns additional separation.
- A section without a meaningful topic can pollute document structure → document heading association and the div alternative; do not invent labels.
- Consumer margins add to padding → preserve and demonstrate them rather than resetting descendants.
- Nested sections can compound padding → document that each wrapper owns its own insets; prefer Stack for inner relationships without another topic.

## Migration Plan

Optional additive adoption. Existing ordinary wrappers, tokens and child component behavior remain valid. Replace Section with equivalent native markup and padding CSS to roll back without data or dependency migration.
