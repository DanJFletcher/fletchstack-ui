# Test guide

The [browser-behavior matrix](browser-behavior-matrix.md) assigns each browser guarantee to its owning layer. Its [case audit](browser-check-audit.json) records the original standalone checks and the surviving confidence for each simplification.

Focused unit tests live with their component family. Integration and E2E remain central by suite and family. Start with the [component organization guide](../docs/component-organization.md) and choose the boundary you need to verify.

| Location | Responsibility | Environment |
| --- | --- | --- |
| [component families](../src/components/) | Component DOM contracts and focused server-rendered markup | Per-file jsdom or Node and React SSR |
| [unit/tokens/](unit/tokens/) | Token compilation, validation, naming, and value conversion | Node; synthetic in-memory inputs |
| [unit/build/](unit/build/) | Build orchestration and errors at filesystem boundaries | Node; filesystem mocked |
| [integration/components/](integration/components/) | Hydration, forms, keyboard behavior, refs, and native visibility | Chromium and real React |
| [integration/themes/](integration/themes/) | Theme selection and generated CSS applied to real controls | Chromium and an isolated token project |
| [integration/tokens/](integration/tokens/) | JSON documents through the real compiler to generated files | Node; temporary directories |
| [integration/build/](integration/build/) | Command entry points and stylesheet publication | Node; real filesystem |
| [e2e/components/](e2e/components/) | Served component behavior through HTTP and a browser | Playwright Test and Chromium against local Storybook |
| [browser-harness/specs/](browser-harness/specs/) | Button, Stack and CodeBlock native behavior, CSS and geometry | Playwright Test and Chromium against the private Vite gallery |
| [e2e/storybook/](e2e/storybook/) | Documentation navigation and theme toolbar | Real Storybook manager and preview iframe |
| [component stories](../src/components/) and [foundations/patterns](../stories/) | Component examples, interactions, and automated accessibility checks | Storybook in Chromium |

## Naming and discovery

- Match the source module or public component name: `token-values.test.mjs`, `Button.ssr.test.tsx`.
- Add a behavior suffix when a component has distinct boundaries: `Button.hidden.test.ts`, `Button.hydration.test.ts`.
- Group related function scenarios with `describe` blocks. The [compiler tests](unit/tokens/token-compiler.test.mjs) contain compilation, flattening, and CSS naming together.
- Use `.tsx` for React test files, `.ts` for other TypeScript tests, and `.mjs` for JavaScript module tests.
- The unit project discovers `tests/unit/**/*.test.{ts,tsx,mjs}` and `src/components/**/__tests__/**/*.test.{ts,tsx,mjs}`; integration discovers only `integration/**/*.test.{ts,tsx,mjs}`. Helpers and sample applications do not use a `.test` suffix.
- Playwright Test discovers only `e2e/**/*.spec.ts`. E2E tests import `test` and `expect` from [fixtures/test.ts](e2e/fixtures/test.ts), which keeps ordinary runs coverage-free and collects coverage only when diagnostics are enabled. Vitest unit/integration discovery patterns are unchanged.
- Add new tests within the appropriate feature directory. Add a new directory only when the tests represent a distinct feature or responsibility.

## DOM test setup

DOM component tests use React Testing Library and jsdom. The unit project defaults to Node; opt a DOM test file in with its environment directive and explicit setup import. For a file inside `src/components/<family>/__tests__/`, begin with:

```tsx
// @vitest-environment jsdom
import '../../../../tests/support/dom';
import { render, screen } from '@testing-library/react';
```

[support/dom.ts](support/dom.ts) registers `@testing-library/jest-dom/vitest` matchers, calls React Testing Library cleanup after each test, and sets/restores only React's act-environment flag. Vitest hooks are imported rather than global, so setup owns this lifecycle explicitly. Do not import this module in Node SSR, token/build, integration, or Storybook tests. A React test does not need separate DOM Testing Library query imports; React Testing Library already exposes them.

