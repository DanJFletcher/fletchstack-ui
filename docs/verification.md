# Verification evidence

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
