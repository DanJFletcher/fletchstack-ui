# Design

> Follow-up (2026-11-10): [Adopt flexible agent testing](../adopt-flexible-agent-testing/design.md) supersedes the universal cadence in decision 7 below. Its red/green sequence now applies when incremental TDD is selected; other supported cadences retain focused/affected feedback and complete verification. The pending workflow requirement is reconciled accordingly. This original design and its completed implementation evidence remain historical records, not a requirement to apply incremental TDD to every future behavior change.

## Context

See [proposal](proposal.md) for motivation and [requirements](specs/affected-unit-integration-testing/spec.md) for the observable contract.

- [Vitest configuration](../../../vitest.config.ts) has separate unit, integration, and Storybook projects. Full unit/integration scripts explicitly enable independent 100% per-file coverage over production source and token/build scripts.
- Current unit discovery finds 37 files; integration finds 43. Existing recorded full runs took 13.45s and 23.63s respectively with different worker conditions. These are context, not controlled affected-run benchmarks.
- Discovery-only probes with installed Vitest 4.1.12 selected 14/37 unit and 33/43 integration files for Button, 15/37 and 31/43 for Field, and zero files in either project for Button CSS. Many focused tests import the public barrel; many integration tests read CSS with `readFile`.
- The [hydration builder](../../../tests/integration/fixtures/hydration/build.ts) takes an entry URL for a separate Vite build. Theme tests copy token/script directories; build tests read generated files and recursively inventory source. Those dependencies cannot be inferred reliably from ordinary module imports.
- [Organization integration](../../../tests/integration/build/organization.test.mjs) imports an E2E coverage helper. Some unit tests also verify coverage tooling. Excluding E2E execution does not justify ignoring files under that directory when unit/integration tests depend on them.
- The tracked local [TDD skill](../../../.agents/skills/tdd/SKILL.md) currently requires meaningful red-green-refactor evidence but does not define affected commands or an explicit final full-verification sequence. The [testing guidelines](../../../.agents/guidelines/testing-guidelines.md) and [test guide](../../../tests/README.md) are complementary update targets.

## Goals / Non-Goals

**Goals:** Make selected execution a dependable development default; retain actual dependency chains and consumer confidence; use maintained Vitest discovery; keep uncertainty visible; measure whether direct imports produce useful gains.

**Non-Goals:** No bespoke module/export graph, learned coverage graph, persistent selection cache, E2E/Storybook selection, altered CI gates, weakened coverage, changed production exports, or removal of behavioral tests. Do not add a monorepo tool or upgrade Vitest.

## Decisions

### 1. A thin project-specific runner over Vitest

Add two npm scripts invoking a shared runner under `scripts/`, with the unit or integration project fixed by the script. Require `--base <git-ref>` and support `--dry-run`; do not guess `main`, change branches, or fetch automatically. Reject unknown options and cross-project/configuration/coverage overrides. A base is explicit so development commands do not silently change meaning across local and CI environments.

Use exported installed Vitest APIs to create a non-watch, coverage-disabled context and discover relevant specifications from the changed-file set. The exploration used `createVitest` and `getRelevantTestSpecifications` successfully without running tests. Encapsulate the version-sensitive adapter and close the context on every path. Do not import Vitest private chunks. Execute exact selected specifications through the public runner API, or validate CLI file filters against that inventory; never let an empty filter become an accidental full run. Preserve nonzero failures and signal termination.

Native `related`/`--changed` alone is inadequate because it misses filesystem resources and does not supply the required classification and explanations. A custom import graph would duplicate Vitest and introduce unnecessary maintenance. Use Vitest's existing graph, accepting conservative barrel behavior in dedicated consumer suites.

### 2. Explicit Git discovery with a small, tested contract

Collect separate NUL-delimited Git results for merge-base-to-HEAD, staged, unstaged, and nonignored untracked paths. Union them rather than comparing the net worktree to the base, which can hide cancelling changes. Resolve refs to commit IDs, retain change statuses and both rename paths, normalize repository-relative paths, and pass arguments without a shell. Match test inventory using Vitest's project rules rather than a second set of discovery globs.

The installed native `--changed` already covers common branch/staged/modified/untracked cases; the wrapper adds deterministic status/path handling and the project's failure semantics, not a new dependency engine. Deleted/renamed runtime or test files use a full-project fallback in version one. Missing base/history/merge-base also yields an explained full-project fallback. Invalid arguments, missing Git root, Git operational errors unrelated to unavailable history, and failed test-inventory discovery are errors, not successful empty runs.

### 3. Fail conservatively for non-import dependencies

Keep classification in one small policy module next to the runner. Combine native dependency selection, directly changed discovered tests, and resource/fallback rules. Apply supported import selection before treating a path as irrelevant; even coverage helpers or documentation can be imported or read by unit/integration tests.

| Input | Unit command | Integration command |
| --- | --- | --- |
| Ordinary implementation/test/helper imports | Vitest-related files plus changed tests | Same |
| Component CSS | No additional unit tests unless dependencies require them | Complete project |
| Token inputs, generated token CSS/reference, token/build tooling | Complete project | Complete project |
| Vitest/Vite/TypeScript configuration, dependency manifests/lockfiles, public root/family barrels, selector/policy | Complete project | Complete project |
| Hydration fixture entry reached by URL, browser-build resources | Declared dependency selection or fallback if uncertain | Explicit family ownership where simple; otherwise complete project |
| Known integration filesystem inputs: component stories, organization fixtures, source/test inventories, copy-style sources, theme resources | Related files or fallback if uncertain | Complete project unless a tested narrower rule proves ownership |
| Runtime deletion/rename, unsupported/unclassified resource, unexplained zero owners | Complete project | Complete project |
| Explicitly unrelated planning prose | Safely empty if no other inputs select tests | Same |

