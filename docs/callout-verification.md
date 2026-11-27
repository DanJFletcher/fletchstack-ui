# Callout verification

Scope: persistent, composable Callout; Corporate/Luna tone roles; Feedback stories; public runtime/types and individual/combined CSS. Existing uncommitted Combobox and Table work was preserved. No commit was requested for this implementation.

## Development and review

- Read the reference Callout docs and used the supplied publishing sheet as the layout target. Title, body and action deliberately share one text column, including tone examples.
- Mechanical scaffold: dry run 0.71s, creation 0.41s (command execution, not total setup time). Authored API, semantic roles, stories, registrations and tests afterward.
- Corrective integration edits: register the additional harness scenarios in both catalog sections; include Callout in Button's affected-consumer expectation; preserve the `.js` declaration re-export suffix for installed NodeNext consumers. Package negative type assertions detected the export issue before handoff.
- Focused unit, hydration/token/selection integration, browser and Storybook checks ran without coverage throughout development and repairs. The initial token test literals were corrected against the existing palette definitions. Browser contrast checks caught the initial Luna neutral surface (3.28:1); the approved darker violet primitive now supplies readable text. No threshold was relaxed.
- Reviewed the component's native attributes/ref, explicit role contract, React-node slots, zero-valued content, omitted-slot spacing, logical leading accent, style-hook inheritance, forced colors and action focus. No timers, default live region, internal dismissal or extra interaction state were introduced.

## Final checks

| Check                                                        | Result                                                                                                          |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Full unit coverage                                           | 69 files, 1,155 tests; 22.21s; independent 100% statements, branches, functions and lines                       |
| Full integration coverage                                    | 75 files, 958 tests; 98.15s; independent 100% statements, branches, functions and lines                         |
| Complete component browser suite                             | 493 passed, 2.0m, two workers                                                                                   |
| Complete retained Storybook browser suite                    | 36 passed, 1.5m, one worker                                                                                     |
| Final Callout browser scope                                  | 10 passed, 6.0s, one worker                                                                                     |
| All Storybook render/play/axe checks                         | 39 files, 454 tests; 19.44s                                                                                     |
| Storybook build                                              | Passed; Vite build stage 6.60s                                                                                  |
| Package build and installed consumers                        | Passed: public API, negative type assertions, CSS exports, bundling and deterministic React 18.3.1 / 19.3.1 SSR |
| Lint, typecheck, structural component check, diff whitespace | Passed                                                                                                          |

Coverage began at final handoff verification, after implementation, tests and review. A final package failure returned to focused feedback for the declaration-suffix repair, followed by package verification and a fresh full unit coverage gate. The first full integration run had 957 passing tests and one 5-second CLI fixture timeout. All nine tests in that unchanged fixture then passed without coverage in 3.93s; the complete integration gate was rerun. No test timeout or retry setting was raised. Full integration coverage uses one worker in isolation to reduce contention in repository CLI/SSR fixtures.

Shared token/export/preview registration changes triggered complete local browser verification. After the declaration-only `.js` suffix repair, the final Callout browser owner and all Storybook checks/build were rerun; other browser results remain applicable because runtime component behavior, styles, themes, scenario registrations and retained Storybook boundaries did not change. Native NodeNext declaration resolution was checked by the installed-package fixture. Browser and Storybook runs are coverage-free. Required CI remains independent of these local results.

## Visual and accessibility evidence

- Visually inspected the rendered publishing composition at 1152px: matching title/message/action alignment, leading accents, optional icon and shared markup across Corporate and Luna.
- Both themes: native Tab/Enter/Space action activation, visible focus, consumer output updates, persistent message, all five tones with no implicit role/live region and text contrast at least 4.5:1.
- Both themes: 320px viewport with 200% text sizing and user text-spacing overrides; long body/action content wraps without document or text-column horizontal overflow. Title/body/action retain the same starting edge.
- Explicit note/status/alert semantics and hidden decorative artwork tested through DOM rendering and server hydration. Zero-valued slots, body-only compact layout, nested themes, instance-local surface/accent/border/radius overrides and forced-colors boundaries checked.
- Storybook axe checks fail on applicable WCAG violations. Actual screen-reader speech and real assistive-technology navigation were not manually tested; automated semantics and emulation do not certify those behaviors.

Timings are observed per-command results under local workload, not an additive wall-clock benchmark or a claimed component-authoring speedup. Routine screenshots and logs remain in ignored local verification output.
