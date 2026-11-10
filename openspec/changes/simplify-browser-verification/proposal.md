# Proposal

## Why

Development browser verification repeats story rendering and interactions across Chromium runners while enforcing complete JavaScript coverage of demonstration code. Existing evidence identifies 207 render-success checks among 594 standalone tests; simplify duplicated work and replace the mandatory E2E percentage gate with explicit browser guarantees before adding selection tooling.

## What Changes

- Assign checks to the cheapest layer that proves their actual boundary: Node/DOM contracts, Storybook rendering/play/accessibility, focused browser integration, and served-Storybook journeys.
- Remove demonstrably redundant checks only after mapping each guarantee to a surviving assertion. Consolidate repeated navigations and theme-independent matrices without losing meaningful CSS or native-browser coverage.
- Make `npm run test:e2e` run the complete focused browser suite without coverage collection or percentage enforcement. Keep filtered development execution usable.
- Add opt-in `npm run test:e2e:coverage` for diagnostic browser coverage with separate production and story/demo/preview summaries, including unloaded files. Coverage percentages are informational; test failures and collection/reporting errors still fail execution.
- Require a documented browser-behavior matrix and explicit ownership for layout, native keyboard behavior, theme scopes, focus, responsive/enlarged/spaced text, RTL, reduced motion, forced colors, SSR/hydration, and served-Storybook integration where applicable.
- Preserve the existing independent unit and integration production coverage gates at 100% statements, branches, functions, and lines per file, with unchanged scope.
- Measure representative cold/warm execution and coverage overhead before and after each simplification stage. Retain complete verification in CI; make diagnostics available on demand.
- This deliberately changes the prior E2E coverage policy recorded in earlier changes and contributor documentation. It changes verification commands, not the public component API.

## Capabilities

### New Capabilities

- `browser-verification`: Layered browser-verification ownership, focused execution, opt-in diagnostic coverage, and evidence required to simplify tests safely.

### Modified Capabilities

None. The accepted-spec inventory is empty; earlier change artifacts document the policy being superseded and remain historical records.

## Impact

- Browser suites and fixtures, Storybook plays where duplicated, selected integration assertions, Playwright reporting/configuration, package scripts, CI, and testing/verification documentation.
- No production component, token, stylesheet, package-export, dependency, or monorepo changes are required.
- Affected-test selection, Nx/Turborepo adoption, browser-engine expansion, broad build-pipeline optimization, and relaxation of unit/integration coverage gates are out of scope.
- Existing uncommitted component work must be preserved. Historical timings are evidence of current work, not promised speedups or a clean passing baseline.
