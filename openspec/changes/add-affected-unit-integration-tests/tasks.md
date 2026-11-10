# Tasks

## 1. Preserve baseline and public boundaries

- [x] 1.1 Record pre-migration Button and Field dependency selections for both Vitest projects, preserve existing test inventories/assertions, and capture comparable bounded timings with explicit workers and coverage mode; verify the evidence identifies discovery separately from execution and does not treat historical timings as controlled comparisons.
- [x] 1.2 Identify the dedicated public-export, composed-consumer, and installed-package assertion owners before migrating imports; retain or add focused public-entrypoint tests and verify missing-export/consumer-render regression probes fail in the intended layer.

## 2. Change discovery and conservative policy

- [x] 2.1 Add unit-tested argument validation and NUL-delimited Git discovery for merge-base branch changes, staged, unstaged, untracked, and rename paths; verify meaningful red-green evidence for the parser/discovery boundary, including paths with spaces and cancelling edits, and document the required base argument.
- [x] 2.2 Add integration cases using synthetic temporary Git repositories for branch/local unions, new tests, renamed/deleted paths, unavailable refs/history, no merge-base, and non-Git errors; verify the actual command/discovery outcomes distinguish full fallback from invalid invocation without modifying the user's checkout.
- [x] 2.3 Implement the single resource/fallback policy with unit scenarios for CSS, tokens/generated references, fixtures, filesystem inventories, config/lockfiles/barrels, unknown inputs, and narrowly unrelated prose; verify uncertain zero owners select the complete requested project and document every supported classification.

## 3. Vitest adapter and development commands

- [x] 3.1 Add a small public-API Vitest adapter for project inventory and related specifications, with unit boundary tests and actual installed-version integration discovery tests; verify Button/Field dependencies, imported helpers, directly changed tests, and project isolation without executing Storybook/E2E or importing private Vitest chunks.
- [x] 3.2 Add `test:unit:affected` and `test:integration:affected` scripts and exact selected-spec execution; verify successful selected tests, a deliberate assertion/setup failure, discovery failure, and termination preserve correct status and close runner resources, and add executable usage examples to the test guide.
- [x] 3.3 Add deterministic selection explanations and `--dry-run`; verify all four outcomes (selected, full fallback, safely empty, error), displayed base/HEAD/merge-base/paths/reasons, and repeatable output through CLI integration assertions without setup hooks, browser launch, or token generation.
- [x] 3.4 Explicitly disable coverage in selected and fallback modes; verify seeded coverage reports/cache artifacts retain bytes and modification times, full command definitions/thresholds/scope remain unchanged, and new executable tooling satisfies the existing independent unit/integration coverage scope without new exclusions.

## 4. Focused import migration

- [x] 4.1 Migrate focused Button tests and its server/client hydration fixture imports to implementation modules while retaining its public-consumer owners; verify unchanged assertions pass and dependency-discovery comparisons no longer select unrelated focused tests solely through the root barrel.
- [x] 4.2 Migrate Field, Select, and TextInput focused tests/fixtures with their real compositions intact; verify a Field discovery/regression probe still selects dependent controls while an unrelated implementation no longer reaches them solely through a barrel, and record the import-boundary rationale in the test guide.
- [x] 4.3 Migrate remaining focused unit/integration tests and fixture apps in bounded groups, excluding explicit public-consumer tests; verify each group's existing behavior tests pass, no names/assertions/environments are removed or weakened, and the final source/public-consumer import inventory matches documented responsibilities.

## 5. Agent workflow and developer guidance

- [x] 5.1 Update the tracked TDD skill to specify focused red/green, affected feedback during refactor, declared base selection, conservative fallbacks, final full verification, and focused repair followed by repeated full verification; verify a documented new-test and final-failure walkthrough satisfies that sequence without requiring nonexistent commands during bootstrap.
- [x] 5.2 Update testing guidelines, reconcile applicable component guidance, and document local affected usage in the README/test guide; verify guidance agrees on coverage isolation, import responsibilities, safely empty versus uncertainty, unchanged required CI/full coverage gates, and E2E/Storybook selection being out of scope.

## 6. Selection and performance acceptance

- [x] 6.1 Exercise controlled Button, Field-dependent, CSS, shared-token, hydration-entry, helper, test-only, new-test, and unknown-resource cases against complete unit/integration results; verify affected selections include the tests that detect each injected regression and preserve true composition dependencies, and record any fallback/precision limitations.
- [x] 6.2 Repeat the bounded pre-migration timing workloads after migration with identical workers, environment and coverage mode, measuring discovery overhead, selected execution, and comparable full coverage-free project runs separately; publish the observed results and limitations without inferring runtime gains from file counts or conflating coverage removal with selection.
- [x] 6.3 After implementation is complete, run required lint/types, complete independent unit/integration coverage, Storybook, complete E2E, library/static Storybook builds, built-browser and package/SSR verification; repair any failures with focused checks and repeat required full verification on the final state, recording actual results and any external blockers without changing CI gates.
- [x] 6.4 Run strict OpenSpec validation and whitespace checks and reconcile delivered evidence with every requirement/task; verify only authorized implementation/guidance changes occurred, production exports and coverage policies remain compatible, and the proposal is ready for review without automatically archiving or committing it.
