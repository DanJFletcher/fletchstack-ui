# Tasks

## 1. Ownership matrix and baseline evidence

- [x] 1.1 Record the current working tree, CSF/story inventory and standalone test inventory, preserving unrelated edits; deliver a browser-behavior matrix in `tests/README.md` or a linked companion with current/retained owners, applicable themes/environments and explicit removal rationale for each candidate case.
- [x] 1.2 Explain and execute a bounded benchmark of representative render-only, play-heavy, geometry and preference cases; record Node/browser versions, checkout, workers, tracing, coverage mode, three warm repetitions, a separate cold-start observation, wall versus summed duration, and measured/unavailable phase boundaries in verification evidence.
- [x] 1.3 Capture one justified complete pre-change verification baseline and reproduce/classify the historical Card readiness failure if it recurs; record actual outcomes without retries, timeout inflation, skips, or a claim that the historical failing run was a passing baseline.

## 2. Remove already-covered smoke and replay checks

- [x] 2.1 Compare actual Storybook discovery/skip tags with the stories exercised by the 16 render-success loops; add a focused inventory regression check for the supported discovery contract and document any unmatched stories before deleting cases.
- [x] 2.2 Remove Select/Stack render-success cases that duplicate existing focused browser checks and Storybook rendering; verify the affected Storybook files and surviving native typeahead, geometry, theme styling and reflow cases, and update their matrix rows.
- [x] 2.3 Remove redundant Button final-focus/ref/attribute replay assertions and equivalent Field description/slot/tag-name checks only where a surviving assertion owns the same guarantee; verify DOM/SSR, real keyboard/hydration and retained story interactions, recording kept distinct boundaries in the matrix.
- [x] 2.4 Measure this first batch against its baseline workload and verify whether the existing strict E2E gate still passes; defer any deletion that only becomes possible after the explicit diagnostic-policy transition, and document the stage's outcomes.

## 3. Coverage-free defaults and opt-in diagnostics

- [x] 3.1 Introduce the explicit coverage fixture option defaulting off and remove coverage reporting from ordinary Playwright execution; add focused lifecycle/configuration tests proving no start/stop/add/cache-clean/report calls or diagnostic artifact writes occur by default, while existing failure tracing/screenshots and zero retries remain.
- [x] 3.2 Add `playwright.coverage.config.ts` extending shared configuration and `test:e2e:coverage` in `package.json`; verify both commands inherit the same server/projects/discovery and accept file/name filters, with collection enabled only in the diagnostic command. Document commands and changed exit semantics alongside the code.
- [x] 3.3 Replace the browser percentage gate with diagnostic reporting, retaining unloaded-file accounting and separate production, story/demo and preview totals plus executed scope/filter metadata; add tests for classification, never-loaded files, cache freshness, incomplete coverage success, and isolation from unit/integration outputs.
- [x] 3.4 Add tests/probes proving test failures, absent expected coverage data and collection/report generation errors still fail diagnostic execution; verify a filtered ordinary run succeeds without unrelated coverage and does not alter a seeded diagnostic artifact.
- [x] 3.5 Record paired capture-on/off timings of the same retained workload, separately measuring fixture/report overhead where available; verify all unit/integration include/exclude patterns, independent 100% thresholds and output isolation remain unchanged, updating the evidence and test guide.

## 4. Consolidate remaining duplicate browser work

- [x] 4.1 Audit the remaining render-success loops and remove only mapped duplicates, retaining representative served-preview success/play-failure checks; run the affected Storybook and focused browser suites per family batch and update inventory/matrix/evidence together.
- [x] 4.2 Consolidate Stack/Container preset/alignment assertions against their already-rendered multi-example fixtures, with named steps and bounded scenario isolation; verify geometry, responsive breakpoints, narrow parents, hidden participation, RTL, source order and focus clearance, recording matched timings.
- [x] 4.3 Apply the same measured consolidation to Cluster, SimpleGrid, AspectRatio and Section where their fixtures support it; retain distinct row/column wrapping, media geometry and section-spacing contracts, and verify each batch through its mapped browser assertions and timing evidence.
- [x] 4.4 Reduce exhaustive theme duplication only for demonstrated shared behavior, retaining theme-specific color/state/focus checks and explicit parity, nested reset and scoped override assertions; run both-theme, 320px, enlarged-text and user-spacing checks for the affected CSS contracts and document sampling rationale.
- [x] 4.5 Confirm retained browser integration still covers pre-hydration geometry, actual hydration, native hidden/disabled behavior, selective stylesheet loading and built-package styles; run the corresponding existing integration/consumer checks and record why superficially similar cases remain.

## 5. CI integration and failure sensitivity

- [x] 5.1 Keep the required verify workflow running independent production gates, all Storybook/a11y checks, complete focused Playwright, builds and package verification; add an on-demand diagnostic coverage workflow with artifacts uploaded on failure, and verify workflow configuration and representative invocations without introducing a schedule or affected selector.
- [x] 5.2 Validate surviving ownership with controlled faults in disposable fixtures or an isolated checkout for label references, native activation/typeahead, gap/breakpoint/RTL geometry, focus clipping, nested tokens, reduced motion and forced colors; record the expected failing owner and restored passing result for each representative boundary.
- [x] 5.3 Verify a failed story play cannot satisfy served-preview readiness, and retain manager links, public IDs, theme toolbar and preview-style integration checks; run the relevant journeys and document the distinct served boundary.
- [x] 5.4 Update README/test/verification guidance consistently with the new policy, diagnostic limitations, ownership matrix and local commands; verify current instructions no longer promise mandatory browser 100%, while historical evidence and prior OpenSpec changes remain intact.

## 6. Complete verification and measured acceptance

- [x] 6.1 Run lint, typecheck, independent unit/integration coverage, all Storybook tests/a11y and the complete focused E2E suite sequentially with token/build writers kept away from served tests; record final outcomes and resolve in-scope regressions without masking failures.
- [x] 6.2 Run build, built-package browser verification, static Storybook build and package/SSR verification; confirm public runtime/types/styles and component behavior are unchanged and unrelated work is preserved.
- [x] 6.3 Run the diagnostic command, including a filtered invocation, and inspect HTML/JSON category inventories and scope labels; verify informational percentages, stale-cache prevention and meaningful error exit statuses.
- [x] 6.4 Capture matched final bounded benchmarks and a justified complete post-change runtime; publish before/after medians/ranges, workload differences, startup/execution/coverage phase evidence, retained behavior owners and remaining limitations without inferring speedup from test counts alone.
- [x] 6.5 Review final matrix and change diff against all requirements, confirm no coverage scopes were silently shrunk and no required browser boundary was lost, and record whether measured residual cost justifies a separate affected-selection proposal without implementing one.
