# component-browser-harness Specification

## Purpose

Provide lightweight, isolated component scenarios for real-browser verification without requiring the Storybook rendering and interaction lifecycle.

## Requirements

### Requirement: Independently addressable scenarios

The harness SHALL expose independently addressable scenarios for Button, Stack and CodeBlock through one browser application. Each scenario SHALL render only the components and composition needed for its behavior, with explicit styles and theme inputs. Tests MUST NOT require loading a page containing every component or executing Storybook play functions.

#### Scenario: Native Button form behavior

- **WHEN** a test opens the Button native-form scenario
- **THEN** it can exercise real keyboard, submit, reset and disabled behavior on that form
- **AND** unrelated gallery components and Storybook interactions do not alter the starting state

### Requirement: Observable readiness and errors

Opening a scenario SHALL finish only when its intended UI is ready for interaction. Unknown scenarios, loading failures, rendering failures and uncaught browser errors SHALL fail the test with useful diagnostics. Readiness MUST NOT rely on arbitrary sleeps or treat visible partial markup as successful initialization.

#### Scenario: Scenario cannot render

- **WHEN** a scenario throws while mounting or its module cannot load
- **THEN** the test fails identifying the scenario and error rather than continuing against stale content

### Requirement: Independent test state

Each test SHALL start with independent DOM, React state, theme, styles, browser preferences, permissions and controlled browser API state. State-changing scenarios SHALL clean up on success and failure. Any context reuse optimization MUST demonstrate equivalent isolation before adoption.

#### Scenario: Clipboard failure follows success

- **WHEN** clipboard success and unavailable-API scenarios run consecutively or in reversed order
- **THEN** each observes its own configured API behavior and fresh component state

#### Scenario: Theme and preference isolation

- **WHEN** a forced-color Luna scenario precedes a default Corporate scenario
- **THEN** the latter retains its intended default preferences, theme and styles

### Requirement: Browser guarantees survive migration

Every migrated assertion SHALL retain its browser behavior, applicable themes and environment coverage, with a recorded owner. The pilot SHALL preserve native input, geometry, focus, responsive/enlarged/spaced text, scoped themes, RTL and applicable preference checks. A passing DOM test or JavaScript coverage percentage MUST NOT replace those browser assertions.

#### Scenario: CodeBlock migration

- **WHEN** CodeBlock checks move into the harness
- **THEN** real clipboard copying, native scrolling/focus, syntax paint and contrast, wrapping, theme resets and applicable preference assertions remain exercised
- **AND** SSR, selective stylesheet and packaged-style checks keep their separate owners

### Requirement: Distinct Storybook boundaries remain

Complete verification SHALL retain all Storybook render/play/accessibility tests, served manager/toolbar/navigation/public-ID/preview-lifecycle checks, and unmigrated component browser suites. Only proven equivalent migrated assertions SHALL be removed from their former location. The harness MUST NOT be presented as validating Storybook delivery.

#### Scenario: Button component checks migrate

- **WHEN** native Button and styling assertions use the harness
- **THEN** Storybook args, toolbar and served-preview assertions remain verified through Storybook
- **AND** the behavior matrix identifies both boundaries

### Requirement: Coverage-free default execution

Ordinary complete and affected harness runs SHALL avoid JavaScript coverage collection and preserve existing diagnostic artifacts. Existing opt-in diagnostics SHALL remain available with explicit execution scope; missing collection data or reporting errors MUST NOT become successful results. Unit/integration coverage scopes and thresholds SHALL remain unchanged.

#### Scenario: Focused harness execution

- **WHEN** a developer runs one harness suite without requesting diagnostics
- **THEN** its browser assertions determine success without unrelated coverage gates
- **AND** previous coverage reports are not used or overwritten as evidence for that run

### Requirement: Measured pilot acceptance

Pilot evidence SHALL compare equivalent retained workloads under recorded environment, workers, tracing, coverage and server conditions. It SHALL report repeated warm-run medians/ranges, separate startup observations, selection overhead and actual outcomes. Migration beyond Button, Stack and CodeBlock SHALL require a separate decision based on measured benefit and preserved behavior.

#### Scenario: Harness performance is evaluated

- **WHEN** the pilot is reviewed
- **THEN** evidence reports at least three comparable warm runs per implementation plus separate fresh-server observations
- **AND** distinguishes wall time, test sums, workload changes and unmeasured phases

#### Scenario: Pilot shows no reliable benefit

- **WHEN** the matched pilot is not faster or loses a required behavior assertion
- **THEN** no broader migration is performed and the former assertion owners remain or are restored
- **AND** the report states the limitation without claiming a speedup from fewer tests
