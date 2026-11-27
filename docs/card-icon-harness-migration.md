# Card and Icon browser harness migration

This extends the [Field migration](field-harness-migration.md). The original Card and Icon suites at `106869f` supply the audit baseline.

## Coverage and setup

All 24 cases move to the [Card](../tests/browser-harness/specs/card/Card.spec.ts) and [Icon](../tests/browser-harness/specs/icon/Icon.spec.ts) harness suites. A one-time TypeScript syntax-tree audit verified that all 64 assertion statements remain identical. All 18 scenarios, defaults, helper functions and icon catalog entries match their source definitions, with Card's Storybook globals mapped to harness theme defaults and spread-based Luna scenarios expanded into explicit definitions.

Card retains native disclosure activation, enlarged/spaced 320px reflow, geometry overrides and composition rendering. Icon retains custom SVG attributes, semantic sizes, all named artwork in both themes, accessible/decorative semantics, scoped token resets, native SVG refs, button-owned keyboard actions, inherited pointer/focus/disabled paint and enlarged labels.

Three prerequisites previously supplied by Storybook plays are now explicit Playwright actions: click the Card summary to open its disclosure; click Inspect SVG ref before checking the result; click Save changes and Close dialog before checking the existing activation count. Other journeys establish their own prerequisites. Storybook's render/play/accessibility project still executes every source play, including Card footer activation and media disclosure plays. Source stories remain unchanged.

Private scenarios import implementation modules and required CSS directly. Card imports its demonstration CSS. Icon copies the catalog data into its fixture and imports the eight named icons individually, avoiding the story catalog's public barrel dependency. Its [searchable gallery and toolbar journeys](../tests/e2e/components/icon/icon-gallery.spec.ts) stay in Storybook. The [historical path map](../tests/fixtures/component-organization-paths.json) points Card and Icon to their harness destinations.

## Measured result

The same 24 cases ran on the same machine in Chromium with three workers, zero retries and ordinary coverage disabled. No other test workload ran concurrently with either measurement.

```sh
npm run test:e2e:storybook -- tests/e2e/components/card/Card.spec.ts tests/e2e/components/icon/Icon.spec.ts --workers=3
npm run test:e2e:components -- tests/browser-harness/specs/card/Card.spec.ts tests/browser-harness/specs/icon/Icon.spec.ts --workers=3
```

| Measurement       | Storybook | Harness |
| ----------------- | --------: | ------: |
| Passing cases     |        24 |      24 |
| Command wall time |    21.22s |   7.99s |
| Runner duration   |     20.5s |    7.4s |

Observed wall time fell **62.3% (2.66×)**. This is one before/after observation with existing caches and ordinary managed-server startup, not a median, cold-start benchmark or full-suite speedup claim. Logs are under ignored `.verification/card-icon-migration/`.

## Ownership and verification

Five additional selection cases cover Card/Icon scenario edits, Card implementation consumers in Container/Section/SimpleGrid, Card demonstration CSS, and MoonIcon consumers. The initial MoonIcon expectation missed the lifecycle suite, which owns Button's scenario and therefore its transitive MoonIcon import. Source/catalog review confirmed that dependency and the expectation now includes it. The existing Button consumer check now includes Card and Icon.

The catalog edit and deleted legacy paths require complete browser fallback for this migration. The complete inventory remains 404 cases across 34 files: **302 harness cases in 23 files** and **102 retained Storybook cases in 11 files**. Production code, source stories, tokens, browser configurations, timeouts/retries, coverage thresholds and CI configuration remain unchanged. Remote CI remains pending.

Final local verification passed:

- Lint and both TypeScript checks.
- 697 unit tests in 51 files and 390 integration tests in 53 files, independently reaching 100% production statement, branch, function and line coverage. Integration includes the corrected lifecycle consumer expectation, historical paths, selection and real Playwright discovery.
- Complete E2E with three workers: 302 harness cases passed in 37.6s and 102 retained Storybook cases passed in 1.3m, with no failures or retries. Total command wall time, including startup, was **116.33s (1m 56.33s)**. This is one local run with existing caches, not a repeat-run median.
- All 338 Storybook render/play/accessibility tests in 29 files.
- Library and static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR checks.
- `git diff --check`; production source, tokens, dependencies, browser configurations and CI files remain unchanged.
