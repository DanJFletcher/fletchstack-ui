# Verification evidence

## Typography — 2026-11-10

Heading and Text follow the [approved content contract](typography.md). The initial token contract test failed on missing roles before implementation. Final verification passed lint, both TypeScript configurations, 620 unit tests and 286 integration tests (each with independent 100% statement/branch/function/line coverage), 303 Storybook browser tests with axe failures enabled, and all 354 standalone Chromium tests. Library and static Storybook builds, built-package browser checks, and installed package exports/types/styles/bundling/React 18 and 19 SSR checks passed. Affected-run dry runs conservatively selected full fallback because tokens, public exports and shared tooling changed.

Typography-specific browser checks cover both-theme scale and contrast, scoped overrides/nested resets, native hidden behavior, inline-link focus including forced colors, RTL, 320px reflow with 200% root text and user text spacing. Both-theme presentation was visually inspected. Native heading levels and inline composition are asserted by story plays; script-free SSR receives real-browser CSS measurements. No real screen-reader, Firefox or WebKit verification was performed.

## Browser test simplification — 2026-11-10

See [the staged runtime and failure-sensitivity evidence](browser-runtime-verification.md) and [required browser-behavior matrix](../tests/browser-behavior-matrix.md). This change replaces mandatory standalone-browser 100% JavaScript coverage with coverage-free required journeys and opt-in diagnostic reports. The historical results and policies below describe their original verification dates; independent unit/integration coverage gates remain unchanged.

## Component and Storybook E2E coverage — 2026-11-08

