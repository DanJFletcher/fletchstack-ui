# Table verification

Verified November 13, 2026 against the supplied five-column portfolio sheet and [reference Table behavior](https://themed-react-ui-foundation.replit.app/?path=/docs/components-table--docs). See the [public API and usage guide](table.md). Changes remain uncommitted; earlier Combobox work was preserved.

## Final checks

| Check                                                        | Final evidence                                                                              | Observed duration                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `npm run test:unit:coverage -- --maxWorkers=2`               | 67 files, 1,132 tests; 100% statements, branches, functions and lines                       | 38.53s                                    |
| `npm run test:integration:coverage -- --maxWorkers=1`        | 73 files, 936 tests; independent 100% coverage gate                                         | 113.93s                                   |
| Complete component E2E, two workers                          | All 483 harness checks passed before the final local selection-slot repair                  | 1.8m                                      |
| Final affected Table E2E, one worker                         | All 13 Table journeys passed after that repair; untouched component-suite evidence retained | 10.6s                                     |
| Final retained Storybook E2E, one worker                     | All 36 boundary checks passed; combined validated browser scope is 519 tests                | 1.5m                                      |
| `npm run test:storybook`                                     | All 38 files / 445 render, play and accessibility checks passed                             | 27.05s                                    |
| `npm run build-storybook`                                    | Passed                                                                                      | Vite 6.63s; total not separately measured |
| `npm run verify:package`                                     | Build, exports/types/styles, bundling, deterministic React 18.3.1 / React 19 SSR passed     | Not separately measured                   |
| Lint, type check, structural Table check, `git diff --check` | Passed                                                                                      | Not separately measured                   |

Development and failure-repair runs did not collect coverage. The unfiltered independent coverage gates ran at the final handoff boundary and were rerun after the selection-slot repair. Initial full browser scope was required by the new semantic token group and public/export/preview registration. The subsequent repair touched only Table selection markup: its directly owned suite and all Storybook checks were rerun, while valid results for untouched components were retained. Ordinary browser tests did not collect code coverage. Remote CI has not been run.

## Behavior and type boundaries

The focused client and independent SSR/hydration suites contain 81 tests each. They establish native table/caption/header/body/footer structure; property/computed accessors and original-row/value contexts; numeric, Date, custom and stable sorting; controlled/manual state; filtering underlying visible values; controlled/default search; single/multiple/mixed/disabled/filtered selection; content-state precedence/spans; style-slot precedence including selection cells; and explicit structural errors. Frozen-input checks establish that local sorting does not mutate consumer arrays.

Installed typed consumers independently establish package-root exports and generic row/value inference for keyed numbers, computed dates and computed numbers. Negative compile cases reject unknown property keys, invalid renderer methods, unknown row fields, unsafe renderer narrowing and unnamed tables. The main Storybook composition consumes the package-root Table export with one shared portfolio dataset, column collection and table element in both theme regions. The plain harness keeps direct component boundaries. The unrelated inventory demonstrates that production Table code owns no project-specific fields, Badge statuses or date formatting.

Browser journeys establish both-theme native sorting buttons with Enter/Space, numeric/date order, stable filtered selection and mixed checkboxes, disabled exclusions, custom cells/footers, controlled/manual data ownership, sticky header geometry, native horizontal keyboard scrolling at 320px with 200% text and spacing overrides, content states, palette inheritance, custom row/column/instance styles, selected-paint precedence and forced colors. The live five-column composition was visually inspected in headless Chromium, including emphasized projects, shared Badge semantics, formatted dates, tabular/end-aligned seats, comfortable spacing and subtle dividers.

Actual screen-reader speech, physical assistive-technology use and cross-browser manual testing remain unverified. Native semantics, automation and accessibility scans do not certify those outcomes.

## Repairs and authoring observations

The scaffold preview/create and initial token-inspection batch took 1.79s; this excludes reference reading, contract work, implementation and verification. Focused client/hydration runs typically took 2–4s, the final Table browser suite 10.6s, and focused Storybook checks about 3.7s. These are observations for this feature, not a controlled comparison or speedup claim.

Authored registrations include all source/type exports, inventory modules, individual/combined styles, semantic theme tokens/generated output, Storybook category/examples, real harness ownership, independent public API/package fixtures, token contracts and the browser behavior matrix. Affected-selection expectations were updated for Table's actual Checkbox, TextInput, Badge, Spinner and CheckIcon dependencies.

A deliberate CSS failure probe restored the original over-specific stripe/hover selectors: the selected row incorrectly painted blue instead of the configured green, and the browser assertion failed. Restoring the corrected cascade made the same journey pass. Two additional regression tests first failed because selection header/body cells did not receive global customization slots. Applying the header/cell slots with the original row/selection context and the virtual `$selection` column identity made both tests pass; focused client/hydration checks, browser checks and both full coverage gates were then refreshed. No production behavior was changed solely to satisfy a coverage percentage.

Initial browser-test corrections addressed whitespace around decorative arrows, a result-count query that also matched the example's native output status, the existing palette's exact RGB values, and using ArrowRight rather than End to test native horizontal scrolling. These changed test expectations to independently justified contracts, without weakening assertions or increasing timeouts. One legacy Checkbox documentation navigation timed out during the two-worker retained run; it passed in isolation with the same timeout, then the complete retained 36-test suite passed with one worker. Final runs used no automatic retries or timeout increases.
