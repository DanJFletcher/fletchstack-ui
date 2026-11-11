# Spatial examples and theme coexistence migration

This follows the [Link migration](link-harness-migration.md). Commit `aab52ad` is the baseline. The original harness change was archived with its three accepted specs before this batch.

## Behavior and ownership

Sixteen spatial-example cases now use the [spatial harness suite](../tests/browser-harness/specs/spatial/SpatialSystem.spec.ts). The two-theme coexistence case moves to the [theme harness suite](../tests/browser-harness/specs/themes/themes.spec.ts). They retain raw spacing measurements, native select typeahead and focus, parent-owned gaps versus Button padding, nested token resets, the exact 600px responsive boundary, both-theme 320px enlarged/spaced reflow, distinct action colors and disabled states.

A one-time syntax-tree audit confirms exact preservation of all 17 migrated test bodies and assertions after normalizing mount calls. All five scenario render expressions, both spatial helper functions and the scale values match their source stories. The spatial composition play resets spacing to `actions`, already the harness initial state; no play prerequisite is lost. Hooks remain inside a React component.

The [private spatial scenarios](../tests/browser-harness/scenarios/SpatialSystem.tsx) import Button, CheckIcon and scoped CSS directly. No CSF module or public barrel is imported. Source stories, play/accessibility checks, production components and CSS remain unchanged.

The [retained spatial suite](../tests/e2e/storybook/spatial-system.spec.ts) preserves all seven remaining cases unchanged: six gallery coupling checks and the sidebar/guide/token navigation journey. The icon gallery and actual theme-toolbar journeys remain on Storybook. The [ownership matrix](../tests/browser-behavior-matrix.md) now links to current Link, Typography, spatial and theme owners.

Selection checks cover private spatial scenario changes, scoped demo CSS and CheckIcon consumers; Button changes include the new spatial composition. An initial CheckIcon expectation missed Checkbox and its composed consumers; source review confirmed those transitive imports and the expected list was corrected. No selection rule or fallback was changed. Actual Playwright discovery reconciles both configurations.

## Matched measurement

Both runs used Chromium, three workers, zero retries, ordinary coverage-free execution and managed-server startup, with no concurrent test workload. Existing caches were retained.

| Same 17 cases | Storybook | Harness |
| --- | ---: | ---: |
| Command wall time | 23.62s | 8.31s |
| Playwright duration | 22.2s | 7.3s |

The observed wall time fell 64.8% (2.84×). This is one before/after observation, not a cold-start benchmark, repeat-run median or full-suite speedup claim.

Total inventory remains **404 cases across 35 files**: **360 harness cases in 28 files**, and **44 Storybook cases in 7 files**. Logs are under ignored `.verification/spatial-theme-migration/`. Remote CI remains pending.

## Verification

Development checks passed without coverage: all 17 migrated browser cases, 140 selection/discovery/organization checks, lint and both TypeScript checks. Final integration initially caught the original theme file losing its unique relocation record when combined with Button tests; the correction keeps a separate theme suite and updates the explicit relocation map without weakening the inventory guard. The preservation audit passed.

Final verification passed:

- 697 unit tests in 51 files, 9.01s command wall time; 100% production statements, branches, functions and lines. This result remained valid across the harness/integration-only relocation repair.
- 458 integration tests in 54 files, 27.62s; the same four independent production coverage metrics reached 100% after the repair.
- Complete E2E with three workers: 360 harness cases in 42.8s and 44 retained Storybook cases in 51.9s, with no retries. Total command wall time was **96.48s (1m 36.48s)**. No other test workload ran concurrently.
- All 338 Storybook render/play/accessibility checks in 29 files; 19.91s command wall time.
- Lint, both TypeScript checks, library/static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR checks.
- Exact test/scenario preservation audit, documentation links and whitespace checks. Affected selection has no unresolved ownership issues and gives the expected complete fallback for the catalog/deletion changes.

Coverage collection began at final readiness. The failed integration inventory check reopened coverage-free development, followed by the full integration coverage rerun; valid unit evidence was retained. Ordinary browser runs collected no diagnostic coverage. Remote CI remains pending.
