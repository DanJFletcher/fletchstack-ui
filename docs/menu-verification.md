# Menu verification

Scope: typed recursive action menu, native links, responsive submenus, keyboard/focus management, theme tokens, Navigation stories, distributed styles and public exports. Baseline was clean after the preceding component commit. No commit was requested for Menu.

## Development and review

- Read the reference action-menu behavior and used the supplied Project actions design sheet. A shared item factory supplies Corporate, Luna and narrow examples.
- Mechanical scaffold dry run: 0.64s; creation: 0.54s (observed command execution, not total setup time). Authored behavior, types, semantic tokens, stories, tests and registrations afterward.
- Rendering/hydration contracts verify names, recursive sibling IDs, decorative icons, disabled skipping, arrows/boundaries/typeahead, opening and return focus, native links, cancellable/controlled selection, empty feedback, native attributes/ref and layout boundaries.
- Focused development feedback ran without coverage. Storybook axe caught a genuinely empty ARIA menu: the corrected empty state renders a disabled, non-focusable menu item with explanatory text. Browser tests verify its container can receive focus and dismiss.
- An observed regression check demonstrated stale typeahead after closing/reopening; clearing the buffer on root requests fixed the failing test. Deferred controlled-opening acceptance also retains its requested focus until the menu exists.
- Reviewed native activation for exactly one action, level-local key handling, immediate unmounting of closed branches, focus continuation on Tab/Shift Tab, pointer behavior, viewport geometry, inherited styles and reduced-motion behavior. Default link navigation remains native; cancellation deliberately prevents both navigation and dismissal.
- Dynamic member-driven href values conservatively preserve affected-browser full fallback. Shared token, export, preview and motion-override edits independently require full browser verification.

## Final checks

| Check                                                 | Result                                                                                                   |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Full unit coverage                                    | 71 files, 1,225 tests; 87.10s; independent 100% statements, branches, functions and lines                |
| Full integration coverage                             | 77 files, 1,027 tests; 123.77s; independent 100% statements, branches, functions and lines               |
| Complete component browser suite                      | 510 passed; 3.0m, two workers                                                                            |
| Complete retained Storybook browser suite             | 36 passed; 1.4m, one worker                                                                              |
| All Storybook render/play/axe checks                  | 40 files, 462 tests; 54.74s                                                                              |
| Storybook build                                       | Passed; Vite stage 22.00s                                                                                |
| Package build and installed consumers                 | Passed: public API/types, individual and combined CSS, bundling, React 18.3.1 / 19.3.1 deterministic SSR |
| Lint, typecheck, component structure, diff whitespace | Passed                                                                                                   |

Coverage started only after implementation, tests, cleanup and review were finished. Full integration coverage runs alone with one worker after browser/build/package work. Browser and Storybook execution are coverage-free. The initial retained Storybook run had 35 passes and one first-preview Button timeout (main.showcase was not present within 5 seconds). That unchanged test passed alone in 7.9s including startup, followed by a complete retained-suite pass in 1.4m. No timeouts, retry settings or assertions were relaxed.

## Visual and accessibility evidence

- Visually inspected the 1152px Project actions composition: named triggers, expanded Export rows, adjacent child panels aligned to their parent rows, Corporate/Luna surfaces and active-child focus indication.
- Browser journeys cover the exact keyboard round trip, reopening, recursive sibling switching, native links, single keyboard/pointer/touch activation, controlled/cancellable selection and outside dismissal.
- Both themes: 320px viewport with 200% text sizing and user text spacing; children expand in normal flow with indentation/guide and wrapping labels without horizontal overflow. Desktop panels flip horizontally and remain inside the viewport.
- Live reduced-motion emulation removes panel animation; closed branches disappear immediately. Forced-colors checks retain panel boundaries and active focus.
- Storybook render/play/axe checks use error-level accessibility assertions. Actual screen-reader speech/navigation and physical mobile-device behavior remain manual verification gaps; semantic tests and Chromium touch emulation do not certify them.

Timings are observed per-command results under local workload, not an additive elapsed benchmark or a claimed authoring speedup. Routine logs/screenshots remain in ignored local verification output. Required CI remains independent of local results.
