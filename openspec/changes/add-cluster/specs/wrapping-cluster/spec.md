# Spec Delta

## Purpose

Provide passive horizontal direct-child composition that wraps with available space while preserving intrinsic widths, semantics and native interaction order.

## ADDED Requirements

### Requirement: Small native API
The library SHALL export Cluster, ClusterProps and ClusterStyle. Cluster SHALL render a div with native attributes, children, className, forwarded div ref and typed --fs-* styles. Gap SHALL be none/actions/related with actions default; align SHALL be start/center/end/baseline with center default; justify SHALL be start/center/end with start default. No direction, reverse, nowrap, responsive objects or automatic separators SHALL be introduced.

#### Scenario: Default wrapper
- **WHEN** Cluster receives children and native attributes
- **THEN** it preserves them on a passive div with actions gap, center alignment and start justification

### Requirement: Natural wrapping and shared gaps
Cluster SHALL use row flexbox, wrap enabled and CSS gap on both axes. None SHALL map to zero, actions directly to --fs-space-gap-actions, and related directly to --fs-space-gap-related. Wrapping SHALL depend on available parent width without breakpoints or measurement scripts. Scoped overrides SHALL remain effective and both themes SHALL share defaults without new token aliases.

#### Scenario: Same viewport with different parents
- **WHEN** identical actions are placed in wide and narrow parents within one viewport
- **THEN** the wide row fits while the narrow row wraps using the selected gap between items and rows

### Requirement: Alignment and row justification
Align SHALL control cross-axis alignment within each row, including baseline alignment for mixed typography. Justify SHALL position each row in available inline space. Start/end SHALL respect writing direction, and DOM, reading and keyboard order SHALL remain unchanged.

#### Scenario: RTL wrapped rows
- **WHEN** start or end justification is applied in RTL
- **THEN** rows align to the corresponding logical edge and native tab order follows DOM order across wrapped rows

### Requirement: Intrinsic passive child layout
Cluster SHALL preserve intrinsic child widths without equalizing or forcing growth, allow shrinking in flex/grid parents, and allow supported children to shrink/wrap their text naturally. It SHALL NOT impose broad descendant styles, reset child margins, clip overflow/focus, or add padding, surface, border, shadow or fixed height. Hidden children SHALL create no phantom gaps; nested clusters SHALL own their relationships.

#### Scenario: Oversized supported button
- **WHEN** a long-label Button is placed in a narrow Cluster
- **THEN** it can wrap its own text and grow in height without Cluster clipping it or its focus indicator

#### Scenario: Hidden items and margins
- **WHEN** a child is hidden or display:none while a visible sibling supplies a margin
- **THEN** hidden items reserve no gap and the consumer margin remains additional to the selected gap

### Requirement: Portable semantics and packaging
Cluster SHALL add no toolbar/selection/group roles, tabindex, arrow-key navigation or focus management. Child semantics and interactions SHALL remain native. Public JS/types, standalone/combined CSS and deterministic SSR SHALL work without CSS imports in library JavaScript, browser globals, providers, layout effects or hydration. Existing tokens and component behavior SHALL remain unchanged.

#### Scenario: Server-rendered actions
- **WHEN** server markup and CSS are loaded without client hydration
- **THEN** horizontal wrapping and gaps are effective and child actions retain their semantics

### Requirement: Discoverable verified composition
Documentation and Storybook SHALL demonstrate all props, mixed heights and typography, wide/narrow parents, badges, long labels, hidden/nested items, RTL, themes, scoped overrides and Container → Stack → Cluster. Guides SHALL be distinct from component styling; ordinary wrappers SHALL remain supported. Verification SHALL include geometry, order, focus and 320px enlarged/spaced content.

#### Scenario: Narrow enlarged content
- **WHEN** representative actions are viewed at 320px with 200% text and user spacing
- **THEN** supported child content wraps, remains visible and operable, and keyboard focus is not clipped
