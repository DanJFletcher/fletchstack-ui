# Tasks

## 1. Ownership and comparable baseline

- [x] 1.1 Record the starting worktree and map every assertion in the Button, Stack and CodeBlock E2E suites to its intended harness or retained Storybook owner; verify the delivered mapping against the existing browser-behavior matrix and preserve unrelated edits.
- [x] 1.2 Capture three warm runs and a separate fresh-server observation for the equivalent pilot workload, recording environment, workers, tracing, coverage, cache state, command wall time and actual failures in benchmark evidence; verify the same assertion workload can be used for the after comparison.
- [x] 1.3 Reproduce the recorded FieldLabel-to-Field and spatial-guide navigation failures with focused runs/traces where feasible, classify readiness/test/product causes, and record any evidence-backed readiness repair with focused passing verification; preserve assertions/timeouts/retries and report unresolved blockers.

## 2. Scoped local completion policy

- [x] 2.1 Update repository testing/component guidance and applicable TDD/test/component skill references to permit focused iteration and affected local E2E completion, with explicit temporary suite selection and full shared/unknown fallbacks; verify by reviewing component-only, CSS, token, infrastructure and failure-repair examples against the local-browser-verification spec.
- [x] 2.2 Update current README/test guidance with commands, ownership rationale, pending-CI reporting and known-failure handling; verify no current guidance still universally requires full local E2E after every repair, while full unit/integration gates, local Storybook checks and other existing obligations remain intact. Preserve historical evidence and document the external guide-installer overwrite risk.

## 3. Lightweight scenario harness

- [x] 3.1 Add the private Vite/React harness, explicit config and static scenario ownership catalog with lazy scenario entries and direct component/CSS imports; verify a focused harness command starts only its server and mounts a representative Button scenario with real styles.
- [x] 3.2 Implement mount/unmount readiness and error propagation using the installed Playwright contract; add focused tests proving unknown IDs, module/render failures and page errors fail, and document scenario authoring and readiness rules alongside the harness.
- [x] 3.3 Establish fresh context/scenario state and cleanup for themes, CSS, preferences, clipboard replacements and permissions; verify representative sequences in both orders and after a failed scenario without enabling retries or context reuse.
- [x] 3.4 Add disjoint harness and retained-Storybook project discovery plus harness-only, retained-only and complete command routing; verify the complete inventory includes every suite exactly once, focused runs start only needed servers, reports do not overwrite each other and failures/signals remain nonzero across orchestration.

## 4. Pilot assertion migration

- [x] 4.1 Port Button's component-native/style assertions into isolated scenarios while retaining Storybook args and delivery assertions; run both equivalent workloads, update the behavior matrix and demonstrate a native activation or disabled-state regression is caught and restored.
- [x] 4.2 Port Stack geometry, scoped spacing, RTL, responsive forms and focus-clearance assertions; run the matched suites and a gap/RTL fault probe, update ownership evidence, and retain existing SSR/hydration boundaries.
- [x] 4.3 Port CodeBlock clipboard, scrolling/focus, wrapping, highlighted source/contrast, theme reset and preference assertions; run the matched suites plus clipboard and scoped-style probes, verify cleanup, and update the matrix without removing SSR or packaged-style coverage.
- [x] 4.4 Preserve coverage-free defaults and opt-in diagnostics across the harness/legacy projects; verify normal runs leave diagnostic artifacts unchanged and filtered diagnostics label scope, include harness sources appropriately and fail for missing data/report errors. Document diagnostic invocation and unchanged production coverage boundaries.

## 5. Affected browser discovery and execution

- [x] 5.1 Add browser-specific option parsing and reuse existing Git change discovery without altering unit/integration selection policy; verify branch/staged/unstaged/untracked unions, whitespace paths, rename/deletion, invalid arguments, missing history and non-Git behavior with focused tests.
- [x] 5.2 Build scenario dependency discovery for supported local component imports/re-exports, literal dynamic imports, CSS imports and local resources; verify transitive Button-to-CodeBlock selection, scoped CSS ownership, unrelated scenario exclusion and conservative unsupported-resource fallback with focused graph tests.
- [x] 5.3 Add conservative ownership for retained Storybook suites and compositions; audit declarations against served scenarios/resources, test catalog completeness against runner inventory, and verify missing/stale declarations and new unmapped tests cannot produce a precise false pass.
- [x] 5.4 Implement `test:e2e:affected -- --base <git-ref> [--dry-run]`, deterministic project/file selection and reasons, four distinct outcomes, and coverage-free execution; verify dry runs execute no test bodies, browsers, servers, token generation, bundles or cache/report writes, and execution uses the same selection.
- [x] 5.5 Verify command failure propagation with disposable failing harness/legacy suites and setup errors; confirm mixed selections preserve nonzero exits, directly changed tests run, shared inputs select the entire inventory and existing coverage artifacts remain untouched.
- [x] 5.6 Exercise controlled direct/transitive component, scoped CSS and shared-token regressions; compare selection with complete owner/inventory evidence, record actual selected failures and restored passes, and measure discovery plus execution time for narrow and fallback cases. Publish selector limits and examples in the test guide.

## 6. Pilot acceptance and CI integration

- [x] 6.1 Run the matched harness benchmarks with at least three warm repetitions and separate fresh-server observations, including selection overhead and disclosed unmeasured phases; publish medians/ranges, parity evidence and a go/no-go decision. Do not infer speedup from counts or expand beyond the pilot; a no-go leaves existing owners active and rollout acceptance incomplete.
- [x] 6.2 After demonstrated parity and measured improvement, remove only equivalent legacy pilot assertions and make the complete E2E/CI entry point run the harness plus retained suites; verify all matrix rows retain active owners and document migration/rollback. Leave this rollout task pending if pilot acceptance fails rather than marking an unaccepted migration complete.
- [x] 6.3 Verify the required CI workflow still runs full E2E and all Storybook render/play/a11y checks alongside unchanged production/build/package gates; validate complete command discovery, no accidental filters/skips, server isolation and diagnostic scope, and update current workflow documentation.

## 7. Final integrated verification

- [x] 7.1 Because this change modifies browser infrastructure, run complete local harness/legacy E2E and all Storybook checks on the final state, with token/build writers kept away from served tests; report all outcomes and any remaining known navigation blocker without masking failures.
- [x] 7.2 Run lint, both TypeScript checks, independent full unit/integration coverage gates, library/static Storybook builds, built-package browser verification and package/SSR checks; verify existing coverage scopes/thresholds and public runtime/types/styles remain intact.
- [x] 7.3 Review final selection evidence, behavior ownership, benchmark conditions and policy consistency; verify local reports distinguish selected/full runs and pending CI, document limitations and the separate decision required for further migration, and confirm unrelated work was preserved.
