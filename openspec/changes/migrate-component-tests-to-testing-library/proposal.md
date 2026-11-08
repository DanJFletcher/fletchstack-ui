# Proposal

## Why

The Button unit suite currently verifies most component behavior through server-HTML substrings, coupling tests to serialization and class ordering while leaving fast DOM interaction checks to browser suites. React and DOM Testing Library are already installed; a focused migration will make unit tests express the public component contract while preserving genuine SSR and browser coverage.

## What Changes

- Add a jsdom environment for DOM component unit tests only; keep SSR, token, and build unit tests in Node.
- Add compatible, pinned development dependencies for jsdom, user-event, and Vitest DOM matchers, with explicit cleanup and React test-environment setup.
- Introduce a Button DOM unit suite using accessible queries, realistic interactions, and assertions on observable behavior, native attributes, and public customization inputs.
- Narrow the existing Button SSR suite to server-rendering guarantees; retain Chromium hydration, native visibility, keyboard, form, theme, and focus checks and existing Storybook tests.
- Preserve separate unit and integration coverage reports and their existing 100% per-file thresholds and production-code scope.
- Update the test guide with environment selection, setup, assertions, and focused commands.
- Out of scope: component implementation or public API changes, token/build test rewrites, browser-test removal, Storybook migration, and changes to coverage targets.

## Capabilities

### New Capabilities

None. This change refactors test tooling and verification of existing behavior; it does not introduce a product capability.

### Modified Capabilities

None. The change metadata sets `skip_specs: true`; no product requirement or delta spec is needed.

## Impact

- [Package manifest](../../../package.json) and lockfile: additional development dependencies only; React peer support and library exports stay unchanged.
- [Vitest configuration](../../../vitest.config.ts), new DOM-only setup, new Button DOM unit tests, and the [existing SSR tests](../../../tests/unit/components/Button.ssr.test.tsx).
- [Test guide](../../../tests/README.md): authoring guidance and boundaries for DOM, SSR, and browser tests.
- Existing unit and integration commands remain the acceptance gates. The migration requires no Gatsby/Astro integration changes, new services, or running Storybook server.
