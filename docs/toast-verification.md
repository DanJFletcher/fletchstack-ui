# Toast verification

Completed November 22, 2026. The component contract is in [Toast](./toast.md); executable browser ownership is in the [behavior matrix](../tests/browser-behavior-matrix.md).

## Final results

| Check                                                        | Result                                                                                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Full unit coverage                                           | 1,903 tests; 100% statements, branches, functions and lines, with per-file gates       |
| Full integration coverage                                    | 1,681 tests; the same independent 100% gates; four workers                             |
| All Storybook render/play/axe checks                         | 675 passed                                                                             |
| Full component browser suite                                 | 734 passed                                                                             |
| Full retained Storybook browser suite                        | 50 passed; one startup timeout passed on focused rerun                                 |
| Lint, TypeScript, structural registration, whitespace checks | Passed                                                                                 |
| Installed React 18/19 consumers                              | Types, runtime exports, individual/combined CSS, bundling and deterministic SSR passed |
| Foundation browser checks                                    | Both themes, control states, narrow reflow, enlarged text and spacing passed           |
| Production Storybook build                                   | Passed                                                                                 |

Browser coverage instrumentation was off. Full browser verification was selected because the change adds semantic tokens, public exports and preview registration. Development checks were coverage-free; full coverage began after implementation, tests and review.

Reviewed the dual-theme composition visually at 1280px. Browser checks also exercise 320px layouts with 200% text and spacing overrides, focus-visible actions, fixed viewport bounds, forced colors and immediate reduced-motion dismissal. Actual screen-reader speech, physical devices and complete CI remain unverified.

## Position and entrance follow-up

Added eight physical page positions to standalone Toast and ToastViewport, retaining logical start/end corners. Focused checks passed: 57 unit, 57 hydration, 12 stories and 36 browser tests. Browser checks measure all eight standalone/stack positions, narrow centered bounds and RTL physical/logical positioning. They seek actual CSS animations to verify initial opacity and translation, finish the animation, reopen it, and switch reduced motion live. An uncontrolled input retains its value across position changes. Reviewed the Luna top-right stack visually at 1100×760.

Final follow-up timings: unit coverage 19.98s, integration coverage 97.19s, all stories 41.94s and full component browser suite approximately 2.1 minutes. These commands overlapped. Package, foundation browser, Storybook build, lint, types, component registration and whitespace checks passed. Coverage was off throughout development and ordinary browser verification.

The retained Storybook run finished with 50 passes and one failure in approximately 2.7 minutes, including all three Toast motion-preview modes passing. It initially timed out waiting for the existing Button preview to render within five seconds. The focused test passed unchanged on the already-running server (7.6s command time). This is a passing rerun after an observed startup failure, not an initially clean suite. No retries, timeouts or assertions were changed.

## Repairs and reruns

- A local test fixture initially queried an unnamed outside button together with the dismiss button. A named query isolated the intended control.
- The deterministic browser timer test initially let its installed clock advance during browser operations. Freezing the clock before opening made the remaining-time boundary explicit.
- Final package verification caught a missing explicit return in a focus-effect callback. The implementation was corrected, focused tests/types were rerun, and both full coverage gates passed on the final source.
- The first retained Storybook run had two navigation failures while builds regenerated assets. All 48 tests passed after that interference stopped, without source/test changes.
- The first full integration run exceeded the existing five-second limit in two tooling tests. Both passed in focused, coverage-free verification. The entire integration coverage gate then passed with four workers. No timeout, assertion, coverage threshold or retry setting was relaxed.

## Authoring observations

Observed scaffold command time: dry run approximately 0.70s; creation approximately 0.55s. These are command times, not total design/setup time. The scaffold handled root registration; adding ToastViewport required explicit runtime/type inventory and public-consumer updates. Dependent browser-selection expectations were updated for the composed Button and CheckIcon consumers. Structural checking found no remaining registration gaps.

Representative development checks: focused unit 1.28s, hydration 0.87s, browser 6.8s, and Storybook 2.93s. Final successful command times: unit coverage 32.47s, integration coverage 96.51s, Storybook checks 106.90s, component browser approximately 2.9 minutes, retained Storybook browser approximately 2.2 minutes. Commands overlapped; these times must not be summed into elapsed development time. Total implementation/setup and final-verification wall times were not separately instrumented. These observations do not establish a scaffold speedup.

No known implementation work remains. Application queue policies and persistence are deliberately consumer-owned. Manual accessibility/device checks and CI remain pending as noted above.
