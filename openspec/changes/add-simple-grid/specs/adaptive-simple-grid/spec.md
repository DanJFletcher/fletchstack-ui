# Spec Delta

## Purpose

Provide an optional passive collection layout with equal-width columns that automatically adapt to the available parent width while preserving native reading and interaction order.

## ADDED Requirements

### Requirement: Adaptive equal-width columns
SimpleGrid SHALL distribute participating direct children into equal-width auto-fit columns with a 240px preferred minimum, shrinking to a single parent-width column below that minimum. Rows SHALL size to their tallest child without fixed heights or reordered content.

#### Scenario: Parent width selects tracks
- **WHEN** six items are placed in 800px, 520px and 200px parents at one viewport width
- **THEN** they form three, two and one columns respectively with no grid-imposed horizontal overflow

#### Scenario: Sparse collection
- **WHEN** fewer children exist than could fit at the preferred minimum
- **THEN** occupied columns expand equally without reserving empty columns

### Requirement: Semantic spacing and customization
SimpleGrid SHALL expose gap none, related and group with related as default, using zero, the existing related gap and group stack roles for both axes. Both themes SHALL share geometry and a scoped overridable preferred-item-width role with nested theme resets.

#### Scenario: Scoped role override
- **WHEN** a consumer overrides the preferred minimum or selected gap in a scope
- **THEN** that scope responds to the override, siblings remain independent and nested explicit themes restore their defaults

### Requirement: Passive native wrapper
SimpleGrid SHALL export its component, props and typed style API, render a div, forward refs and native attributes, preserve classes and styles, and add no semantics or keyboard behavior. It SHALL add no padding, surface, border, clipping or descendant margin resets.

#### Scenario: Native interaction order
- **WHEN** keyboard users traverse a wrapped collection of links or buttons
- **THEN** native DOM order and visible focus remain intact without an extra grid tab stop

#### Scenario: Hidden children and consumer margins
- **WHEN** children are hidden or consumers supply child margins
- **THEN** hidden children reserve no track or gap and consumer margins remain effective

### Requirement: Package and accessible compositions
SimpleGrid SHALL work with server rendering and standalone or combined CSS, without JavaScript layout logic or CSS imports. Documentation and stories SHALL show responsive parents, spacing, themes, overrides, Container composition and accessible narrow enlarged-text layouts.

#### Scenario: CSS before hydration
- **WHEN** server-rendered markup receives tokens and SimpleGrid CSS without client execution
- **THEN** columns adapt to parent width and retain the documented geometry

#### Scenario: Narrow collection
- **WHEN** representative cards render at 320px with enlarged text and user text spacing
- **THEN** supported content reflows, rows grow and focus remains visible
