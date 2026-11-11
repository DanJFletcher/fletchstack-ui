# Spec Delta

## Purpose

Guide agents to choose a proportionate testing cadence while preserving intended behavior, meaningful verification, and accurate completion evidence across development workflows.

## ADDED Requirements

### Requirement: Behavioral expectations precede implementation

Agents SHALL establish intended observable behavior, important edge cases, and relevant verification boundaries before implementing a behavior change. Existing specifications or a concise checklist SHALL suffice when they capture the contract; a separate planning document MUST NOT be universally required.

#### Scenario: Routine component behavior
- **WHEN** an agent adds a component state with an approved pattern
- **THEN** it identifies the public API, expected interactions, and applicable accessibility behavior before implementation
- **AND** reuses existing requirements rather than producing a mandatory new planning artifact

### Requirement: Proportionate test cadence

Guidance SHALL permit incremental TDD, batched test-first, and implementation followed by tests based on task uncertainty and risk. An explicit user-selected workflow SHALL take precedence. Routine changes MUST NOT require a justification report or extra approval solely for selecting a supported cadence.

#### Scenario: Implementation followed by tests
- **WHEN** an agent implements a routine feature with a clear contract and no explicit TDD request
- **THEN** it can implement a coherent increment before authoring its behavioral tests
- **AND** it still runs applicable verification before completion

#### Scenario: Batched test-first development
- **WHEN** several related examples clarify a precise behavioral contract
- **THEN** the agent can author them together and implement the corresponding coherent behavior
- **AND** it is not required to alternate implementation with every assertion

### Requirement: Consistent TDD activation

The TDD skill SHALL be selected for an explicit request or a deliberate task-specific choice, rather than merely because it is installed or behavior changes. Other testing and component skills SHALL defer cadence selection to the shared policy. When incremental TDD is selected, it SHALL retain meaningful failing-test, passing-test, and behavior-preserving cleanup evidence.

#### Scenario: Component skill activation
- **WHEN** the component-building or React testing skill is used for a new feature
- **THEN** its instructions do not automatically require the TDD skill

#### Scenario: Explicit incremental TDD request
- **WHEN** the user requests incremental TDD
- **THEN** the agent observes the focused behavior test fail for the intended reason before implementation and pass afterward
- **AND** it distinguishes setup failures from behavioral failures

### Requirement: Regression reproduction

For bug fixes, agents SHALL reproduce the defect with a focused failing regression test before changing production code where feasible, then verify the fix with that test. If pre-fix reproduction is infeasible, agents SHALL explain the concrete limitation, use the available verification, and report the missing evidence without fabricating red results.

#### Scenario: Disabled control regression
- **WHEN** a disabled component incorrectly invokes its public callback and can be reproduced locally
- **THEN** the agent observes a callback-suppression test fail before the fix and pass afterward

#### Scenario: Unavailable reproduction environment
- **WHEN** a bug requires an unavailable environment to reproduce
- **THEN** the agent reports that limitation and the verification it actually performs
- **AND** it does not claim to have reproduced the defect

### Requirement: Refactoring baseline

Agents SHALL establish passing coverage of affected public behavior before a behavior-preserving refactor. Missing coverage SHALL be addressed with relevant characterization checks. A refactor MUST NOT require introducing a synthetic failing behavior solely to satisfy a development sequence.

#### Scenario: Internal implementation cleanup
- **WHEN** an agent restructures a component without changing its public contract
- **THEN** it verifies the relevant baseline and reruns appropriate checks after the change
- **AND** no artificial red step is required

### Requirement: Expectations grounded in intent

Test expectations SHALL derive from requirements, public contracts, or independently justified examples. Implementation inspection SHALL remain permitted for discovering cases and integration details, but current output alone MUST NOT establish expected behavior. Conflicts between tests and code SHALL be resolved against the contract rather than by weakening assertions solely to pass.

#### Scenario: Implementation encodes the wrong rule
- **WHEN** current code returns a negative price but the contract requires a minimum price of zero
- **THEN** the test expects zero and exposes the disagreement
- **AND** the expected value is not copied from the current implementation

#### Scenario: Incorrect generated test
- **WHEN** a generated assertion contradicts an established contract
- **THEN** the agent corrects the assertion using that contract and verifies the resulting test

### Requirement: Proportionate failure evidence

Guidance SHALL require meaningful test execution but MUST NOT require observing every routine test fail. Focused failure probes SHALL be used when needed to resolve a concrete concern about assertion effectiveness. Reporting SHALL distinguish final passing behavior from observed regression reproduction and deliberate failure probes.

#### Scenario: Valid test added after implementation
- **WHEN** a contract-based test passes on its first run after implementation
- **THEN** the agent can report the successful behavioral check without reverting or breaking code solely to manufacture red
- **AND** it does not report a pre-fix failure it never observed

#### Scenario: Suspected false positive
- **WHEN** an assertion may pass without exercising the intended behavior
- **THEN** the agent checks that concern with a focused failure probe or equivalent concrete evidence
- **AND** restores any temporary perturbation before final verification

### Requirement: Verification remains required

All cadences SHALL retain coverage-free focused/affected development feedback and conservative selection safeguards. Full independent coverage gates SHALL run at the final boundary defined by test-coverage-execution. Affected results MUST NOT be presented as complete verification. Final failures SHALL use coverage-free focused repair followed by failed or invalidated full gates when ready; unchanged valid results need not repeat. Other required checks SHALL remain mandatory.

#### Scenario: Uncertain affected selection
- **WHEN** an affected run cannot establish a safe precise selection
- **THEN** its existing conservative fallback remains applicable regardless of test cadence

#### Scenario: Regression discovered at completion
- **WHEN** final verification fails after focused tests passed
- **THEN** the agent reproduces and repairs the failure using coverage-free focused feedback and repeats failed or invalidated full gates at the next final-verification boundary
- **AND** reports any remaining blocker rather than claiming a complete pass

### Requirement: Design review without mandatory delegation

Agents SHALL review touched implementation for concrete design and maintenance concerns separately from interpreting passing tests. Testing guidance MUST NOT universally require a separate agent, isolated context, or additional review document; inline review SHALL be sufficient when appropriate to the task.

#### Scenario: Small component change
- **WHEN** a component's tests pass after a bounded change
- **THEN** the agent checks the changed API and implementation for clarity and appropriate responsibilities
- **AND** it need not create a second agent or separate report to satisfy that review
