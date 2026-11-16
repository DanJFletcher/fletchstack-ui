# Navbar verification

Scope: the native Navbar and Brand/Item placement API, persistent child identity, container responsiveness, disclosure state, semantic tokens, public exports, distributed styles and Navigation stories. Baseline was clean after the Breadcrumbs commit. No commit was requested for Navbar.

## Design, implementation and review

- Read the supplied design PDF by rendering it with macOS Quick Look; Poppler was unavailable. Inspected the complete rendered page and used the accompanying explicit API/behavior as the authority. No PDF or unrelated component was modified.
- Manually authored the compound nav because the scaffold supports neither a nav root nor this composition. Total setup duration was not separately instrumented; no scaffold speedup is claimed.
- Menu and bar items stay under persistent keyed group parents. Reordering whole groups as siblings updates native DOM/Tab order without moving an item between React parents. No portals, child clones, duplicate layouts or CSS reading-order dependency are used. Native hidden keeps closed children mounted and unavailable.
- Reviewed controlled truth, default/undefined placement, stable keys, fragments/mapped/conditional children, child/root handlers and refs, router links that prevent native navigation, consumer actions, instance IDs, focus repair, CSS distribution and SSR hydration.
- Development checks were coverage-free: 36 focused unit/token tests in 1.13s; 35 hydration/token integration tests in 1.02s; 152 browser-selection contracts alongside hydration; 15 focused browser tests in 8.0s; eight Storybook render/play/axe checks in 2.94s. These observations are per-command results, not additive implementation time.
- Corrective edits: changed the initial CSS reading-order approach to keyed whole-group ordering for native DOM order; updated the corresponding wide DOM order assertion; awaited the actual compact trigger after asynchronous ResizeObserver measurement; installed the size-observer fake in the standalone hidden-state test. The mapped `undefined` placement intentionally needs an explicit union under exactOptionalPropertyTypes; a documented line-level lint exception preserves the requested public type. No timeouts, retries or behavioral assertions were weakened.

## Final verification

| Check | Result |
| --- | --- |
| Full unit coverage | 75 files, 1,290 tests; 30.11s; independent 100% statements, branches, functions and lines |
| Full integration coverage | 81 files, 1,090 tests; 96.33s; independent 100% statements, branches, functions and lines |
| Complete component browser suite | 538 passed; 1.6m, two workers |
| Complete retained Storybook browser suite | 36 passed; 1.2m, one worker |
| All Storybook render/play/axe | 42 files, 479 tests; 26.47s |
| Storybook build | Passed; Vite stage 6.56s |
| Package build and installed consumers | Passed: compound public API/types, optional mapped placement, individual and combined CSS, bundling, React 18.3.1 / 19.3.1 deterministic SSR |
| Lint, typecheck, component structure, diff whitespace | Passed |

Final coverage began after implementation, tests, cleanup and review. Shared tokens, preview and public-export registration require full local browser verification. Browser/Storybook tests remain coverage-free. Full integration coverage runs alone with one worker after browser/build/package checks to avoid concurrent fixture contention. Required CI remains independent of local evidence.

## Visual, keyboard and identity evidence

- Inspected the complete 1152px Storybook composition against the PDF: Corporate/Luna desktop examples and compact closed/open examples, brand, native links, theme control, persistent CTA, border and disclosure divider. Consumer artwork and existing theme tokens supply the brand/control colors.
- In both themes, a local text input is edited wide, only its container shrinks while the viewport stays at 1200px, the disclosure opens, the first value is retained, the value changes again, the disclosure closes/reopens, and widening retains the second value. The local switch also retains checked state. The CTA remains visible throughout. DOM/hydration tests independently retain the exact child ref and native input value while its group moves.
- Native Tab order follows wide and compact visual order. Enter/Space toggles, Escape closes and restores a visible focus ring, hidden links are skipped, native nested-label links navigate and dismiss, ordinary controls stay open, and controlled requests wait for parent acceptance.
- All-visible links omit the disclosure; mapped/conditional/fragment items preserve group order. Scoped geometry/breakpoint overrides leave neighbors unchanged. Both themes reflow at 320px with 200% text and user spacing; forced colors retain focus and borders.
- Public installed-package fixtures exercise compound exports, mapped optional placement, native refs, CSS, deterministic SSR and React 18/19 compatibility. Actual screen-reader speech/navigation and physical-device behavior remain unverified; Chromium automation does not certify them.

Logs and screenshots remain in ignored local verification output.
