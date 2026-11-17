# Tabs verification

Verified on 2026-11-16 for [Tabs](./tabs.md) and [the change](../openspec/changes/add-tabs/).

## Final checks

| Scope | Coverage | Result | Runner duration |
| --- | --- | --- | --- |
| Full unit suite, 2 workers | enabled | 1,381 passed; statements, branches, functions and lines 100% | 96.71 seconds |
| Full integration suite, 1 worker | enabled | 1,160 passed; statements, branches, functions and lines 100% | 109.09 seconds |
| Full component browser suite, 2 workers | disabled | 572 passed | 2.6 minutes |
| Full retained Storybook browser suite, 1 worker | disabled | 36 passed | 1.7 minutes |
| Full Storybook render/play/accessibility | disabled | 510 passed | 67.56 seconds |

Lint, both TypeScript configurations, component structural registration, token generation, whitespace checks, Storybook production build, library build/browser verification and installed-package verification passed. Installed consumers passed public types, negative type examples, runtime exports, CSS entry points, deterministic SSR and tree shaking under React 18.3.1 and 19.3.1. No runtime dependency was added. The final Storybook Vite build reported 55.20 seconds; that is its build phase, not total command time.

Coverage stayed disabled during implementation, test authoring, debugging, cleanup and review. Both final coverage gates are unfiltered, with the existing per-file 100% thresholds unchanged. Shared semantic tokens and public-export registration required the full local browser fallback. Some independent checks ran concurrently; these timings are observed runner durations rather than an isolated performance benchmark.

## Behavior and visual evidence

- Both themes support line/automatic and pills/manual presentation. The composition reproduces Workspace overview, 3 projects and 8 members. Visual inspection confirmed a focused Activity tab remains distinct from selected Overview in manual mode.
- Browser journeys verify arrows, Home/End, disabled skipping, RTL and vertical movement, native Enter/Space, Tab/Shift+Tab, nested ownership, non-submitting tab buttons, delayed controlled requests and owned-focus repair after item removal/disabling.
- Editable panel state survives switching and keyed reordering; hidden panel controls leave accessibility queries and keyboard navigation immediately. Hidden panels remain mounted and may continue effects or fetching.
- Overflow stays within the list at 320px with 200% text and user spacing, with no page scroll caused by tab focus. Full-width distribution, reduced motion, nested theme inheritance and isolated token overrides pass.
- Independent DOM/SSR/hydration contracts exercise initial selection, fallback/restoration, instance-specific IDs, refs/native attributes and persistent content without hydration recovery.

The scaffold prepared mechanical registration. Authored follow-up added helper modules/types to the family inventory, explicit public-export expectations and installed typed/runtime consumer cases, plus actual harness scenarios and behavior ownership. The integration discovery expectation now includes Tabs as a transitive Button consumer. Early failures were corrected without relaxing checks: array test-case formatting, ambiguous section 1/10 browser locators, an undersized native demo button replaced with the library Button, and a nested Luna demo given its matching theme surface. The first full integration run reported 1,159 passes and one stale Button-consumer expectation; its focused coverage-free repair passed 152 checks in 6.11 seconds before rerunning the full gate. Only that integration test expectation changed, preserving the independent passing unit and browser evidence.

## Remaining verification boundaries

Automated Chromium journeys and visual inspection are recorded above. Actual screen-reader speech, physical touch devices and cross-browser/device testing were not performed. Complete required CI remains pending. No claim is made that axe or Chromium keyboard checks substitute for those manual checks.
