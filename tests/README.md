# Test guide

Tests are organized by suite, then feature. Start with the feature's directory and choose the boundary you need to verify.

| Location | Responsibility | Environment |
| --- | --- | --- |
| [unit/components/](unit/components/) | Component DOM contracts and focused server-rendered markup | Per-file jsdom or Node and React SSR |
| [unit/tokens/](unit/tokens/) | Token compilation, validation, naming, and value conversion | Node; synthetic in-memory inputs |
| [unit/build/](unit/build/) | Build orchestration and errors at filesystem boundaries | Node; filesystem mocked |
| [integration/components/](integration/components/) | Hydration, forms, keyboard behavior, refs, and native visibility | Chromium and real React |
| [integration/themes/](integration/themes/) | Theme selection and generated CSS applied to real controls | Chromium and an isolated token project |
| [integration/tokens/](integration/tokens/) | JSON documents through the real compiler to generated files | Node; temporary directories |
| [integration/build/](integration/build/) | Command entry points and stylesheet publication | Node; real filesystem |
| [e2e/components/](e2e/components/) | Served component behavior through HTTP and a browser | Playwright Test and Chromium against local Storybook |
| [e2e/storybook/](e2e/storybook/) | Documentation navigation and theme toolbar | Real Storybook manager and preview iframe |
| [../stories/](../stories/) | Component examples, interactions, and automated accessibility checks | Storybook in Chromium |

## Naming and discovery

- Match the source module or public component name: `token-values.test.mjs`, `Button.ssr.test.tsx`.
- Add a behavior suffix when a component has distinct boundaries: `Button.hidden.test.ts`, `Button.hydration.test.ts`.
- Group related function scenarios with `describe` blocks. The [compiler tests](unit/tokens/token-compiler.test.mjs) contain compilation, flattening, and CSS naming together.
- Use `.tsx` for React test files, `.ts` for other TypeScript tests, and `.mjs` for JavaScript module tests.
- The unit project discovers only `unit/**/*.test.{ts,tsx,mjs}`; integration discovers only `integration/**/*.test.{ts,tsx,mjs}`. Helpers and sample applications do not use a `.test` suffix.
- Playwright Test discovers only `e2e/**/*.spec.ts`. E2E tests import `test` and `expect` from [fixtures/test.ts](e2e/fixtures/test.ts), which automatically collects browser coverage. Vitest unit/integration tests keep their existing imports and discovery patterns.
- Add new tests within the appropriate feature directory. Add a new directory only when the tests represent a distinct feature or responsibility.

## DOM test setup

DOM component tests use React Testing Library and jsdom. The unit project defaults to Node; opt a DOM test file in with its environment directive and explicit setup import. For a file inside `unit/components/`, begin with:

```tsx
// @vitest-environment jsdom
import '../setup/dom';
import { render, screen } from '@testing-library/react';
```

[setup/dom.ts](unit/setup/dom.ts) registers `@testing-library/jest-dom/vitest` matchers, calls React Testing Library cleanup after each test, and sets/restores only React's act-environment flag. Vitest hooks are imported rather than global, so setup owns this lifecycle explicitly. Do not import this module in Node SSR, token/build, integration, or Storybook tests. A React test does not need separate DOM Testing Library query imports; React Testing Library already exposes them.

Run the DOM file independently with:

```sh
npx --no-install vitest run --project unit tests/unit/components/Button.test.tsx
```

SSR tests retain the Node environment and direct `react-dom/server` rendering. DOM tests run without Chromium; browser integration and Storybook checks still require it.

## Component assertions and suite boundaries

Use `screen.getByRole` with an accessible name to locate a control, and `within` when a named region needs its own scope. Use React Testing Library's `render` directly; this library currently needs no providers or custom render wrapper. Compose real labels and decorative children so accessible-name assertions reflect what consumers render.

For interaction tests, create `const user = userEvent.setup()` before rendering, then await `user.click`, `user.type`, or other actions in the test. Assert the consumer callback or visible result. Use `findBy` or `waitFor` only for eventual outcomes, and never repeat an action inside a retrying assertion. DOM matchers such as `toBeDisabled`, `toHaveAccessibleName`, and `toHaveFocus` express the promised state more precisely than HTML substrings.

