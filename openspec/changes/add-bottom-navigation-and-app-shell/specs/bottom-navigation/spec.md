# Spec Delta

## Purpose

Provide accessible bottom destination navigation that composes consumer-owned links and inherits the library's themes without owning routing or page positioning.

## ADDED Requirements

### Requirement: Named native navigation and public composition

The library SHALL expose `BottomNavigation`, `BottomNavigation.Item`, and their public types through its standard entry points. The root MUST require an accessible name, render a native navigation landmark containing an ordered-in-source unordered list, forward its ref as `HTMLElement`, and forward native attributes and handlers. Each Item MUST render one supplied link inside a list item.

#### Scenario: Native root contract

- **WHEN** a consumer provides `aria-label="Primary"`, an ID, a class, a click handler, and a root ref
- **THEN** the native nav exposes that name, receives the attributes and handler, and is the ref target
- **AND** its list contains one list item per supplied destination

#### Scenario: Labelled-by and type safety

- **WHEN** consumers compile usage of the public API
- **THEN** either `aria-label` or `aria-labelledby` satisfies the required navigation name
- **AND** omitting both names or supplying multiple sibling elements as one Item's child is rejected by the public types

### Requirement: Consumer-owned links remain intact

Each Item SHALL render its supplied anchor or anchor-producing custom link without replacing, cloning, or intercepting it. Link props, refs, nested handlers, visible label, icon, and native browser navigation MUST remain effective. There SHALL be one focusable destination link per Item.

#### Scenario: Native anchor behavior

- **WHEN** a user activates a Help anchor supplied with an href and nested content handlers
- **THEN** its handlers run with normal event propagation and its href is followed
- **AND** modified clicks, opening in a new tab, and copying the link destination retain native behavior

#### Scenario: Custom link and ref

- **WHEN** an Item receives a custom link component that renders an anchor with a forwarded ref
- **THEN** the anchor retains its supplied props, accessible name, href, and working ref without an additional focusable wrapper

### Requirement: Current appearance follows the anchor attribute

The rendered anchor's `aria-current="page"` SHALL determine current appearance, including on initial server render. BottomNavigation MUST NOT match URLs or maintain selection state. Focus indication MUST remain distinct from the current-destination indicator.

#### Scenario: Server-rendered native destination

- **WHEN** the initial server render marks Help with `aria-current="page"`
- **THEN** Help receives the current appearance without waiting for client effects

#### Scenario: Current destination changes

- **WHEN** the application moves `aria-current="page"` from Inbox to Help
- **THEN** the indicator and emphasized label move to Help
- **AND** keyboard focus on Inbox remains separately visible

#### Scenario: Real router navigation and history

- **WHEN** a consumer using real router links navigates to `/inbox/42`, then Help, then Back, then Forward
- **THEN** Inbox is current on the nested Inbox route and Help is current on Help whenever the consumer sets the corresponding anchor attribute
- **AND** navigation history and programmatic route changes update appearance without BottomNavigation-specific routing code

### Requirement: Equal-width accessible destination layout

Destinations SHALL occupy equal-width cells, with a decorative icon above each visible label and a rounded indicator behind the current icon. The anchor MUST fill its cell, including padding. Corporate, Luna, nested themes, and per-instance semantic style overrides MUST work. Labels MUST wrap without clipping or forcing horizontal page scrolling.

#### Scenario: Padded link target

- **WHEN** a user clicks inside a destination's padded cell area outside its icon and text
- **THEN** that cell's link activates

#### Scenario: Theme and narrow layout

- **WHEN** the same destinations render in Corporate, Luna, a nested theme, or a narrow container with a long label
- **THEN** active-theme semantic colors and focus styles apply, labels remain visible, and cells retain equal widths
- **AND** a scoped token override changes only the intended instance

### Requirement: Native keyboard navigation

BottomNavigation SHALL preserve document-order Tab and Shift+Tab navigation and native Enter activation. It MUST NOT add roving focus, arrow-key selection, or menu/tab widget roles.

#### Scenario: Focus differs from current destination

- **WHEN** Inbox is current and a keyboard user tabs through Home, Inbox, and Help
- **THEN** focus follows source order with a visible focus ring on each link
- **AND** Enter follows the focused destination while Shift+Tab reverses that order

### Requirement: Consumer examples and icon support

Storybook SHALL document the public API and show Inbox current, Help current, and focus on a non-current link. Examples MUST include mixed router/native links, mapped native destinations with keys on Item, theme inheritance, and bottom placement through AppShell and AppContent. Home, Inbox, and Help named icons SHALL be available through standard icon exports.

#### Scenario: Usable consumer documentation

- **WHEN** a consumer reads BottomNavigation documentation
- **THEN** they can copy examples for router links and server-rendered native anchors, find the API types, and follow a working long-content shell composition
- **AND** the documentation explains that the parent owns positioning and links own routing, icons, and labels
