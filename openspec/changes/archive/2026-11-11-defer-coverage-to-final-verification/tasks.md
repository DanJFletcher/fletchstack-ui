# Tasks

## 1. Explicit command contracts and CI routing

- [x] 1.1 Make default unit/integration scripts explicitly coverage-free, add the two full `:coverage` scripts with existing report directories, and switch required CI callers in the same increment; verify scripts, project isolation, unchanged thresholds and unchanged remaining CI steps with focused contract checks run without coverage.
- [x] 1.2 Add bounded build integration checks for coverage-free report preservation and nonzero test/setup failures; verify with disposable fixtures and coverage disabled, without starting instrumented child runs during development. Retain the existing affected-run isolation checks.
- [x] 1.3 Update current command examples and coverage explanations in the root README and test guide, including migration instructions for callers relying on old defaults; verify all active references use the new meanings and preserve historical reports unchanged.

## 2. Shared agent execution policy

- [x] 2.1 Define development/final phases, agreed-scope completion, user-request exceptions, failure repair and evidence invalidation in testing guidelines; verify by walking through a multi-task implementation, interrupted work, full fallback and final failure without treating intermediate commits as final gates.
- [x] 2.2 Align component guidance and TDD, refactoring, React testing, Playwright and component-building skills through short shared-policy links; replace ambiguous measured-coverage baseline wording and verify every entry point yields coverage-free development feedback while retaining its existing behavioral obligations.
- [x] 2.3 Align the test guide's completion and repair examples with the shared policy; verify walkthroughs for explicit coverage requests, integration-only repairs, shared-code repairs and committing verified work, check relative links, and confirm installer fingerprints/external guide sources remain untouched.

## 3. Pending specification reconciliation

- [x] 3.1 Reconcile only the affected-testing delta's `Coverage and failure isolation` and `Development and completion workflow` requirements and the agent-workflow delta's `Verification remains required` requirement as described in the design; preserve existing scenarios and completed task evidence, add dated follow-up notes in their proposals/designs, and validate the revised requirement meanings against this change. If already accepted, use proper MODIFIED deltas instead of restoring old pending artifacts.
- [x] 3.2 Run strict OpenSpec validation for this change and the two reconciled changes, review all guidance/command references for contradictions, and confirm no archive/sync or historical evidence rewrite occurred.

## 4. Final integrated verification

- [x] 4.1 Once commands, guidance, tests, cleanup and review are complete, run both full explicit coverage gates, confirm separate reports and unchanged per-file 100% thresholds, and demonstrate threshold failure in a disposable fixture at this final boundary. Verify ordinary/affected runs preserve those reports without repeating full instrumented runs unnecessarily.
- [x] 4.2 Complete applicable lint, type, Storybook, full E2E, library/static Storybook build, built-browser and package/SSR checks; inspect affected-selection fallback reasons for command/config changes and report actual scope, coverage mode, counts, timings, any failures and remote CI status. Repair failures with coverage-free focused feedback and rerun invalidated final gates only when ready.

## Verification evidence (2026-11-11)

- Development used coverage-free commands: 39 focused command/affected-run checks passed. Lint caught a regular-expression backtracking concern in the new CI-routing test; line-based parsing replaced it, and all 9 command-contract checks, lint and both type checks then passed before final coverage began.
- Reviewed the policy across all five skill entry points: multi-task work, TDD/refactor baselines, interrupted work and conservative fallbacks remain coverage-free; explicit user requests are permitted; integration-only versus shared repairs invalidate the appropriate gates; committing unchanged verified content does not rerun them. Relative documentation links passed inspection. Installer fingerprints, production code, coverage configuration, dependencies and browser runner configurations are unchanged.
- At final readiness, `test:unit:coverage` passed 697 tests in 51 files (8.41s command wall time); `test:integration:coverage -- --maxWorkers=3` passed 418 tests in 54 files (43.72s). Both retained 100% statements, branches, functions and lines with separate reports.
- Final disposable-fixture probes exercised each actual coverage script: passing behavior with an uncovered branch failed the threshold; covering both branches passed all four metrics. No instrumented child runs occurred during development.
- Subsequent ordinary and affected commands passed and preserved all 220 report files byte-for-byte with unchanged modification times. Affected project runs exercised conservative full fallback for this change.
- Browser selection reported full fallback for package infrastructure and unowned changed paths. Complete E2E with three workers passed 404 cases (329 harness, 75 Storybook) in 118.90s wall time, without coverage, failures or retries. All 338 Storybook render/play/accessibility checks passed separately.
- Library/static Storybook builds, built-style browser checks and packed exports/types/CSS/bundling/React 18 and 19 SSR checks passed. All three affected OpenSpec changes passed strict validation. Timings are single local observations, not benchmark guarantees.
- Detailed logs are in ignored `.verification/coverage-policy/`. Remote CI is pending; no archive, sync, commit or push was performed as part of applying this change.
