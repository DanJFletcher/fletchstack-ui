# Tasks

Development checks below run without coverage. Final coverage collection starts only after implementation, tests, cleanup, and review of the whole change are finished. Follow the existing repository verification policy; this change does not alter it.

## 1. Shared tokens and documented defaults

- [x] 1.1 Add fast/slow/spinner duration and enter/exit easing primitives and direct semantic aliases in both theme sources, preserving current standard roles and the legacy Spinner numeric token; verify matching names/types and explicit values with focused token unit/integration contracts.
- [x] 1.2 Regenerate theme CSS and the public token reference with `npm run tokens`; verify distributable declarations, the seven approved motion values in each theme, and unchanged protected token values with existing generation/compatibility checks.
- [x] 1.3 Create the authoritative motion guide with the approved token table, role selection, theme/scoped override behavior, and immediate focus/semantic-state rules; verify examples match generated values and link it from the existing foundation/token documentation.

## 2. Existing component adoption and accessibility

- [x] 2.1 Update Spinner to combine the shared duration and existing numeric customization as specified, retaining linear rotation and reduced-motion status; verify default, legacy-only, shared-only, and combined overrides through focused browser checks, and document the compatibility calculation in the motion and Spinner guides.
- [x] 2.2 Add or extend browser harness checks for Accordion and Spinner under normal/reduced system preferences, live preference changes, and scoped overrides; verify no active motion under reduction and correct final visual/semantic states without fixed sleeps.
- [x] 2.3 Verify Accordion still defaults to immediate panels, preserves opt-in expand behavior and hydration accessibility, and handles rapid toggles; exercise keyboard opening, following a panel link, and skipping that link immediately after collapse, including before animated exit finishes. Update Accordion motion documentation with the verified contract.

## 3. Storybook preference previews and motion examples

- [x] 3.1 Add the default-System motion toolbar, one preview lifecycle owner for explicit mode markers, and isolated preview-only motion override styles; verify all six mode/system-preference combinations against both components with retained served-Storybook browser tests.
- [x] 3.2 Verify preview lifecycle behavior in Docs and Canvas, simultaneous Docs canvases, story navigation, theme changes, nested theme panels, and returning to System; add focused lifecycle regressions and document that Full is an inspection override confined to Storybook.
- [x] 3.3 Add the discoverable Motion MDX foundation and interactive duration/easing plus Accordion/Spinner examples in Corporate and Luna; verify examples reflect the toolbar and theme, support keyboard replay, show generated token values accurately, and pass focused Storybook render/play/accessibility checks.
- [x] 3.4 Verify package artifacts contain no preview adapter, mode selectors, or override stylesheet with package/build boundary checks; confirm a consumer under reduced motion remains unaffected by Storybook mode markers/tooling.

## 4. Authoring integration

- [x] 4.1 Link the motion guide from the component authoring recipe and applicable component/token guidelines; verify it covers purposeful role selection, immediate focus/state changes, reduced-motion alternatives, future JavaScript preference handling, and verification without fixed animation sleeps while preserving current test cadence.
- [x] 4.2 Review touched source, CSS cascade specificity, generated output, tests, and docs against the motion spec; resolve drift and rerun coverage-free focused checks for repairs before entering final verification.

## 5. Final integrated verification

- [x] 5.1 After the whole implementation and review are finished, run `npm run test:unit:coverage` and `npm run test:integration:coverage` without filters; verify both independent full production coverage gates and report any failures or blockers accurately.
- [x] 5.2 Run full local browser verification (`npm run test:e2e`) and all Storybook render/play/accessibility checks (`npm run test:storybook`) because shared tokens and preview infrastructure changed; verify all suites, including retained Storybook boundaries, pass in the final state.
- [x] 5.3 Run required lint, type, build, SSR/browser-consumer and package checks plus `npm run build-storybook`; verify preview tooling remains isolated, record both-theme visual/keyboard and reduced-motion observations, and report coverage modes, executed scope, limitations and CI status.
