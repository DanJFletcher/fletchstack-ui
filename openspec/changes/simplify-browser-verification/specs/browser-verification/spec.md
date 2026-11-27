# Spec Delta

## Purpose

Provide maintainable browser verification with explicit behavior ownership, fast coverage-free execution, and diagnostic coverage that does not require redundant tests of demonstration code.

## ADDED Requirements

### Requirement: Coverage-free browser execution

The default `npm run test:e2e` command SHALL execute the complete focused browser suite without collecting or reporting JavaScript coverage. Filtered execution SHALL apply the same policy. Browser assertion, setup, and teardown failures MUST remain failures, with existing failure diagnostics preserved.

#### Scenario: Complete default execution

- **WHEN** a developer or CI runs `npm run test:e2e` without filters
- **THEN** every test in the focused browser suite runs without coverage collection or percentage enforcement
- **AND** coverage artifacts and caches from previous diagnostic runs are neither read as evidence nor modified

#### Scenario: Focused development execution

- **WHEN** a developer supplies a file or test filter to the default command
- **THEN** the selected tests can pass without satisfying an unrelated complete-source coverage inventory
- **AND** a failing selected assertion produces a nonzero exit status

### Requirement: Opt-in diagnostic browser coverage

The `npm run test:e2e:coverage` command SHALL explicitly collect browser coverage and publish separate production and story/demo/preview summaries. The report MUST include eligible unloaded modules, identify filtering, and label percentages as diagnostic. Incomplete percentages SHALL NOT fail the command; collection/reporting errors and test failures SHALL fail it.

#### Scenario: Unloaded runtime code

- **WHEN** diagnostic execution leaves an eligible production or demonstration module unvisited
- **THEN** the module appears as uncovered in its respective inventory rather than disappearing from the report
- **AND** incomplete percentages alone do not fail execution

#### Scenario: Failed diagnostic collection

- **WHEN** diagnostic collection or report generation fails, or expected browser coverage data is absent
- **THEN** the command fails with an actionable error rather than reporting successful measurement

#### Scenario: Filtered diagnostic run

- **WHEN** diagnostic execution uses a test filter
- **THEN** the report identifies the selected scope and retains unloaded-file accounting
- **AND** it does not describe the result as complete browser-behavior verification

### Requirement: Independent production coverage gates

Unit and integration verification SHALL continue to enforce their existing independent 100% per-file statements, branches, functions, and lines thresholds over the unchanged production scope. Neither story execution nor browser diagnostic counters SHALL satisfy those gates.

#### Scenario: Missing production coverage in one layer

- **WHEN** an included executable production file is insufficiently covered in the unit or integration layer
- **THEN** that layer fails independently of results from every other layer

### Requirement: Browser behavior ownership

The project SHALL maintain a browser-behavior matrix identifying applicable guarantees and their owning assertions. It MUST cover native interaction, CSS/layout, theme boundaries, focus, responsive/enlarged/spaced text, RTL, preferences, SSR/hydration, and served-Storybook integration. Non-applicable entries MUST have a reason; JavaScript coverage SHALL NOT substitute for behavior assertions.

#### Scenario: A layout primitive is verified

- **WHEN** browser verification for a layout primitive is reviewed
- **THEN** the matrix identifies checks for its actual geometry, narrow-parent behavior, order, RTL, hidden participation, and focus clearance where applicable
- **AND** theme parity and scoped reset behavior remain covered without requiring every functional case to run in every theme

#### Scenario: Browser preferences affect a component

- **WHEN** a component responds to reduced motion or forced colors
- **THEN** the matrix identifies browser checks that exercise the applicable preference and assert the resulting observable behavior

### Requirement: Evidence-backed test consolidation

Every removed or consolidated browser check SHALL have a recorded rationale and a surviving assertion that proves its relevant guarantee and integration boundary. Story rendering and play checks MAY be owned by the story-testing layer, but native input, pre-hydration styling, selective CSS loading, and distributed-package behavior MUST NOT be replaced solely by simulated DOM interactions.

#### Scenario: Redundant story smoke is removed

- **WHEN** a served-story render-success check is removed
- **THEN** the same story remains discoverable and exercised by the story-testing layer
- **AND** representative served-preview lifecycle and failure propagation checks remain

#### Scenario: A native-input assertion is evaluated

- **WHEN** a native keyboard/typeahead check is considered redundant with a simulated selection interaction
- **THEN** native browser input coverage remains assigned to an actual browser assertion

### Requirement: Served-Storybook and delivery boundaries

Complete verification SHALL retain story rendering/play/accessibility checks and focused served-Storybook checks for manager navigation, preview lifecycle, public story/documentation IDs, and theme toolbar integration. Representative SSR/hydration and built-package browser guarantees SHALL remain verified. A failing play function MUST NOT be accepted as a successful served preview.

#### Scenario: Served preview play fails

- **WHEN** a story play function fails during a retained served-preview journey
- **THEN** the journey fails rather than racing ahead or treating visible content as successful completion

#### Scenario: Development preview and packaged styles differ

- **WHEN** complete verification runs
- **THEN** the distributed-style browser boundary is exercised independently of Storybook's globally loaded development styles

### Requirement: Measured simplification

Each simplification stage SHALL record comparable before/after runtime evidence and its behavior-ownership changes. Reports MUST distinguish wall time from summed worker duration and separate measured phases from unavailable timing data. Performance improvements SHALL NOT be claimed from test-count reductions alone.

#### Scenario: Runtime changes are evaluated

- **WHEN** a simplification stage is assessed
- **THEN** its evidence records checkout, environment, worker count, selected checks, coverage mode, and cold or reused server state
- **AND** it reports startup, test execution, coverage collection, and report generation separately where measured, identifying unmeasured boundaries explicitly

#### Scenario: Removed checks are validated

- **WHEN** a stage removes duplicated checks
- **THEN** surviving assertions are validated against representative controlled regressions at the relevant boundaries
- **AND** complete required verification remains successful or pre-existing failures are separately reproduced and recorded
