# Feedback, action-group and form-group browser migration

This extends the [form-control migration](forms-harness-migration.md). The four original suites at `9da79b6` supply the audit baseline.

## Coverage and setup

All 53 browser cases move to [the component harness](../tests/browser-harness/specs/). A one-time TypeScript syntax-tree comparison verified that all 140 assertion statements remain identical, and all 31 scenario render/args definitions, defaults and retained helpers match their source stories. The Badge type assertion now references its directly imported props type. Fixtures import implementation modules and required CSS directly, including ButtonGroup's demonstration layout CSS, without importing CSF modules or public barrels.

| Family | Harness owner | Preserved boundary |
| --- | --- | --- |
| Badge | [Badge](../tests/browser-harness/specs/badge/Badge.spec.ts) | Both-theme contrast, passive semantics, exact counts/live regions, icon size, forced colors and reflow |
| Spinner | [Spinner](../tests/browser-harness/specs/spinner/Spinner.spec.ts) | Animation/reduced motion, status and busy-region lifecycle, inherited paint, focus exclusion, sizing and forced colors |
| ButtonGroup | [ButtonGroup](../tests/browser-harness/specs/button-group/ButtonGroup.spec.ts) | Joined seams/corners, hidden edges, RTL, widths/wrapping/alignment, scoped gaps, keyboard/focus, external submit/reset and enlarged labels |
| FormGroup | [FormGroup](../tests/browser-harness/specs/form-group/FormGroup.spec.ts) | Native choice keyboard behavior, disabled fieldsets, accessible names/descriptions, nesting, theme paint and responsive composition |

Storybook play functions continue to run through the unchanged Storybook test project. Three prerequisites previously supplied by play functions are explicit in the migrated tests: clicking Mark all read establishes Badge's zero count; clicking Save draft then pressing Tab establishes ButtonGroup's keyboard focus; checking SMS establishes FormGroup's checked state before its existing Space-to-uncheck assertion. Spinner starts in its authored pending state, which is also the state its story play restores.

The [organization relocation map](../tests/fixtures/component-organization-paths.json) points FormGroup's historical test path to its new destination. Production components, stories, global styles, browser configuration, timeouts, retries and coverage thresholds remain unchanged.

## Measured result

The same 53 cases ran on the same machine in Chromium with three workers, zero retries and coverage disabled. No other test workload ran concurrently with either measurement. Commands used `npm run test:e2e:storybook` before and `npm run test:e2e:components` after, with explicit Badge, Spinner, ButtonGroup and FormGroup suite directories and `--workers=3`.

| Measurement | Storybook | Harness |
| --- | ---: | ---: |
| Passing cases | 53 | 53 |
| Command wall time | 30.82s | 9.48s |
| Runner duration | 30.1s | 8.7s |

Observed wall time fell **69.2% (3.25×)**. This is a single before/after observation with existing caches and ordinary managed-server startup, not a median, cold-start benchmark or full-suite speedup claim. Logs are under ignored `.verification/feedback-actions-migration/`.

## Ownership and verification

Scenario-only edits select only their owning family. Selection checks also cover Badge CSS consumers in Cluster and SimpleGrid, ButtonGroup's demonstration CSS, Spinner implementation, and the new Button/Container/Checkbox/TextInput/FormGroup composition edges. The first targeted selection run exposed an incomplete expected consumer list for Badge CSS; source review confirmed Cluster and SimpleGrid import and render Badge, and the expectation was corrected to retain both consumers.

The catalog edits and deleted legacy paths trigger complete browser fallback for this migration. Production edits continue to conservatively include all retained Storybook suites. The inventory remains 404 cases across 33 files: **259 harness cases in 19 files** and **145 Storybook cases in 14 files**. Required remote CI remains pending.

Final local verification passed:

- Lint and both TypeScript checks.
- 697 unit tests in 51 files and 380 integration tests in 53 files, each independently reaching 100% production statement, branch, function and line coverage. Integration includes the corrected consumer expectation, seven additional selection cases, historical path checks and real Playwright discovery reconciliation.
- Complete E2E with three workers: 259 harness cases passed in 32.6s and 145 retained Storybook cases passed in 1.6m, with no failures or retries. These runner times cover a broader workload than the matched measurement above.
- All 338 Storybook render/play/accessibility tests in 29 files.
- Library and static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR verification.
- `git diff --check`; production source, tokens, dependencies, browser configurations and CI files remain unchanged.

This successful full browser run does not establish that the intermittent Storybook readiness behavior recorded in the [layout report](layout-harness-migration.md) is fixed. No timeouts, retries or assertions were relaxed.
