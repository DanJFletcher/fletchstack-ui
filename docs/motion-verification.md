# Motion foundation verification

Verified locally on 2026-11-12 for [introduce-motion-foundation](../openspec/changes/introduce-motion-foundation/proposal.md). See the [motion guide](motion.md) for the public contract.

## Final results

| Check | Result |
| --- | --- |
| `npm run test:unit:coverage` | 954 tests / 62 files passed; 10.16s runner time |
| `npm run test:integration:coverage -- --maxWorkers=1` | 760 tests / 68 files passed; 144.13s runner time |
| Unit and integration coverage | Each independently reached 100% statements, branches, functions and lines, including per-file gates |
| `npm run test:e2e -- --workers=1` | Complete scope: 446 component tests (2.6m) and 36 retained Storybook tests (1.7m), all passed |
| `npm run test:storybook` | All 400 render/play/accessibility checks / 35 files passed; 21.39s runner time |
| Lint and typecheck | Passed |
| Library build and `npm run verify:browser` | Passed; consumer interaction, contrast, 320px reflow, enlargement and text spacing |
| `npm run verify:package` | Packed exports, types, CSS imports, bundling and React 18/19 SSR passed |
| `npm run build-storybook` | Passed; existing non-blocking large-chunk warning |
| Strict OpenSpec validation and whitespace checks | Passed |

Development baseline, focused implementation checks and failure repair ran without coverage. Only final unit/integration gates collected coverage; E2E and Storybook runs did not. Shared tokens, generated styles and preview infrastructure required the full local browser scope, rather than affected-only selection. Runner times above are separate measurements, not a total wall-clock development duration.

## Behavior observed

- Both generated themes expose the seven approved motion roles with unchanged existing standard timing/easing and Spinner numeric defaults.
- Browser checks verify ordinary/reduced motion, live system preference changes, shared/legacy/combined Spinner overrides, and consumer isolation from preview markers.
- Animated Accordion keyboard checks open a panel, follow its link, close it, and skip the link immediately while exit motion is still possible. Rapid toggles settle at the latest semantic state; default panels and reduced motion remain immediate. Existing SSR/hydration checks passed in the full gates.
- Served Storybook checks cover all six mode/system-preference combinations, both themes, nested themes, Docs with three simultaneous canvases, theme and story navigation, returning to System, and keyboard replay.
- Visual inspection of the component example confirmed Corporate and Luna surfaces, readable loading labels, expanded FAQ alignment, and opposite nested theme scopes. Captures and raw command logs remain in the ignored local verification directory.
- Package boundary checks confirm preview mode markers, adapter and override styles are absent from distributed library code/styles.

## Repairs and limits

The initial focused Docs test used an exact heading name that omitted Storybook's heading permalink text; its locator was corrected. A documentation anchor navigation reloaded the manager rather than exercising its router; the persistence check now uses real sidebar navigation. A first Vitest browser run reloaded during dependency optimization; explicitly prebundling the new Storybook core-events import fixed the runner error, and all 400 checks subsequently passed.

The first final integration run exposed the missing catalog registration for the new retained Storybook suite. Adding its runtime ownership entry restored selection; 158 focused discovery tests passed before repeating both complete coverage gates. The invalidated integration run was stopped. The initial concurrent final browser run passed components but had nine served-Storybook loading timeouts; the complete final run passed with one worker, without changing assertions, retries or timeouts. Integration also used one worker to avoid known fixture contention.

Verification used Chromium and emulated browser preferences. It does not establish behavior in other browsers, real operating-system preference interfaces, or native screen-reader testing. Complete required CI has not been run from this session. No known local verification failure remains on the final state.
