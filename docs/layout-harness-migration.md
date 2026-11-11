# Layout browser harness migration

This continues the [initial harness pilot](component-harness-verification.md) with Cluster, Container, Section, SimpleGrid and Separator. The user requested further migration after the pilot was committed as `d8712c1`.

Counts and measurements below describe this batch. The subsequent [form-control migration](forms-harness-migration.md) records the expanded harness inventory.

## Preserved coverage

All 86 cases from the five original suites move to [the harness suites](../tests/browser-harness/specs/). A one-time comparison against `d8712c1` verified that the complete test files are identical after normalizing only fixture imports, fixture arguments, `openStory(page, …)` to `openScenario(mount, …)`, and the Separator contrast-helper import path. No assertions, test titles, viewports, preferences, retries or timeouts changed. The committed baseline remains the audit source; test text is not frozen for future maintenance.

| Family | Source at `d8712c1` | Current owner |
| --- | --- | --- |
| Cluster | `tests/e2e/components/cluster/Cluster.spec.ts` | [Cluster](../tests/browser-harness/specs/cluster/Cluster.spec.ts) |
| Container | `tests/e2e/components/container/Container.spec.ts` | [Container](../tests/browser-harness/specs/container/Container.spec.ts) |
| Section | `tests/e2e/components/section/Section.spec.ts` | [Section](../tests/browser-harness/specs/section/Section.spec.ts) |
| SimpleGrid | `tests/e2e/components/simple-grid/SimpleGrid.spec.ts` | [SimpleGrid](../tests/browser-harness/specs/simple-grid/SimpleGrid.spec.ts) |
| Separator | `tests/e2e/components/separator/Separator.spec.ts` | [Separator](../tests/browser-harness/specs/separator/Separator.spec.ts) |

Private scenario modules retain the relevant story render trees and defaults, with direct implementation imports and explicitly required component/demo CSS. A one-time TypeScript syntax-tree comparison confirmed identical render/args expressions for all 61 migrated scenarios, along with identical defaults and helper implementations. They do not import CSF or execute story play functions. The original stories and their render/play/accessibility checks remain intact. The [behavior matrix](../tests/browser-behavior-matrix.md) retains responsive sizing, real geometry, native focus, theme boundaries, RTL, enlarged/spaced text, forced colors and distinct SSR/package/Storybook ownership.

## Measured decision

One matched before/after invocation ran without other test workloads, on the same checkout and machine with Chromium, three workers, zero retries, failure traces/screenshots, and ordinary coverage-disabled configuration. Commands used `npm run test:e2e:storybook` before and `npm run test:e2e:components` after, with explicit paths to the same five families and `--workers=3`.

| Measurement | Storybook | Harness |
| --- | ---: | ---: |
| Passing cases | 86 | 86 |
| Command wall time (`/usr/bin/time -p`) | 111.80s | 18.12s |
| Runner duration | 1.8m | 17.4s |

The harness reduced observed command wall time by **83.8% (6.17×)** for this workload. This is a single-run observation, not a median or a full-suite speedup claim. It uses ordinary managed-server startup and existing disk caches, not controlled cold-cache startup measurements. Keep the migration: equivalent assertions passed with substantially lower local cost. Scratch logs are under ignored `.verification/layout-migration/`.

## Affected selection

The [catalog](../tests/browser-harness/catalog.json) assigns each moved suite to its imported scenarios. Scenario-only changes select just their owning suite. Integration regressions cover all five scenario modules and composed consumers: Cluster CSS selects Cluster, Section and SimpleGrid; Container implementation selects Container, Cluster, Section, SimpleGrid and Stack; Separator CSS selects Separator. Production edits still select all retained Storybook suites conservatively. Shared or uncertain changes still trigger full fallback.

The migration itself changes the catalog and removes legacy paths, so local completion requires the complete browser suite. The complete inventory remains 404 cases across 33 files: 146 harness cases in nine files and 258 retained Storybook cases in 24 files. Actual runner discovery is checked against the static inventory. Public stories, Storybook delivery checks, production code, unit/integration coverage thresholds and CI configuration are unchanged.

## Verification

The focused baseline and migrated run passed all 86 cases. Lint and both TypeScript checks passed. The independent full unit gate passed 697 tests in 51 files, and the full integration gate passed 364 tests in 53 files with three workers. Both retain 100% production statement, branch, function and line coverage. Integration checks include actual Playwright inventory reconciliation and the eight added ownership cases.

`npm run test:e2e -- --workers=3` passed all 146 harness cases, then 249 of 258 retained Storybook cases. Nine retained cases timed out waiting for Storybook rendering or preview content: three Textarea cases, one Typography case, three organization/documentation cases and two spatial-system cases. The observed failures were readiness timeouts rather than changed component assertions. Concurrent machine activity was high, but resource contention is only a possible explanation, not a proven root cause.

`npm run test:e2e:storybook -- --last-failed --workers=1` subsequently passed all nine failed cases in 23.6 seconds without implementation, assertion, timeout or retry changes. Every case therefore has a passing result across these invocations, but the complete invocation was not clean; this is intermittent-failure evidence, not a reliability fix. Original failure traces and context were preserved in ignored `.verification/layout-migration/failed-storybook-results/`. Complete remote CI remains pending.

All 338 Storybook render/play/accessibility tests in 29 files passed. The library build, static Storybook build, built-style browser checks and installed-package verification passed, including exported types/CSS, bundling, and React 18/19 SSR. `git diff --check` passed. Production sources, tokens, dependencies, browser configurations and CI files remain unchanged.
