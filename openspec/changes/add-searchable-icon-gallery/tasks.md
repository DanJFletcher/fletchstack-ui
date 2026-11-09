# Tasks

## 1. Shared Storybook Catalog

- [x] 1.1 Record the existing icon-story, E2E coverage, lint, and type-check baseline; verify current Catalog membership and preserve the uncommitted add-icon-components work.
- [x] 1.2 Extract the eight-entry catalog into a story-only module with typed name/use/artwork/keyword metadata; add membership/order and synonym checks, update Catalog to consume it, and verify its existing size/theme E2E assertions still pass.
- [x] 1.3 Record the documentation-only gallery pattern, native search appearance, semantic layout roles, and non-interactive card ownership in the foundation; verify it introduces no public component, token, or package API change.

## 2. Gallery View and Focused Tests

- [x] 2.1 Implement the gallery's raw query and derived literal case-insensitive filtering with RTL tests for initial results, name/use/keyword matches, surrounding/blank whitespace, multiple results, duplicate avoidance, and special characters; observe a meaningful failing search test before implementation and verify all focused cases pass.
- [x] 2.2 Add the labeled native searchbox, always-available Clear search Button, polite result count, accessible results list, decorative artwork, and helpful empty state; verify RTL cases for singular/plural/zero feedback, typing focus, keyboard clearing, focus restoration, already-empty clearing, and absence of card actions/tab stops.
- [x] 2.3 Add scoped responsive preview styles and Corporate/Luna native control color-scheme handling using existing theme/layout foundations; document search behavior and gallery discovery in the README/test guide, then verify focused rendering, lint, and types without changing shipped styles or tokens.

## 3. Storybook and Real Browser Contract

- [x] 3.1 Wire Components/Icon/Gallery with a play journey that filters by keyword, reaches no results, clears, and restores all eight cards; verify the Storybook runner passes with accessibility violations still configured as test failures and the comparison Catalog remains unchanged.
- [x] 3.2 Add Playwright journeys using the real Gallery preview and theme toolbar for name/use/keyword searches, normalization, literal special characters, counts, empty-state recovery, keyboard focus, and clear-from-empty behavior; verify new story/helper files enter the existing complete-inventory 100% E2E coverage gate with scripts still excluded.
- [x] 3.3 Exercise 320px reflow, 200% text enlargement, and text-spacing overrides in both themes; visually inspect full/filtered/empty states and keyboard focus, check search control text/boundary contrast, and record actual results plus any unperformed assistive-technology checks.

## 4. Integrated Acceptance

- [x] 4.1 Run lint, type checking, unit, integration, accessibility-enabled Storybook tests, and sequential CI-mode E2E; verify existing independent coverage thresholds/scopes remain intact and record results and any environment blockers.
- [x] 4.2 Run library/static Storybook builds and packed-consumer bundle verification; verify Gallery is discoverable in static Storybook, no gallery/search metadata enters the library JavaScript, public exports remain unchanged, and unused icon artwork is still removable.
