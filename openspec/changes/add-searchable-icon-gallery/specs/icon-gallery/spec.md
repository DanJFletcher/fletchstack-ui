# Spec Delta

## Purpose

Help consumers discover appropriate named icons through an accessible, searchable Storybook gallery without adding discovery code to the installable component library.

## ADDED Requirements

### Requirement: Browse the complete named collection
Storybook SHALL provide Components/Icon/Gallery containing one card per supplied named icon. Each card SHALL show its artwork, exact export name, and intended use. An empty search SHALL display all eight initial icons in the existing catalog order.

#### Scenario: Initial gallery
- **WHEN** a consumer opens the Gallery story
- **THEN** MoonIcon, SunIcon, CheckIcon, CloseIcon, ChevronDownIcon, ArrowRightIcon, PlusIcon, and ExternalLinkIcon each appear once with artwork and intended use
- **AND** the visible result count is eight

### Requirement: Search names, uses, and keywords
The gallery SHALL update results immediately as the query changes. Search SHALL perform case-insensitive literal substring matching against each icon's export name, intended use, and curated keywords after trimming the query's surrounding whitespace. Results SHALL preserve catalog order without duplicating an icon that matches multiple fields.

#### Scenario: Export-name search ignores case and surrounding whitespace
- **WHEN** the consumer enters "  mOoN  "
- **THEN** only MoonIcon appears
- **AND** the result count is one

#### Scenario: Intended-use search
- **WHEN** the consumer enters "mode"
- **THEN** MoonIcon and SunIcon appear in catalog order
- **AND** the result count is two

#### Scenario: Synonym keyword search
- **WHEN** the consumer enters "add"
- **THEN** PlusIcon appears even though its export name does not contain "add"

#### Scenario: Dismissal keyword search
- **WHEN** the consumer enters "dismiss"
- **THEN** CloseIcon appears

#### Scenario: Whitespace-only query
- **WHEN** the consumer enters only whitespace
- **THEN** all eight icons remain visible

#### Scenario: Special characters are literal
- **WHEN** the consumer enters "["
- **THEN** search does not throw or interpret the query as a regular expression
- **AND** zero matching icons are reported

### Requirement: Clear the current search
The gallery SHALL provide an explicit Clear search control. Activating it SHALL empty the query, restore the complete collection and count, and return focus to the search input. Clearing an already empty query SHALL not alter the complete collection.

#### Scenario: Recover from a filtered result
- **WHEN** the consumer activates Clear search after entering "moon"
- **THEN** the input becomes empty, all eight cards return, and the result count is eight
- **AND** the search input receives focus

### Requirement: Helpful empty state
When no icons match, the gallery SHALL show a visible no-results message, a zero result count, and guidance to try another term or clear the search. Search and Clear search SHALL remain available without navigating away.

#### Scenario: No matching icon
- **WHEN** the consumer enters "no-such-icon"
- **THEN** no icon cards appear and a helpful no-results message and zero count are visible
- **AND** clearing the query restores the complete collection

### Requirement: Accessible search and feedback
The search input SHALL have a persistent visible label and a searchbox role. Result-count updates SHALL be available as polite status feedback without moving focus during typing. Search and clear controls SHALL be keyboard operable with visible focus. Cards SHALL remain non-interactive and introduce no keyboard stops; artwork SHALL be decorative because card text identifies it.

#### Scenario: Keyboard-only filtering and recovery
- **WHEN** the consumer focuses Search icons, types "add", tabs to Clear search, and activates it by keyboard
- **THEN** PlusIcon is initially the sole result and the complete collection is subsequently restored
- **AND** focus returns to Search icons, with no card-selection control in the tab order

#### Scenario: Filtering preserves typing focus
- **WHEN** the consumer edits a query that changes the number of results
- **THEN** focus stays in Search icons and the updated count is exposed through a status region

### Requirement: Responsive and themed presentation
Gallery surfaces, text, spacing, artwork, and controls SHALL remain legible and usable with Corporate and Luna selected through the existing toolbar. Cards and text SHALL reflow at 320 CSS pixels with 200% text enlargement and text-spacing overrides without clipped names, controls, or page-level horizontal overflow.

#### Scenario: Search under either theme
- **WHEN** the consumer selects Corporate or Luna and searches for an icon
- **THEN** the gallery follows that theme and its search, results, empty state, and clear control remain usable

#### Scenario: Narrow and enlarged gallery
- **WHEN** the gallery is displayed at 320px with 200% text enlargement, 1.5 line height, 0.12em letter spacing, and 0.16em word spacing
- **THEN** export names and descriptions wrap, controls remain usable, and the page has no horizontal overflow

### Requirement: Preserve catalog and library boundaries
The existing Catalog story SHALL continue to display every named icon at all three sizes in both themes. Gallery search, keywords, and metadata SHALL remain outside public package exports and production library JavaScript, with no new runtime dependency or request to an external search service.

#### Scenario: Comparison catalog remains available
- **WHEN** the consumer opens Components/Icon/Catalog after using the gallery
- **THEN** all eight icons remain present at small, medium, and large sizes in Corporate and Luna

#### Scenario: No library discovery runtime
- **WHEN** a consumer installs and bundles the library using existing named imports
- **THEN** no gallery UI, search implementation, or keyword registry is included
- **AND** existing unused-icon-removal behavior is preserved

### Requirement: Reference-driven gallery presentation
The Gallery SHALL use the user's approved visual reference: a breadcrumb strip, compact heading and subtitle, search toolbar, centered bordered cards in up to four columns, monospaced export names, and an import/accessibility footer. Its semantic gallery tokens SHALL exist in both themes, with legible supporting text and visible keyboard focus. Cards SHALL wrap without fixed-height clipping.

#### Scenario: Desktop collection
- **WHEN** the Gallery is viewed at 1024 CSS pixels
- **THEN** the eight icons appear in two rows of four centered cards
- **AND** their exact names and intended uses remain visible

### Requirement: Preview settings
The Gallery SHALL provide native radio controls for 16, 20, and 24px artwork, defaulting to 24px, and a labeled theme selector. The default Storybook option SHALL inherit the existing toolbar theme; Corporate and Luna SHALL establish a local explicit scope. Settings SHALL preserve the query and results.

#### Scenario: Keyboard preview-size selection
- **WHEN** a consumer selects 16px and presses ArrowRight in the size group
- **THEN** 20px is selected and the displayed artwork changes size
- **AND** the collection and query remain unchanged

#### Scenario: Local theme selection
- **WHEN** a consumer selects Luna, then Corporate, then Storybook
- **THEN** the Gallery applies each explicit theme and finally returns to toolbar inheritance
- **AND** the cards remain non-interactive
