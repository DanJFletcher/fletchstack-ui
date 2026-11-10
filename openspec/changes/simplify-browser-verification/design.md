# Design

## Context

See [the proposal](proposal.md) for motivation and the [browser-verification contract](specs/browser-verification/spec.md) for acceptance requirements. This is a cross-cutting verification-policy and performance change, so a design is necessary.

Current boundaries:

- [Vitest configuration](../../../vitest.config.ts) runs independent unit/integration projects and Chromium Storybook tests. Some integration files launch real Chromium through their own fixture; others use Node or jsdom. A project's name does not identify its execution cost or boundary.
- [Playwright configuration](../../../playwright.config.ts) starts served Storybook on port 6007. Its [preview adapter](../../../tests/e2e/fixtures/storybook.ts) waits for successful `storyFinished`, including play completion. Storybook/Vitest also executes plays, so reopening a story can repeat the same interactions.
- The auto [coverage fixture](../../../tests/e2e/fixtures/test.ts) collects every test's V8 coverage. Disabling reporters alone does not disable collection. The [report](../../../tests/e2e/coverage/report.mjs) adds unloaded runtime modules; the reporter enforces 100% per file including demos.
- Historical local evidence: standalone 594 tests/611.4 seconds/three workers, with one failure; Storybook 286 tests/15.14 seconds; integration 218 tests/22.93 seconds; unit 527 tests/12.46 seconds. The 207 standalone render-success checks total 580.6 summed seconds. Coverage fixture setup/teardown totals about 176 summed seconds across all tests. These overlapping worker sums are not wall-time savings. The reports do not isolate cold startup, render/play, or all instrumentation cost.
- The browser inventory contains 53 production files/372 statement counters, 28 story/demo files/673 counters, and one preview file/30 counters. A JavaScript percentage does not measure CSS or native interaction.
- [Earlier organization design](../organize-component-library/design.md) and [test documentation](../../../tests/README.md) explicitly retain three independent gates. The user approved superseding the E2E gate; unit and integration coverage policy remains unchanged. Earlier change artifacts are historical and will not be rewritten.

## Goals / Non-Goals

**Goals:** Establish one primary owner per guarantee, preserve distinct delivery boundaries, remove repeated browser work, and make performance and diagnostic coverage observable without maintaining two exhaustive test catalogs.

**Non-Goals:** Affected selection, graph tooling, monorepo migration, new dependencies, browser-engine expansion, production changes, lower unit/integration thresholds, a second legacy exhaustive suite, or a general CI/build optimization project.

## Decisions

### 1. Own guarantees through a reviewable behavior matrix

Add the matrix to [the test guide](../../../tests/README.md), with a linked detailed inventory if necessary. Each row records component/behavior, applicable states/themes/environments, current test and assertion, retained primary owner, any distinct secondary boundary, removal/consolidation rationale, and validation evidence. Account for all standalone cases rather than deleting by title pattern. New components need applicable rows or a reason for non-applicability; raw story/test counts are not a substitute.

| Boundary | Primary owner |
| --- | --- |
| Token compilation/validation, deterministic server HTML, package exports/types | Node unit/integration and package verification |
| Props, attributes, refs, callback wiring, state transitions, ARIA relationships | DOM tests |
| Every eligible CSF story's render/play and accessibility scan | Existing Storybook/Vitest browser project |
| CSS before hydration, real hydration, selective stylesheet loading | Existing focused browser integration |
| Native input, geometry, browser preferences, served manager/preview journeys | Focused standalone Playwright |

Do not move equivalent browser checks merely to use another runner. DOM callback tests and browser activation after hydration prove different boundaries. Storybook's `userEvent.selectOptions` does not replace native `page.keyboard` typeahead. Standalone CSS and built-package checks remain because Storybook imports all styles globally and can conceal missing dependencies.

### 2. Start from concrete, bounded duplication

