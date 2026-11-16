# Spec Delta

## Purpose

Provide reusable application layout primitives that keep persistent navigation visible while allowing page content to scroll without overlapping that navigation.

## ADDED Requirements

### Requirement: Public shell and content primitives
The library SHALL export AppShell, AppContent, and their public props and scoped style types through standard entry points. Both components MUST forward native attributes, class names, styles, handlers, and root refs. AppContent MUST render a main landmark by default and support a div root when the consumer already has a main landmark.

#### Scenario: Standalone application semantics
- **WHEN** a consumer renders AppContent inside AppShell without an element override
- **THEN** AppContent renders a main landmark and both roots expose their forwarded attributes and refs

#### Scenario: Embedded showcase semantics
- **WHEN** a shell is placed inside an existing main landmark with `AppContent as="div"`
- **THEN** the content region renders as a div without creating a nested main landmark

### Requirement: Persistent rows and independent content scrolling
AppShell SHALL allocate space for one direct AppContent region and persistent siblings in source order. AppContent MUST scroll within the remaining height. A bottom navigation sibling MUST stay visible and occupy its actual rendered height, including wrapped labels and safe-area padding, without covering content or requiring a matching padding value on the content region.

#### Scenario: Long page with navigation
- **WHEN** a user scrolls long content in a finite-height shell with BottomNavigation after AppContent
- **THEN** the navigation remains visible at the shell's bottom and the last content element can scroll fully above it
- **AND** an optional header before AppContent remains visible above the scrolling region

#### Scenario: Navigation height changes
- **WHEN** labels wrap or the effective bottom safe-area inset changes
- **THEN** the shell reserves the resulting navigation height automatically without adding the safe-area inset twice

### Requirement: Viewport and parent sizing
AppShell SHALL support viewport-height sizing by default and an explicit parent-height mode. Parent-height mode MUST fit a definite-height containing region without claiming the whole viewport. BottomNavigation itself MUST remain in normal layout flow without viewport-fixed or sticky positioning.

#### Scenario: Viewport application
- **WHEN** a standalone application uses the default AppShell sizing with a normalized page container
- **THEN** the shell fills the available viewport height and its content scrolls independently above navigation

#### Scenario: Embedded application
- **WHEN** AppShell uses parent-height mode inside a definite-height preview
- **THEN** it fits that preview, and scrolling its content leaves surrounding page content and navigation placement independent

#### Scenario: Navigation without shell
- **WHEN** BottomNavigation is rendered in an ordinary page without AppShell
- **THEN** it occupies normal document flow at the parent's chosen position

### Requirement: Theme and layout ownership
The layout primitives SHALL inherit active semantic theme tokens and support documented per-instance style overrides. AppContent MUST leave content spacing to consumers. The documented composition MUST identify which component owns bottom safe-area padding and provide an override for embedded contexts.

#### Scenario: Two themed shells
- **WHEN** Corporate and Luna shells render with a scoped override on only one instance
- **THEN** each inherits its own theme and only the targeted instance changes
- **AND** consumers can supply their own content spacing without compensating for a hidden default padding contract

### Requirement: Storybook explains bottom placement
Storybook documentation for BottomNavigation, AppShell, and AppContent SHALL cross-link the composition and explain viewport versus parent sizing, definite parent height, independent scrolling, automatic height reservation, and safe-area ownership. A working long-content example MUST demonstrate that no manual bottom padding or base fixed positioning is necessary.

#### Scenario: Documentation makes placement reproducible
- **WHEN** a consumer opens any of the three components' Storybook documentation
- **THEN** they can find a copyable composition, sizing requirements, a long-content demonstration, and links to the other two components
- **AND** the examples explain using `as="div"` inside an existing main landmark
