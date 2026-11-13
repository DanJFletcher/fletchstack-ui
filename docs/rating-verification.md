# Rating verification

Verified locally on 2026-11-12 (America/Toronto). The [Rating contract](rating.md) records behavior and supported inputs.

## Final results

| Check | Result |
| --- | --- |
| Structural check | `npm run component:check -- Rating` passed |
| Lint and typecheck | Passed, including declaration generation constraints |
| Unit coverage gate | 992 tests / 64 files passed; 23.93s runner time |
| Integration coverage gate | 797 tests / 70 files passed; 340.18s runner time with one worker |
| Coverage | Each full gate independently reached 100% statements, branches, functions and lines, including per-file thresholds |
| Complete E2E | 461 component tests (3.0m) and 36 retained Storybook tests (2.3m), all passed with one worker |
| All Storybook render/play/accessibility checks | 412 tests / 36 files passed; 32.56s runner time |
| Library build and browser consumer checks | Passed; existing contrast, interaction, reflow, enlargement and text-spacing checks retained |
| Installed package | Exports, types, individual/combined CSS, bundling and deterministic React 18/19 SSR passed |
| Storybook build | Passed; existing non-blocking chunk-size advisory |
| Whitespace check | `git diff --check` passed |

Shared theme tokens, generated styles and public registrations required complete local browser verification. Development and repair checks were coverage-free; only the final unit/integration gates collected coverage. E2E and Storybook checks remained coverage-free. No test assertions, retries, timeouts or coverage thresholds were weakened.

## Rating evidence

- Independent client and SSR/hydration contracts cover controlled/uncontrolled state, fractional naming, formatting/localization, three symbol names, required validity, description/error relationships, refs and hidden semantics, unique unnamed groups, disabled state, reset/canceled reset and external form ownership. Server markup exposes ten native half-step radios and one checked value before JavaScript; hydration rejects recovery errors.
- Both-theme browser journeys verify pointer and native keyboard selection of 3.5 produces the same half-filled fourth symbol, checked accessible name and submitted `FormData` value. Tab enters at the selected radio and leaves the group; the active half receives its own focus ring. Native reset restores the initial score.
- Browser geometry checks verify fractional fills retain full-size SVG outlines for stars, hearts and thumbs at all three sizes. Named display images remain outside keyboard order. The ten-point half-step scale passes 320px, 200% root text and user text-spacing checks. Forced colors retain selected artwork, outlines and focus.
- The 1152px composition was visually inspected with Corporate and Luna 4.5/5 summaries, a keyboard-focused 3/5 input, empty required symbols with the supplied error, and a disabled 4/5 survey. The summary demonstrates scoped 64px artwork customization; the standard large footprint remains 48px. Captures and command logs remain in the ignored local verification directory.
- The required field's error remains caller-owned, matching existing form controls; native required validity is independent of that message.

## Authoring observations and repairs

The scaffold dry-run and creation completed in a single approximately 1.02s command batch. It prepared source, styles, stories, harness ownership, package exports and inventory registrations. Additional modules and the public symbol type were classified explicitly. Declaration checks caught missing exported helper return types, and lint required direct test cases alongside the shared contract harness. Those were corrected before final verification.

After reference inspection and scaffolding, the tracked implementation interval was 2026-11-13 00:23:47–00:37:04 UTC (13m17s), including tests, visual review, documentation and focused verification. Final verification began at 00:37:04 UTC. These intervals omit earlier reference/setup work and are not a total session-duration measurement; individual runner times above overlap and must not be summed as wall time.

Package verification initially caught a test assumption about adjacent `checked` and `value` attribute ordering. The assertion now independently verifies the checked input's value without requiring an order; the complete package check subsequently passed against React 18 and 19. No library behavior changed in that repair, so passing production coverage/browser results remained valid.

No known local verification failure remains. Required CI was not run from this session. Chromium emulation and automated accessibility checks do not establish native screen-reader output, real-device behavior or other-browser parity; those remain manually unverified.