Run the DOM file independently with:

```sh
npx --no-install vitest run --project unit src/components/button/__tests__/Button.test.tsx
```

SSR tests retain the Node environment and direct `react-dom/server` rendering. DOM tests run without Chromium; browser integration and Storybook checks still require it.

## Component assertions and suite boundaries

Use `screen.getByRole` with an accessible name to locate a control, and `within` when a named region needs its own scope. Use React Testing Library's `render` directly; this library currently needs no providers or custom render wrapper. Compose real labels and decorative children so accessible-name assertions reflect what consumers render.

For interaction tests, create `const user = userEvent.setup()` before rendering, then await `user.click`, `user.type`, or other actions in the test. Assert the consumer callback or visible result. Use `findBy` or `waitFor` only for eventual outcomes, and never repeat an action inside a retrying assertion. DOM matchers such as `toBeDisabled`, `toHaveAccessibleName`, and `toHaveFocus` express the promised state more precisely than HTML substrings.

| Contract or risk | Primary test location | Assertion boundary |
| --- | --- | --- |
| Label and icon-only names; decorative composition | [Button.test.tsx](../src/components/button/__tests__/Button.test.tsx) | Role/name queries and accessible names |
| Default/explicit types, disabled/hidden attributes, external form association | [Button.test.tsx](../src/components/button/__tests__/Button.test.tsx) | Native DOM attributes, state, and form ownership |
| Variant and size selection | [Button.test.tsx](../src/components/button/__tests__/Button.test.tsx) | Exact class membership for deliberate CSS styling hooks, independent of ordering |
| Consumer classes, conventional styles, semantic custom properties | [Button.test.tsx](../src/components/button/__tests__/Button.test.tsx) | Forwarded class membership and inline property values, not computed appearance |
| Handler forwarding, disabled activation, public ref focus, prop updates | [Button.test.tsx](../src/components/button/__tests__/Button.test.tsx) | Awaited interactions, callback outcomes, focus, and `rerender` |
| Native markup, repeatable initial HTML, types/state/ARIA/customization before hydration | [Button.ssr.test.tsx](../src/components/button/__tests__/Button.ssr.test.tsx) | Real server rendering with no browser globals |
| Hydration, native forms, keyboard activation, disabled tab order, focus styling | [Button.hydration.test.ts](integration/components/button/Button.hydration.test.ts) | Real React and Chromium after server rendering |
| CSS preserving native hidden behavior and tab order | [Button.hidden.test.ts](integration/components/button/Button.hidden.test.ts) | Actual browser visibility and navigation |
| Theme selection, CSS cascade, visual states, reflow, accessibility | [Theme integration](integration/themes/), [stories](../stories/), and [browser verification](../scripts/verify-browser.mjs) | Generated styles, real browser behavior, and existing accessibility checks |

Class checks deliberately verify the CSS hooks that select variant/size styling; they do not prove colors or layout. Similarly, inspecting a custom property's inline value proves forwarding, not theme resolution. The hidden-attribute DOM test explicitly includes hidden elements because such an element has no accessible name; browser tests prove that it is actually hidden and skipped by Tab.

SSR repeatability compares two real renderings rather than fixing a full markup snapshot. General label and customization checks moved to DOM assertions, while server-specific attributes remain checked before hydration. DOM and browser scenarios may overlap when they verify different boundaries, such as callback forwarding versus successful activation after hydration. Do not remove browser checks merely because a jsdom test passes.

## Fixtures

Keep one-off setup near its test. Share setup when several tests need the same lifecycle; keep scenario inputs, actions, and assertions visible in the test.

- [browser.ts](integration/fixtures/browser.ts) owns a Chromium browser per test file, a fresh isolated page per test, page-error collection, and cleanup. Import its `test` and use `test.beforeEach` for scenario-specific page setup.
- [token-project.mjs](integration/fixtures/token-project.mjs) supplies temporary project directories, synthetic token documents, and cleanup. It is used only by integration tests; unit tests keep their filesystem doubles local.
- [hydration/build.ts](integration/fixtures/hydration/build.ts) owns shared temporary Vite bundling. Real React apps and browser entries live beside each [integration family](integration/components/) under `fixtures/`.

