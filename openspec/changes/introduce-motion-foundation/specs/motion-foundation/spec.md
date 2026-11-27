# Spec Delta

## Purpose

Provide consistent, customizable motion across the component library while respecting reduced-motion preferences and keeping interaction behavior independent of animation.

## ADDED Requirements

### Requirement: Shared semantic motion tokens

The library SHALL expose semantic duration tokens for fast, standard, slow, and spinner motion and easing tokens for standard, enter, and exit motion in both Corporate and Luna. Themes SHALL initially share the same values. Motion values SHALL use the existing validated token pipeline.

#### Scenario: Default timing and easing

- **WHEN** either theme's generated motion tokens are consumed
- **THEN** fast, standard, slow, and spinner durations resolve to 100ms, 160ms, 240ms, and 1000ms respectively
- **AND** standard, enter, and exit easing resolve to cubic-bezier(0.2, 0.8, 0.2, 1), cubic-bezier(0.2, 1, 0.3, 1), and cubic-bezier(0.5, 0, 0.9, 0.3) respectively

#### Scenario: Scoped customization

- **WHEN** a consumer overrides a semantic motion token within a component's ancestor
- **THEN** motion using that token adopts the override without changing unrelated scopes
- **AND** reduced-motion behavior remains effective

### Requirement: Consumer motion follows system preference

In consumer applications, library motion SHALL follow the browser's reduced-motion preference, including changes during the session. Reduced motion SHALL stop Spinner rotation and remove Accordion panel and chevron transitions while preserving their final states and essential content. Consumer behavior MUST NOT depend on Storybook preview overrides.

#### Scenario: Reduced motion requested

- **WHEN** reduced motion is requested while an animated Accordion and Spinner are rendered
- **THEN** Accordion panels and chevrons change immediately and Spinner does not rotate
- **AND** disclosure state, content availability, loading status, and status text remain correct

#### Scenario: System preference changes

- **WHEN** the system preference changes between full and reduced motion without reloading
- **THEN** existing components adopt the new motion behavior
- **AND** their semantic state and keyboard behavior remain unchanged

### Requirement: Interaction behavior is independent of animation

Motion SHALL NOT delay focus indication, activation, semantic state updates, or keyboard access rules. Collapsed Accordion content SHALL become unavailable to keyboard and screen-reader users immediately, including during an exit transition. Essential behavior SHALL remain functional without animation completion events.

#### Scenario: Panel closes during keyboard use

- **WHEN** a keyboard user closes an Accordion panel with panel motion enabled
- **THEN** the trigger reports its collapsed state immediately and its focus indicator remains visible
- **AND** the next Tab skips links inside the closed panel before any visual transition completes

#### Scenario: Rapid activation

- **WHEN** an animated disclosure is toggled again before the previous transition finishes
- **THEN** content availability and expanded state match the latest activation
- **AND** the final visible state settles correctly without a required animation callback

### Requirement: Existing component motion remains compatible

Accordion SHALL keep its existing default immediate panel changes, opt-in expand motion, and standard chevron timing. Spinner SHALL retain its default one-second rotation and existing component rotation customization token while supporting the shared spinner duration token.

#### Scenario: Existing Accordion consumer

- **WHEN** a consumer renders Accordion without enabling panel motion
- **THEN** panels change immediately and chevrons use the existing standard timing when motion is permitted

#### Scenario: Existing Spinner customization

- **WHEN** a consumer sets the existing spinner rotation-seconds token
- **THEN** that token continues to determine the rotation duration
- **AND** without that override the shared spinner duration token controls rotation

#### Scenario: Combined Spinner customization

- **WHEN** a consumer sets the shared spinner duration to 500ms and the existing numeric rotation-seconds token to 2
- **THEN** effective rotation duration is 1000ms, combining the shared duration with the legacy numeric factor

### Requirement: Storybook motion preview modes

Storybook SHALL provide System, Reduced, and Full motion modes, defaulting to System. System SHALL follow the browser preference; Reduced SHALL suppress library motion; Full SHALL allow normal library motion even when the browser requests reduction. Overrides SHALL apply only inside Storybook previews and SHALL survive theme changes and story navigation until changed by the user.

#### Scenario: Mode and system preference matrix

- **WHEN** a user selects each mode under either browser motion preference
- **THEN** System follows the browser, Reduced suppresses motion, and Full permits motion
- **AND** both Accordion and Spinner follow the selected mode

#### Scenario: Returning to System

- **WHEN** a user changes the theme or navigates between stories with an explicit motion mode selected
- **THEN** that mode remains effective
- **AND** selecting System removes the override and follows the current browser preference

#### Scenario: Consumer isolation

- **WHEN** the distributed library is used outside Storybook
- **THEN** the Storybook toolbar and preference override behavior are absent
- **AND** real reduced-motion preferences remain authoritative

### Requirement: Motion foundation documentation and examples

Storybook SHALL include a discoverable Motion foundation page explaining token roles, defaults, preference modes, purposeful use, and customization. Interactive examples SHALL demonstrate duration and easing differences, Accordion disclosure, and Spinner loading in both themes. Authoring guidance SHALL describe reduced-motion alternatives and animation-independent accessibility.

#### Scenario: Inspecting motion

- **WHEN** a user opens the Motion foundation and tries its examples under System, Reduced, and Full
- **THEN** the examples reflect the selected mode and active theme
- **AND** documented token values agree with the generated theme values

#### Scenario: Authoring guidance

- **WHEN** a component author consults the motion guidance
- **THEN** it explains timing and easing selection, immediate focus and state changes, reduced-motion behavior, and observable-state verification without fixed sleeps
- **AND** it states that future JavaScript-driven motion must honor the same preference contract
