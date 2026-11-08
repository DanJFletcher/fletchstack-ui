# Design

## Context

See [the proposal](proposal.md#why) for motivation. The current [Vitest configuration](../../../vitest.config.ts) has unit and integration projects using Node by default and a separate Chromium Storybook project. Both coverage commands independently enforce 100% statements, branches, functions, and lines per executable production file over the same source and token/build scripts.

[Button.ssr.test.tsx](../../../tests/unit/components/Button.ssr.test.tsx) currently contains 16 cases using HTML substring assertions. [Browser integration tests](../../../tests/integration/components/) already verify real hydration, keyboard activation, native forms, hidden and disabled controls, refs, overrides, and focus styling. Storybook uses Testing Library-style queries and interactions through `storybook/test`.

React Testing Library 16.3.3 and DOM Testing Library 10.4.2 are direct development dependencies. No direct jsdom, user-event, or jest-dom dependency is configured for unit tests. Test hooks are imported from Vitest rather than exposed globally; the installed React Testing Library registers automatic cleanup and suite-level React act setup only when the relevant global hooks exist. The library itself has no browser-dependent rendering logic to change.

## Goals / Non-Goals

**Goals:**

- Give React DOM tests a predictable, isolated environment without changing the environment of SSR or non-UI tests.
- Preserve the existing Button contract checks while replacing serialization-sensitive assertions and adding direct interaction and update checks.
- Keep the existing commands and independent coverage gates usable during and after migration.

**Non-Goals:**

- Introduce providers, a custom render abstraction, new test projects, or a second browser automation framework.
- Use jsdom to establish layout, theme contrast, CSS cascade, native tab order, or hydration correctness.
- Change Button, its CSS, themes, public types, package exports, supported React range, or Node version floor.

## Decisions

### 1. Select jsdom per DOM test file

Add `tests/unit/components/Button.test.tsx` with the `@vitest-environment jsdom` directive. Keep the existing unit project and Node default. SSR tests remain explicitly Node-based, and token/build tests retain their current environment. This keeps DOM and Node execution in one unit command and coverage report.

Alternatives: changing the entire unit project to jsdom would weaken SSR isolation and add unnecessary browser globals to pure tests. A separate DOM project would complicate command selection and coverage aggregation for one component. jsdom is chosen as a general DOM implementation; browser-dependent guarantees remain in Chromium regardless of emulator choice.

### 2. Scope setup to DOM test files

Create `tests/unit/setup/dom.ts`, explicitly imported by DOM tests after environment selection. It imports `@testing-library/jest-dom/vitest`, registers `afterEach(cleanup)` through imported Vitest hooks, and sets/restores React's act-environment flag for the suite. Restore only the flag owned by this setup; do not reset unrelated global stubs. Keep this setup out of Node SSR, token/build, integration, and Storybook execution.

Add pinned direct development dependencies on `jsdom`, `@testing-library/user-event`, and `@testing-library/jest-dom`. Select versions whose engines and peer dependencies support the repository's Node floor, installed Vitest/React, and supported React range. Do not rely on Storybook's transitive packages or enable runner globals just to trigger auto-cleanup. The setup is TypeScript and stays within the existing TypeScript test include paths.

### 3. Test component contracts through the rendered DOM

Import `render`, `screen`, and where needed `within` from React Testing Library; it already exposes DOM Testing Library queries. Use `userEvent.setup()` inside interaction tests before rendering, await interactions, and prefer role/name queries. Use `findBy` or `waitFor` only for genuinely asynchronous outcomes, with actions outside retry callbacks. Keep production components and composed children real; a callback spy is acceptable when the callback is the public outcome.

| Current concern | Planned verification |
| --- | --- |
| Label, explicit accessible name, decorative icon and label | Named button queries and accessible-name assertions; decorative content does not pollute the name |
| Default, submit, reset, form association, hidden and disabled attributes | Native DOM properties/attributes and state matchers; real native behavior stays covered in Chromium |
| Consumer class and style forwarding | Consumer class membership, explicit inline styles, and semantic custom-property values; no class-order or style-serialization checks |
| Variant and size selection | Preserve existing selection cases with unordered class-membership checks for the CSS hooks that select their styling; these are rendering checks, not claims about visual appearance |
| Handlers, disabled activation, ref access | Awaited user interactions, observable callback outcomes, and focusing the queried native button through its public ref |
| Updates after initial rendering | `rerender` an enabled Button as disabled and verify its state and subsequent activation behavior in separate focused cases |

Do not replace string checks with large DOM snapshots, private React-state assertions, or repeated hand-built query helpers. Each case retains arrange/act/assert structure and one promised behavior. Cases that inspect styling hooks do so deliberately; user-facing queries still locate the element.

### 4. Retain distinct SSR and browser guarantees

Narrow the Node SSR suite to deterministic initial native markup, the default non-submitting type and explicit form types, disabled/hidden state in server HTML, and representative native/ARIA/customization forwarding. Retain direct `react-dom/server` calls so these tests cannot silently become client-only tests. Avoid exact full-markup snapshots and class-order expectations.

Leave all current integration and Storybook checks intact. A DOM test can verify handler forwarding while the existing hydration test verifies the same handler after server markup reaches a real browser. Hidden visibility, tab order, computed focus indicators, theme resolution, and layout are not migrated into jsdom. Token and build tests do not gain Testing Library dependencies in their test code.

### 5. Preserve coverage and document the boundaries

Keep both coverage commands, report directories, 100% thresholds, per-file enforcement, and current production include/exclude patterns unchanged. DOM tests join the unit counters; integration must still reach its own thresholds independently. Test counts may change as serialization cases are split or replaced; preserving each behavior and both gates matters more than preserving a count.

Update [the test guide](../../../tests/README.md) with the DOM directive and setup import, query and interaction conventions, cleanup ownership, focused commands, and a DOM/Node/browser decision table. No CI command change should be necessary.

## Risks / Trade-offs

- DOM state leaking between cases -> explicit cleanup; run the DOM file alone and with shuffled tests and verify duplicate labels from prior tests do not remain mounted.
- React act warnings or stale asynchronous assertions -> explicit act-environment lifecycle, awaited user-event calls, and outcome-based async queries; diagnose warnings instead of suppressing them.
- jsdom passing while real browser behavior is broken -> retain every existing Chromium and Storybook check and state the emulator's limits in the guide.
- Losing a contract case when simplifying SSR strings -> map all existing cases to DOM, SSR, or retained browser checks before removing an assertion; preserve selection and customization checks without ordering assumptions.
- Dependency or declaration incompatibility -> verify package engines/peers before installation and run strict type checks; keep the Node floor and React peer range unchanged.
- Coverage being easier to satisfy after reconfiguration -> compare the include/exclude patterns and thresholds with the baseline; do not exclude source or combine unit/integration counters.

## Migration Plan

1. Record passing unit and integration coverage baselines and current Storybook checks. Preserve unrelated uncommitted changes.
2. Add compatible development dependencies and DOM-only setup, then implement the mapped DOM scenarios and narrow SSR scenarios without editing production code.
3. Run focused DOM and SSR tests independently, then shuffled DOM tests to exercise isolation. Confirm a representative assertion rejects a deliberately broken contract in a reversible local check, and restore the original implementation before final verification.
4. Update the guide and run lint, type checking, the two independent coverage commands, Storybook tests, and the library build. Record results and any verification limitations.

Rollback consists of reverting only this migration's test, setup, dependency, and documentation edits. No deployed behavior, data, or generated design tokens require migration. Product specs are deliberately skipped because existing behavior is preserved.