| Candidate | Change and retained evidence |
| --- | --- |
| Render-success loops in 16 families, including Select's 14 and Stack's 12 | Verify discovery parity, then remove individual cases that add only visibility/play completion. Keep Storybook rendering/a11y and representative served-preview checks. |
| Button keyboard story wrappers and ref-focus replay | Remove wrappers whose only new assertion is the play's end state. Preserve native Enter/Space and disabled tab behavior in Chromium hydration/focused tests, DOM forwarding, and representative story interactions. |
| Button title/class/default-type forwarding | Keep DOM/SSR assertions; retain a representative Controls/args integration check only for that distinct boundary. |
| Field description ordering, slot classes, message tag names | Retain exhaustive DOM assertions and one browser label/description composition. Keep inline-label interaction when it proves a real browser boundary. |
| Nested theme/consumer override assertions after the identical play | Assign the CSS assertion to one primary browser owner, keeping the served toolbar journey and token-generation integration. |
| Stack/Container preset and alignment tables | Load a multi-example story once per relevant scenario/theme and measure each case with named steps. Preserve responsive changes, RTL, hidden participation and focus clearance. |
| Theme-independent interactions and geometry | Use one exhaustive functional matrix plus explicit theme parity/reset checks when the CSS contract is shared. Keep both-theme checks where palette, typography, focus, state styling or boundaries differ. |

Do not remove all browser label/description assertions in favor of jsdom. Keep representative actual accessibility-tree relationships and native label activation. Keep 320px, 200% text and user-spacing checks for genuinely different CSS/compositions rather than one universal smoke. Do not combine unrelated journeys into a giant shared-state test; group measurements already present in the same fixture.

### 3. Separate normal execution and diagnostic coverage structurally

Keep `npm run test:e2e` as the complete focused-suite command. Remove its coverage reporter and make the coverage fixture an explicit boolean option defaulting false. In that path, do not start/stop coverage, instantiate the coverage report, clean caches, write counters, or touch prior diagnostic outputs. Failure traces/screenshots remain enabled and retries remain zero.

Add a thin `playwright.coverage.config.ts` extending the ordinary configuration. It enables the same fixture option and diagnostic reporter. Expose it as `npm run test:e2e:coverage`; both commands accept ordinary Playwright filters. This avoids cross-platform shell environment syntax, a new dependency, and duplicated server/project/test discovery configuration. Test the disabled lifecycle as well as configuration inheritance so reporters and collection cannot diverge accidentally.

Use the existing Monocart pipeline to keep its complete eligible-file inventory and source maps, but replace threshold enforcement with diagnostic generation. Categorize production separately from component/root story/demo helpers and preview runtime; retain a preview subcategory. Keep authored runtime files visible even when unloaded. Exclusions remain for test/setup/fixtures, declarations, external dependencies, Node-only configuration and generated wrappers; do not hide uncovered families or add ignore comments.

Publish HTML/JSON plus explicit category totals, executed suite/test scope, invocation/filter information and coverage mode under the diagnostic output location. Label results as measurement rather than proof of the behavior matrix. Clear diagnostic caches only in diagnostic mode. Test failures, absent expected data, invalid source mapping/collection and report errors still produce failure; low percentages alone do not. A partial report must never satisfy or overwrite independent unit/integration evidence.

Keep one test catalog: diagnostic execution measures the simplified suite and can show uncovered demo callbacks. Do not preserve smoke loops solely to restore a green percentage. A runtime coverage gap is a review signal; promote it to a behavioral regression test only when it exposes an actual missing contract.

Alternatives rejected: retaining mandatory E2E 100% on every PR perpetuates counter-driven duplication; enforcing production-only E2E 100% still measures JavaScript rather than browser risk; lowering to an arbitrary percentage has no risk-based rationale; a second legacy suite duplicates maintenance.

### 4. Retain complete CI verification, with on-demand diagnostics

