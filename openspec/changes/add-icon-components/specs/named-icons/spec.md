# Spec Delta

## Purpose

Supply a small, coherent catalog of optional SVG artwork that consumers can explicitly import while sharing the library's Icon rendering and accessibility contract.

## ADDED Requirements

### Requirement: Initial named catalog

The library SHALL export MoonIcon, SunIcon, CheckIcon, CloseIcon, ChevronDownIcon, ArrowRightIcon, PlusIcon, and ExternalLinkIcon as separate named components with public TypeScript props. Each component SHALL provide its own artwork without requiring consumers to supply children or perform a runtime name lookup.

#### Scenario: Explicit icon selection

- **WHEN** a consumer imports and renders any initial named icon
- **THEN** it renders the corresponding moon, sun, check, close, downward chevron, rightward arrow, plus, or external-link artwork
- **AND** no catalog-wide name registry or external asset request is required

### Requirement: Consistent artwork language

Each initial named icon SHALL use a 24×24 coordinate space, outline artwork, inherited currentColor, and consistent round line caps and joins. Artwork SHALL remain recognizable and unclipped at all supported Icon sizes. Its identity and geometry SHALL remain consistent across Corporate and Luna.

#### Scenario: Review the catalog across themes

- **WHEN** all eight named icons appear at small, medium, and large sizes in Corporate and Luna
- **THEN** each has a consistent outline treatment and recognizable, unclipped geometry
- **AND** changing theme changes inherited styling rather than replacing the artwork

### Requirement: Shared Icon contract

Named icons SHALL compose the public Icon foundation and preserve its sizing, decorative default, optional accessible label, ref forwarding, className/style customization, and compatible native SVG attributes. Their fixed artwork and coordinate space SHALL NOT be replaceable through children or viewBox props.

#### Scenario: Accessible named icon customization

- **WHEN** a consumer supplies SunIcon with a label, size, SVG ref, className, style, and data attribute
- **THEN** it exposes the supplied image name and customization through its SVG root
- **AND** its ref targets that root while the sun artwork and coordinate space remain intact

#### Scenario: Decorative catalog in a control

- **WHEN** an unlabeled CloseIcon is placed inside an aria-labeled Button
- **THEN** only the Button supplies the control's accessible name and keyboard interaction

### Requirement: Opt-in bundle behavior

A consumer production bundle importing one named icon SHALL be able to omit unused named icon artwork. Importing only Button SHALL NOT retain the icon catalog. Public exports SHALL remain compatible with the existing ESM package, declaration files, and external React peer dependencies.

#### Scenario: Single-icon consumer

- **WHEN** a temporary consumer builds an application importing only MoonIcon from the packed package
- **THEN** its optimized JavaScript retains moon artwork and omits artwork unique to the other seven named icons

#### Scenario: Existing Button-only consumer

- **WHEN** a temporary consumer builds an application importing only Button from the packed package
- **THEN** its optimized JavaScript contains no named icon artwork

### Requirement: Discoverable catalog and examples

Storybook and package documentation SHALL identify all eight exports, their intended uses, and the shared accessibility/customization contract. The existing private moon example SHALL use the public MoonIcon without changing Button's API or spacing responsibility.

#### Scenario: Find an appropriate named icon

- **WHEN** a consumer opens the Storybook catalog
- **THEN** they can identify each export, compare supported sizes and themes, and inspect labeled and decorative composition examples

#### Scenario: Existing Button composition remains usable

- **WHEN** a consumer views Button's label-and-icon and icon-only examples
- **THEN** those examples use the public MoonIcon while retaining their accessible names, keyboard behavior, and layout ownership