Do not import one test file from another or share assertion logic across suites. Unit and integration suites should independently verify their respective boundaries. Follow the [testing guidelines](../.agents/guidelines/testing-guidelines.md) for readable scenarios and precise assertions.

## Running tests

### Affected unit and integration feedback

Choose incremental TDD, batched test-first, or implementation followed by tests under the [development policy](../.agents/guidelines/testing-guidelines.md#development-policy). Use explicit files without coverage for focused checks, including newly added tests. Use affected commands for related feedback as implementation evolves and during refactoring:

```sh
npm run test:unit:affected -- --base origin/main
npm run test:integration:affected -- --base origin/main
npm run test:integration:affected -- --base origin/main --dry-run
```

The base is required; choose the ref whose merge-base with HEAD covers your branch work. `--base HEAD` is useful for local-only edits, but does not include earlier committed work. Commands union committed branch, staged, unstaged, and nonignored untracked changes, preserving cancelling edits and both rename paths. They neither fetch history nor change branches. Missing history yields a full requested-project fallback. Invalid arguments, a non-Git directory, or broken test discovery fail.

Output identifies the project, base/HEAD/merge-base, changed paths, selected files and reasons. Outcomes are `selected`, `full-fallback`, `safely-empty`, or an error with nonzero status. Dry run discovers specifications without executing test modules/hooks, launching Chromium, generating tokens, or touching coverage. The only options are `--base <git-ref>` and `--dry-run`; project/config/coverage overrides are rejected.

Vitest owns normal import dependency selection. Focused component tests and server/client fixture apps import implementation modules directly; real composed dependencies remain intact. Dedicated [public export](unit/build/public-api.test.tsx), [consumer composition](integration/build/public-consumer.test.tsx), named-icon/catalog contracts, and packed-consumer checks intentionally retain public-barrel confidence. Broad selection of those suites is expected.

The [policy](../scripts/affected-policy.mjs) is deliberately conservative:

| Changed input | Development selection |
| --- | --- |
| Implementation, test or imported helper | Vitest-related owners and directly changed tests |
| Component CSS | Full integration; no additional unit appearance tests |
| Tokens, generated CSS/reference, scripts, configuration, dependencies or public barrels | Full requested project |
| Integration fixture/resource, stories/docs or added source/test inventory | Full integration; related owners or conservative fallback in unit |
| Runtime rename/deletion, unknown resource or unproven runtime owners | Full requested project |
| Unrelated OpenSpec planning prose | Safely empty unless another input selects tests |

Paths under E2E or documentation are not blanket-ignored: some unit/integration tests import helpers there or read files from disk. A new unsupported dependency pattern must gain a tested rule or retain the full fallback. These unit/integration selectors provide no export-aware graph or persistent cache. Browser selection uses the separate [harness ownership policy](browser-harness/README.md#affected-selection). See [unit/integration selection evidence](../docs/affected-test-verification.md) for its measured results and limitations.

Affected unit/integration runs are coverage-free even in full-fallback mode and preserve prior reports. They are partial development feedback, not a replacement for the independent full unit/integration coverage gates. At local completion retain those gates and required lint/type/build/package/SSR checks, and follow the [browser completion policy](#local-browser-completion). Required CI stays complete.

For selected incremental TDD, add a new Button test, run that explicit file to observe a meaningful failure, implement it and rerun the file for green, then use affected feedback while refactoring. For a routine feature tested afterward, establish its API and accessibility contract, implement a coherent increment, add tests with expectations derived from that contract, and run those explicit files plus related affected checks. A first-run pass is valid final-behavior evidence; no artificial failure is required. Both approaches retain required full verification.

If final full integration exposes a regression, reproduce it with its explicit test, fix it, and rerun that required full gate on the final state. Browser reruns follow the final repair's impact rather than automatically repeating every unrelated E2E suite. A conservative full fallback is expected when shared inputs change.

## Local browser completion

During iteration, run specific browser scenarios and regression tests. At local completion for browser-impacting changes, run all Storybook render/play/accessibility checks and affected E2E suites, including composed consumers and retained served-Storybook boundaries. Use `npm run test:e2e:affected -- --base <git-ref>` and inspect its reasons. Explicit suite selection requires a stated ownership rationale; uncertain ownership requires the complete suite.

| Changed input | Local E2E scope |
| --- | --- |
| Component implementation or scoped CSS with proven consumers | Owning suites plus dependent compositions |
| Shared tokens, generated/global styles, browser setup or dependency/public-export configuration | Complete E2E |
| Unknown impact or missing ownership | Complete E2E with fallback explanation |
| Test-only repair with known dependencies | Changed tests and affected suites |
| Shared readiness or harness repair | Complete E2E |

After a failure, reproduce it and repair it with focused checks, then rerun the scope affected by the final changes. Do not repeat unrelated local E2E solely because a failure happened. Never reuse results across relevant subsequent edits. Complete required CI always runs every browser suite and must pass after a CI failure is repaired. Independent full unit/integration coverage, lint, type, build and package obligations are unchanged.

Report actual commands/scope, fallbacks, known failures, unrun checks and pending CI. An affected pass is local evidence, not complete repository verification or merge readiness. Known documentation-navigation failures remain visible even when a component's selected checks pass.

This policy is repository-local. Reinstalling upstream agent-guides may overwrite local guideline/skill edits; preserve this section and reconcile the shared execution policy afterward. Updating the external guide source or installer is separate work.

The development policy and coordinated skills are repository-local customizations of the installer-managed files listed in [agi.json](../agi.json). Preserve those local changes when reviewing a future installer refresh; do not rewrite manifest fingerprints to mark them as upstream content. Updating the shared agent-guides source or installer package is separate work.

Run commands from the repository root:

```sh
npm run test:unit
npm run test:integration
npm run test:storybook
npm run test:e2e
npm test
```

Run a single file or feature without enforcing whole-suite coverage:

```sh
npx --no-install vitest run --project unit tests/unit/tokens/token-compiler.test.mjs
npx --no-install vitest run --project unit src/components/button/__tests__/Button.test.tsx
npx --no-install vitest run --project unit src/components/button/__tests__/Button.ssr.test.tsx
npx --no-install vitest run --project integration tests/integration/components/button/Button.hydration.test.ts
npx --no-install vitest run --project unit tests/unit/tokens
npx --no-install vitest run --project integration tests/integration/components -t 'disabled'
```

For Vitest watch mode, omit `run`. Install the browser once with `npx --no-install playwright install chromium` before running browser integration, Storybook, or E2E tests. Unit tests and filesystem-only integration tests do not launch a browser. No suite needs a manually started Storybook server; the E2E runner manages its own.

## Playwright E2E tests

[The complete runner](browser-harness/run.mjs) makes `npm run test:e2e` run both disjoint projects, sequentially: the private Vite gallery on port 6008 through [the component configuration](../playwright.components.config.ts), then retained Storybook on port 6007 through [the Storybook configuration](../playwright.config.ts). Each project generates tokens before starting its own server. Locally an existing server may be reused; CI starts its own. Interactive Storybook remains on port 6006. Explicit file filters route only to the owning project; focused project commands accept the full Playwright option set.

The [Button harness journeys](browser-harness/specs/button/Button.spec.ts) own native activation/forms, disabled/hidden order, real focus, variants/sizes, icon composition and enlarged/spaced labels. [Retained Button delivery](e2e/components/button/Button.spec.ts) owns Storybook args. Stack and CodeBlock use the same private harness while their SSR/hydration/package checks stay separate. [Theme journeys](e2e/themes/themes.spec.ts) retain sibling/nested scopes and consumer overrides. [Storybook journeys](e2e/storybook/documentation.spec.ts) retain docs navigation and the actual toolbar. The [preview adapter](e2e/fixtures/storybook.ts) still requires successful `storyFinished` completion.

Use [openScenario](browser-harness/fixtures/scenario.ts) with explicit theme/args for catalogued harness scenarios. Retained tests use named [openStory options](e2e/fixtures/storybook.ts) and complete public story IDs instead of hand-built query strings. Keep actions and assertions visible in each journey. See [scenario authoring and isolation](browser-harness/README.md) and the [behavior matrix](browser-behavior-matrix.md).

The harness verifies development component behavior; retained tests verify the served Storybook boundary. Neither replaces Gatsby/Astro consumer verification, existing browser integration, package checks or Storybook render/play/accessibility tests.

```sh
npx --no-install playwright install chromium
npm run test:e2e
npm run test:e2e:components -- button
npm run test:e2e:storybook -- button
npm run test:e2e:affected -- --base origin/main --dry-run
npm run test:e2e:affected -- --base origin/main
npm run test:e2e -- --headed
npm run test:e2e:ui         # Retained Storybook UI
npm run test:e2e:components -- --ui
npm run test:e2e:report
```

E2E tests use fresh browser contexts, accessible locators and auto-waiting assertions. Retries remain disabled. Failure screenshots/traces and HTML reports use separate `components` and `storybook` directories under `test-results/` and `playwright-report/`. Open a specific report with `npx --no-install playwright show-report playwright-report/components` (or `storybook`). These outputs are ignored. Required CI still runs the complete E2E command and all existing gates. `npm test` remains Vitest; standalone E2E does not contribute to either production coverage gate.

### Coverage-free E2E and diagnostic measurement

`npm run test:e2e` runs the complete Chromium suite without starting V8 coverage, cleaning caches, or writing coverage artifacts. File filters route to their owning projects; use a focused project command for title filters so an unrelated project with no matching cases does not fail the invocation. All ordinary modes preserve assertion failures, screenshots and retained traces. Existing diagnostic artifacts are untouched, not evidence for this run.

```sh
npm run test:e2e
npm run test:e2e -- tests/browser-harness/specs/select/Select.spec.ts
npm run test:e2e:storybook -- --grep 'native keyboard'
npm run test:e2e:coverage
npm run test:e2e:coverage -- tests/browser-harness/specs/select/Select.spec.ts
```

The opt-in command includes both projects through [the diagnostic configuration](../playwright.coverage.config.ts), starts both servers, collects Chromium V8 data across navigation and writes HTML/JSON under `coverage/e2e/`. `diagnostic-summary.json` separately lists production, story/demo, preview and harness files with exact counters, invocation/filter information, selected projects/suites/tests, test status and report-generation time. Unloaded authored modules remain in the denominator. Reports describe execution measurement, not completion of the browser-behavior matrix.

Percentages are informational, including 0% for unloaded modules. Test failures, missing expected collection data, and collection/reporting/write errors still fail the command. Each diagnostic run cleans its own cache; counters never satisfy unit/integration gates. A filtered diagnostic run shows its selection and must not be presented as complete browser verification. A request-only selection with no JavaScript produces no measurement and fails rather than inventing data.

The diagnostic inventory includes authored browser JavaScript/TypeScript in [src/](../src/), [stories/](../stories/), [.storybook/](../.storybook/), [gallery/](browser-harness/gallery/) and [scenarios/](browser-harness/scenarios/). It excludes declarations, test/runner/fixture code, framework wrappers, dependencies and Node-only Storybook configuration. CSS and prose have no JavaScript counters. Independent production unit/integration scopes and 100% per-file thresholds remain unchanged.

Complete CI requires all Storybook render/play/a11y checks, both complete browser projects, production gates and existing build/package checks. Affected selection is for local completion under the policy above. Its static scenario graph includes composed consumers; retained Storybook conservatively owns all authored source/story/runtime resources because the preview shares CSS and public-barrel imports. Missing ownership or unknown inputs trigger a complete fallback. See [selector limits](browser-harness/README.md#affected-selection), [pilot measurements and fault probes](../docs/component-harness-verification.md), [the subsequent layout migration](../docs/layout-harness-migration.md), [form-control migration](../docs/forms-harness-migration.md), [feedback/actions migration](../docs/feedback-actions-harness-migration.md), [Field migration](../docs/field-harness-migration.md), [Card/Icon migration](../docs/card-icon-harness-migration.md), and [AspectRatio migration](../docs/aspect-ratio-harness-migration.md). The separate manually dispatched diagnostic workflow remains on demand.

Exercise DOM-test cleanup with a reproducible shuffled order:

```sh
npx --no-install vitest run --project unit src/components/button/__tests__/Button.test.tsx --sequence.shuffle --sequence.seed=42
```

## Coverage and isolation

The unit and integration commands independently enforce 100% statements, branches, functions, and lines per executable production file. Their reports are separate: [unit](../coverage/unit/index.html) and [integration](../coverage/integration/index.html). The shared scope is defined in [vitest.config.ts](../vitest.config.ts); neither suite relies on another suite's counters.

Coverage includes library source and token/build scripts. It excludes verification harnesses, configuration, stories, examples, declarations, generated assets, and test fixtures. The public re-export-only entry point has no executable counters. Node-side coverage includes SSR execution; the browser hydration bundle validates client behavior without contributing counters. JavaScript coverage does not measure CSS or establish accessibility compliance.

Temporary projects and bundles are removed after use. The command-entry smoke test intentionally regenerates the checked-in token CSS and documentation and verifies they are unchanged. Browser layout and focus checks stay in integration tests; Storybook retains its accessibility checks.

Icon contracts are covered by [DOM tests](../src/components/icon/__tests__/Icon.test.tsx), [SSR tests](../src/components/icon/__tests__/Icon.ssr.test.tsx), [named artwork tests](../src/components/icon/__tests__/named-icons.test.tsx), [hydration integration](integration/components/icon/Icon.hydration.test.ts), and [component browser journeys](browser-harness/specs/icon/Icon.spec.ts). The packed-consumer checks also verify single-icon and Button-only bundles omit unused artwork.

The searchable Gallery uses shared [story-only metadata](../src/components/icon/stories/icon-catalog.ts). [Catalog integrity tests](../src/components/icon/stories/__tests__/icon-catalog.test.ts) check public named-export membership, order and synonyms. [Gallery DOM tests](../src/components/icon/stories/__tests__/icon-gallery.test.tsx) exercise literal matching, feedback, empty-state recovery and keyboard focus. [Browser journeys](e2e/components/icon/icon-gallery.spec.ts) cover the real preview, theme toolbar, styled controls, preview sizes, local theme selection, and narrow/enlarged text. These helper modules remain visible in the complete-inventory diagnostic browser report; unit/integration production coverage scopes remain unchanged. Storybook's play journey restores all eight results before the accessibility scan.

Spatial-system coverage lives in [unit token contracts](unit/tokens/spatial-contract.test.mjs), [real-generation integration](integration/tokens/spatial-contract.test.mjs), and [Storybook browser journeys](e2e/storybook/spatial-system.spec.ts). The [frozen legacy contract](fixtures/spatial-legacy-tokens.json) records the 90 pre-change public defaults per theme; additions are allowed, while unintended changes fail. Browser tests check corrected gallery coupling, semantic gap selection, nested resets, guide links, and the example-specific responsive breakpoint. Native select typeahead supplies a real keyboard journey; popup arrow navigation must also be checked on supported real browsers/platforms. Production coverage scopes and thresholds are unchanged.
