# Spec Delta

## Purpose

Provide optional vertical direct-child composition with consistent semantic gaps and cross-axis alignment while preserving native reading and keyboard order.

## ADDED Requirements

### Requirement: Small native API
The library SHALL export Stack, StackProps and StackStyle. Stack SHALL render a div with native attributes, children, className, forwarded div ref and typed --fs-* styles. Gap SHALL be none/related/group/section with related default; align SHALL be stretch/start/center/end with stretch default. No horizontal, reverse, wrap, breakpoint-object, separator or arbitrary styling props SHALL be introduced.

#### Scenario: Default native wrapper
- **WHEN** Stack is rendered with children and native descriptive attributes
- **THEN** it preserves them on a div with related spacing and stretch alignment

### Requirement: Existing semantic spacing
Stack SHALL use column flexbox and CSS gap, mapping none to zero, related directly to --fs-space-gap-related, group directly to --fs-space-stack-group, and section directly to --fs-layout-section-gap. It SHALL preserve scoped overrides and add no token aliases. Corporate and Luna SHALL share default layout values.

#### Scenario: Semantic gap override
- **WHEN** a scope overrides the related gap from 16px to 32px
- **THEN** its related Stack uses 32px while group and section retain their independent defaults

### Requirement: Direct-child relationships
Only participating layout children SHALL receive gaps. Stack SHALL insert no spacers, reset no child margins, and impose no descendant widths. Children SHALL retain content-sized block dimensions and grow as text wraps; nested stacks SHALL own their direct relationships independently. Stack SHALL shrink within flex/grid parents and SHALL NOT clip overflow or focus rings.

#### Scenario: Hidden children and consumer margins
- **WHEN** a child is display:none and a participating sibling has a consumer-owned margin
- **THEN** no gap is reserved for the hidden child and the visible margin remains additional to the gap

#### Scenario: Nested stacks
- **WHEN** a group Stack contains a related Stack and a sibling
- **THEN** the outer relationship uses 24px while the inner relationships use 16px by default

### Requirement: Logical alignment and order
Alignment SHALL affect the cross axis, with start/end following writing direction. Stack SHALL preserve DOM, reading and keyboard order, add no keyboard behavior, and remain vertical at every viewport width. Consumers SHALL control responsive gap changes through CSS overrides of existing semantic variables.

#### Scenario: Right-to-left alignment
- **WHEN** start or end alignment is used in an RTL layout
- **THEN** children align to the logical start or end without changing order

#### Scenario: Narrow viewport
- **WHEN** a consumer's CSS changes a semantic gap at a viewport breakpoint
- **THEN** spacing changes without Stack changing direction or requiring client layout logic

### Requirement: Passive portable styling
Stack SHALL add no padding, surface, border, shadow or fixed height. Its JavaScript SHALL import no stylesheet and require no browser globals, providers, layout effects or hydration. Public JavaScript/types, standalone and combined CSS, and deterministic server rendering SHALL be supported while existing public tokens and components remain unchanged.

#### Scenario: Server-rendered layout
- **WHEN** server-rendered Stack markup and its CSS are loaded before hydration
- **THEN** vertical gaps and alignment are already effective

### Requirement: Discoverable accessible composition
Documentation and Storybook SHALL cover defaults, gaps, alignments, nesting, long content, themes, overrides, responsive CSS and a real form with existing fields and Container. Guides SHALL remain separate from Stack styling. Guidance SHALL explain optional adoption, direct children, additive child margins, composed fields, overflow responsibility and the separately proposed Cluster for horizontal wrapping.

#### Scenario: Enlarged form layout
- **WHEN** the representative form is viewed at 320px with 200% text and user text spacing and traversed by keyboard
- **THEN** fields remain usable, order is preserved, content grows, and focus indicators are not clipped by Stack
