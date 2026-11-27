# Icon gallery migration

This completes the identified component/gallery migration candidates after the [spatial/theme batch](spatial-theme-harness-migration.md), committed as `38bc917` before this work.

## Behavior and ownership

The [gallery harness suite](../tests/browser-harness/specs/icon/IconGallery.spec.ts) takes ownership of 16 existing cases: ten gallery behavior checks and six spacing-independence checks, with both themes retained. Search/order/focus, empty recovery, contrast, native radio selection, preview sizes, local themes, 320px enlarged/spaced reflow, and independent spacing variables retain their original assertions.

The [scenario](../tests/browser-harness/scenarios/IconGallery.tsx) mounts the existing [gallery implementation](../src/components/icon/stories/icon-gallery.tsx) and its scoped styles. The gallery and [catalog](../src/components/icon/stories/icon-catalog.ts) now import icon implementations directly; their logic, metadata and markup are unchanged. No CSF, public component barrel or combined stylesheet enters this scenario graph. Reusing the actual gallery avoids a second implementation drifting from the documented behavior.

Storybook's Gallery play finishes with an empty query, eight results and search focused. The harness naturally has the same query/results. The contrast journey explicitly establishes search focus before its original Tab/Shift+Tab sequence. Other journeys establish their own focus through their existing actions. Storybook's play and accessibility checks remain intact.

A syntax-tree audit compared the migrated loops against the committed baseline, normalizing only mount calls and this explicit focus prerequisite. It also confirmed both retained journeys are unchanged and both shared helper modules differ only in imports.

The [actual theme toolbar](../tests/e2e/components/icon/icon-gallery.spec.ts) and [spatial guide navigation](../tests/e2e/storybook/spatial-system.spec.ts) stay in Storybook. Verified inventory is **404 cases across 36 files: 376 harness cases in 29 files and 28 Storybook cases in seven files**. Those 28 verify Storybook delivery, docs/index/navigation, toolbar and lifecycle boundaries; they are intentionally retained.

Affected-selection checks cover the private scenario, shared gallery component, metadata, scoped CSS and representative named-icon consumers. Unrelated Button scenarios stay excluded for gallery-only changes. Catalog edits require a complete local browser run under the existing fallback policy; no selector rule, threshold, dependency or runner configuration changed.

## Verification

Development checks passed without coverage: all 16 migrated cases, 144 ownership/discovery/organization checks, 25 gallery/catalog DOM checks, lint and both TypeScript checks. The preservation audit and documentation links also passed. Affected selection reports the expected full fallback for catalog changes with no ownership issues.

The same 16 cases took **22.71s command wall time on Storybook versus 9.75s in the harness**, a 57.1% reduction (2.33×). Both measurements used Chromium, three workers, zero retries and managed server startup with existing caches. These two measurements had no concurrent test workload. This is a single before/after observation, not a cold-start benchmark or repeat-run median. An earlier development harness pass took 9.24s; it is not used for the comparison because other checks were launched around that run.

After implementation, cleanup and review, final verification ran sequentially:

| Check                                                 | Result                                                               | Command wall time |
| ----------------------------------------------------- | -------------------------------------------------------------------- | ----------------: |
| Full unit coverage                                    | 697 tests / 51 files; 100% statements, branches, functions and lines |             7.68s |
| Full integration coverage                             | 462 tests / 54 files; independently 100% on all four metrics         |            27.63s |
| Complete E2E                                          | 404 cases; 376 harness + 28 Storybook; zero retries                  |        **86.43s** |
| Storybook render/play/accessibility                   | 338 checks / 29 files                                                |            19.67s |
| Library build and built-style browser checks          | Passed                                                               |             3.89s |
| Static Storybook build                                | Passed                                                               |             7.79s |
| Packed exports/types/CSS/bundling and React 18/19 SSR | Passed                                                               |             7.39s |

The full E2E runner reported 41.5s for the harness and 43.5s for retained Storybook. No concurrent test workload ran during final verification. Ordinary browser execution collected no diagnostic coverage; unit/integration coverage began only at the final handoff boundary. Production components, styles, public exports, coverage thresholds and CI requirements are unchanged.

Logs and the preservation audit are kept under ignored `.verification/icon-gallery-migration/`. Remote CI remains pending.
