# Spec Delta

## Purpose

Provide an optional passive content wrapper that consistently bounds and centers page content while supplying responsive horizontal gutters.

## ADDED Requirements

### Requirement: Small native layout API

The library SHALL export Container, ContainerProps, and ContainerStyle. Container SHALL render a div, accept native div attributes, children, className, forwarded refs and typed --fs-* styles, and support size reading/content/wide with content default and boolean gutters with true default. It SHALL require no providers, browser globals, stylesheet imports in JavaScript, or client layout logic.

#### Scenario: Default native composition

- **WHEN** a consumer renders Container with children, an ID, ref, class and styles
- **THEN** it renders a native div retaining those inputs with the content preset and gutters enabled

### Requirement: Bounded centered geometry

Container SHALL use border-box sizing, width 100% of available parent width, auto inline margins, and a maximum inclusive of gutters: reading 720px, content 1120px, wide 1440px. It SHALL support shrinking within flex/grid and use logical properties for RTL. It SHALL NOT clip overflow or focus rings.

#### Scenario: Wide viewport

- **WHEN** each preset is rendered inside an 1800px-wide parent
- **THEN** its outer width is respectively 720px, 1120px, or 1440px and its inline margins center it

#### Scenario: Narrow parent

- **WHEN** a flex/grid parent offers less width than the preset maximum
- **THEN** Container shrinks to the available width without imposing a minimum based on its children

### Requirement: Responsive optional inline gutters

Container SHALL provide 16px inline padding below 600px viewport width and 24px at or above 600px. gutters=false SHALL remove only inline padding, preserving centering and the selected maximum. Corporate and Luna SHALL share all initial layout values.

#### Scenario: Breakpoint boundary

- **WHEN** viewport width changes from 599px to 600px
- **THEN** each enabled inline gutter changes from 16px to 24px without increasing the constrained outer width

#### Scenario: Nested inset ownership

- **WHEN** a child Container is rendered with gutters=false inside an inset parent
- **THEN** it adds no second gutter while preserving its own maximum and centering

### Requirement: Narrow passive responsibility

Container SHALL add no surface, border, shadow, fixed height, vertical padding, keyboard behavior, section semantics, or child layout. Documentation SHALL explain that parents own vertical spacing, children own layout and overflow handling, and reading is a width preset rather than guaranteed text line length. Ordinary flex/grid wrappers SHALL remain supported.

#### Scenario: Independent child layout

- **WHEN** a consumer composes sections and a grid within Container
- **THEN** the semantic sections and child layout come from the consumer, and Container only bounds, centers and gutters them

### Requirement: Additive theme tokens and packaging

Both themes SHALL provide Container maximum-width and gutter semantic roles referencing primitives directly. Generated CSS and reference documentation SHALL use the token tooling. Scoped overrides and explicit nested-theme resets SHALL work; existing spatial tokens SHALL remain unchanged. Container SHALL be exported through public JavaScript/types and standalone/combined stylesheets with deterministic SSR.

#### Scenario: Scoped override and theme reset

- **WHEN** an ancestor overrides a Container maximum and gutters and includes a nested explicit theme
- **THEN** the outer Container inherits the overrides, the nested theme restores default values, and unrelated siblings retain defaults

### Requirement: Discoverable verified examples

Storybook SHALL show all presets, responsive gutters, opt-out, nesting, overrides, both themes, and composition with existing components. Demonstration guides SHALL be distinguished from Container appearance. Verification SHALL cover actual geometry, RTL, themes, focus clearance, SSR, native props, 320px reflow, and enlarged text without concealing child overflow.

#### Scenario: Enlarged content and keyboard use

- **WHEN** representative content is viewed at 320px with 200% text and user spacing and controls receive keyboard focus
- **THEN** content remains usable and focus rings remain visible without Container clipping
