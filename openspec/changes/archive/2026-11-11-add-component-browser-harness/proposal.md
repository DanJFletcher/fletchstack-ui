# Proposal

## Why

Recent complete browser runs took 8.1–8.5 minutes and each failed an unrelated documentation-navigation check, while all 25 CodeBlock checks passed and the full Storybook render/play/accessibility suite took 24 seconds. Mandatory full local reruns make small changes expensive; a lightweight component harness and dependency-aware selection can reduce repeated work while preserving browser behavior coverage.

## What Changes

- Allow focused browser feedback during implementation and affected browser verification at local completion. Require complete local browser verification for shared tokens/global styles, browser infrastructure changes, or uncertain impact; retain complete browser verification in required CI.
- Keep independent full unit/integration coverage gates and existing lint, type, build, SSR and package verification obligations unchanged. Report local scope and pending CI explicitly.
- Pilot one lightweight React/Vite harness with isolated, independently loaded Button, Stack and CodeBlock scenarios driven by Playwright. Preserve their component assertions and retain distinct served-Storybook journeys.
- Add explainable affected browser selection connecting tests to scenario modules and transitive component/CSS dependencies, including composed consumers and retained legacy suites. Unknown ownership selects the full browser suite.
- Retain all Storybook render/play/accessibility checks, a focused served-Storybook integration suite, and unmigrated browser suites. Remove migrated duplicates only after equivalent behavior and failure sensitivity are demonstrated.
- Measure matched pilot workloads and selection overhead before committing to migration beyond the three pilot families. Broader migration is a separate decision.

## Capabilities

### New Capabilities

- `local-browser-verification`: Scoped local completion, conservative full-run triggers, failure-repair cadence and truthful verification reporting with complete CI coverage.
- `component-browser-harness`: Isolated React scenarios for real browser behavior, explicit verification ownership and measured pilot acceptance.
- `affected-browser-testing`: Complete change discovery, scenario/dependency selection, retained-suite ownership, explainable dry runs and safe fallback/error behavior.

### Modified Capabilities

None: the accepted-spec inventory is empty. This change explicitly supersedes the full-local-browser completion requirements in the completed but unarchived `add-affected-unit-integration-tests` and `adopt-flexible-agent-testing` changes. It preserves the behavior ownership and coverage-free defaults established by `simplify-browser-verification`, adapting component assertion owners to the harness. Prior change artifacts remain historical records.

## Impact

- Playwright configuration/fixtures, pilot browser tests and scenarios, a small Vite harness entry, selection scripts/tests, package scripts, CI, the browser behavior matrix, test documentation and repository agent guidelines/skills.
- Reuse installed React, Vite and Playwright 1.65.0; no experimental component-testing package, monorepo tool or production API/token/style changes are proposed.
- No wholesale test deletion, library-wide migration, lower coverage thresholds, new browser engines, scheduled jobs, general CI optimization or suppression of existing navigation failures. Focused diagnosis of those failures is necessary when they obstruct complete validation; unrelated product fixes must be reported separately.
