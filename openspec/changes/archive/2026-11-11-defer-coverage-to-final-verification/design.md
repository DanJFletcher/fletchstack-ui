# Design

## Context

See [the proposal](proposal.md) for motivation and [the specification](specs/test-coverage-execution/spec.md) for the contract. This is a cross-cutting command and guidance change, so a design is warranted.

The [testing policy](../../../../.agents/guidelines/testing-guidelines.md) already separates development from local completion, but does not define the implementation boundary. The [TDD skill](../../../../.agents/skills/tdd/SKILL.md) explicitly disables coverage for red runs; other skills use ambiguous phrases such as “passing coverage.” The [affected runner](../../../../scripts/affected-vitest.mjs) disables collection, including full fallback. The [default project commands](../../../../package.json) enable coverage, and [CI](../../../../.github/workflows/verify.yml) relies on those names. [Vitest configuration](../../../../vitest.config.ts) supplies independent per-file thresholds and report formats without globally enabling collection.

Accepted specs are empty. Related completed changes remain unarchived, including a requirement that existing full commands remain unchanged. That wording conflicts with the new command meanings and must be reconciled explicitly during implementation.

## Goals / Non-Goals

**Goals:** Make command intent obvious, give every agent entry point a consistent phase boundary, and preserve CI assurance through the command migration.

**Non-Goals:** Add an agent state machine, enforce phases through shell permissions, change TDD activation, alter test selection or thresholds, add dependencies, or rewrite historical timings. Ordinary E2E and diagnostic browser coverage remain unchanged.

## Decisions

### 1. Separate default execution from explicit coverage gates

Use these script contracts:

| Command | Invocation |
| --- | --- |
| `test:unit` | `vitest run --project unit --coverage.enabled=false` |
| `test:integration` | `vitest run --project integration --coverage.enabled=false` |
| `test:unit:coverage` | `vitest run --project unit --coverage --coverage.reportsDirectory=coverage/unit` |
| `test:integration:coverage` | `vitest run --project integration --coverage --coverage.reportsDirectory=coverage/integration` |

Switch CI to both explicit coverage commands in the same implementation increment. Preserve the existing affected commands and generic `npm test` behavior. Keep command forwarding for file filters and worker options; final-gate instructions require the complete project, without filters. No custom argument wrapper is necessary.

Alternative: retain coverage defaults and add `:fast` aliases. That is less disruptive but leaves the most obvious commands expensive and dependent on agents remembering an exception. The chosen approach changes command semantics intentionally and documents how external callers retain the former behavior.

### 2. Define phases centrally and keep skill referrals short

Make the execution section of [testing guidelines](../../../../.agents/guidelines/testing-guidelines.md) authoritative. Development includes baseline, test authoring, implementation, debugging and cleanup. Final verification starts after the agreed implementation scope is complete and reviewed; individual subtasks, interim commits and progress messages do not create new boundaries. A separately requested, bounded implementation batch can have its own final handoff. Explicit user requests override the timing default.

Apply short referrals and terminology corrections in [component guidance](../../../../.agents/guidelines/component-library.md) and the [TDD](../../../../.agents/skills/tdd/SKILL.md), [refactoring](../../../../.agents/skills/typescript-refactor/SKILL.md), [React testing](../../../../.agents/skills/react-testing-library/SKILL.md), [Playwright](../../../../.agents/skills/playwright-e2e/SKILL.md), and [component-building](../../../../.agents/skills/build-react-components/SKILL.md) skills. Clarify that passing behavioral tests establish a refactor baseline without measuring code coverage. Update [README](../../../../README.md) and [test guide](../../../../tests/README.md) command examples and completion language.

Alternative: repeat the full policy in every skill. That increases loaded prose and creates conflicting rules over time. Preserve installer-managed local customizations and their existing maintenance note; do not edit [installer fingerprints](../../../../agi.json) or external sources.

### 3. Return to development feedback when final checks fail

A failed final check reopens implementation. Diagnose using coverage-free focused tests, then run failed or invalidated complete coverage gates at the next final boundary. Production, shared configuration and dependency changes normally invalidate both unit and integration results. A demonstrably integration-only fixture change can preserve a valid unit result. Unknown impact invalidates both. Tests and test setup count as relevant inputs, not just production source.

Do not require reruns solely for committing unchanged content or unrelated planning prose. Do not create persistent result caching: the agent reports commands, modes, scope and relevant intervening changes. This preserves final evidence without treating every debugging attempt as final verification. Required CI remains complete.

Alternative: rerun every gate after any failure. That repeats unrelated work and does not improve evidence for unchanged inputs.

### 4. Reconcile pending requirements without rewriting history

During implementation, narrowly update the pending [affected-testing spec](../../add-affected-unit-integration-tests/specs/affected-unit-integration-testing/spec.md): preserve coverage-free affected execution and thresholds while replacing the “existing full commands ... unchanged” promise with explicit coverage commands. Update its `Development and completion workflow` requirement and the pending [agent workflow spec](../../adopt-flexible-agent-testing/specs/agent-testing-workflow/spec.md) `Verification remains required` requirement to follow the new phase and evidence-validity rules. Preserve every existing scenario, adapting only the conflicting completion/rerun wording.

Add dated follow-up notes in those changes' proposals/designs linking this change; retain completed tasks and historical measurements. The pending [browser completion spec](../../add-component-browser-harness/specs/local-browser-verification/spec.md) already preserves independent gates and impact-based repair, so it needs no requirement change. Validate all changed deltas together. Do not archive or sync as part of this work. If a relevant capability becomes accepted before implementation, use its then-current requirement and a proper MODIFIED delta instead of recreating a pending change.

### 5. Validate observable command behavior and policy consistency

Add bounded command-contract checks alongside existing build integration tests. During development, verify project isolation, default coverage-free runs preserving report sentinels, coverage command configuration and CI routing without launching instrumented child runs. At final verification, verify actual separate reports and threshold enforcement; use a small disposable fixture for the threshold-failure probe rather than deliberately breaking production. Preserve the existing affected-run coverage isolation tests. Do not hide early coverage collection inside a nominally coverage-free test command.

Walk through multi-task implementation, explicit TDD, refactoring baseline, conservative full fallback, interrupted work, an explicit coverage request, final repair and committing verified work across the guidance entry points. Review links and scan live docs for obsolete command semantics. These checks establish consistency, not guaranteed compliance by every agent.

Run focused contract checks without coverage while developing. At final readiness, execute both complete new coverage gates and all other applicable required checks. Package/CI configuration changes currently demand complete local browser verification under the existing policy; do not exempt this change by labeling it documentation-only. Record modes, counts and timings, and report remote CI as pending until it actually runs.

## Risks / Trade-offs

- External callers expect old command semantics → Flag the compatibility change and document the explicit replacements; update repository CI atomically.
- “No coverage until the end” becomes optional final verification → Require both independent gates before declaring implementation complete and identify pending gates on interruption.
- Agents infer validity too broadly → Include tests, fixtures, configuration and dependencies in invalidation; uncertain scope repeats both gates.
- Guidance drifts on installer refresh → Preserve local customization notes and fingerprints; upstream changes remain separate work.
- One timing pair is overgeneralized → Retain its workload and single-observation limitation; do not promise a fixed speedup.

## Migration Plan

Implement command/CI changes together, then align guidance and pending requirements before final validation. Update current command documentation while preserving historical reports as records of commands actually run. Roll back script names, CI callers, guidance and pending-spec reconciliation together if needed; coverage configuration itself remains unchanged.
