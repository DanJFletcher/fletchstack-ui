# Spec Delta

## Purpose

Provide accessible tabs for switching related panels within one view while preserving panel state, theme inheritance, and predictable keyboard interaction.

## ADDED Requirements

### Requirement: Public item-driven component

The library SHALL export Tabs, TabsProps, TabsItem, and TabsStyle through its standard entry points. Tabs MUST accept a named tab list and readonly items with unique nonempty IDs, visible labels, renderable content, and optional disabled flags. The native div root MUST forward its ref, attributes, handlers, class name, and scoped style overrides.

#### Scenario: Public consumer composition

- **WHEN** a consumer supplies a Workspace label and Overview, Activity, and disabled Settings items
- **THEN** a named Workspace tab list exposes three labeled tabs in source order
- **AND** supplied root customization, native handlers, and the HTMLElement ref remain effective

#### Scenario: Invalid item identities

- **WHEN** items contain duplicate or blank IDs
- **THEN** Tabs rejects the ambiguous configuration with a clear error

### Requirement: Controlled and uncontrolled selection

Tabs SHALL support value and onValueChange for controlled selection and defaultValue for initial uncontrolled selection. Without a valid initial selection, it MUST select the first enabled item. Pointer activation MUST select an enabled tab in either activation mode; activating a disabled or already selected tab MUST NOT issue a selection-change callback.

#### Scenario: Uncontrolled selection

- **WHEN** an uncontrolled instance starts without defaultValue and a user activates Activity
- **THEN** Overview is initially selected, followed by Activity after activation
- **AND** onValueChange receives Activity's ID once

#### Scenario: Controlled request

- **WHEN** a controlled instance with value Overview receives an Activity activation
- **THEN** it requests Activity through onValueChange but continues displaying Overview until the parent changes value

#### Scenario: Explicit initial selection and no-op activation

- **WHEN** defaultValue names Activity and the user activates Activity or disabled Settings
- **THEN** Activity remains selected and no change callback fires

### Requirement: Independent focus and activation modes

Tabs SHALL default to automatic activation and support manual activation. Focus movement MUST select the destination in automatic mode and leave selection unchanged in manual mode until Enter or Space activates it. Selected styling and keyboard focus MUST remain visually distinct.

#### Scenario: Automatic activation

- **WHEN** Overview is selected and the user moves focus to Activity in automatic mode
- **THEN** Activity becomes focused and selected and its panel is displayed

#### Scenario: Manual activation

- **WHEN** Overview is selected and the user arrows to Activity in manual mode
- **THEN** Activity receives the focus ring while Overview and its panel remain selected
- **AND** Enter or Space selects Activity through the same selection contract as pointer activation

### Requirement: Native tab sequence and directional keyboard movement

Tab entry SHALL land on the selected enabled tab. Arrows MUST wrap through enabled tabs; Home and End MUST reach enabled boundaries. Horizontal lists MUST use Left/Right and mirror movement in RTL, while vertical lists MUST use Up/Down. Unrelated arrow keys and normal Tab/Shift+Tab movement MUST remain available to the browser.

#### Scenario: Tab leaves and re-enters a manual list

- **WHEN** focus moves to Activity without selecting it, then leaves and re-enters the tab list
- **THEN** selection remains Overview and tab-list entry returns to Overview
- **AND** Tab is not trapped among individual tabs

#### Scenario: Disabled skipping and boundary wrapping

- **WHEN** Settings is disabled and the user moves past Activity or uses Home/End
- **THEN** arrows wrap only between Overview and Activity and Home/End focus the first/last enabled tab

#### Scenario: Orientation and inherited direction

- **WHEN** the list is horizontal under inherited RTL or is vertical
- **THEN** horizontal Left/Right movement follows visual RTL order, or vertical Up/Down movement follows source order respectively
- **AND** horizontal Up/Down and vertical Left/Right are not intercepted

### Requirement: Accessible tab and panel relationships

Tabs SHALL use a named tablist, native button tabs with aria-selected and aria-controls, and panels labeled by their associated tabs. IDs MUST be unique across instances and stable through hydration. When focus is outside the list, only the selected tab MUST be its ordinary entry stop. The active panel MUST be keyboard reachable, including when it contains only text.

#### Scenario: Separate instances and SSR

- **WHEN** two instances share item IDs and are server-rendered then hydrated
- **THEN** each tab controls only its own labeled panel without ID collisions or hydration mismatches

#### Scenario: Text panel access

- **WHEN** a keyboard user tabs forward from a selected tab with plain-text content
- **THEN** focus can enter the active labeled panel before continuing through the page

#### Scenario: Nested tabs and forms

