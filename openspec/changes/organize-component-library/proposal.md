# Proposal

## Why

Component implementations, CSS, stories, and focused tests currently live in separate flat directories, making ownership and related examples harder to find as the library grows. Grouping work by component family and organizing Storybook by consumer intent will improve discovery while preserving the package API, native behavior, and verification boundaries.

## What Changes

- Introduce kebab-case component-family directories under `src/components/`, colocating implementation, CSS, focused unit tests, and component stories/examples.
- Keep compound exports in their owning family, shared runtime hooks under `src/internal/hooks/`, and cross-component documentation/examples under root `stories/` foundations, patterns, and shared support.
- Retain central integration and E2E suites with matching component-family directories and appropriately scoped fixtures. Preserve all existing test boundaries, independent 100% coverage gates, and accessibility checks.
- Present Storybook components under Actions, Forms, Surfaces, and Visuals; retain Design System guidance and add a Patterns root when it contains an existing multi-component example.
- Give independently reusable public field atoms discoverable component examples and documentation; keep card parts documented with their parent.
- Pin existing component/story IDs before changing titles, retaining existing preview links, documentation links, and browser-test routes.
- Update discovery, declaration exclusions, coverage inventories, stylesheet publication, and contributor documentation for the new layout without shipping stories/tests or changing public CSS entrypoints.

## Capabilities

### New Capabilities

- `component-discovery`: Consumer-facing Storybook navigation, discoverable public component/part documentation, consistent example organization, and stable legacy story permalinks.

### Modified Capabilities

None. The main spec inventory is currently empty. Earlier completed but unarchived change deltas are compatibility context, not existing main capabilities. Source/test relocation is a behavior-preserving implementation change; the intentional Storybook navigation behavior is specified by `component-discovery`.

## Impact

- Source modules, styles, internal imports, public export wiring, unit-test locations, and component-owned examples.
- Storybook discovery, titles/order, documentation links, preview support/styles, and relevant browser assertions.
- Vitest and Playwright discovery/support paths, browser coverage inventory, TypeScript development/build scopes, style-copy inputs, package consumer checks, and test/contributor guidance.
- No new dependencies, monorepo packages, public runtime exports, component API changes, token/default-style changes, or public CSS filename changes are planned. The visible sidebar hierarchy intentionally changes; existing story IDs remain compatible.
- Archiving other OpenSpec changes, extracting CharacterCount/InputAdornment, changing coverage policy, and consolidating test scenarios are out of scope.
