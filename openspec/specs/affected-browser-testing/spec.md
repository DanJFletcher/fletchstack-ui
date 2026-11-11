# affected-browser-testing Specification

## Purpose

Select browser suites affected by a change without losing composition, stylesheet or legacy verification dependencies, and explain the evidence behind the selection.

## Requirements

### Requirement: Explicit affected browser command

The repository SHALL provide `npm run test:e2e:affected -- --base <git-ref>` with optional `--dry-run`. It SHALL select from the complete harness and retained E2E inventory, execute selected suites without coverage, and preserve assertion/setup/teardown failure exit statuses. It MUST NOT claim that selected execution is complete CI verification.

#### Scenario: Selected execution fails
- **WHEN** a selected harness or retained Storybook test fails
- **THEN** the command exits nonzero and identifies the failed scope
- **AND** does not reinterpret the result as an empty successful selection

### Requirement: Complete change discovery

Selection SHALL include the union of branch changes from merge-base to HEAD, staged changes, unstaged changes and nonignored untracked files. It SHALL handle whitespace in paths and consider both old and new names for renames. Changed browser tests SHALL be selected directly.

#### Scenario: Mixed worktree changes
- **WHEN** a branch edit, a staged stylesheet, an unstaged scenario and an untracked browser test coexist
- **THEN** every change contributes to selection even if some edits cancel in a combined diff

### Requirement: Scenario dependency selection

Selection SHALL connect each harness suite to its scenarios and follow supported transitive component and stylesheet dependencies, including composed consumers. Browser navigation or scenario identifiers alone MUST NOT be treated as proof of dependency ownership. Shared registry membership alone MUST NOT make unrelated isolated scenarios owners of every component.

#### Scenario: Composed consumer changes
- **WHEN** Button changes and a CodeBlock scenario imports a component that composes Button
- **THEN** both relevant Button and CodeBlock suites are selected
- **AND** output explains the transitive relationship

#### Scenario: Isolated CodeBlock change
- **WHEN** only CodeBlock implementation changes and the complete ownership inventory establishes no other consumer
- **THEN** CodeBlock's browser owners are selected without unrelated Button-only suites merely because both scenarios use one harness

#### Scenario: Scoped CSS change
- **WHEN** a component stylesheet or its supported imported stylesheet changes
- **THEN** every mapped scenario or retained suite consuming that CSS is selected
- **AND** unresolved cascade influence triggers full fallback

### Requirement: Retained suite accountability

Affected selection SHALL account for browser tests not migrated into the harness, including composed consumers and served-Storybook integration. Missing or stale ownership metadata MUST NOT silently omit such suites. New or changed scenarios and tests without proven ownership SHALL force full fallback or an actionable discovery error.

#### Scenario: Button used in an unmigrated composition
- **WHEN** Button changes while a retained Storybook composition exercises it
- **THEN** that suite is selected through declared ownership or the complete E2E inventory runs

#### Scenario: Ownership inventory drifts
- **WHEN** a newly discovered browser suite has no validated ownership declaration
- **THEN** the command refuses a precise subset and reports the missing ownership
- **AND** runs the full inventory if discovery is otherwise valid

### Requirement: Conservative fallback

Shared tokens, generated/global styles, browser infrastructure, dependencies/public exports, unknown runtime inputs, deleted or renamed dependencies, and unavailable comparison history SHALL select the complete E2E inventory with reasons. Fallback MUST include both harness and retained suites, not only the pilot.

#### Scenario: Shared token changes
- **WHEN** a theme token changes
- **THEN** every harness and retained E2E suite is selected
- **AND** the output identifies the shared-input fallback

#### Scenario: Missing base history
- **WHEN** a valid base argument cannot resolve to usable comparison history
- **THEN** the full E2E inventory runs with a history-unavailable explanation

### Requirement: Distinct selection outcomes

The command SHALL distinguish selected execution, full fallback, safely empty selection and discovery/usage errors. Empty success SHALL require every changed input to be proven unrelated. Invalid arguments, non-Git directories, unreadable required metadata or inability to discover the complete test inventory SHALL fail rather than claim a successful fallback.

#### Scenario: Planning-only change
- **WHEN** all changed files are explicitly classified as unrelated planning documents and have no browser owners
- **THEN** the command reports safely empty without launching browsers

#### Scenario: Unknown source owner
- **WHEN** a runtime source file changes but has no discovered owners
- **THEN** the result is full fallback rather than safely empty

### Requirement: Explainable side-effect-free discovery

Dry runs SHALL report the resolved base, HEAD, merge-base, changed paths, selected project/file pairs, dependency or fallback reasons and outcome deterministically. They MUST NOT execute test bodies, launch browsers or servers, build bundles, generate tokens, or write coverage or cache artifacts. Execution SHALL use the same selection policy.

#### Scenario: Dry run for a stylesheet edit
- **WHEN** a developer previews affected selection with `--dry-run`
- **THEN** the command explains the stylesheet owners or fallback without modifying generated files
- **AND** a subsequent execution on the same repository state selects the same suites

### Requirement: Selection correctness evidence

Selection SHALL be validated against complete-inventory discovery and controlled regressions in component, transitive composition, CSS and shared-input cases. Tests SHALL cover changed tests/scenarios, missing history, rename/deletion, unknown ownership and safely unrelated inputs. Runtime evidence SHALL include discovery overhead rather than infer gains from selected test counts.

#### Scenario: Transitive regression probe
- **WHEN** a controlled Button regression affects CodeBlock's copy control
- **THEN** affected selection includes the CodeBlock owner and its assertion detects the regression
- **AND** the restored selected checks pass without hiding an owner found by complete verification
