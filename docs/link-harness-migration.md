# Link and inline-focus browser migration

This follows the [Typography migration](typography-harness-migration.md). Commit `08293d1` is the pre-migration baseline.

## Preserved behavior

All 13 Link cases move to the [Link harness suite](../tests/browser-harness/specs/link/Link.spec.ts). The remaining inline-link focus case joins the [Typography harness suite](../tests/browser-harness/specs/typography/Typography.spec.ts). Tests preserve native Enter and modified-click navigation, popup opener isolation, current-tab external navigation, downloads, empty/unavailable destinations, hover/active/forced-color states, contrast, inherited typography and narrow-screen reflow.

A one-time source audit confirmed exact preservation of the migrated test bodies and assertions after normalizing fixture/mount calls and the explicit keyboard prerequisite. The Link keyboard story previously tabbed twice in its play function; the harness test now performs those tabs and checks the first link before continuing the original second-link/Shift+Tab/Enter journey. Stories and their plays remain unchanged.

The private [Link scenarios](../tests/browser-harness/scenarios/Link.tsx) import the real Link, required icons and scoped CSS. Original args and existing renders match the stories. The default component adapter and the external, download, empty and unavailable render adapters pin destinations explicitly while preserving each tested state. They intentionally do not expose arbitrary href overrides. The native-focus composition matches the original Heading story render exactly.

## Conservative destination ownership

The [graph](../tests/browser-harness/selection/graph.mjs) now recognizes empty/current-page and absolute HTTP(S) href literals alongside existing fragment and data literals: these introduce no additional local file dependency. Local document paths remain unknown. A [bounded symbol analysis](../tests/browser-harness/selection/forwarded-href.mjs) can prove a destructured href forwarded to a native anchor by a constant React forwardRef component when every component use in the closed import graph is JSX with an omitted or proven literal destination. It binds authored modules without executing code or loading additional runtime modules.

This is deliberately narrow. Computed/local destinations, overriding prop spreads, mutable/redeclared bindings, default href values, component aliases/reexports/escapes, unrelated functions named forwardRef and unsupported resource flows still cause complete fallback. No component name or source-file exemption exists. Selection tests cover those failures, shadowed identifiers, native-anchor spread overrides and preservation of dynamic-import/runtime-resource fallbacks. A focused failure probe demonstrated that a `var` redeclaration initially escaped the proof; the repaired analysis now rejects multiply declared symbols.

The selection tests share one read-only repository ownership snapshot because none of their fixtures modify repository files. Temporary resource/failure fixtures remain independently created and cleaned up. This avoids repeating the same symbol analysis for every expected-consumer assertion: all 114 cases passed without coverage in 3.25s runner time (6.03s command wall time), versus 22.16s in an earlier focused run before this setup change. These are individual observations with different host load.

Link implementation or CSS edits select both Link and Typography harness consumers, plus all retained Storybook suites. Private Link scenario edits select only Link; Heading/Text scenario edits select only Typography. Real Playwright discovery reconciles the new inventory exactly once across both projects.

## Measurement and scope

The same 14 cases passed in Chromium with three workers and zero retries:

| Runner duration (including managed server startup) | Storybook | Harness |
| -------------------------------------------------- | --------: | ------: |
| Passing cases                                      |        14 |      14 |
| Playwright duration                                |     19.2s |    6.3s |

This is a single before/after observation with existing caches, not a cold-start benchmark or repeat-run median. No other browser workload ran concurrently. A separate development run of the complete Link/Typography harness suites passed all 21 cases in 7.28s command wall time while non-browser validation was also running. Development runs collected no code coverage.

The complete inventory remains **404 cases**, now across 34 files: **343 harness cases in 26 files** and **61 Storybook cases in 8 files**. Remaining Storybook suites cover args delivery, Field documentation, the icon gallery, documentation/navigation, preview lifecycle, spatial guidance and theme integration. Production components, source stories/assets, tokens, runner settings, timeouts/retries, coverage thresholds and CI are unchanged.

## Final verification

Final local checks passed on the implementation:

- Lint and both TypeScript checks.
- 697 unit tests across 51 files, independently reaching 100% production statements, branches, functions and lines; 8.01s command wall time. This result remained valid across the subsequent integration-only selector repair and fixture setup change.
- 454 integration tests across 54 files, independently reaching 100% production statements, branches, functions and lines; 30.98s command wall time after the read-only snapshot optimization. The preceding full run before that optimization took 147.56s; host load differed, so this is not a controlled benchmark.
- Complete E2E: 343 harness cases in 46.4s and 61 Storybook cases in 2.4m; all 404 passed without retries. Total command wall time was 193.45s. This run overlapped coverage-free selector repair validation and is not a clean full-suite performance comparison.
- All 338 Storybook render/play/accessibility checks in 29 files; 24.11s command wall time.
- Library/static Storybook builds, built-style browser verification, and packed exports/types/CSS/bundling/React 18 and 19 SSR checks.
- Exact test/scenario preservation audit and whitespace checks. Affected selection reports no unresolved ownership issues and the expected complete fallback for infrastructure/catalog/deletion changes.

Code coverage ran only at final readiness. The selector repair used coverage-free feedback, then invalidated integration coverage was rerun; valid unit/browser evidence was retained. No diagnostic browser coverage was collected. Logs are under ignored `.verification/link-migration/`. Remote CI remains pending.