On macOS with Node 22.23.4, `npm run test:e2e` and a clean sequential `CI=true npm run test:e2e` each passed all 20 Chromium journeys. The independent browser report reached 100% statements, branches, functions, and lines for each scoped executable file. [Coverage configuration](../tests/e2e/coverage/report.mjs) includes component and authored Storybook JavaScript/TypeScript, inventories unvisited files, and excludes scripts and Node configuration. Documentation prose and CSS are verified through navigation and computed layout/style assertions rather than JavaScript counters. See the [test guide](../tests/README.md#independent-e2e-coverage-gate) for scope and reproduction.

Failure sensitivity was exercised: a temporary, never-imported component module appeared at 0% and made the command exit 1 even though its selected test passed. The probe was removed. The documentation journey also failed on an actual broken Foundation → Tokens link; fixing both docs links to target the manager route made navigation through Tokens → Consumer Override pass. Storybook's successful play completion is required before preview interactions.

Also passed: `npm run lint`, `npm run typecheck`, `npm run test:unit` (128 tests; independent 100% coverage), `npm run test:integration` (75 tests; independent 100% coverage), `npm run test:storybook` (16 tests with accessibility failures enabled), `npm run build`, and `npm run build-storybook`. An initial parallel verification run triggered Vite reloads while other checks wrote generated files; the final CI-mode E2E run passed after those processes finished, matching the workflow's sequential execution. Remote GitHub Actions was not run as part of this check.

These additions do not establish Firefox/WebKit coverage, full Gatsby/Astro application coverage, CSS coverage, or assistive-technology certification. The earlier framework and manual accessibility gaps below remain applicable.

## Initial library verification

Run date: 2026-11-06. Environment: macOS arm64, temporary Node 22.23.4 runtime, npm 10.9.9, Chromium 158 via Playwright 1.65.0. The shell initially had no Node, and system Git could not run because Apple developer tools were unavailable. No Git commit was created.

## Commands and observed outcomes

| Command | Result |
| --- | --- |
| `npm install` | Successful; reproducible package lock generated without the starter's external local-tarball dependency |
| `npm run tokens` | Passed; two themes, identical contract of 59 semantic properties each |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm test` | Passed: 11 unit tests and 16 Chromium Storybook tests (27 total) |
| `npm run build` | Passed; external React ESM bundle, declarations, combined and separate stylesheets |
| `npm run build-storybook` | Passed; static Storybook generated |
| `node scripts/verify-browser.mjs` | Passed: built-package CSS states, contrast, focus, enlarged text, reflow and text spacing |
| `npm run verify:package` | Passed: npm tarball installed in a temporary consumer; public exports, NodeNext declarations, actual CSS imports through Vite, deterministic React 19.3.1 and 18.3.1 SSR, matching React 18/19 types |
| `npm pack` | Installable tarball generated; not published |
| `npm run build --prefix .verification/astro` | Passed with Astro 7.4.7, @astrojs/react 7.1.4 and React 19.3.1 using the packed library |
| `node scripts/verify-astro.mjs` | Passed: static HTML with JavaScript disabled; one `client:load` React island; click changes label to Saved and disables control; no browser page errors |
| `npm audit --omit=dev` | Zero production vulnerabilities |

Storybook build warnings: its global settings file was outside the sandbox, but the build completed; docs/axe bundles exceed Vite's chunk-size warning threshold. These are preview tooling assets, not the library bundle (approximately 0.4kB JavaScript before compression).

The full dependency audit reports 13 moderate development-tool advisories from glob/minimatch dependency chains in lint/docgen tooling. Compatible Vite/Vitest patches removed the initial high/critical findings. npm's suggested remaining automatic fixes involve incompatible tooling downgrades; no forced major changes or broad transitive overrides were applied. The Astro fixture's current integration and plugin-react metadata also disagree on the optional oxc-transform-react peer range; npm warns, but production build and hydration both passed with the recorded versions.

## Tests and failure sensitivity

- Observed red before green: token compilation returned `{}` instead of the resolved semantic `8px`; the alias test passed after implementation.
- Observed red before green: Button's initial native wrapper omitted `type="button"`; SSR exposed that failure and passed after the default was added.
- Additional token rejection and typography cases were added after the compiler implementation, rather than each being developed through an individual red–green cycle. A temporary no-op compiler mutation made all ten token tests fail; restoring the compiler returned them to green.
- Packed consumer typing initially failed: extensionless declaration re-exports caused NodeNext consumers to lose the typed component. Changing the source export to `./Button.js` fixed this; both React type generations now pass, including a deliberate invalid-variant type assertion.
- Storybook uses its supported Vitest plugin and `a11y.test: 'error'`, with WCAG 2 A/AA, 2.1 AA and 2.2 AA tags. A temporary unnamed-button story made the real runner exit 1 with axe's `button-name` violation. It was removed; the valid suite passes. An initial name-filtered probe selected no tests and was not counted as evidence.

Story interactions check accessible names, Enter and Space activation, focus-visible, disabled click/tab behavior, default non-submission, explicit submission/reset, ref focus, nested theme resolution, and scoped consumer overrides. Corporate and Luna each have automated variant, disabled, keyboard and long-label coverage. Story checks are browser integration journeys, not isolated unit tests.

## Contrast and rendered layout

The built CSS was exercised with actual hover and mouse-down states in Chromium. All enabled label/state combinations meet 4.5:1, non-ghost control boundaries meet 3:1 against their region, and focus rings meet 3:1. Ghost's transparent resting boundary is intentional; the text identifies the action. Disabled text also meets 4.5:1, although exempt.

| Theme | Default primary | Default secondary | Default ghost |
| --- | --- | --- | --- |
| Corporate | 7.75:1 | 7.75:1 | 7.75:1 |
| Luna | 9.99:1 | 13.08:1 | 9.99:1 |

Verified 3px solid focus outlines. At a 320 CSS pixel viewport, 200% root font size, 1.5 line height, 0.12em letter spacing, and 0.16em word spacing, no page-level horizontal overflow or button content clipping was detected. The paragraph override of 2em is included in the test stylesheet; this Button fixture contains no paragraphs. Normal and enlarged screenshots were visually reviewed: both theme palettes, visible focus, wrapping labels and growing controls remained legible. Screenshots can be regenerated in `.verification/` with `npm run verify:browser`.

## Framework scope and remaining gaps

- **Astro actually exercised:** packed library, real static production build, React static HTML without browser JavaScript, hydrated React island interaction and disabled state.
- **Gatsby not built:** a minimal Gatsby page is supplied; package ESM/CSS bundling and React 18/19 SSR were exercised independently. This does not constitute a full Gatsby integration test.
- No manual VoiceOver/NVDA session, human keyboard session, Safari/Firefox run, browser zoom test, forced-colors OS session, or deployed-site test was performed. Browser keyboard automation and 200% text enlargement are recorded separately from these checks. Automated results are not a WCAG conformance certification.
- No Figma/design-tool exchange was configured or tested. The JSON-to-CSS handoff is authoritative and tested.
- GitHub Actions subsequently passed on both push and pull-request runs at commit `d3b28ff`.

## PR review regressions (2026-11-08)

Chromium reproduced both review findings before their fixes:

- A native `hidden` Button was visibly rendered, and real Tab navigation focused it. Two separate regressions failed, then passed after limiting flex display to buttons without a `hidden` attribute.
- A temporary `brand.json` copied from Luna sorted before Corporate. The generated stylesheet incorrectly painted the document's Button Corporate blue (`rgb(36, 75, 176)`) instead of lavender (`rgb(199, 181, 255)`). The browser regression passed after restricting Corporate defaults to `:root:not([data-theme])`.

The isolated theme fixture runs the real generator without adding a third shipped theme. Additional browser cases confirm the unthemed root defaults to Corporate and explicit Corporate/Luna roots retain their colors. All six regressions run in the integration project through `npm test`, including CI; rerun them alone with `npm test -- --project integration`.

On macOS with Node 24.22.2, lint, type checking, all 33 tests (11 unit, six integration, 16 Storybook), the library build, and the static Storybook build passed. Built-package browser checks again passed for both themes' state contrast, focus indicators, 320px reflow, 200% text enlargement, and text spacing. `npm run verify:package` passed for packed exports, declarations, CSS imports/bundling, and deterministic React 18/19 SSR. Storybook retains its preview bundle-size warnings. The framework and manual accessibility gaps above remain unchanged.

## Reproduce the optional Astro check

From the repository root after `npm ci` and `npx playwright install chromium`:

```sh
mkdir -p .verification/astro
cp -R examples/astro/. .verification/astro/
npm pack --pack-destination .verification
npm install --prefix .verification/astro "$(pwd)/.verification/fletchstack-ui-0.0.1.tgz"
npm run build --prefix .verification/astro
node scripts/verify-astro.mjs
```

This small fixture is kept outside the root dependency graph. Remove `.verification/astro` before recreating it when changing its dependency versions.

## Icon implementation baseline — 2026-11-08

Before icon changes, lint, type checking, the library build, 128 unit tests, 75 integration tests, and 20 E2E tests passed. Unit, integration, and E2E each independently reached 100% of their scoped statements, branches, functions, and lines. The existing local agent-guides-installer tarball dependency remains a clean-CI-installation limitation; this change does not alter it.

## Icon visual review — 2026-11-08

Visually reviewed captured Storybook catalog output with all eight named icons at 16px, 20px, and 24px in Corporate and Luna. The artwork is recognizable, uses a consistent outline, and remains unclipped. A browser geometry check also confirmed stroke clearance for all 48 rendered catalog instances. Reviewed default, hover, active, disabled, and keyboard-focus compositions in both themes: artwork inherits the control color and the icon-only Button's ring remains visible. Reviewed 320px layouts with 200% root text size and WCAG text-spacing overrides: labels wrap, controls grow vertically, fixed icons remain 20px, and no horizontal overflow was detected. Reviewed scoped size/stroke overrides and nested theme reset visually.

Local screenshots were captured under the ignored `.verification/icons-*.png` paths. Keyboard activation, focus order, image names, hydration, CSS state inheritance, and reflow were exercised automatically in Chromium. No VoiceOver/NVDA or other real assistive-technology session was performed; this is not a screen-reader certification. Firefox/WebKit were not run.

Observed red-to-green checks: real theme compilation initially omitted all four icon properties; Icon's initial SVG wrapper lacked the labeled image role/name; stylesheet publication omitted icon.css; and the catalog initially lacked all eight exports. Those focused tests passed after their respective changes. Packed typing also caught the JSX hyphenated-attribute loophole in an omitted aria-label prop, leading to explicit forbidden attributes in public types. Additional contract and browser cases were added after those implementations; they are final-behavior evidence rather than individual red-to-green cycles.

## Icon final acceptance — 2026-11-08

All checks passed sequentially after implementation:

| Command | Observed result |
| --- | --- |
| `npm run lint` | Passed with SonarJS and required braces |
| `npm run typecheck` | Passed, including isolated library declarations |
| `npm run test:unit` | 184 tests; independent 100% statements/branches/functions/lines |
| `npm run test:integration` | 87 tests; independent 100% statements/branches/functions/lines |
| `npm run test:storybook` | 24 tests, with WCAG accessibility violations configured as failures |
| `CI=true npm run test:e2e` | 32 Chromium journeys; independent 100% per browser source file; scripts excluded |
| `npm run build` | Passed; Icon and eight named exports, declarations, and icon.css included |
| `node scripts/verify-browser.mjs` | Passed existing built-package contrast/state/focus/reflow checks |
| `npm run build-storybook` | Passed; existing preview chunk-size warnings remain |
| `npm run verify:package` | Passed packed exports, combined/selective CSS, React 18/19 types and deterministic SSR, and production bundle opt-in checks |

The unit and integration reports each count 136/136 statements, 109/109 branches, 38/38 functions, and 108/108 lines in their scoped executable source/build scripts. E2E separately covers the component source and authored Storybook browser modules; none of these gates borrow counters from another suite.

Packed consumer compilation now includes the actual Gatsby page source and Astro React island source under both React type generations. React SSR and real Chromium hydration were exercised. No full Gatsby site build or Astro production site build was run for this icon change; earlier dated framework evidence above describes previous work, not a rerun. No framework version/support range was changed.

The opt-in checks bundle an entry importing only MoonIcon, one importing only Button, and a positive control importing MoonIcon plus SunIcon. They inspect unique SVG geometry: used artwork stays, the other seven icons disappear from the single-icon bundle, and Button-only output contains no catalog artwork. React remains external. No new runtime dependency was added. The pre-existing local agent-guides-installer tarball remains a clean GitHub CI-install limitation; no remote Actions run is claimed. Changes remain uncommitted for review.

## Searchable icon gallery — 2026-11-08

Scope: Components/Icon/Gallery (`components-icon--gallery`), shared story-only metadata, native search controls, and discovery documentation. The comparison Catalog remains eight icons × three sizes × two themes. Existing uncommitted Icon work was retained; no library source, public token, package export, dependency, or shipped CSS was changed for the gallery.

Baseline: `npm run lint`, `npm run typecheck`, `npm run test:storybook` (24 tests), and `CI=true npm run test:e2e` (32 tests, all four scoped metrics 100%) passed before extraction. Three metadata integrity tests and the existing Catalog browser comparison passed after extraction.

TDD evidence: the export-name normalization test initially failed because typing `  mOoN  ` still displayed eight entries instead of MoonIcon alone. It passed after literal filtering was added. The polite-count test then failed for the missing status region and passed after feedback was added. A separate initial special-character test failed in user-event's keyboard parser; escaping its literal opening bracket fixed the test input, rather than treating that harness error as a product regression.

Final automated checks:

- `npm run lint` and `npm run typecheck`: passed.
- Focused gallery/catalog RTL tests: 23 passed; includes names/uses/synonyms, normalization, literal brackets, initial/singular/plural/zero counts, empty recovery, focus, keyboard clearing, already-empty clearing, non-interactive cards, and unique field associations across instances.
- `npm run test:unit`: 207 tests passed; 100% statements (136/136), branches (109/109), functions (38/38), and lines (108/108).
- `npm run test:integration`: 87 tests passed; independently the same 100% production metrics.
- `npm run test:storybook`: 25 passed, with axe WCAG 2/2.1/2.2 AA rules and `a11y.test: error` preserved. Gallery play restores the complete collection after filtering and clearing.
- `CI=true npm run test:e2e`: 41 passed with no retries. Complete-inventory per-file 100% statements/branches/functions/lines includes the new catalog and gallery modules; scripts remain outside E2E scope. Nine new journeys check search, keyboard recovery, native contrast, enlarged reflow in both themes, and the real theme toolbar.

Visual/browser evidence: inspected Corporate and Luna full collections, keyword-filtered results, empty results, keyboard-visible focus, and 320px layouts with 200% root text size, 1.5 line height, 0.12em letter spacing, 0.16em word spacing, and 2em paragraph spacing. Ten local screenshots were inspected under ignored `.verification/gallery-*.png`. Names/descriptions wrap; controls remain usable; browser assertions confirm no page-level horizontal overflow or overflowing cards. Search remains focused while filtering; clear restores it after mouse or keyboard activation.

Measured Chromium native-control contrast (text/background; boundary/surface; boundary/field; focus/surface; focus/field): Corporate **21.00 / 4.54 / 4.54 / 5.98 / 5.98**; Luna **11.20 / 4.95 / 3.04 / 10.50 / 6.43**. Native focus is visibly blue in Corporate and light blue in Luna; persistent browser checks enforce text ≥4.5 and boundary/focus ≥3. These are measurements of this Chromium environment, not a guarantee for every OS/native palette.

Unperformed checks: real screen-reader announcement review, Safari/Firefox native-control appearance, and additional operating systems. No full Gatsby or Astro site build was added for this Storybook-only change. The existing local `agent-guides-installer` tarball dependency remains a known clean remote-install limitation; it was not changed by this work.

Build/package acceptance: `npm run build`, `npm run build-storybook`, and `npm run verify:package` passed. The library remains 3.06 kB (0.97 kB gzip). Packed consumers validated unchanged public exports, declarations, stylesheet imports, React 18.3.1/19.3.1 deterministic SSR, and single-icon/Button-only unused-artwork removal with a positive control. A served static-build smoke check confirmed the Gallery index and sidebar entry, successful play lifecycle, keyword filtering to PlusIcon, and clearing back to eight cards. The library JavaScript was checked for absence of gallery headings, labels, empty-state text, filtering identifiers, and catalog keywords/uses. Static Storybook emitted its existing large-chunk advisory; package verification emitted a transient peer-resolution advisory while switching React versions, with both compatibility checks passing.

## Gallery visual reference revision — 2026-11-08

The user's replacement screenshot is the approved design for this revision. The gallery now has a branded breadcrumb strip, compact title/subtitle, labeled local theme selector, icon-prefixed search and explicit clear target, native radio preview-size controls, four centered outlined cards per desktop row, monospaced export names, and a usage/accessibility footer. At smaller widths the grid collapses intrinsically. The theme selector calls its inherited option **Storybook**, accurately describing toolbar inheritance rather than implying operating-system theme detection. Corporate remains the global default; Luna supplies the reference's dark navy/lavender treatment.

The reference supersedes the initial native-control/no-new-tokens restriction. Twenty-seven additive semantic gallery roles now alias DTCG primitives in both themes (90 total semantic properties per theme), covering documentation colors, emphasis, focus, spacing, shape, typography and minimum dimensions. The generated token reference documents each purpose. Gallery React code remains outside the library bundle and public React exports are unchanged. Interactive control borders and focus deliberately retain stronger contrast than the subtle decorative card borders.

Observed TDD: the new preview-size and local-theme tests first failed because their radio/combobox controls did not exist; both passed after implementation. Final checks passed: `npm run lint`, `npm run typecheck`, `npm run test:unit` (209 tests), `npm run test:integration` (87), `npm run test:storybook` (25, accessibility failures enabled), and `CI=true npm run test:e2e` (43, no retries). Unit, integration, and complete-inventory component/Storybook E2E coverage each remain independently 100% across all four gated metrics. Browser tests cover all size options, native arrow-key radio operation and visible focus, local theme selection/toolbar inheritance, literal search/clear behavior, themed search text/boundary/focus contrast, and 320px reflow with 200% text plus spacing overrides. Supporting text uses the theme-specific semantic muted role rather than opacity.

Visual inspection compared the 1024×768 Luna view to the supplied reference and checked Corporate, full/filtered/empty states, keyboard focus, and enlarged 320px layouts. Export names, descriptions, controls, and the code sample wrap without page overflow. Updated local screenshots are under ignored `.verification/gallery-*.png`. The explicit clear action remains keyboard accessible even for an empty query, and cards remain non-interactive.

`npm run build`, `npm run build-storybook`, `npm run verify:package`, and strict OpenSpec validation passed. Packed declarations, CSS imports, React 18/19 deterministic SSR, unchanged React exports, and unused-icon removal passed; library JavaScript remains 3.06 kB (0.97 kB gzip). Existing Storybook chunk-size and React-switch peer-resolution advisories remain non-failing. Real screen-reader review and Safari/Firefox checks remain unperformed; no full framework site builds were added for this documentation change.

Final visual refinement: the grid retains empty column tracks so filtered cards keep their original desktop width rather than stretching. All 11 focused gallery browser journeys, lint, type checking, and the static Storybook rebuild passed afterward. A served static build was exercised for both themes and all ten screenshots regenerated; filtered-card width is now explicitly asserted against the full collection in the browser suite.

## Spatial system — 2026-11-09

Implemented the establish-spatial-system contract: a documented 4px working rhythm with precision exceptions, four spatial categories, six additive consumer spacing roles, and four independent gallery spacing roles. Both themes now supply 100 semantic properties, with all 90 pre-change names/defaults retained. The authored guide audits 33 existing non-typographic spatial roles (including SVG stroke geometry) and records the intentional removal of height/padding, general-inset/heading-gap, and border/preview-inset coupling. New Spatial System and Spatial Examples pages are linked from Foundation, Tokens, and the README. No layout React export, new dependency, or density/breakpoint API was added.

Baseline evidence: lint, strict types, token generation, and all 75 existing token unit tests passed. Before changes, 24 geometry cases were captured across Button variants/sizes, Icon customization, and Gallery at 1024px/320px in Corporate/Luna, each with default and documented override cases. After the gallery mapping change, all 24 matched exactly in positions, dimensions, padding, margins, gaps, radii, and borders. Local before/after screenshots and measurement JSON are under ignored `.verification/spatial-*`; the pre-change public defaults are also frozen in the committed test fixture for repeatable contract checks.

TDD evidence: the new unit and real-generation integration contracts failed for missing semantic roles, then passed after token additions. Six browser regression cases failed because control height changed search padding, general inset changed heading separation, and border thickness changed preview padding. They passed after independent roles were mapped. Generator-link tests failed before the reference template gained the spatial guide link. Repeated generation produced identical CSS/reference output, and existing invalid-type/reference/cycle tests remained green.

Visual/accessibility evidence: captured sixteen new example screenshots across both themes at 1024px and at 320px with 200% text, 1.5 line height, 0.12em letter spacing, 0.16em word spacing, and 2em paragraph spacing. Inspected representative scale, composition, responsive-section, and nested-scope views, including native-select focus. Text and actions wrap without lost content or page-level horizontal overflow; nested Button labels and SVGs remain visible. New example wrappers avoid redundant outer padding; nested containers demonstrate their own semantic inset. The native select measured 37px tall in both themes, exceeding the AA minimum; visible native focus is blue on Corporate and light blue on Luna. Clear controls and gallery focus styling remain unchanged from baseline.

Native select investigation: on this macOS headless Chromium setup, Arrow/Home/End popup navigation did not change selection, while keyboard typeahead dispatched real input/change events and updated the React state and computed gap. The browser journey uses a typed native selection, then direct option selection for the remaining choices; no custom keyboard behavior or sleeps were added. Sequential typeahead characters are a prefix buffer, so tests do not mistake combined prefixes for separate selections. A Storybook assertion initially compared a resolved gap to an unresolved var() expression; it now checks the computed pixel value. These were test/platform findings, not product regressions.

Unperformed manual checks: real screen-reader announcements, Safari/Firefox, and native popup navigation on other supported platforms. No full Gatsby/Astro site builds are required or claimed; packed React SSR/types/CSS checks remain the framework-consumption boundary. The previously recorded local installer tarball dependency limitation is unchanged.

Final commands passed: `npm run lint`, `npm run typecheck`, `npm run test:unit` (228 tests), `npm run test:integration` (91), `npm run test:storybook` (33, including explicit Luna examples with axe failures enabled), and `CI=true npm run test:e2e` (66, no retries). Unit and integration each independently retained 100% statements (136/136), branches (109/109), functions (38/38), and lines (108/108). Complete-inventory component/Storybook E2E coverage also retained 100% statements, branches, functions, and lines per scoped file, including SpatialSystem.stories.tsx; no coverage scope, threshold, or ignore was changed. The final example review gave the native select its own scoped 8px inset instead of borrowing the label-gap role; the repeated lint/type/Storybook/CI-E2E run passed, with an assertion that label-gap overrides leave control padding unchanged.

`npm run build`, `npm run build-storybook`, and `npm run verify:package` passed. The packed stylesheet exports contain the new action-gap and section-gap properties, declarations and React exports remain compatible, React 18.3.1/19.3.1 SSR is deterministic, and unused-icon removal remains verified. Library JavaScript stays 3.06 kB (0.97 kB gzip); no spatial-example runtime enters it. The served static Storybook smoke check verified its guide/index entry, all four example links, the token-reference round trip, and narrow 32px section spacing. Strict OpenSpec validation and whitespace checks passed. Existing Storybook chunk-size and temporary React-version-switch peer advisories remain non-failing.
