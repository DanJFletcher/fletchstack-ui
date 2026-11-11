# Spec Delta

## Purpose

Provide safe and explainable unit and integration feedback during development while retaining complete verification and independent coverage gates before work is declared complete.

## ADDED Requirements

### Requirement: Project-specific affected commands

The project SHALL provide `npm run test:unit:affected -- --base <git-ref>` and `npm run test:integration:affected -- --base <git-ref>` to execute affected test files in their respective projects. They MUST NOT execute the Storybook or E2E projects.

#### Scenario: Unit development execution
- **WHEN** a developer invokes the unit affected command with a valid base
- **THEN** selection and execution are restricted to unit test files
- **AND** the command reports that it is partial development feedback

#### Scenario: Integration development execution
- **WHEN** a developer invokes the integration affected command
- **THEN** selected integration tests retain their actual DOM, SSR, filesystem, and Chromium environments
- **AND** other test projects are not executed

### Requirement: Complete change discovery

Affected commands SHALL include the union of changes from the base/HEAD merge-base to HEAD, staged changes, unstaged changes, and nonignored untracked files. They MUST preserve paths containing whitespace and consider both old and new paths for renames.

#### Scenario: Mixed local and branch changes
- **WHEN** branch changes, staged edits, unstaged edits, and an untracked test exist together
- **THEN** each contributes to selection without one diff cancelling another
- **AND** changed test files belonging to the requested project are selected directly

#### Scenario: Renamed or deleted runtime file
- **WHEN** a runtime dependency is renamed or deleted
- **THEN** the requested project runs completely with an explanation rather than relying on a missing current dependency edge

### Requirement: Explainable dependency selection

Affected execution SHALL include tests reached by supported import dependencies and changed tests in the requested project. Output MUST identify the resolved base, HEAD, merge-base, changed paths, selected files, and selection reasons. Broad dependency selections MUST NOT be presented as precise export-level analysis.

#### Scenario: Shared field implementation
- **WHEN** Field changes and Select or TextInput tests import dependent controls
- **THEN** those tests remain selected through their actual dependency chains
- **AND** output explains dependency-based selection

#### Scenario: Barrel-dependent consumer test
- **WHEN** a dedicated public-consumer test depends on a changed component through a barrel
- **THEN** it remains selected even when this makes selection broader than focused component tests

### Requirement: Conservative resource and configuration handling

Selection SHALL account for runtime inputs accessed outside imports through declared fallback rules. Shared tokens, generated styles, generation tooling, configuration, dependencies, public exports, and unknown runtime inputs MUST NOT silently produce an empty result. Component CSS changes MUST select the complete integration project.

#### Scenario: Stylesheet read through the filesystem
- **WHEN** Button CSS changes and integration fixtures read it without importing it
- **THEN** the integration affected command runs the complete integration project
- **AND** reports the stylesheet fallback

#### Scenario: Shared or unresolved input
- **WHEN** shared tokens or an unclassified runtime input change
- **THEN** each affected command runs its complete requested project with a reason

#### Scenario: Dynamically built hydration fixture
- **WHEN** a fixture entry changes that dependency discovery cannot follow
- **THEN** its declared owning suites or the complete integration project run

### Requirement: Safe selection outcomes

Commands SHALL distinguish selected execution, full fallback, safely empty selection, and errors. Missing comparison history or uncertain impact MUST fall back to the complete requested project. Invalid arguments, a non-Git directory, and inability to discover that project's inventory MUST fail with actionable errors.

#### Scenario: Missing base history
- **WHEN** the requested comparison cannot be resolved or has no usable merge-base
- **THEN** the command explains the limitation and runs the complete requested project

#### Scenario: Safely empty selection
- **WHEN** all changes are explicitly classified as unrelated to the requested project
- **THEN** the command reports safely empty selection and succeeds without running tests

#### Scenario: Unexpected empty dependency result
- **WHEN** a changed runtime file has no known test owners and cannot be proven irrelevant
- **THEN** the command falls back rather than reporting a successful empty run

#### Scenario: Broken discovery
- **WHEN** the command cannot discover the requested project's test inventory
- **THEN** it exits nonzero instead of claiming either an empty or full successful run

### Requirement: Side-effect-free dry run

Both commands SHALL support `--dry-run` to report the same selection policy without executing tests, launching browsers, generating tokens, or writing coverage artifacts. Selection output MUST be deterministic for the same repository state and identify any full fallback.

#### Scenario: Integration dry run
- **WHEN** the integration command is invoked with `--dry-run`
- **THEN** selected files and reasons are displayed without running setup hooks or test bodies
- **AND** no Chromium instance or generated token output is created

### Requirement: Coverage and failure isolation

Affected commands SHALL disable coverage collection in selected and full-fallback modes and preserve existing coverage artifacts. Independent per-file 100% gates and scopes MUST remain unchanged through the explicit full `test:unit:coverage` and `test:integration:coverage` commands required by CI; default project commands SHALL disable coverage. Selected test failures and execution errors MUST yield a nonzero exit status.

#### Scenario: Partial development pass
- **WHEN** selected tests pass without executing the entire production inventory
- **THEN** the affected run can succeed without claiming a complete coverage result
- **AND** existing unit and integration reports remain unchanged

#### Scenario: Selected failure
- **WHEN** a selected test fails or its setup fails
- **THEN** the affected command fails without converting the outcome into an empty selection

### Requirement: Focused and consumer test boundaries

Focused unit/integration tests and fixtures SHALL use direct implementation imports where barrel imports unnecessarily broaden selection. Real component dependencies and assertions MUST remain intact. Dedicated tests MUST retain public-export, consumer-composition, and installed-package confidence without changing production exports.

#### Scenario: Focused import migration
- **WHEN** a Button test or hydration fixture is migrated from the public barrel
- **THEN** its behavior assertions and server/client boundaries are preserved
- **AND** unrelated leaf components cease to be dependencies solely through that barrel

#### Scenario: Public interface compatibility
- **WHEN** focused tests use implementation imports
- **THEN** dedicated consumer tests still verify supported public exports and representative compositions
- **AND** existing packaged-consumer verification remains required

### Requirement: Development and completion workflow

Selected incremental TDD SHALL retain a specific failing test for red, the same test for green and affected feedback during refactoring. All cadences SHALL follow test-coverage-execution: coverage-free development and full independent coverage gates at final readiness of the agreed scope. Failures SHALL use coverage-free focused repair followed by failed or invalidated full gates when ready; unchanged valid results need not repeat. Other required checks SHALL remain mandatory.

#### Scenario: Iterative TDD
- **WHEN** an agent develops a behavior in red-green-refactor cycles
- **THEN** it observes the specific test fail meaningfully and pass after the implementation
- **AND** uses affected runs for related feedback without weakening fallback rules

#### Scenario: Final verification failure
- **WHEN** complete verification exposes a regression outside the selected tests
- **THEN** the agent fixes it with coverage-free focused execution and, when ready, repeats failed or invalidated full gates before reporting completion

### Requirement: Measured selection validation

The change SHALL validate selection against representative full-project results and controlled regressions. Runtime evidence MUST record workload, environment, worker settings, coverage mode, and discovery overhead. Fewer selected files alone MUST NOT be claimed as a measured runtime gain.

#### Scenario: Selection correctness and performance review
- **WHEN** affected execution is evaluated after import migration
- **THEN** evidence compares selections and full-project results for implementation, CSS, tokens, fixtures, and test-only changes
- **AND** reports observed timings and limitations without replacing full CI gates