| Contract or risk | Primary test location | Assertion boundary |
| --- | --- | --- |
| Label and icon-only names; decorative composition | [Button.test.tsx](unit/components/Button.test.tsx) | Role/name queries and accessible names |
| Default/explicit types, disabled/hidden attributes, external form association | [Button.test.tsx](unit/components/Button.test.tsx) | Native DOM attributes, state, and form ownership |
| Variant and size selection | [Button.test.tsx](unit/components/Button.test.tsx) | Exact class membership for deliberate CSS styling hooks, independent of ordering |
| Consumer classes, conventional styles, semantic custom properties | [Button.test.tsx](unit/components/Button.test.tsx) | Forwarded class membership and inline property values, not computed appearance |
| Handler forwarding, disabled activation, public ref focus, prop updates | [Button.test.tsx](unit/components/Button.test.tsx) | Awaited interactions, callback outcomes, focus, and `rerender` |
| Native markup, repeatable initial HTML, types/state/ARIA/customization before hydration | [Button.ssr.test.tsx](unit/components/Button.ssr.test.tsx) | Real server rendering with no browser globals |
| Hydration, native forms, keyboard activation, disabled tab order, focus styling | [Button.hydration.test.ts](integration/components/Button.hydration.test.ts) | Real React and Chromium after server rendering |
| CSS preserving native hidden behavior and tab order | [Button.hidden.test.ts](integration/components/Button.hidden.test.ts) | Actual browser visibility and navigation |
| Theme selection, CSS cascade, visual states, reflow, accessibility | [Theme integration](integration/themes/), [stories](../stories/), and [browser verification](../scripts/verify-browser.mjs) | Generated styles, real browser behavior, and existing accessibility checks |

Class checks deliberately verify the CSS hooks that select variant/size styling; they do not prove colors or layout. Similarly, inspecting a custom property's inline value proves forwarding, not theme resolution. The hidden-attribute DOM test explicitly includes hidden elements because such an element has no accessible name; browser tests prove that it is actually hidden and skipped by Tab.

SSR repeatability compares two real renderings rather than fixing a full markup snapshot. General label and customization checks moved to DOM assertions, while server-specific attributes remain checked before hydration. DOM and browser scenarios may overlap when they verify different boundaries, such as callback forwarding versus successful activation after hydration. Do not remove browser checks merely because a jsdom test passes.

## Fixtures

Keep one-off setup near its test. Share setup when several tests need the same lifecycle; keep scenario inputs, actions, and assertions visible in the test.

- [browser.ts](integration/fixtures/browser.ts) owns a Chromium browser per test file, a fresh isolated page per test, page-error collection, and cleanup. Import its `test` and use `test.beforeEach` for scenario-specific page setup.
- [token-project.mjs](integration/fixtures/token-project.mjs) supplies temporary project directories, synthetic token documents, and cleanup. It is used only by integration tests; unit tests keep their filesystem doubles local.
- [hydration/](integration/fixtures/hydration/) holds the real React sample app, browser entry point, and temporary Vite bundler used by the hydration tests.

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
npx --no-install vitest run --project unit tests/unit/components/Button.test.tsx
npx --no-install vitest run --project unit tests/unit/components/Button.ssr.test.tsx
npx --no-install vitest run --project integration tests/integration/components/Button.hydration.test.ts
npx --no-install vitest run --project unit tests/unit/tokens
npx --no-install vitest run --project integration tests/integration/components -t 'disabled'
```

For Vitest watch mode, omit `run`. Install the browser once with `npx --no-install playwright install chromium` before running browser integration, Storybook, or E2E tests. Unit tests and filesystem-only integration tests do not launch a browser. No suite needs a manually started Storybook server; the E2E runner manages its own.

## Playwright E2E tests

[playwright.config.ts](../playwright.config.ts) configures the dedicated Playwright Test runner. `npm run test:e2e` generates tokens, starts Storybook at `http://127.0.0.1:6007`, waits for the preview server, runs Chromium tests over HTTP, and stops the server it started. It can reuse a manually started server at that address locally; CI always starts its own. The usual development Storybook port remains 6006.

