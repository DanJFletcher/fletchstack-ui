# Design

## Context

See [the proposal](proposal.md) for motivation and scope. This design is necessary because the change crosses verification policy, browser infrastructure, dependency discovery and test migration.

- [Current Playwright configuration](../../../playwright.config.ts) serves Storybook on port 6007, uses Chromium, zero retries and retained failure traces. [Preview readiness](../../../tests/e2e/fixtures/storybook.ts) waits for successful render/play completion. The ordinary command is already coverage-free.
- [Browser simplification evidence](../../../docs/browser-runtime-verification.md) records an earlier reduction from 594 tests/648.95s to 346/280.47s. [Later verification](../../../docs/verification.md) records two 395/396 runs with documentation-navigation failures; associated logs report 8.5 and 8.1 minutes. These are historical workloads, not a controlled benchmark for this change.
- [Button's hydration fixture](../../../tests/integration/components/button/fixtures/ButtonApp.tsx) already imports Button directly and exercises native forms outside Storybook. Its [builder](../../../tests/integration/fixtures/hydration/build.ts) and [browser fixture](../../../tests/integration/fixtures/browser.ts) create per-file work; the harness should use one served application per run rather than duplicating those costs. Existing SSR/hydration checks remain intact.
- Installed Playwright 1.65.0 supplies `mount(storyId, props)` against a gallery exposing `window.mount`/`window.unmount`. Its implementation navigates to the configured base URL before mounting; do not assume navigation disappears or that scenario-string calls provide an import graph. [Upstream component-testing documentation](https://playwright.dev/docs/test-components) describes the same developer-owned gallery model.
- [Existing Git discovery](../../../scripts/affected-git.mjs) already unions branch, staged, unstaged and untracked changes. [Unit/integration selection policy](../../../scripts/affected-policy.mjs) is intentionally conservative and remains unchanged. The new selector needs a browser-specific graph and legacy resource rules.
- Accepted specs are empty. Earlier unarchived [affected-testing requirements](../add-affected-unit-integration-tests/specs/affected-unit-integration-testing/spec.md) and [agent workflow requirements](../adopt-flexible-agent-testing/specs/agent-testing-workflow/spec.md) mandate full local verification. This change intentionally replaces only the full-local-browser obligation; it preserves their other guarantees. Historical artifacts are not edited. Future spec synchronization must reconcile that explicit supersession rather than reinstating conflicting local-browser language.

## Goals / Non-Goals

**Goals:** Implement the [local policy](specs/local-browser-verification/spec.md), [harness contract](specs/component-browser-harness/spec.md) and [selector contract](specs/affected-browser-testing/spec.md) with a bounded pilot and an auditable relationship from changed input to selected suite.

**Non-Goals:** A second public component showcase, mounting every component simultaneously, export-level tree-shaking analysis, arbitrary JavaScript dependency inference, rewriting existing unit/integration selectors, new testing dependencies, blanket trace removal, automatic retries or migration beyond the three pilot families.

## Decisions

### 1. Separate local scope from complete CI confidence

Update the shared testing policy first; it can operate with explicit suite selection while automation is built. Document affected families and composed consumers, using a full local browser run when uncertain. A focused failure repair invalidates the affected scope, not every unrelated previous browser result; infrastructure repairs invalidate the full browser scope. Never reuse results across relevant intervening edits.

Keep the existing full Storybook render/play/a11y run at local completion for browser-impacting work during this pilot: its measured cost is about 24 seconds and it protects the published examples. The local time-saving change targets standalone E2E. Full unit/integration coverage and existing lint/type/build/package obligations are unchanged. Complete CI still runs all checks; local completion reports CI as pending unless its result is actually known.

Update [testing guidance](../../../.agents/guidelines/testing-guidelines.md), [component guidance](../../../.agents/guidelines/component-library.md), [TDD guidance](../../../.agents/skills/tdd/SKILL.md), applicable test/component skill references, [test guide](../../../tests/README.md) and [README](../../../README.md) consistently. Do not modify the external agent-guides installer/source repository. Record that reinstalling upstream guidance could replace local policy edits.

Alternative rejected: retaining full local E2E after every repair preserves the major repeated cost even if individual tests get faster. Relying only on CI for shared/unknown changes would discard the agreed conservative local fallback.

### 2. One Vite application, independently loaded scenarios

Place a small private harness under `tests/browser-harness/`, with one HTML/React entry and scenario modules grouped by component family. Serve it on a dedicated loopback port, separate from Storybook's 6006/6007 ports. Use installed Vite/React tooling and an explicit harness configuration; do not inherit the library-build entry accidentally.

The gallery lazily loads only the requested scenario from a static catalog. Each scenario imports implementation modules directly plus the CSS needed for that composition; global token CSS is a declared shared dependency. Avoid the public re-export barrel and all-component stylesheet in these focused fixtures. Keep separate package/consumer tests responsible for published exports and stylesheet delivery.

Use the installed Playwright mount contract. Resolve only after React commit and any scenario initialization required for interaction; report import/render failures and uncaught page errors. Unknown IDs reject. Tests control theme, viewport and preferences explicitly. No automatic Storybook plays, arbitrary sleeps or global demo UI is included.

Start with fresh Playwright contexts and normal worker-owned browsers. Reset any scenario-owned clipboard replacement, permissions or document changes, including after failure. Context reuse and trace changes are optional later experiments, not prerequisites or assumed speedups. Keep retries at zero and failure evidence intact.

Alternative rejected: one all-components page couples keyboard order, CSS and dependencies. Importing whole CSF modules into the harness would reintroduce Storybook behavior and broad barrel dependencies. Plain shared React fixture components can be extracted where that demonstrably avoids duplicate setup without altering public stories.

### 3. Make suite-to-scenario ownership explicit

Use a small static ownership catalog linking discovered browser suite paths to scenario IDs/modules. The catalog is also the source for the gallery's allowed scenario entries; do not maintain separate competing scenario lists. Select at file granularity, conservatively including all scenarios owned by that suite.

Build a read-only graph from each scenario entry using installed TypeScript parsing/resolution for supported local imports/re-exports and literal dynamic imports, and resolve stylesheet imports as resource edges. Handle CSS imports and local resource URLs as dependencies where supported; unresolved aliases, dynamic paths, filesystem resources and unsupported syntax produce full fallback. Built-in/shared harness modules and global styles are full-run triggers. Do not execute fixture modules or run Vite transforms during discovery.

The generic catalog loader is infrastructure, not an edge making each suite depend on every scenario. Tests obtain IDs through declared ownership; discovery checks IDs, files and complete Playwright project/file inventory for missing or stale entries. Catalog edits trigger full fallback during the pilot. Avoid relying on Playwright `--only-changed`: its runner import graph cannot see application dependencies loaded through a browser URL or scenario string.

For retained Storybook suites, record conservative component/scenario/resource ownership in the same catalog. Audit their real compositions, story imports and shared CSS. A family name alone is insufficient: Button affects CodeBlock, Stack forms, ButtonGroup and other consumers. If complete ownership cannot be established for a retained suite or changed resource, run the complete E2E inventory. Global preview CSS/cascade inputs stay broad; no claimed precision should depend on current equal token values or brittle selector-name guesses. Validate catalog completeness against discovery, and use controlled transitive regressions to check substantive ownership.

Alternative rejected: a large hand-maintained source-file-to-test map duplicates the component graph. Keep only the missing suite/scenario bridge and legacy external-resource declarations explicit, deriving scenario dependency closure from source.

### 4. Preserve one meaning for complete E2E

Keep `npm run test:e2e` as the complete standalone browser entry point across two Playwright projects: `components` for the harness and the retained `chromium` Storybook project. Ensure test matching is disjoint. Add an explicit harness-only command/configuration for focused development, so selecting a harness suite does not start Storybook. Retained-only selection must likewise avoid starting the harness. Mixed/full execution can invoke the required projects sequentially through a thin runner, with distinct output/report paths and combined nonzero failure status.

Introduce `npm run test:e2e:affected -- --base <git-ref> [--dry-run]`. Reuse the Git-discovery utility without changing existing unit/integration policy. Produce deterministic project/file selections with source reasons and complete fallback outcomes. Use argument arrays to launch tests, never shell-interpolated filenames. Inventory/metadata parse failure is an error; unproven impact with a valid complete inventory is full fallback. Preserve signals and failures across any multiple runner invocations.

Dry-run discovery launches no browsers/servers, performs no token generation or bundles, and writes no caches/reports. It must not import test bodies with side effects. Keep discovery manifests static/parseable and verify them against actual runner discovery in dedicated tests. Select directly changed/new tests; incomplete ownership of new inputs broadens the run.

Ordinary execution remains coverage-free. Preserve `test:e2e:coverage` as an opt-in diagnostic across the applicable projects, with scope labels and scenario/harness classification in its browser-source inventory. A focused diagnostic may be partial; no harness migration may silently turn a supposedly complete diagnostic into a legacy-only report. Existing independent production coverage configuration remains unchanged; test harness files stay outside production source scope.

### 5. Migrate guarantees, with a measured stopping point

Use the [browser behavior matrix](../../../tests/browser-behavior-matrix.md) to map each assertion in the three pilot suites to a harness or retained served-Storybook owner. Port Button native form/keyboard/style checks, Stack geometry/RTL/forms, and CodeBlock clipboard/scrolling/highlighting/reflow/preferences. Keep Button Storybook args and other delivery-specific assertions in served tests. SSR, hydration and built/individual stylesheet tests remain separate; development harness success cannot replace them.

Capture the existing equivalent workload before editing it, then compare the harness workload using identical browser, worker count, tracing, coverage mode and uncontended machine conditions. Run at least three warm repetitions per mode, alternate order where practical, report medians/ranges, and measure fresh server startup separately with cache state disclosed. Include full command wall time and selector discovery overhead; do not equate summed test/step durations with elapsed savings. Measure scenario initialization separately if available; label unavailable phases.

Validate failure sensitivity with bounded native activation, gap/RTL, clipboard and nested-style probes in disposable fixtures or a temporary checkout; restore them before final checks. Probe selection for direct and transitive implementation changes, component CSS, story/scenario/test edits, shared tokens, unknown paths, rename/deletion and missing history. Compare the affected selection with complete inventory/owner evidence.

Retire duplicate legacy component assertions only after parity and an observed matched runtime improvement. If evidence is inconclusive, keep the pilot opt-in and existing owners active, report the result and stop broader migration. This change establishes a go/no-go record; it does not authorize the next wave automatically.

## Risks / Trade-offs

- **Legacy ownership is incomplete:** Full fallback remains the correct initial result; disclose how often it happens and do not promise all leaf edits will be narrow.
- **CSS imports miss cascade coupling:** Declare shared styles broadly, test scoped CSS and composed consumers, and fall back when locality is unproven.
- **Two scenario catalogs drift:** Share plain React fixture pieces only where helpful, keep harness fixtures minimal, and retain independent Storybook render/a11y checks.
- **A faster harness conceals a boundary:** Preserve the behavior matrix, SSR/package owners and served-Storybook tests; use failure probes before removing assertions.
- **Known navigation failures obstruct full validation:** Diagnose the FieldLabel-to-Field and spatial-guide navigation paths with focused traces. Preserve assertions/timeouts/retries; apply only evidence-backed test readiness repairs. Report any unrelated product regression or remaining blocker without claiming a green gate.
- **Diagnostics/reporting or server orchestration adds complexity:** Keep one complete command, disjoint project ownership and simple argument-array orchestration; test failure propagation and server selection explicitly.

## Migration Plan

1. Record branch/worktree state, ownership and matched baseline; preserve unrelated component work.
2. Introduce consistent local policy with explicit suite selection and shared/unknown fallback.
3. Add the private harness and opt-in pilot suites; retain original owners while comparing.
4. Add and validate browser selection, including retained-suite declarations and full fallbacks.
5. Record parity/performance results. If the pilot earns migration, remove only equivalent legacy assertions and include harness owners in complete E2E/CI; otherwise retain originals and leave the pilot opt-in.
6. Validate complete browser coverage because this change touches infrastructure, plus unchanged required gates. Record known failures and focused repairs. Update current documentation and stop before any additional families migrate.

Rollback restores the former pilot assertion owners and complete command routing, and disables automatic affected selection in favor of explicit known scope or full fallback. The policy can remain independently useful; rollback must never leave a browser guarantee without an active CI owner.
