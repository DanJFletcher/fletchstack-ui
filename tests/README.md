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
| [e2e/storybook/](e2e/storybook/) | Documentation navigation and theme toolbar | Real Storybook manager and preview iframe |
| [component stories](../src/components/) and [foundations/patterns](../stories/) | Component examples, interactions, and automated accessibility checks | Storybook in Chromium |

## Naming and discovery

- Match the source module or public component name: `token-values.test.mjs`, `Button.ssr.test.tsx`.
- Add a behavior suffix when a component has distinct boundaries: `Button.hidden.test.ts`, `Button.hydration.test.ts`.
- Group related function scenarios with `describe` blocks. The [compiler tests](unit/tokens/token-compiler.test.mjs) contain compilation, flattening, and CSS naming together.
- Use `.tsx` for React test files, `.ts` for other TypeScript tests, and `.mjs` for JavaScript module tests.
- The unit project discovers `tests/unit/**/*.test.{ts,tsx,mjs}` and `src/components/**/__tests__/**/*.test.{ts,tsx,mjs}`; integration discovers only `integration/**/*.test.{ts,tsx,mjs}`. Helpers and sample applications do not use a `.test` suffix.
- Playwright Test discovers only `e2e/**/*.spec.ts`. E2E tests import `test` and `expect` from [fixtures/test.ts](e2e/fixtures/test.ts), which automatically collects browser coverage. Vitest unit/integration tests keep their existing imports and discovery patterns.
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

[playwright.config.ts](../playwright.config.ts) configures the dedicated Playwright Test runner. `npm run test:e2e` generates tokens, starts Storybook at `http://127.0.0.1:6007`, waits for the preview server, runs Chromium tests over HTTP, and stops the server it started. It can reuse a manually started server at that address locally; CI always starts its own. The usual development Storybook port remains 6006.

The [Button journeys](e2e/components/button/Button.spec.ts) exercise every variant and size, keyboard activation and focus, disabled and hidden controls, native forms, ref access, icon composition, native attributes, consumer classes, and enlarged/spaced long labels at 320px. [Theme journeys](e2e/themes/themes.spec.ts) verify sibling and nested scopes plus consumer overrides. [Storybook journeys](e2e/storybook/documentation.spec.ts) navigate Foundation → Tokens → the override example and switch themes through the actual toolbar. The [preview adapter](e2e/fixtures/storybook.ts) waits for Storybook's successful `storyFinished` event so play-function failures cannot silently pass or race subsequent interactions.

Keep theme-specific story IDs in the Button test's scenario table and group cases with `test.describe`. Use named preview options, such as `openStory(page, 'components-button--interaction-states', { theme: 'luna' })` or `openStory(page, 'components-button--playground', { args: { hidden: true } })`, instead of hand-built query strings. Pass a complete Storybook story ID so the same adapter supports Button and Icon. Reuse locators locally; keep actions and assertions visible in each scenario. Give longer journeys descriptive `test.step` blocks so the report identifies the stage that failed.

This suite exercises the real Storybook browser bundle; it is not a full Gatsby or Astro site test. Existing Vitest browser integration and Storybook accessibility tests remain separate and are not replaced.

```sh
npx --no-install playwright install chromium
npm run test:e2e
npm run test:e2e -- tests/e2e/components/button/Button.spec.ts
npm run test:e2e -- --headed
npm run test:e2e:ui
npm run test:e2e:report
```

E2E tests use Playwright's isolated browser contexts, accessible locators, and auto-waiting assertions. Retries are disabled so failures are visible. Failure screenshots and retained traces are written under `test-results/`; the test report is written to `playwright-report/`. These generated directories are ignored by Git and ESLint. The E2E command runs separately in CI and does not contribute to either Vitest coverage gate. `npm test` continues to run the Vitest suites; use `npm run test:e2e` for E2E execution.

### Coverage-free E2E and diagnostic measurement

`npm run test:e2e` runs the complete focused Chromium suite without starting V8 coverage, cleaning caches, or writing coverage artifacts. File/name filters use the same mode and preserve normal assertion failures, screenshots and retained traces. Existing diagnostic artifacts are untouched, not evidence for this run.

```sh
npm run test:e2e
npm run test:e2e -- tests/e2e/components/select/Select.spec.ts
npm run test:e2e -- --grep 'native keyboard'
npm run test:e2e:coverage
npm run test:e2e:coverage -- tests/e2e/components/select/Select.spec.ts
```

