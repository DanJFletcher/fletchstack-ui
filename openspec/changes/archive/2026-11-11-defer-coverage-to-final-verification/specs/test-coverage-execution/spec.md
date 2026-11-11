# Spec Delta

## Purpose

Control when agents collect code coverage so development feedback stays inexpensive while final local verification and required CI preserve independent production coverage gates.

## ADDED Requirements

### Requirement: Coverage-free development phase

Agents SHALL disable code coverage during baseline checks, implementation, debugging, test authoring and refactoring unless the user explicitly requests coverage. Test scope and coverage collection SHALL be independent decisions; a full development fallback MUST remain coverage-free.

#### Scenario: Refactoring baseline
- **WHEN** an agent must establish passing coverage of public behavior before refactoring
- **THEN** it runs tests that exercise that behavior without collecting code coverage
- **AND** missing behavioral tests are added without requiring an instrumented baseline

#### Scenario: Uncertain impact
- **WHEN** development test selection cannot safely identify affected tests
- **THEN** the relevant complete suite runs without coverage collection
- **AND** the fallback retains its normal failure handling and explanation

#### Scenario: User requests early coverage
- **WHEN** the user explicitly requests a coverage report during implementation
- **THEN** the agent can run the requested coverage command and reports its scope
- **AND** later relevant edits invalidate that result as final evidence

### Requirement: Defined final verification boundary

Final coverage gates SHALL run when implementation, tests, cleanup and review of the agreed implementation scope are finished and the agent is preparing a final handoff. An individual subtask, progress update or intermediate commit MUST NOT independently trigger coverage. Agents MUST NOT claim implementation completion while required final gates remain unrun or failed.

#### Scenario: Several subtasks in one implementation
- **WHEN** one subtask passes but further agreed implementation remains
- **THEN** the agent continues with coverage-free feedback
- **AND** defers final coverage until the combined work is ready

#### Scenario: Ready for handoff
- **WHEN** the agreed implementation scope is finished and reviewed
- **THEN** both full independent unit and integration coverage gates run before completion is reported

#### Scenario: Interrupted implementation
- **WHEN** work stops before implementation is finished
- **THEN** the agent reports the unfinished work and pending coverage gates
- **AND** does not run coverage solely because a progress response or checkpoint commit is needed

### Requirement: Explicit development and coverage commands

`test:unit` and `test:integration` SHALL explicitly disable coverage by default and preserve existing coverage reports. `test:unit:coverage` and `test:integration:coverage` SHALL run their complete respective projects with coverage enabled and separate existing report locations. Test or setup failures MUST retain nonzero exit status in both modes.

#### Scenario: Default project run
- **WHEN** either default unit or integration command is invoked without overrides
- **THEN** the full requested project runs without collecting, clearing or replacing coverage reports

#### Scenario: Explicit final gate
- **WHEN** a final coverage command runs
- **THEN** it executes the complete corresponding project and applies its coverage thresholds
- **AND** it writes reports only to that project's designated coverage output

#### Scenario: Failed test without coverage
- **WHEN** a test or setup fails in a coverage-free run
- **THEN** the command exits nonzero rather than treating disabled coverage as permission to ignore failures

### Requirement: Preserve independent CI assurance

Required CI SHALL invoke both explicit full coverage commands. Production coverage scopes and per-file 100% statement, branch, function and line thresholds MUST remain unchanged and independent. Existing Storybook, E2E, lint, type, build, SSR and package obligations SHALL remain intact; diagnostic browser coverage MUST NOT become routine verification.

#### Scenario: Required verification job
- **WHEN** required CI verifies a change
- **THEN** unit and integration coverage gates run separately
- **AND** neither ordinary tests, affected selection nor another project's coverage substitutes for either gate

### Requirement: Repair and evidence validity

Final failures SHALL return the agent to coverage-free focused debugging. At the next final-verification boundary, failed or invalidated coverage gates MUST be rerun. A passing result SHALL be reusable only when no relevant source, tests, fixtures, configuration or dependencies changed; uncertain impact MUST invalidate the result. A commit or unrelated prose edit alone MUST NOT force reruns.

#### Scenario: Integration fixture repair
- **WHEN** an integration-only fixture repair follows a failed integration gate and demonstrably does not affect unit execution
- **THEN** the agent verifies the repair without coverage during development and reruns full integration coverage when ready
- **AND** an otherwise valid passing unit gate need not repeat

#### Scenario: Shared implementation repair
- **WHEN** a repair changes shared production code or has uncertain scope
- **THEN** both final coverage gates run after focused feedback passes and the repair is ready

#### Scenario: Commit after verified work
- **WHEN** an agent commits already verified work without relevant content changes
- **THEN** it retains the passing coverage evidence without rerunning tests solely for the commit

### Requirement: Consistent guidance and truthful reports

Testing guidelines, applicable skills and contributor instructions SHALL reference the same execution phases and command meanings. Guidance MUST distinguish behavioral test coverage from code coverage collection. Reports SHALL state executed scope, coverage mode, failures and pending gates without equating coverage-free passes with completed coverage verification.

#### Scenario: Component and TDD workflows
- **WHEN** an agent enters through component, testing, TDD or refactoring guidance
- **THEN** it receives the same coverage timing policy without changing the selected test-development cadence

#### Scenario: Development status report
- **WHEN** affected or complete development tests pass without coverage
- **THEN** the report identifies that mode and leaves final coverage explicitly pending
