# Tasks

## 1. Establish migration contracts

- [x] 1.1 Record the initial working-tree changes, passing verification results, public runtime/type exports, CSS entrypoints and concatenation order, and representative Corporate/Luna screenshots in migration evidence; verify the record distinguishes existing feature edits from this change.
- [x] 1.2 Capture the current Storybook index as an ID-to-example/docs mapping and the unit, integration, and browser runtime coverage inventories; add compatibility assertions that detect removed or reassigned IDs and omitted mapped modules, verified against the unchanged baseline.
- [x] 1.3 Create contributor guidance describing the approved family ownership, central browser-suite boundaries, explicit production/development inventories, and stable Storybook identity policy; verify its paths and commands against the current configuration and the planned destination map.

## 2. Prove the layout with Textarea

- [x] 2.1 Add configuration/inventory tests for production modules, colocated tests, stories/examples, fixtures, and an unvisited runtime helper; update unit discovery, coverage exclusions, Storybook discovery, and declaration exclusions to support the mixed migration state, verified by classification assertions and exactly-once discovery.
- [x] 2.2 Move the explicit DOM test setup to `tests/support/dom.ts` and update its callers without globally enabling a DOM environment; verify DOM tests and existing Node SSR/build/token tests retain their intended environments, and document the setup boundary.
- [x] 2.3 Pin Textarea's existing metadata ID and relocate its implementation, CSS, unit tests, and stories into `src/components/textarea/`; update direct imports and root exports while retaining story export keys, verified by focused editing, counter, reset, ref, and SSR tests plus legacy story URLs.
- [x] 2.4 Adapt stylesheet publication and its unit/filesystem tests for the Textarea destination while preserving published names, contents, and concatenation order; verify standalone and combined CSS consumers and document the family's focused commands.
- [x] 2.5 Add package-content/declaration assertions excluding development modules and verify the pilot through type checking, package build, existing consumer fixtures, focused integration/E2E checks, and the baseline ID/inventory mapping before migrating other families.

## 3. Relocate form families and their verification

- [x] 3.1 Move Field and its public primitives, FormGroup, and their CSS/unit tests/stories into their owning families; move the shared accessibility hook to `src/internal/hooks/`, verified by existing association, error, disabled, ref, and SSR assertions with unchanged public exports.
- [x] 3.2 Move TextInput, Select, and Checkbox with their CSS/unit tests/stories into their families, retaining private helpers and story identities; verify each family's existing native behavior, keyboard, form, theme, and SSR checks and stylesheet publication tests.
- [x] 3.3 Organize form-specific integration/E2E tests under their central component-family directories and move component hydration fixtures beside their integration owners; update entry URLs/imports, verified by real-browser hydration and existing suite assertions without removing or combining scenarios.
- [x] 3.4 Update contributor/test documentation and story-support imports for the relocated forms; verify focused commands discover each test once, all old form story/docs IDs resolve, and Corporate/Luna styles preserve the baseline cascade.

## 4. Finish family ownership and shared documentation layout

- [x] 4.1 Relocate Button and Card implementation, CSS, unit tests, and stories with pinned IDs, retaining all compound Card parts; move their integration/E2E ownership and Button hydration fixtures, verified by focused suites, updated shared bundler defaults/caller URLs, and CSS publication tests.
- [x] 4.2 Relocate Icon and named artwork into the icon family and place gallery/catalog runtime, styles, and helper unit tests under its stories ownership; move gallery E2E to its central family directory, verified by search/clear/settings/catalog checks, SSR, and single-icon bundle isolation.
- [x] 4.3 Move Foundation, Tokens, and Spatial prose/examples to `stories/foundations/`, generic preview support to `stories/shared/`, and owner-specific demo CSS beside its stories; preserve explicit CSS import order and Design System IDs, verified by navigation, spatial, and computed-style/visual comparisons.
- [x] 4.4 Move cross-family theme E2E to `tests/e2e/themes/` and retain manager/spatial journeys centrally; update test/contributor guides and remove superseded copies only after reference and discovery checks pass, verified by exactly-once test discovery and the complete module/ID mapping.

## 5. Deliver consumer-facing Storybook organization

- [x] 5.1 Apply explicit Actions, Forms, Surfaces, and Visuals titles with the agreed root/category/example ordering while retaining old metadata IDs and export keys; add index and real-manager navigation checks for category placement and legacy story/docs URLs, verified through the actual preview iframe and toolbar.
- [x] 5.2 Add FieldLabel, FieldDescription, and FieldError CSF/autodocs pages with unique IDs, real associated controls, applicable inline/paragraph examples, and links to Field; verify public props, label/message semantics, keyboard focus, axe, both themes, and narrow/enlarged layouts in their own story/browser checks.
- [x] 5.3 Add Card subcomponent metadata and accessible composition guidance within its family; verify every existing public part is discoverable with its props and that existing Card composition stories and IDs still work.
- [x] 5.4 Add `stories/patterns/Forms.mdx` linking the canonical FormGroup composition and Textarea native-form stories, and update navigation/contributor documentation; add checks that links open those existing runnable examples and no copied workflow or empty category is introduced.

## 6. Complete integration verification

- [x] 6.1 Compare final discovered tests, story/docs ID-to-meaning mappings, production/documentation runtime inventories, exports, and stylesheet contents/order with the baseline; verify every relocation is accounted for and no duplicate discovery or development module enters the package.
- [ ] 6.2 Run the existing lint, type, package/Storybook build, unit, integration, Storybook accessibility, and E2E commands; verify independent unit/integration/browser 100% per-file gates remain intact, completing token/build mutations before served browser suites.
- [x] 6.3 Verify packed-package consumers, runtime/type/CSS entrypoints, deterministic SSR, hydration, and single-icon tree-shaking; inspect actual published JavaScript/declarations and confirm the existing consumer fixtures pass without new runtime dependencies.
- [x] 6.4 Compare representative views in both themes and check touched examples at 320px, 200% text, prescribed text spacing, and keyboard navigation; record observed results and any unperformed screen-reader checks, then review the diff for scope and preservation of pre-existing edits.