The [verify workflow](../../../.github/workflows/verify.yml) continues requiring lint, types, independent unit/integration coverage, all Storybook tests/a11y, complete focused Playwright, builds and package checks. Diagnostic coverage is available through a separate manually dispatched workflow sharing the same checkout/install prerequisites, with diagnostic artifacts uploaded even on failures. No scheduled run is required initially; its cadence can be decided from usefulness/cost later.

Keep token/build writes sequential relative to served browser tests: earlier verification exposed Vite reload races. Record repeated token generation and prepack rebuilds in timing evidence, but do not disable lifecycle hooks, merge verification counters or broadly rearrange builds in this change.

### 5. Measure stages and prove surviving checks catch defects

Before edits, inventory existing failures and capture the working tree. Explain a bounded benchmark before running it: select representative render-only, play-heavy, geometry and preference cases; fix workers, tracing, browser/Node versions and resource contention. Repeat paired warm-server runs three times and measure cold startup separately. Instrument server readiness, navigation/render/play waits where accessible, fixture collection and final report generation. Mark unavailable boundaries; never rename all navigation wait time as play time. Preserve failures rather than adding retries/timeouts to obtain a baseline.

Compare the same retained behavior workload with collection on/off to isolate instrumentation; compare old/new complete workloads separately to measure consolidation. Record medians/ranges, executed checks and wall time versus summed worker durations. Historical logs are contextual only. Run one complete before/after verification after explaining its purpose: discover integration regressions and determine whether costs were displaced. Account for the known historical Card readiness failure by reproduction/triage, not masking it or accepting a failing final result.

Use controlled faults in disposable fixtures or an isolated checkout, never by overwriting unrelated edits. Representative probes cover label/reference wiring, native keyboard activation/typeahead, a gap/breakpoint/RTL edge, clipped focus, nested token reset, disabled motion and forced-color visibility. Keep defect-specific assertions in their owning layers. A passing suite or 100% counters alone does not prove safe removal.

## Risks / Trade-offs

- Lost guarantee that every runtime/demo branch executes in standalone Chromium -> preserve cheaper production gates, all-story/a11y tests, inventory visibility in diagnostics and explicit browser matrix; review real client-only effects specifically.
- A smoke case is the only test discovering a story -> verify Storybook discovery/skip tags against the pre-change CSF inventory before removing it; retain served index/public-ID checks.
- Consolidation hides failures behind early assertions -> use named steps and small scenario groups, keeping unrelated contexts isolated.
- Theme sampling misses a divergent rule -> retain theme-specific styling and parity/reset assertions, and validate a scoped-theme regression.
- Coverage overhead is larger/smaller than fixture timing -> use controlled capture-on/off comparisons; fixture timing omits some V8 execution impact and is not wall time.
- Passing historical evidence is assumed despite a recorded failure -> reproduce and classify baseline failures separately, fix in scope only if necessary to verify the retained boundary, and disclose unresolved blockers.
- Uncommitted component work is lost -> edit only relevant verification/planning files and preserve current component/token/style changes.

## Migration Plan

1. Record source/test inventories and the behavior ownership matrix; establish bounded timing/failure evidence without running build writers alongside browser tests.
2. Remove smoke/replay duplicates that already have surviving ownership and can preserve current gates; record evidence after this first stage.
3. Transition default/diagnostic modes and CI policy together, validate their failure behavior, and update contradictory contributor guidance. This explicitly supersedes the old E2E gate; do not rewrite prior verification records.
4. Remove remaining counter-only repetitions and consolidate presets/theme-independent cases. Run targeted probes and matched timings after each family batch.
5. Complete all required checks, capture the final matrix and before/after evidence in verification documentation, and report remaining measurement limits. Use the resulting runtime to decide whether a separate selector proposal is warranted.

Rollback reverts only this change's verification/configuration/documentation edits. Restore removed tests together with the old full-inventory gate; restoring only the gate would fail on intentionally unvisited demonstrations. No production API, token or data migration is involved.
