# Proposal

## Follow-up: coverage timing (2026-11-11)

[Defer coverage to final verification](../archive/2026-11-11-defer-coverage-to-final-verification/proposal.md) supersedes the original coverage-command defaults and blanket full-verification rerun wording. Ordinary unit/integration commands now disable coverage; explicit `:coverage` commands preserve independent final/CI gates. Development and repair feedback remain coverage-free, with failed or invalidated gates rerun at final readiness. The affected pending requirements were reconciled narrowly; original design rationale, completed tasks and historical execution evidence below remain records of the earlier implementation.

> Follow-up (2026-11-10): [Adopt flexible agent testing](../adopt-flexible-agent-testing/proposal.md) supersedes this proposal's universal TDD ordering with task-appropriate cadence selection. Specific red/green ordering applies when incremental TDD is selected. The pending workflow requirement is reconciled accordingly; affected-selection safeguards, final verification, completed tasks, and observed implementation evidence remain intact. The original proposal below records the initial scope.

## Why

Repeated complete unit and integration runs slow the red-green-refactor cycle even when a change affects a small part of the library. Vitest already supports import-based selection, but filesystem dependencies and broad public-barrel imports require explicit safeguards before affected runs can be dependable development feedback.

## What Changes

- Add `test:unit:affected` and `test:integration:affected` development commands with an explicit Git comparison base, dry-run selection, explanations, and coverage disabled.
- Include committed branch changes and local staged, unstaged, and nonignored untracked files; distinguish safely empty selection from uncertainty and command errors.
- Reuse installed Vitest dependency discovery with conservative full-project fallbacks for non-imported resources, shared inputs, missing history, and uncertain changes. Do not build an export-aware dependency graph.
- Replace public-barrel imports in focused unit/integration tests and their fixtures with direct implementation imports. Retain dedicated public-export, consumer-composition, and packaged-consumer coverage.
- Update the repository TDD skill and applicable testing guidelines: run the specific test for red, affected tests during green/refactor, and required full verification after implementation. Repair failures with focused runs and repeat full verification before completion.
- Preserve existing complete commands, independent unit/integration 100% coverage gates, and required CI verification. Validate selection correctness and measure actual runtime gains in stages.
- Exclude E2E/Storybook selection, monorepo adoption, production API changes, test removal, and coverage-policy reductions.

## Capabilities

### New Capabilities

- `affected-unit-integration-testing`: Safe, explainable selection and execution of unit/integration development tests, their import boundaries, and their role in the TDD and completion-verification workflow.

### Modified Capabilities

None. The accepted capability inventory is currently empty. This change preserves the independent production coverage requirements recorded in the completed [browser verification change](../simplify-browser-verification/specs/browser-verification/spec.md).

## Impact

- Test commands in [package.json](../../../package.json), a small runner/policy under [scripts](../../../scripts), and selection tests under the existing [unit](../../../tests/unit) and [integration](../../../tests/integration) structure.
- Focused component tests, SSR/hydration fixtures, and dedicated public-entrypoint assertions; no changes to library exports or runtime behavior.
- [TDD skill](../../../.agents/skills/tdd/SKILL.md), [testing guidelines](../../../.agents/guidelines/testing-guidelines.md), relevant component guidance, and [test documentation](../../../tests/README.md).
- Existing Vitest/Vite APIs and Git, without a new dependency-analysis or monorepo tool. Full required CI remains unchanged; no affected-only CI gate is introduced.
