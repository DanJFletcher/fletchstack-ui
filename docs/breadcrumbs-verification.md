# Breadcrumbs verification

Scope: ordered native navigation, caller-owned destinations, responsive inline disclosure, theme tokens, Navigation stories, distributed styles and public exports. Baseline was clean after the Menu commit. No commit was requested for Breadcrumbs.

## Development and review

- Read the reference Breadcrumbs documentation and used the supplied Home / Projects / Atlas / Settings design. Corporate and Luna examples share their items and markup.
- Authored the native nav/list structure manually because the component scaffold does not support a nav root. Total setup time was not instrumented; this change does not establish a scaffold speedup.
- Coverage-free focused development checks passed: 29 unit tests in 1.17s, 28 hydration/token integration tests in 1.50s, 13 browser tests in 7.0s, nine Storybook tests in 3.79s and 152 browser-selection integration tests in 6.49s.
- The first browser-selection run occurred before its registered Breadcrumbs browser owner file existed and correctly failed through conservative full fallback. After the real suite was authored, the complete selection contract passed. Lint identified a nested conditional in the count-aware label; separating the singular/plural noun resolved it. No assertions, timeouts or retry settings were weakened.
- Reviewed native destinations, ordered/current semantics, immediate removal of hidden ancestors, independent disclosure state, retained toggle focus, Tab order, inclusive/custom viewport boundaries, hydration-safe server output, scoped styles and narrow wrapping. Public types reject ancestors without destinations and current pages with destinations.

## Final checks

| Check | Result |
| --- | --- |
| Full unit coverage | 73 files, 1,254 tests; 33.79s; independent 100% statements, branches, functions and lines |
| Full integration coverage | 79 files, 1,055 tests; 102.64s; independent 100% statements, branches, functions and lines |
| Complete component browser suite | 523 passed; 1.8m, two workers |
| Complete retained Storybook browser suite | 36 passed; 1.3m, one worker |
| All Storybook render/play/axe checks | 41 files, 471 tests; 30.78s |
| Storybook build | Passed; Vite stage 13.53s |
| Package build and installed consumers | Passed: public API/types, individual and combined CSS, bundling, React 18.3.1 / 19.3.1 deterministic SSR |
| Lint, typecheck, component structure, diff whitespace | Passed |

Coverage began only after implementation, tests, cleanup and review finished. Shared theme tokens and export/preview registrations require the complete browser fallback. Browser and Storybook tests remain coverage-free; the full integration coverage gate runs alone with one worker after browser/build/package work.

## Visual and accessibility evidence

- Visually inspected the 1152px composition: underlined ancestors, strong current page, muted separators, Corporate/Luna inheritance and inline disclosure with a visible focused toggle.
- Both themes: Enter/Space expands and collapses while retaining toggle focus; the next Tab reaches Projects after expansion and skips both intermediate links after collapse. Native destinations navigate without a router.
- Browser checks cover exact 640/641px default and 800/801px custom boundaries, wide restoration, independent instance overrides, two-item trails without disclosure and forced-colors focus.
- Long ancestor/current labels reflow at 320px with 200% text sizing and user text spacing without horizontal overflow. Server rendering exposes the entire trail; hydration observes the actual viewport without recovery errors.
- Storybook runs error-level accessibility checks. Actual screen-reader speech/navigation and physical mobile-device behavior remain manual verification gaps.

Timings are observed per-command results under local workload, not additive elapsed implementation time. Routine screenshots/logs remain in ignored local verification output. Required CI remains independent of local results.
