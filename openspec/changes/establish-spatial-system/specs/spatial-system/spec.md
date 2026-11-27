# Spec Delta

## Purpose

Provide a consistent, documented spatial vocabulary that helps component authors and website consumers choose spacing, preserve hierarchy, and customize layout without coupling unrelated dimensions.

## ADDED Requirements

### Requirement: Preferred spacing scale

The system SHALL document and supply raw spacing values of 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, and 96 CSS pixels. Guidance SHALL distinguish component detail from group and page-section separation and explain that a 4px working rhythm does not require every dimension to be divisible by four.

#### Scenario: Choosing spacing for a website

- **WHEN** an author consults the spatial guide
- **THEN** they can compare the scale visually and find examples for label gaps, action groups, container padding, and page sections
- **AND** the guide explains the intended relationship behind each example

### Requirement: Distinct spatial concerns and exceptions

Documentation SHALL distinguish spacing, sizing, shape/boundary geometry, and layout constraints. Precision exceptions SHALL state their purpose; existing 10px Button padding SHALL remain a documented 2px precision adjustment. Borders, radii, focus geometry, control minima, and column widths SHALL NOT be advertised as general spacing steps.

#### Scenario: Reviewing a non-scale value

- **WHEN** an author encounters a 3px focus ring, 6px radius, 44px control minimum, or 200px column constraint
- **THEN** the guide classifies its spatial purpose without treating it as a spacing-scale failure
- **AND** a 1px technical edge inset is documented as boundary compensation rather than a general spacing option

### Requirement: Shared semantic spacing vocabulary

Both themes SHALL provide the following public CSS properties with identical initial px values: --fs-space-gap-label (8), --fs-space-gap-actions (12), --fs-space-gap-related (16), --fs-space-stack-group (24), --fs-space-inset-container (24), and --fs-layout-section-gap (64). The token reference SHALL document intended uses, and components and consumer examples SHALL use semantic tokens.

#### Scenario: Selecting an action gap

- **WHEN** a consumer uses --fs-space-gap-actions in a wrapping parent layout
- **THEN** adjacent actions have a default 12px gap in Corporate and Luna
- **AND** each Button retains ownership of its internal padding and label/icon gap

### Requirement: Two-layer token contract

Source tokens SHALL retain DTCG 2025.10 primitives containing raw values and semantics directly referencing primitives. Component-specific and shared meanings SHALL occupy the same semantic layer. Fixed spatial dimensions SHALL use px, tokenized font sizes SHALL use rem, and line height SHALL remain unitless where appropriate. Token generation SHALL continue rejecting invalid types, unresolved references, and cycles.

#### Scenario: Invalid semantic alias

- **WHEN** a new spatial semantic token references another semantic token instead of a primitive
- **THEN** generation rejects it under the existing two-layer contract

#### Scenario: Reproducible generation

- **WHEN** valid token sources are built twice without edits
- **THEN** generated CSS and the public reference are identical
- **AND** every theme supplies the same semantic names and types

### Requirement: Compatible existing defaults

Every existing public token name and its default value SHALL remain available. Default Button, Icon, and gallery geometry SHALL remain visually equivalent. Existing semantic customization SHALL retain its documented role behavior; intentional removal of incidental cross-role coupling SHALL be explained in a migration table with old usage, replacement role, and preserved default.

#### Scenario: Existing consumer styles

- **WHEN** a consumer continues using --fs-space-inline, --fs-space-stack, or --fs-space-inset
- **THEN** they remain 12px, 24px, and 24px respectively unless explicitly overridden
- **AND** existing exports and React component APIs remain unchanged

### Requirement: Independent gallery dimensions

Gallery search padding SHALL have semantic roles independent from control minimum height. Heading separation SHALL not be calculated from unrelated inset roles, and preview-group edge inset SHALL not use the border-thickness token as padding. Their new defaults SHALL preserve the existing rendered geometry.

#### Scenario: Search height override

- **WHEN** a consumer increases the gallery control-height token while leaving search padding unchanged
- **THEN** the control's minimum height changes without changing its horizontal or vertical padding
- **AND** existing wrapping, accessible names, and clear-search behavior remain intact

#### Scenario: Boundary and heading overrides

- **WHEN** a consumer changes gallery border thickness or its general inset token
- **THEN** preview edge padding and heading separation retain their independently defined values

### Requirement: Scoped and responsive spatial customization

New semantic spatial properties SHALL support document, sibling, nested-theme, and scoped consumer override patterns using the existing theme contract. Defaults SHALL match across Corporate and Luna; spatial density SHALL NOT change merely because the visual theme changes. Responsive examples SHALL use CSS and scoped semantic overrides without browser-dependent initial rendering.

#### Scenario: Nested theme reset

- **WHEN** an outer container overrides its action gap and includes a nested explicit Luna region
- **THEN** the override applies in the outer scope
- **AND** the nested region restores Luna's complete default contract while sibling scopes remain unaffected

#### Scenario: Narrow page-section example

- **WHEN** the responsive example is viewed at a 320px viewport
- **THEN** its section-gap role changes from the documented 64px desktop default to 32px through a scoped CSS override
- **AND** no library-wide breakpoint token or JavaScript viewport check is required

### Requirement: Discoverable spatial documentation

Storybook SHALL expose Design System/Spatial System with the preferred scale, annotated component and parent spacing, grouping guidance, exception examples, and links to runnable examples and the public token reference. Foundation and README documentation SHALL link to this guide. Examples SHALL expose real spacing changes and preserve keyboard and accessible-control semantics.

#### Scenario: Exploring the system in Storybook

- **WHEN** a consumer opens Spatial System from the static Storybook sidebar
- **THEN** the guidance and examples are available in both themes
- **AND** they can follow links to a working scoped-spacing example and the token reference

### Requirement: Resilient and accessible composition

Spatial examples and touched gallery layouts SHALL remain usable at 320 CSS pixels, with 200% text enlargement and user overrides of 1.5 line height, 0.12em letter spacing, 0.16em word spacing, and 2em paragraph spacing. They SHALL avoid clipping, fixed text-control heights, and page-level horizontal overflow. Target-size and focus-clearance requirements SHALL remain independent of spacing-scale choices.

#### Scenario: Enlarged and spaced content

- **WHEN** the specified enlargement and text-spacing overrides are applied in either theme
- **THEN** labels, controls, code examples, and groups wrap without losing content or functionality
- **AND** focus indicators remain visible and controls retain their minimum target sizes