- **WHEN** Tabs is used inside a form or a panel contains another Tabs instance
- **THEN** tab buttons do not submit the form and nested keyboard movement affects only its owning list

### Requirement: Persistent hidden panel lifecycle

Inactive panels SHALL remain mounted and MUST be absent from keyboard navigation and the accessibility tree immediately. Switching tabs or reordering items with stable IDs MUST preserve their local state. Removing an item MUST remove its panel. Tabs MUST NOT defer visibility or semantic updates for animation.

#### Scenario: Stateful panel survives switching and reordering

- **WHEN** a user edits a control in Overview, selects Activity, reorders the items, and returns to Overview
- **THEN** the edited value is preserved
- **AND** Overview's controls were unreachable while its panel was inactive

#### Scenario: Item removal

- **WHEN** an item is removed from items
- **THEN** its panel is removed rather than retained as hidden application state

### Requirement: Deterministic dynamic fallback

If the selected ID disappears or becomes disabled, Tabs SHALL display the first enabled panel; with no enabled items it MUST show no selected panel. Uncontrolled fallback MUST become the stored selection. Controlled fallback MUST NOT rewrite the supplied value. Initialization and fallback MUST NOT emit interaction callbacks.

#### Scenario: Uncontrolled selection disappears

- **WHEN** selected Activity is removed and Overview remains enabled
- **THEN** Overview becomes the uncontrolled selection without onValueChange firing
- **AND** reintroducing Activity does not restore the former selection automatically

#### Scenario: Controlled invalid value

- **WHEN** a parent supplies an unavailable or disabled selected ID
- **THEN** the first enabled panel is displayed without a callback or parent-value mutation
- **AND** if the supplied ID later becomes enabled and available, it again determines the displayed panel

#### Scenario: Empty or all-disabled collection

- **WHEN** items is empty or every item is disabled
- **THEN** no panel is selected, no tab is a tab-list entry stop, and any supplied disabled tabs remain visible

### Requirement: Focus repair does not steal unrelated focus

When a focused tab disappears or becomes disabled, Tabs SHALL move focus to the effective selected enabled tab only if focus was in the affected list. Ordinary external value or item updates MUST NOT move focus from elsewhere. When no enabled tab remains after losing list focus, the list MUST offer a programmatic focus target without becoming an ordinary Tab stop.

#### Scenario: Focused item is removed

- **WHEN** Activity has focus and is removed while Overview remains enabled
- **THEN** focus moves to the effective selected Overview tab

#### Scenario: Background update

- **WHEN** focus is in an unrelated page control and selection falls back after an item update
- **THEN** that page control retains focus

#### Scenario: No focusable tab remains

- **WHEN** the focused list loses its last enabled tab
- **THEN** focus is retained on the named list as a programmatic target and no hidden panel receives focus

### Requirement: Responsive themed presentation

Tabs SHALL provide line and pills variants with line as default, horizontal orientation by default, and optional fullWidth distribution for horizontal lists. Labels MUST remain readable; horizontal overflow MUST scroll within the list rather than the page. Corporate, Luna, nested themes, and scoped overrides MUST use semantic tokens. Panel changes MUST be immediate by default.

#### Scenario: Supplied design sheet

- **WHEN** line/automatic and pills/manual examples render with Overview selected and disabled Settings
- **THEN** both show Workspace overview with 3 projects and 8 members
- **AND** the manual example can show Activity focused while Overview stays selected

#### Scenario: Full-width and overflowing labels

- **WHEN** fullWidth is enabled and labels fit, or a narrow container cannot fit them
- **THEN** tabs distribute across the available width when they fit and the list scrolls when necessary
- **AND** keyboard movement brings the focused tab into view without scrolling the whole page unexpectedly

#### Scenario: Theme and override isolation

- **WHEN** the same examples render in Corporate, Luna, and a nested theme with an override on one instance
- **THEN** theme-appropriate selected/focus/disabled states apply and neighboring instances remain unchanged

### Requirement: Consumer guidance and examples

Storybook SHALL document API types/defaults, automatic versus manual activation, controlled fallback, panel persistence, and overflow behavior under Navigation / Tabs. Stories MUST cover the sheet examples, both themes, controlled state, vertical/RTL, overflow/full-width, dynamic items, and an editable stateful panel. Documentation MUST explain that hidden mounted content can continue effects and fetching.

#### Scenario: Reproducible consumer usage

- **WHEN** a consumer opens Tabs documentation
- **THEN** a minimal usage example, prop defaults, named tab/panel relationships, and the requested behavior examples are available
- **AND** routing, closable tabs, lazy mounting, and panel animation are identified as outside this component's initial scope
