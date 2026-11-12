# Tasks

## 1. Component recipe

- [x] 1.1 Add `docs/component-authoring.md` with concern-specific Stack/Badge/Switch/Avatar references, the lightweight contract checklist, and the current integration map; verify every reference resolves and no routine choice requires a new planning or approval gate.
- [x] 1.2 Link the recipe from the existing component skill and contributor documentation, referencing rather than duplicating testing policy; verify it preserves coverage-free development, final coverage gates, full browser fallback, and authored accessibility evidence.

## 2. Mechanical inventory and compatibility

- [x] 2.1 Establish passing coverage-free focused build/organization/public-export tests and record existing CSS concatenation order and exported entrypoints; verify the baseline before refactoring registration.
- [x] 2.2 Introduce the build-only component-family inventory and refactor stylesheet distribution to consume its ordered mappings; verify focused synthetic ordering/missing-file tests and byte-equivalent existing combined/individual styles, and document inventory ownership in the recipe.
- [x] 2.3 Separate protected migration-baseline checks from current inventory consistency checks, removing growing new-component-name exceptions without changing baseline fixtures; verify additive synthetic registrations pass and deleted protected exports, changed protected tokens, unclassified modules, and package development-file leakage fail.
- [x] 2.4 Retain independent reviewed runtime/type and installed-package consumer expectations while simplifying mechanical build fixtures; verify existing consumers and explicit CSS entrypoints still resolve independently of inventory-derived assertions.

## 3. Safe scaffold planning and application

- [x] 3.1 Implement shared deterministic planning for `component:new`, with validated names/categories/intrinsic-element mappings and conventional output paths; verify dry-run fixtures report exact proposed edits and leave all file bytes unchanged, and document command inputs and supported single-root scope.
- [x] 3.2 Implement preflight and bounded registration edits with path/symlink containment, collision detection, content rechecks, and no force-overwrite mode; verify invalid names, duplicate identities, existing files, unsupported layouts, and repeated creation fail before writes while unrelated edits survive valid creation.
- [x] 3.3 Generate component/ref/native-prop skeletons, scoped CSS, local exports, plain React examples, thin story/harness adapters, and documentation markers; verify temporary fixture output typechecks for supported intrinsic mappings and does not introduce token values, copied reference behavior, Storybook runtime dependencies in harness examples, or placeholder behavioral tests.
- [x] 3.4 Wire inventory, static public exports, CSS package entrypoints, preview imports/categories, and catalog scenario/planned-owner registration through the same plan; verify disposable creation produces the reported edits without changing existing stylesheet order or exports, and document that missing authored suites remain incomplete.
- [x] 3.5 Expose the npm command and implement clear success, preflight-failure, and filesystem-failure reports; verify exit statuses and changed-path reporting using isolated fixtures, including that creation runs no test, coverage, build, or server commands.

## 4. Completion checks and adapter integration

- [x] 4.1 Add `component:check` for inventory/file/export/style/scenario ownership consistency and unresolved scaffold markers; verify each missing or duplicate target produces an actionable nonzero result and document that structural readiness is not behavioral verification.
- [x] 4.2 Complete one synthetic component in a disposable fixture with independently authored behavior and consumer assertions; verify shared examples work through separate Storybook and harness adapters, explicit ownership resolves, public types/styles load, and no synthetic component enters production exports.
- [x] 4.3 Finish recipe examples with the actual commands, expected incomplete-work report, test-owner responsibilities, and a concise next-component evaluation record; verify the documented sequence against the fixture and record setup time/corrections separately from test time without claiming a real-component speedup.

## 5. Final integration verification

- [x] 5.1 Review the complete implementation for scope, independent assertions, deterministic mutation boundaries, and compatibility; verify all new/changed focused tests pass without coverage and no unresolved scaffold fixture or unrelated production changes remain.
- [x] 5.2 After all implementation, tests, cleanup, and review are finished, run `npm run test:unit:coverage` and `npm run test:integration:coverage` unfiltered; verify both existing independent 100% gates pass and apply the current focused-repair/evidence-reuse policy if either fails.
- [x] 5.3 Run required lint, both TypeScript checks, library/built-browser checks, static Storybook build, and package/SSR verification; verify supported consumers, exports, styles, and generated outputs retain compatibility.
- [x] 5.4 Run full E2E and all Storybook render/play/accessibility checks because build/export/browser registration infrastructure changed; report timings, scope, coverage mode, failures, and pending CI without changing selection rules or claiming synthetic timing proves faster component delivery.

## Workflow follow-up

- On the next separately requested real component, use the recipe/scaffold and record setup time, integration corrections, and verification time before considering further generator features. This future product request is not a prerequisite for completing this tooling change.

## Verification record

Coverage-free focused checks passed before final verification. Final results: 787 unit tests (10.60s), 596 integration tests (33.42s), both independent coverage gates at 100% statements/branches/functions/lines; 415 E2E tests (97.32s, three workers, no retries); and 348 Storybook checks (15.71s). Lint, both TypeScript checks, built-browser/library verification (3.83s), static Storybook build (7.89s), and packed React 18/19 consumer/type/CSS/SSR checks (7.95s) passed. Existing combined CSS was byte-equivalent to the pre-refactor baseline; public exports were unchanged. Logs are in ignored `.verification/component-authoring/`.

Disposable fixture checks establish scaffold correctness, including five supported native element/ref mappings and independent adapter rendering. They do not measure authoring speed for a real component. Required remote CI and that next-component evaluation remain pending.
