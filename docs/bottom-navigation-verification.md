# BottomNavigation and app layout verification

Verified on 2026-11-16. Implements [BottomNavigation](./bottom-navigation.md), [AppShell](./app-shell.md), and [AppContent](./app-content.md), plus Home, Inbox, and Help named icons.

## Final results

| Scope | Mode | Result | Runner duration |
| --- | --- | --- | --- |
| Full unit suite | coverage enabled; 2 workers | 1,319 passed; all four coverage metrics 100% | 97.48 seconds |
| Full integration suite | coverage enabled; 1 worker, isolated after browser/build/package work | 1,100 passed; all four coverage metrics 100% | 106.85 seconds |
| Full component browser suite | no coverage; 2 workers | 555 passed | 2.9 minutes |
| Full retained Storybook E2E | no coverage; 1 worker | 36 passed | 2.3 minutes |
| Full Storybook render/play/accessibility suite | no coverage | 494 passed | 61.07 seconds |

Runner durations are observed, rounded where reported by Playwright, and are not an isolated performance benchmark. Some independent final checks ran concurrently. Coverage was disabled throughout development and focused repair work. Both independent coverage gates cover the entire configured production scope, with 100% per-file thresholds unchanged.

Lint, both TypeScript configurations, all three component structural checks, token generation, Storybook production build, library build/browser verification, installed package verification, and whitespace checks passed. Packed consumers passed with React 18.3.1 and 19.3.1, including public types, negative type cases, CSS entry points, SSR, and tree shaking. React Router is development-only; production components have no router imports.

## Behavioral evidence

- Corporate and Luna share destination markup; current state comes from the actual anchor attribute, including before hydration. Focus can remain on a non-current link.
- Native refs, attributes, nested handlers, document-order keyboard navigation, Enter activation, modified new-tab navigation, and padded-area activation are preserved.
- A real browser router keeps Inbox current at a nested route and updates through programmatic navigation, native Help navigation, Back, and Forward.
- Viewport and definite-parent shells reserve persistent header/navigation rows. The last content element scrolls fully above the bar. Wrapped labels and changing safe-area padding resize the reserved row once without compensating content padding.
- Narrow layouts, 200% text and user spacing, scoped overrides, and nested theme inheritance pass browser checks.
- Rendered Storybook docs were checked for working cross-links and layout guidance. The themed composition was visually inspected. Final documentation-link edits received a further 15 passing focused story checks.

## Repairs and execution notes

Initial checks exposed stale eight-icon expectations and a separately maintained harness icon catalog. These now include all eleven icons. The focused icon story and harness suites passed before clean full verification.

Overlapping component-browser runs initially collided in the default Playwright output directory, causing trace-file teardown errors. Runs were separated; the clean full suite passed. A retained Button Storybook startup check initially failed to render its preview, passed unchanged in isolation, and then passed in the clean full retained suite. No retries, timeouts, assertions, or coverage thresholds were relaxed.

Mechanical setup and implementation duration were not timed independently, so this change does not establish an authoring-speed improvement. Observed setup corrections included explicit declaration annotations, gallery registrations/counts, and lint recognition of shared contract suites.

## Remaining evidence

Manual screen-reader and physical-device testing were not performed. Chromium interaction checks and automated axe checks do not substitute for that evidence. Remote required CI has not been run from this local session. No required local gate remains pending.
