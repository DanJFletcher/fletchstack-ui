# Spec Delta

## Purpose

Give meaningful page regions consistent block padding while preserving consumer-owned headings, child layouts, width constraints and separation between regions.

## ADDED Requirements

### Requirement: Independent block-padding presets

Section SHALL apply compact 32px, default 64px or spacious 96px padding at both block edges, defaulting to default spacing. It SHALL add no inline padding, sibling gap, width constraint, surface, border, fixed height or child layout. Both themes SHALL share geometry.

#### Scenario: Content-based section height

- **WHEN** a 20px child renders without margins in each spacing preset
- **THEN** section heights are 84px, 148px and 212px, with zero inline padding

#### Scenario: Adjacent padding edges

- **WHEN** two default sections are adjacent without parent gaps or child margins
- **THEN** the distance between their content edges includes both 64px padding edges

### Requirement: Native section semantics

The library SHALL export Section, SectionProps and SectionStyle, rendering section by default and optionally div. Native attributes, children, classes, styles and an outer HTMLElement ref SHALL be supported. Section SHALL add no headings, labels, roles or keyboard behavior automatically.

#### Scenario: Heading-associated topic

- **WHEN** a consumer associates the native section with its visible heading through aria-labelledby
- **THEN** the topic is exposed as a named native region without an extra tab stop

#### Scenario: Visual wrapper

- **WHEN** the consumer chooses as=div for visual grouping
- **THEN** no section semantics are added and children retain their order and native behavior

### Requirement: Scoped semantic padding

Section SHALL use independent semantic padding roles referencing existing primitives directly. Scoped overrides and explicit nested-theme resets SHALL work without changing existing spatial roles. It SHALL introduce no automatic breakpoint or responsive JavaScript behavior.

#### Scenario: Consumer responsive override

- **WHEN** consumer CSS changes the default padding role at a chosen breakpoint
- **THEN** only that scope changes padding and ordinary sections retain 64px at the same viewport width

#### Scenario: Role independence

- **WHEN** a consumer overrides section sibling separation or a specific Section padding role
- **THEN** the other role and unselected presets remain independent

### Requirement: Passive accessible composition

Section SHALL preserve child margins and native DOM/tab order, allow content growth and shrinking, and leave overflow/focus visible. It SHALL work during SSR with standalone/combined CSS without JS stylesheet imports, browser globals or layout effects. Documentation SHALL distinguish Section padding from Container gutters and parent gaps.

#### Scenario: Narrow enlarged content

- **WHEN** a representative Section/Container/Stack/SimpleGrid composition renders at 320px with 200% text and user spacing
- **THEN** child content reflows, section height grows and native focus remains visible

#### Scenario: Server-rendered geometry

- **WHEN** server markup receives tokens and Section CSS before hydration
- **THEN** the documented padding applies without client layout logic
