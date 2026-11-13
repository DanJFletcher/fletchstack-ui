# Combobox verification

Verified November 12, 2026. The approved [component contract](combobox.md) follows the supplied design sheet and reference Storybook. Changes remain uncommitted.

## Final checks

| Command | Result | Observed duration |
| --- | --- | --- |
| `npm run test:unit:coverage -- --maxWorkers=2` | 65 files, 1,049 tests; 100% statements, branches, functions and lines | 54.51s |
| `npm run test:integration:coverage -- --maxWorkers=1` | 71 files, 854 tests; independent 100% coverage gate | 93.52s |
| `npm run test:e2e -- --workers=1` | 470 harness tests plus 36 retained Storybook boundary tests, all passing | 4.2m + 1.8m |
| `npm run test:storybook` | 37 files, 426 render/play/accessibility checks passing | 22.87s |
| `npm run build-storybook` | Passed | Vite build 6.74s; total not separately measured |
| `npm run verify:package` | Build, packed exports/types/styles, bundling and deterministic React 18.3.1 / React 19 SSR passed | Not separately measured |
| `npm run lint`, `npm run typecheck`, `npm run component:check -- Combobox`, `git diff --check` | Passed | Not separately measured |

Coverage stayed disabled during implementation, test authoring and repair. The two unfiltered independent coverage gates ran at final verification. Full browser verification was retained because the change touches public-export configuration and global Storybook preview registration. Browser runs did not collect code coverage. Remote required CI has not been run.

## Behavior and visual evidence

The final focused contract contains 57 client tests and 57 independent SSR/hydration tests. The nine new harness journeys establish both-theme keyboard/pointer form flow, immediate removal of submitted identities on edit/clear, required selection validity, noncommitting highlights, disabled choices, controlled updates, loading/no-results announcements, 320px enlarged/spaced label wrapping and forced-color focus/highlight. Storybook supplies 14 new stories, including both-theme `uni` searches, explicit states and custom filtering. Package fixtures independently validate the public API and CSS export.

The live composition was inspected in headless Chromium in Corporate and Luna with `uni`, full labels, the active-row tint/accent, input focus, selected/clear presentation and popup alignment. The paired fields are independent interactive instances: focusing another field closes the previous popup. Native keyboard events were exercised by the browser journeys. Actual screen-reader speech and physical assistive-technology use remain unverified; DOM relationships and automated accessibility scans do not establish those outcomes.

## Authoring observations

The mechanical scaffold preview/create batch took 1.23s, excluding reference reading and API work. Focused DOM/hydration checks typically took 1–3s per command; the focused browser run took 10.0s and the initial focused Storybook run 2.82s. These are observations for this component, not a comparative speedup claim. Total implementation and verification elapsed approximately 30 minutes; final verification, including repairs and repeat runs, occupied roughly the final 11 minutes.

Authored registrations included the source/type exports, inventory modules, stylesheet distribution, Storybook category, real harness scenarios/ownership, independent public API/package fixtures and browser behavior matrix. The new Spinner dependency required updating the affected-selection expectation to include Combobox. A final coverage gap identified the untested Tab transition from the input to its clear button; that public interaction now has an explicit test. No production behavior was changed to satisfy coverage.

The first disabled-option browser check stalled because Playwright correctly treats ARIA-disabled rows as unavailable for normal locator clicks. The repaired journey first asserts the disabled state, then uses real pointer coordinates to verify that native pointer events cannot select it. The final nine focused journeys and complete browser run passed without retries.

Concurrent full verification produced existing Git/CLI and browser-fixture timeouts. Coverage-free focused repairs passed with one worker and unchanged timeouts. A CLI-discovery timing check also timed out during the first single-worker coverage run while other browser/build verification was active. Its isolated coverage-free run passed all six tests in 4.79s, and the final complete integration gate passed alone in 93.52s. Assertions, timeouts and retry settings were not weakened.