The [Button journeys](e2e/components/Button.spec.ts) exercise every variant and size, keyboard activation and focus, disabled and hidden controls, native forms, ref access, icon composition, native attributes, consumer classes, and enlarged/spaced long labels at 320px. [Theme journeys](e2e/components/themes.spec.ts) verify sibling and nested scopes plus consumer overrides. [Storybook journeys](e2e/storybook/documentation.spec.ts) navigate Foundation → Tokens → the override example and switch themes through the actual toolbar. The [preview adapter](e2e/fixtures/storybook.ts) waits for Storybook's successful `storyFinished` event so play-function failures cannot silently pass or race subsequent interactions.

Keep theme-specific story IDs in the Button test's scenario table and group cases with `test.describe`. Use named preview options, such as `openStory(page, 'interaction-states', { theme: 'luna' })` or `openStory(page, 'playground', { args: { hidden: true } })`, instead of hand-built query strings. Reuse locators locally; keep actions and assertions visible in each scenario. Give longer journeys descriptive `test.step` blocks so the report identifies the stage that failed.

This suite exercises the real Storybook browser bundle; it is not a full Gatsby or Astro site test. Existing Vitest browser integration and Storybook accessibility tests remain separate and are not replaced.

```sh
npx --no-install playwright install chromium
npm run test:e2e
npm run test:e2e -- tests/e2e/components/Button.spec.ts
npm run test:e2e -- --headed
npm run test:e2e:ui
npm run test:e2e:report
```

E2E tests use Playwright's isolated browser contexts, accessible locators, and auto-waiting assertions. Retries are disabled so failures are visible. Failure screenshots and retained traces are written under `test-results/`; the test report is written to `playwright-report/`. These generated directories are ignored by Git and ESLint. The E2E command runs separately in CI and does not contribute to either Vitest coverage gate. `npm test` continues to run the Vitest suites; use `npm run test:e2e` for E2E execution.

### Independent E2E coverage gate

Chromium's native V8 coverage is collected before navigation, preserved across manager/iframe navigation, and merged by `monocart-coverage-reports` using source maps. The [report configuration](e2e/coverage/report.mjs) inventories all JavaScript/TypeScript browser modules in `src/`, `stories/`, and `.storybook/`, including files never loaded. Type declarations and the Node-only `.storybook/main.ts` configuration are excluded. **Scripts are outside E2E coverage.** MDX/Markdown prose and CSS have no authored JavaScript counters; the documentation and computed styling journeys verify their observable behavior instead. Dependencies, generated framework wrappers, test fixtures, and Node build tooling are also outside the gate.

The [reporter](e2e/coverage/reporter.mjs) clears cached counters before every run and requires **100% statements, branches, functions, and lines per scoped file**, comparing exact covered/total counts rather than rounded percentages. Zero-counter metrics are vacuous; missing coverage fails. Coverage ignore comments are disabled. The HTML report is [coverage/e2e/index.html](../coverage/e2e/index.html), with V8 details and a machine-readable summary alongside it. Unit, integration, and E2E reports never share counters.

The normal `npm run test:e2e` command enforces this gate locally and in CI. A filtered run still enforces the complete inventory and can therefore pass its selected tests but exit unsuccessfully for incomplete coverage. For focused debugging without the whole-suite gate, override reporters explicitly: `npx --no-install playwright test --grep 'native default' --reporter=list`. Run the normal command before submitting changes. Coverage proves execution of mapped JavaScript, not CSS coverage, accessibility compliance, or cross-browser compatibility; this suite currently runs Chromium only.

Exercise DOM-test cleanup with a reproducible shuffled order:

```sh
npx --no-install vitest run --project unit tests/unit/components/Button.test.tsx --sequence.shuffle --sequence.seed=42
```

## Coverage and isolation

The unit and integration commands independently enforce 100% statements, branches, functions, and lines per executable production file. Their reports are separate: [unit](../coverage/unit/index.html) and [integration](../coverage/integration/index.html). The shared scope is defined in [vitest.config.ts](../vitest.config.ts); neither suite relies on another suite's counters.

Coverage includes library source and token/build scripts. It excludes verification harnesses, configuration, stories, examples, declarations, generated assets, and test fixtures. The public re-export-only entry point has no executable counters. Node-side coverage includes SSR execution; the browser hydration bundle validates client behavior without contributing counters. JavaScript coverage does not measure CSS or establish accessibility compliance.

Temporary projects and bundles are removed after use. The command-entry smoke test intentionally regenerates the checked-in token CSS and documentation and verifies they are unchanged. Browser layout and focus checks stay in integration tests; Storybook retains its accessibility checks.
