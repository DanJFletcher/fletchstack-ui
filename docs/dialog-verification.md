# Dialog verification

Verified on 2026-11-16 for [Dialog](./dialog.md), inspired by the [reference Storybook](https://themed-react-ui-foundation.replit.app/?path=/docs/components-dialog--docs). The reference documents a controlled native modal, content slots, sizes, dismissal options, inherited themes and optional fade/slide motion.

## Results

| Scope                                           | Mode              | Result                                       | Runner duration |
| ----------------------------------------------- | ----------------- | -------------------------------------------- | --------------- |
| Full unit suite, 2 workers                      | coverage enabled  | 1,410 passed; all four coverage metrics 100% | 70.08 seconds   |
| Full integration suite, 1 worker                | coverage enabled  | 1,187 passed; all four coverage metrics 100% | 109.29 seconds  |
| Full component browser suite, 2 workers         | coverage disabled | 588 passed                                   | 2.6 minutes     |
| Full retained Storybook browser suite, 1 worker | coverage disabled | 36 passed                                    | 1.7 minutes     |
| Full Storybook render/play/accessibility        | coverage disabled | 527 passed                                   | 52.11 seconds   |

Lint, both TypeScript configurations, component structural checks, token generation, whitespace checks, Storybook production build, library build/browser verification and installed-package verification passed. Installed React 18.3.1 and 19.3.1 consumers verify public exports/types, negative type cases, standalone and aggregate CSS, deterministic closed SSR and tree shaking. No runtime dependencies were added.

Coverage was disabled during implementation, test authoring, debugging and review. Full unfiltered coverage gates began only after the complete implementation and review. Integration coverage runs alone after browser/build/package work. Existing 100% per-file thresholds remain unchanged. Shared tokens, public exports and Storybook motion infrastructure require the full local browser fallback. Durations are observed runner results, with some independent final checks running concurrently; they are not an isolated performance benchmark.

## Evidence and corrections

- The reference was read and its opened confirmation inspected, including content slots and native modal semantics. Corporate and Luna previews were visually inspected. An unthemed demo link was replaced by the library Link, and an open Luna story now receives accessibility checks.
- Browser journeys verify real Enter/Escape/Tab/Shift+Tab, native inert background/focus containment, restoration, controlled dismissal acceptance, Escape veto, opt-in backdrop gestures, ignored padding/drag gestures, native form/ref close without duplicate requests, nested modals, persisted edits and consumer confirmation actions.
- Viewport-bounded content scrolling passes at 320px with 200% text and user spacing. Oversized header/footer regions are bounded and scrollable so wrapped headings cannot push actions outside the modal.
- Fade, slide and immediate behavior pass. Animated exit retains native modality; live reduced motion cancels it and restores focus immediately. A CSS specificity defect found by the live-preference test was repaired without weakening assertions. Served Storybook inspection confirms Full/Reduced preview CSS overrides under system reduction.
- Independent DOM/hydration contracts verify refs, native props/handlers, rich/omitted slots, accessible names/descriptions, unique IDs, controlled notifications, cancelled exits and SSR that defers modal opening until hydration. JSDOM substitutes only the native modal/animation boundary; actual modality is verified in Chromium.
- Harness dependency styles were explicitly imported after browser checks exposed missing Button focus styles. Discovery expectations include the actual Button/TextInput/Link consumer dependencies; the focused selection checks pass. The token compiler's primitive-only semantic alias contract was respected after an initial alias validation failure.

The scaffold prepared mechanical registration. Additional authored integration includes helper/type modules in the inventory, explicit public API expectations, typed/runtime installed consumers, owned browser scenarios and documentation. Setup duration was not independently instrumented, so no setup speedup is claimed. Focused development checks and repairs remained coverage-free; required checks are summarized above.

## Remaining boundaries

Actual screen-reader speech, physical touch devices and cross-browser/device testing were not performed. Chromium keyboard/inertness checks and automated accessibility checks do not substitute for those manual checks. Required CI remains pending. Changes have not been committed.

## Docs landing regression — 2026-11-17

The generated Docs page previously mounted both Initially Open examples inline, opening two native modals immediately. A served-Storybook regression test reproduced two `:modal` elements before the repair. Both stories now opt out of inline autodocs while remaining standalone examples. The regression test passes: the fully rendered documentation starts without a modal, explicit trigger activation opens exactly one, and Escape closes it and restores focus.

The repair changes story metadata, documentation and the existing Storybook documentation browser suite only. Dialog production code, shared consumer examples, unit/integration tests, package configuration and tokens are unchanged, so the passing production coverage/package/component-browser evidence above remains valid. Refreshed checks passed: all 527 Storybook render/play/accessibility checks (33.15 seconds), all 37 retained Storybook browser tests (1.4 minutes), the Storybook production build, lint, both TypeScript configurations and component structural checks. These browser/development checks ran without coverage.

## Default backdrop dismissal — 2026-11-17

The owner requested that clicking behind an open dialog close it. Backdrop dismissal now defaults to true, with closeOnBackdropClick=false as an explicit opt-out. Panel padding, content clicks and gestures starting inside remain protected. A new shared DOM/hydration regression first failed because the default emitted no close request; it passes after the default change. Real browser coverage verifies default dismissal, focus restoration, opt-out, padding and drag behavior.

Final scoped browser verification owns the changed Dialog event policy: all 16 Dialog harness journeys passed, and all three served-Storybook documentation tests passed. Other component harness consumers do not import Dialog. The initial documentation run timed out loading previews during concurrent final checks, including unrelated foundation/button pages; the unchanged suite passed alone in 14.6 seconds without retries or timeout changes. This does not establish a permanent resolution of that environmental loading sensitivity.

All 527 Storybook checks passed (95.53 seconds), as did the Storybook production build, installed React 18/19 consumers, library/browser verification, lint, both TypeScript configurations, structural registration and whitespace checks. All 1,411 unit tests passed with 100% statements, branches, functions and lines (112.99 seconds). All 1,188 integration tests passed in the isolated final coverage run (115.55 seconds), with all four coverage metrics at 100%. Baseline and focused repair work remained coverage-free; the independent final coverage gates are unfiltered with thresholds unchanged. Full required CI remains pending.
