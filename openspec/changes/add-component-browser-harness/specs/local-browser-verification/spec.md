# Spec Delta

## Purpose

Reduce repeated local browser work while keeping complete CI verification and accurately reporting the evidence for each change.

## ADDED Requirements

### Requirement: Scoped local completion

Agents SHALL use focused browser tests during iteration and verify affected browser suites at local completion when impact is known. Selection MUST include dependent compositions and retained browser boundaries. Before automatic selection is available, explicit suite selection SHALL state its ownership rationale; unknown impact SHALL require complete local browser verification.

#### Scenario: Bounded component edit
- **WHEN** a component implementation or scoped stylesheet changes and its browser owners are known
- **THEN** local completion runs its affected suites and dependent compositions
- **AND** unrelated browser suites need not run locally solely to finish that task

#### Scenario: Manual selection during rollout
- **WHEN** the affected command is not yet available
- **THEN** the agent lists the chosen browser suites and their relationship to the changes
- **AND** uses complete execution if it cannot establish all relevant owners

### Requirement: Conservative full local verification

Changes to shared tokens, generated/global styles, browser infrastructure, dependency or public-export configuration, and inputs with uncertain impact SHALL require complete local browser verification. Scoped component CSS SHALL qualify for affected execution only when its consumers and cascade dependencies are accounted for.

#### Scenario: Shared theme token edit
- **WHEN** a shared token or generated theme stylesheet changes
- **THEN** local verification includes the complete component/legacy browser suite, served-Storybook checks and all Storybook render/play/accessibility checks

#### Scenario: Unknown stylesheet influence
- **WHEN** a stylesheet change cannot be classified as local to proven owners
- **THEN** selection falls back to complete browser verification with an explanation

### Requirement: Independent gates remain intact

The scoped browser policy SHALL preserve independent full unit and integration coverage thresholds and scopes, plus existing lint, type, build, SSR and package obligations. Complete CI SHALL run all harness tests, retained browser tests and all Storybook render/play/accessibility checks. Affected execution MUST NOT replace a required complete CI gate.

#### Scenario: Local affected browser pass
- **WHEN** selected browser suites pass for a component change
- **THEN** the unchanged full unit/integration coverage gates and other applicable verification obligations remain required
- **AND** CI still executes every browser suite

### Requirement: Failure repair follows impact

After a browser failure, agents SHALL reproduce and repair it with focused checks, then rerun verification appropriate to the final changes. A browser failure alone MUST NOT require repeating every unrelated local suite. Shared repairs or uncertain impact SHALL require a complete local run, and failed required CI SHALL be rerun completely after repair.

#### Scenario: Local scenario repair
- **WHEN** a failure is fixed by a change confined to a known component scenario
- **THEN** the focused regression and affected browser suites run on the final state
- **AND** unrelated local browser checks need not be repeated solely because a failure occurred

#### Scenario: Shared readiness repair
- **WHEN** a fix changes shared browser readiness or harness setup
- **THEN** complete local browser verification runs after the focused reproduction passes

### Requirement: Truthful completion evidence

Reports SHALL identify executed browser scope, fallback reasons, failures, unrun checks and whether complete CI remains pending. A local affected pass MUST NOT be described as complete repository verification. Known failures outside the selected scope SHALL remain visible and MUST NOT be hidden by selection or treated as resolved.

#### Scenario: Known documentation failure
- **WHEN** affected component tests pass while a previously observed documentation-navigation failure remains unresolved
- **THEN** the report distinguishes the component pass from the outstanding failure
- **AND** does not claim complete browser verification or merge readiness

### Requirement: Consistent agent guidance

Current repository testing guidelines, component guidance, applicable skills and contributor documentation SHALL use the same scoped browser completion policy. Historical verification reports and prior change artifacts SHALL remain historical records rather than being rewritten as current policy.

#### Scenario: Component or TDD workflow
- **WHEN** an agent follows either workflow after the policy update
- **THEN** it receives the same affected-browser completion and full-fallback rules
- **AND** explicit TDD cadence and independent production coverage requirements remain intact
