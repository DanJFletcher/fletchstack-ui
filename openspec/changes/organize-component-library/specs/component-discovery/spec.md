# Spec Delta

## Purpose

Help consumers find the library's public components, understand their supported composition, and reach working examples through stable Storybook links as the library grows.

## ADDED Requirements

### Requirement: Browse components by function
Storybook SHALL organize current component families under Components/Actions, Components/Forms, Components/Surfaces, and Components/Visuals. Public component names SHALL remain recognizable and searchable. Atomic/composed classifications SHALL NOT determine the primary navigation hierarchy.

#### Scenario: Find an editing control
- **WHEN** a consumer browses Components/Forms
- **THEN** Checkbox, Field, FieldLabel, FieldDescription, FieldError, FormGroup, Select, TextInput, and Textarea are discoverable by their public names

#### Scenario: Find other component families
- **WHEN** a consumer browses Actions, Surfaces, or Visuals
- **THEN** Button is under Actions, Card is under Surfaces, and Icon is under Visuals

### Requirement: Document independently reusable public components
Each independently reusable public component SHALL have a discoverable documentation entry and a working, meaningfully composed example demonstrating its own contract. Examples of labels and messages SHALL include the control and associations needed to demonstrate accessible usage.

#### Scenario: Explore a standalone field atom
- **WHEN** a consumer opens FieldLabel, FieldDescription, or FieldError from Forms
- **THEN** its documentation identifies its public props and shows its relationship to an actual labeled control or composed field
- **AND** the consumer can reach the related Field composition

### Requirement: Document compound parts with their family
Parts intended for use within a compound component SHALL be documented with their owning family, including their available props and representative composition. Compound documentation SHALL preserve the existing public part names without requiring a separate primary sidebar page for every part.

#### Scenario: Compose a card
- **WHEN** a consumer opens Card documentation
- **THEN** they can discover CardHeader, CardContent, CardFooter, CardMedia, CardTitle, and CardDescription and see them used together

### Requirement: Present examples in a predictable order
Component documentation SHALL present the playground before applicable state, variant/size, composition, customization, and theme-comparison examples. Unsupported example categories SHALL be omitted. Existing specialized examples SHALL remain reachable even when they do not fit the standard sequence.

#### Scenario: Read Textarea examples
- **WHEN** a consumer opens Textarea
- **THEN** its playground, supported states, composition/customization examples, and both-theme comparison follow a consistent order
- **AND** length guidance, controlled editing, reset ownership, and other existing specialized examples remain reachable

### Requirement: Preserve existing story permalinks
Every pre-migration story and documentation ID SHALL continue to resolve to its corresponding example or guidance after file relocation and title changes. An existing ID SHALL NOT be reassigned to an unrelated example. Changing navigation SHALL NOT require consumers to update existing bookmarked preview URLs.

#### Scenario: Open an existing component preview
- **WHEN** a consumer opens `components-textarea--both-themes`
- **THEN** the Textarea theme comparison renders successfully under Components/Forms/Textarea

#### Scenario: Open the existing icon gallery
- **WHEN** a consumer opens `components-icon--gallery`
- **THEN** the searchable gallery renders under Components/Visuals/Icon
- **AND** its catalog, search, clear, preview settings, and accessibility behavior remain available

#### Scenario: Follow an existing design-system link
- **WHEN** a consumer opens an existing Foundation, Tokens, Spatial System, or Spatial Examples documentation/story ID
- **THEN** the corresponding guidance or runnable example still resolves and its linked examples remain usable

### Requirement: Keep design guidance and patterns distinct
Design System SHALL retain Foundation, Tokens, Spatial System, and Spatial Examples. A Patterns/Forms guide SHALL direct consumers to existing multi-component form examples without introducing a new product workflow or duplicating those examples' implementations. Empty speculative pattern categories SHALL NOT be presented.

#### Scenario: Discover a multi-control composition
- **WHEN** a consumer opens Patterns/Forms
- **THEN** they can follow links to the existing related-controls composition and native-form examples
- **AND** those links open the canonical runnable stories

### Requirement: Preserve accessible and themed discovery
Reorganized documentation and examples SHALL retain Corporate/Luna theme selection, native control semantics, accessible labels and message relationships, keyboard usability, and visible focus. Touched preview layouts SHALL remain usable at 320 CSS pixels with 200% text and the existing user text-spacing overrides.

#### Scenario: Read a new field-atom example in either theme
- **WHEN** a consumer selects Corporate or Luna and uses a field-atom example by keyboard
- **THEN** the control has its intended name, description, validation state, and visible focus

#### Scenario: Edit the controlled Textarea counter example
- **WHEN** a consumer edits the controlled Textarea example with its counter enabled in either theme
- **THEN** the consumer change handler receives the multiline edits and retains the exact value
- **AND** the counter derives its length from that controlled value without restoring stale text

#### Scenario: Read narrow enlarged examples
- **WHEN** a touched example is displayed at 320 CSS pixels with 200% text, 1.5 line height, 0.12em letter spacing, 0.16em word spacing, and 2em paragraph spacing
- **THEN** its labels, messages, and controls remain readable and usable without clipped content or page-level horizontal overflow

### Requirement: Preserve package boundaries while organizing discovery
Existing public runtime/type exports, stylesheet entrypoints, token names/defaults, and component behavior SHALL remain compatible. Published library JavaScript and declarations SHALL exclude documentation-only examples, gallery metadata, and test code. Unused named-icon removal SHALL remain effective.

#### Scenario: Use the package after reorganization
- **WHEN** an existing consumer builds and server-renders the package using its current imports and stylesheets
- **THEN** the same exported components/types and styled behavior remain available
- **AND** the package does not acquire Storybook, test, or example runtime dependencies

#### Scenario: Bundle one named icon
- **WHEN** a consumer bundles one existing named icon
- **THEN** unused named artwork and the documentation gallery implementation remain absent