The opt-in command uses the same suites/server/browser through a thin coverage configuration. It collects Chromium V8 data across navigation and writes HTML/JSON under `coverage/e2e/`. `diagnostic-summary.json` separately lists production, story/demo and preview files and exact metric totals, invocation/filter information, selected suites/tests, test status and report-generation time. Unloaded authored modules remain in the denominator. Reports explicitly describe JavaScript execution measurement, not completion of the browser-behavior matrix.

Percentages are informational, including 0% for unloaded modules. Test failures, missing expected collection data, and collection/reporting/write errors still fail the command. Each diagnostic run cleans its own cache; counters never satisfy unit/integration gates. A filtered diagnostic run shows its selection and must not be presented as complete browser verification. A request-only selection with no JavaScript produces no measurement and fails rather than inventing data.

The inventory still includes authored browser JavaScript/TypeScript in `src/`, `stories/`, and `.storybook/`, excluding declarations, tests/setup/fixtures, generated framework wrappers, external dependencies and Node-only `.storybook/main.ts`. Scripts, CSS and prose have no browser-JavaScript counters. See the [browser-behavior matrix](browser-behavior-matrix.md) for their actual verification owners. Independent unit and integration coverage scope and 100% per-file thresholds are unchanged.

Complete CI verification requires all Storybook render/play/a11y checks, the complete focused browser suite, production gates and existing build/package checks. The separate manually dispatched diagnostic workflow measures coverage on demand. There is no affected selector or scheduled diagnostic run in this change.

Exercise DOM-test cleanup with a reproducible shuffled order:

```sh
npx --no-install vitest run --project unit src/components/button/__tests__/Button.test.tsx --sequence.shuffle --sequence.seed=42
```

## Coverage and isolation

The unit and integration commands independently enforce 100% statements, branches, functions, and lines per executable production file. Their reports are separate: [unit](../coverage/unit/index.html) and [integration](../coverage/integration/index.html). The shared scope is defined in [vitest.config.ts](../vitest.config.ts); neither suite relies on another suite's counters.

Coverage includes library source and token/build scripts. It excludes verification harnesses, configuration, stories, examples, declarations, generated assets, and test fixtures. The public re-export-only entry point has no executable counters. Node-side coverage includes SSR execution; the browser hydration bundle validates client behavior without contributing counters. JavaScript coverage does not measure CSS or establish accessibility compliance.

Temporary projects and bundles are removed after use. The command-entry smoke test intentionally regenerates the checked-in token CSS and documentation and verifies they are unchanged. Browser layout and focus checks stay in integration tests; Storybook retains its accessibility checks.

Icon contracts are covered by [DOM tests](../src/components/icon/__tests__/Icon.test.tsx), [SSR tests](../src/components/icon/__tests__/Icon.ssr.test.tsx), [named artwork tests](../src/components/icon/__tests__/named-icons.test.tsx), [hydration integration](integration/components/icon/Icon.hydration.test.ts), and [served Storybook journeys](e2e/components/icon/Icon.spec.ts). The packed-consumer checks also verify single-icon and Button-only bundles omit unused artwork.

The searchable Gallery uses shared [story-only metadata](../src/components/icon/stories/icon-catalog.ts). [Catalog integrity tests](../src/components/icon/stories/__tests__/icon-catalog.test.ts) check public named-export membership, order and synonyms. [Gallery DOM tests](../src/components/icon/stories/__tests__/icon-gallery.test.tsx) exercise literal matching, feedback, empty-state recovery and keyboard focus. [Browser journeys](e2e/components/icon/icon-gallery.spec.ts) cover the real preview, theme toolbar, styled controls, preview sizes, local theme selection, and narrow/enlarged text. These helper modules remain visible in the complete-inventory diagnostic browser report; unit/integration production coverage scopes remain unchanged. Storybook's play journey restores all eight results before the accessibility scan.

Spatial-system coverage lives in [unit token contracts](unit/tokens/spatial-contract.test.mjs), [real-generation integration](integration/tokens/spatial-contract.test.mjs), and [Storybook browser journeys](e2e/storybook/spatial-system.spec.ts). The [frozen legacy contract](fixtures/spatial-legacy-tokens.json) records the 90 pre-change public defaults per theme; additions are allowed, while unintended changes fail. Browser tests check corrected gallery coupling, semantic gap selection, nested resets, guide links, and the example-specific responsive breakpoint. Native select typeahead supplies a real keyboard journey; popup arrow navigation must also be checked on supported real browsers/platforms. Production coverage scopes and thresholds are unchanged.
