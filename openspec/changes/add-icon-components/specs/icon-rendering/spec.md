# Spec Delta

## Purpose

Provide a consistent, accessible SVG foundation for consumer-supplied artwork that composes with existing controls and works across themed, server-rendered websites.

## ADDED Requirements

### Requirement: Consumer-supplied SVG composition

The library SHALL export Icon and its TypeScript props. Icon SHALL render one SVG root containing consumer-supplied SVG children, accept a custom viewBox, forward a native SVG ref, and support className, style, and compatible native SVG attributes without overriding its accessibility contract.

#### Scenario: Custom artwork and coordinate space

- **WHEN** a consumer renders Icon with path/group children, a custom viewBox, className, style, and a data attribute
- **THEN** the SVG preserves that artwork, coordinate space, and customization
- **AND** its forwarded ref refers to the SVG root

### Requirement: Decorative default

An Icon without a nonblank label SHALL be hidden from the accessibility tree and SHALL NOT create a keyboard tab stop. Empty or whitespace-only labels SHALL behave as an omitted label.

#### Scenario: Decorative artwork beside a label

- **WHEN** an unlabeled Icon is composed inside a Button containing visible text
- **THEN** the Button's accessible name contains the visible text without an additional image name
- **AND** the SVG has aria-hidden="true" and focusable="false"

#### Scenario: Blank label

- **WHEN** Icon receives an empty or whitespace-only label
- **THEN** it retains decorative semantics

### Requirement: Meaningful icon naming

An Icon with a nonblank label SHALL expose an image role and an accessible name equal to its trimmed label. It SHALL remain non-focusable. The label API SHALL own naming and prevent conflicting role, aria-hidden, aria-label, aria-labelledby, or tabIndex props from overriding this contract.

#### Scenario: Standalone meaningful image

- **WHEN** Icon receives label=" Night mode "
- **THEN** assistive technology can identify an image named "Night mode"
- **AND** the SVG introduces no keyboard tab stop

### Requirement: Shared semantic sizing

Icon SHALL support small, medium, and large sizes, defaulting to medium. Both themes SHALL supply the same semantic icon size and stroke-width tokens. Initial dimensions SHALL be 16px, 20px, and 24px respectively, with a stroke width of 2 SVG user units. Scoped semantic overrides SHALL change the corresponding rendering without component edits.

#### Scenario: Default and explicit sizes

- **WHEN** a consumer renders an Icon with no size and Icons with each supported size
- **THEN** their dimensions are 20px and 16px/20px/24px respectively in Corporate and Luna

#### Scenario: Local size and stroke overrides

- **WHEN** a containing region overrides an icon semantic size or stroke-width custom property
- **THEN** applicable Icons in that region use the overridden value
- **AND** unaffected siblings retain their own values

### Requirement: Inherited color and theme scope

Icon's default artwork styling SHALL use currentColor so it inherits its context's resolved color, including Button hover, active, focus-visible, and disabled states. Explicit SVG paint attributes for custom artwork SHALL remain supported. Nested explicit theme scopes SHALL reset the icon token contract consistently with existing theme behavior.

#### Scenario: Stateful control composition

- **WHEN** an unlabeled Icon is rendered inside a Button in either theme and the control changes supported interaction states
- **THEN** the icon follows the control's text color without a separate state implementation

#### Scenario: Nested region resets an override

- **WHEN** an outer region overrides icon size and a nested region explicitly selects the other theme
- **THEN** the nested region restores that theme's icon size contract

### Requirement: Layout and interaction ownership

Icon SHALL own only its SVG rendering and intrinsic dimensions, with no external margin or interactive control behavior. Button SHALL continue to own its internal label/icon gap, padding, keyboard activation, and focus. An icon-only Button SHALL receive its accessible name on the Button while its child Icon remains decorative.

#### Scenario: Named icon-only action

- **WHEN** a Button labeled "Close dialog" contains only an unlabeled Icon
- **THEN** keyboard users encounter one button named "Close dialog" and no separate focusable image

#### Scenario: Enlarged text and narrow layout

- **WHEN** Icon and a long Button label are rendered at 320px with 200% text enlargement and text-spacing overrides
- **THEN** the label wraps without horizontal page overflow or clipped text
- **AND** the icon does not acquire external margins or change Button's spacing ownership

### Requirement: Server-compatible package consumption

Icon SHALL be available through public package exports with declarations, explicit stylesheet imports, and external React peers compatible with the existing React 18/19 range. Initial markup SHALL be deterministic without browser globals, runtime asset requests, random IDs, or hydration-only theme selection.

#### Scenario: Packed consumer rendering

- **WHEN** a temporary consumer installs the packed library, imports Icon and its styles, and server-renders it with supported React versions
- **THEN** declarations resolve, styles bundle, and repeated renders produce matching markup
- **AND** hydrating the component produces no mismatch

### Requirement: Storybook contract documentation

Storybook SHALL demonstrate custom SVG artwork, all sizes, decorative and meaningful modes, both themes, scoped token overrides, and labeled/icon-only Button composition. Automated accessibility checks SHALL remain enabled as test failures.

#### Scenario: Discoverable component examples

- **WHEN** a maintainer opens Icon's Storybook examples
- **THEN** they can inspect the supported modes and use the existing Corporate/Luna toolbar
- **AND** automated checks reject accessibility violations in those examples