Do not globally ignore `docs/`, `stories/`, `tests/e2e/`, `.github/`, or fixtures: actual tests read some of them. Keep the irrelevant allowlist narrow. Unknown paths default to complete execution of the requested project. New fixture patterns must add a policy rule or retain that fallback. A CSS-only unit selection can be safely empty because unit tests do not resolve appearance; report that the integration command is its verification owner.

This deliberately trades precision for a small maintainable policy. Fine-grained CSS maps, automatic parsing of filesystem expressions, and export-aware traversal are deferred until measured need warrants them.

### 4. Four explicit outcomes and a true dry run

Print the requested project, base input/resolved commit, HEAD, merge-base when available, changed paths, outcome, sorted selected files, and reasons. Reasons distinguish direct test edits, import-based related selection for the given input set, and named fallback rules. Do not invent precise per-export chains that Vitest does not expose. A full fallback lists the inventory it will run; a safely empty result states why no files run.

Dry run performs only Git/discovery/policy work: no test collection that executes module bodies, setup hooks, Chromium launch, token generation, or coverage cleanup. Use specification discovery rather than ordinary test-name collection. Repeated results for a fixed state must be deterministic. Tests must distinguish intentionally empty selection from broken discovery or unknown runtime impact.

### 5. Separate development execution from completion gates

Explicitly disable coverage for both selected execution and full-project fallback; do not touch prior unit/integration report directories. Keep existing full scripts, scope and per-file thresholds unchanged. Required CI continues to run all current checks. A fallback is a development safety mechanism, not a substitute for final coverage verification.

Any executable selector modules covered by existing `scripts/*.mjs` coverage scope need independent unit and integration coverage; do not add exclusions to avoid this. Unit tests can mock Git/runner boundaries. Integration tests use synthetic temporary Git repositories and observable command results; dependency-discovery probes must exercise the actual installed Vitest adapter as well as policy doubles.

### 6. Import boundaries reflect test responsibility

Migrate focused component DOM/SSR/integration tests and their composed fixture apps to direct implementation imports, preserving all test names, assertions, environments, and real dependent components. Inspect both server rendering and client build entry paths. Changing only a test import is ineffective if its fixture app still reaches the root barrel.

Retain or add a small explicit public-entrypoint unit/integration suite for supported runtime exports and representative composed consumer rendering. Existing package verification remains responsible for declarations, React 18/19, packed styles and bundling. Consumer tests are allowed to depend broadly on the public barrel; mark their purpose clearly. Do not mechanically replace public API tests with implementation imports or change the library barrel itself.

Start with Button and Field/Select/TextInput to demonstrate narrower selection and preservation of true shared dependencies, then migrate remaining focused tests in bounded groups. This import migration is part of the change, with measured results rather than an assumption that every file is faster.

### 7. Encode the TDD and completion sequence in local guidance

Update the tracked TDD skill and testing guidelines, reconcile the component guideline if needed, and document commands in the README/test guide. Repository-specific commands belong in local guidance, not edits to an external skill source or dependency tarball.

1. Red: explicitly run the test being introduced/changed without coverage and observe a meaningful failure. Use an explicit file for new tests rather than relying solely on Git discovery.
2. Green: rerun that same test; use affected unit/integration commands for related feedback as the implementation evolves.
3. Refactor: rerun affected commands with the declared base. Conservative full fallbacks still apply. Before these commands exist, use explicit focused Vitest files rather than imaginary commands.
4. Completion: after implementation is complete, execute the repository's required full verification, including independent unit/integration coverage and the unchanged Storybook/E2E/build/package checks. This change selects only unit/integration tests; it does not waive other completion checks.
5. Repair: use focused tests to fix any final-verification failures, then repeat required full verification on the final state. Record meaningful red, affected/fallback results, full results, and any blockers honestly.

Targeted browser verification needed during component development remains supported; the new unit/integration workflow does not prohibit evidence required by other skills.

## Risks / Trade-offs

- [A resource dependency is absent from imports] -> Full-project rules for known filesystem boundaries, unknown-input fallback, regression probes, and unchanged full CI verification.
- [Direct imports hide a public-export regression] -> Dedicated public-consumer suites and existing packed-consumer verification remain required.
- [Vitest discovery costs erase savings on these short suites] -> Measure discovery and execution separately; report little/no improvement if observed. Avoid caching complexity in version one.
- [Vitest API changes on dependency upgrades] -> Narrow public-API adapter, discovery-contract tests, lockfile/config full triggers.
- [Fresh generated outputs are required by integration tests] -> Preserve each existing setup contract and final full preparation; dry run must not regenerate files. A missing/stale required fixture must fail visibly.
- [Guideline ownership is refreshed by the installer later] -> Make the tracked repository changes explicit and document their local nature; do not modify the external installer package.

## Migration Plan

1. Record the initial import-based selections, full-project results and bounded timing conditions. Reuse existing evidence for context; obtain comparable timing before changing imports.
2. Implement runner/policy tests and commands, then verify CSS, tokens, fixture, test-only and history fallback behavior.
3. Migrate the representative focused imports and public-contract owners; compare selections and full outcomes. Migrate the remaining focused imports without test removal.
4. Update TDD/guidance and run staged correctness probes against complete project results. Test signal/error propagation and coverage artifact preservation.
5. Record comparable before/after timings with fixed workers and coverage mode, separating discovery overhead from execution and coverage effects. Do not claim gains from selected-file counts.
6. Run required full verification on the final state. CI remains unchanged. Rollback consists of removing the new development commands/guidance and reverting test-import changes; no production or data migration is required.
