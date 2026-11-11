# Proposal

## Why

Agents already receive advice to avoid coverage during development, but undefined “local completion” boundaries and coverage-enabled default commands encourage expensive reports at intermediate checkpoints. Recent sequential runs measured unit/integration wall time at 49.97s with coverage versus 31.10s without it; this single observation motivates clearer execution defaults, not a guaranteed speedup.

## What Changes

- Define final verification as the end of the agreed implementation scope, after implementation, tests, cleanup and review; individual task checkboxes, progress updates and intermediate commits do not trigger coverage.
- Require coverage-free baseline, implementation, debugging and refactoring runs, including conservative full-suite fallbacks. Preserve explicit user requests for earlier coverage.
- **BREAKING** for command consumers: make `test:unit` and `test:integration` explicitly coverage-free; introduce `test:unit:coverage` and `test:integration:coverage` as the full, independent final gates.
- Move required CI to the explicit coverage commands without changing production scopes, per-file 100% thresholds or report locations.
- Coordinate testing guidelines, relevant skills and contributor instructions around one shared policy. Clarify behavioral test coverage versus measured code coverage.
- Repair final failures with coverage-free focused feedback, then rerun any invalidated final coverage gate when the repair is ready. Preserve valid results when unrelated edits do not invalidate them.
- Reconcile conflicting requirements in the completed but unarchived affected-testing change during implementation; preserve historical execution evidence.

## Capabilities

### New Capabilities

- `test-coverage-execution`: Coverage collection timing, coverage-free development commands, explicit final/CI gates and evidence validity across repairs.

### Modified Capabilities

None in the accepted inventory, which is currently empty. Existing pending capabilities `agent-testing-workflow`, `affected-unit-integration-testing` and `local-browser-verification` inform this change; its design identifies the narrow reconciliation needed before archival.

## Impact

Changes target [package scripts](../../../../package.json), [required CI](../../../../.github/workflows/verify.yml), [testing guidelines](../../../../.agents/guidelines/testing-guidelines.md), component guidance, applicable testing/component/refactoring skills, and both contributor test guides. Focused command-contract validation will guard against accidentally removing coverage from CI.

No production component, dependency, coverage threshold, affected-selection algorithm or browser execution policy changes are intended. E2E remains coverage-free by default; browser coverage remains an explicit diagnostic. External agent-guides sources, installer fingerprints, archive/sync and publishing are outside scope.
