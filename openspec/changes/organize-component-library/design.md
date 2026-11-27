# Design

## Context

See [the proposal](proposal.md) for motivation and [component discovery](specs/component-discovery/spec.md) for observable behavior. This design is required because relocation crosses source, declaration emission, stylesheet publication, three independent coverage inventories, and public Storybook URLs.

The package currently has flat implementation/CSS files in `src/`, named artwork in `src/icons/`, one shared accessibility hook in `src/internal/`, flat component stories in `stories/`, and central suite-first tests. Storybook 10.6 uses explicit titles, CSF stories, theme globals, and axe failures. Vitest unit/integration coverage independently includes library and build code at 100% per executable file; Playwright independently inventories library and authored Storybook runtime at the same thresholds. Browser integration and E2E prove different boundaries. The declaration build currently includes every TypeScript file under `src/`, so simply moving stories/tests there would publish development declarations.

The main spec inventory is empty. Four completed changes remain unarchived. In particular, the earlier [gallery delta](../add-searchable-icon-gallery/specs/icon-gallery/spec.md) names Components/Icon/Gallery and Catalog; the new taxonomy intentionally changes their visible breadcrumbs to Components/Visuals/Icon while preserving IDs and every gallery/catalog behavior. [Spatial guidance](../establish-spatial-system/specs/spatial-system/spec.md) retains its Design System names and links. Historical change artifacts are not rewritten or archived by this migration; future archival must reconcile the superseded gallery breadcrumb rather than reintroduce it.

## Goals / Non-Goals

**Goals:**

- Give each component family a predictable home without making sidebar categories part of its source identity.
- Make relocated tests/stories discoverable exactly once and keep development modules outside production JavaScript and declarations.
- Preserve existing runtime/type/CSS exports, theme resolution, token defaults, story IDs, verification commands, test boundaries, and coverage thresholds.
- Separate consumer examples from regression infrastructure while retaining all existing scenarios.

**Non-Goals:**

- No monorepo, component-per-package distribution, framework migration, new dependencies, public API redesign, new primitive extraction, CSS/token redesign, test deduplication, or coverage-policy relaxation.
- No speculative empty component families or product workflows. Patterns reuse existing examples through links.

## Decisions

### Approved follow-up: controlled Textarea counter

The owner approved the proposed counter-listener fix after the migration exposed a failing controlled-editing regression. Controlled counters derive their length from `value`; they must not subscribe to native input/reset observation, whose state update can restore the old controlled DOM value before the consumer's React change handler runs. Include controlled ownership in the effect dependencies so observers are cleaned up when ownership changes. Uncontrolled editing and normal/canceled reset behavior remain covered. This narrow correction is the approved exception to the migration's behavior-preserving scope; no API, styling, or token changes are introduced.

### 1. Use component-family folders, independent of navigation categories

Adopt lowercase kebab-case family directories and preserve PascalCase public component filenames. One family can contain several exports; there is no rule requiring one folder or implementation file per export.

| Current owner             | Destination family                                | Retained ownership                                |
| ------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| Button                    | `src/components/button/`                          | Button implementation and CSS                     |
| Card and its parts        | `src/components/card/`                            | All compound parts remain together in Card.tsx    |
| Checkbox                  | `src/components/checkbox/`                        | Native checked/mixed behavior and marks           |
| Field and FieldPrimitives | `src/components/field/`                           | Composed field and standalone label/message atoms |
| FormGroup                 | `src/components/form-group/`                      | Fieldset/legend composition                       |
| Icon and named artwork    | `src/components/icon/` and its `named/` directory | Wrapper plus existing eight named exports         |
| Select                    | `src/components/select/`                          | Native single-choice control                      |
| TextInput                 | `src/components/text-input/`                      | Single-line control and private adornment         |
| Textarea                  | `src/components/textarea/`                        | Multiline control and private count/reset logic   |

Example target layout:

```text
src/
+-- components/
|   +-- textarea/
|       +-- Textarea.tsx
|       +-- textarea.css
|       +-- index.ts
|       +-- __tests__/
|       |   +-- Textarea.test.tsx
|       +-- stories/
|           +-- Textarea.stories.tsx
|           +-- Textarea.examples.tsx
|           +-- textarea.stories.css
+-- internal/
|   +-- hooks/useFieldAccessibility.ts
+-- generated/tokens.css
+-- index.ts

stories/
+-- foundations/
+-- patterns/
+-- shared/
```

The example helper/CSS files are created only where existing code needs a separate home. Small story render functions can remain in the CSF module. Textarea's count logic and TextInput's adornment remain private and retain behavior. Move the already shared hook to `src/internal/hooks/`; do not promote owner-specific helpers into a global utilities folder.

Family indexes explicitly export only current public members. The root [public entrypoint](../../../src/index.ts) continues to expose the same names/types. Internal cross-family imports use the owning family directly rather than importing the root package barrel back into the implementation.

Alternative: source folders named atoms/molecules/organisms or Forms/Visuals. Rejected because classifications are debatable and can change independently of implementation ownership. Alternative: one package per component, as in Radix's larger repository. Rejected as unnecessary distribution overhead for this package.

### 2. Colocate focused units and keep integration/E2E boundaries central

Move current component unit DOM and Node SSR tests to their family's `__tests__/`. Preserve environment directives, assertions, and Node defaults. Move the explicit DOM-only setup to `tests/support/dom.ts` and update imports; Node SSR/build/token tests must not acquire browser globals. Existing jsdom integration tests retain their explicitly chosen environment and do not become claims of Chromium hydration coverage.

Keep these central boundaries:

```text
tests/
+-- support/dom.ts
+-- unit/
|   +-- build/
|   +-- tokens/
+-- integration/
|   +-- components/textarea/
|   +-- components/checkbox/
|   +-- fixtures/
|   +-- build/
|   +-- tokens/
|   +-- themes/
+-- e2e/
    +-- components/textarea/
    +-- components/icon/
    +-- themes/
    +-- storybook/
    +-- fixtures/
    +-- coverage/
```

All existing component test files map one-to-one into their family until a later authorized behavior/test-policy change. Component-specific hydration apps/entries move beside their integration family under `fixtures/`; shared browser lifecycle, temporary token-project fixture, and hydration bundler stay central. Update the bundler's default entry and caller URLs explicitly when moving the Button fixture. Keep gallery/catalog helpers and their unit tests owned by `icon/stories/` (tests in its `__tests__/`); move gallery E2E under the icon family. Keep manager navigation and spatial-system journeys in central Storybook tests, and move cross-family theme E2E into `tests/e2e/themes/`.

Unit discovery accepts both central build/token tests and family `__tests__/**/*.test.{ts,tsx,mjs}`. Integration and E2E keep their current runner/file suffix contracts and recursive discovery. Document focused family commands and keep assertion logic independent across suites.

Alternative: colocate every browser test and infrastructure file in `src/`. Rejected because shared browser lifecycles and cross-component scenarios have different ownership and would complicate distribution isolation. Alternative: retain all component unit tests centrally. Viable, but it leaves routine edits unnecessarily spread across directories.

### 3. Define development and production inventories explicitly

Update [Vitest configuration](../../../vitest.config.ts), [declaration build](../../../tsconfig.build.json), [Storybook discovery](../../../.storybook/main.ts), and [browser coverage](../../../tests/e2e/coverage/report.mjs) as one coordinated migration:

- Development type checking includes all relocated runtime, tests, stories, and helpers.
- Production declarations exclude component `__tests__/` and `stories/` subtrees. Runtime entrypoints must not import those subtrees; exclusions alone do not prevent an imported file from entering a declaration graph.
- Unit/integration production coverage excludes colocated development subtrees but continues covering every executable library and existing build-script file independently at 100% statements/branches/functions/lines.
- Browser coverage excludes test/setup/fixture files and declarations, while retaining all library files, component-local story/example/gallery runtime, root Storybook runtime helpers, and the preview decorator. Never exclude a whole component family to avoid an uncovered file.
- Storybook discovers the component-local CSF files plus foundation/pattern MDX and foundation CSF under root `stories/`, without also matching stale copies at the old paths.

Add inventory-focused tests that distinguish a representative production module, a component story/example, an unvisited runtime helper, a unit test, and a fixture. Capture a before/after module mapping so relocation cannot silently omit production or documentation runtime from a gate. Do not combine counters across suites, lower thresholds, add ignore comments, or remove scenarios to make the reorganization pass.

Adapt [stylesheet publication](../../../scripts/copy-styles.mjs) and its unit/real-filesystem tests to new source paths while preserving every destination name, file contents, and combined stylesheet order. Preview imports remain explicit with preserved effective cascade; no filesystem glob determines CSS precedence. Verify package contents, root/type/CSS consumers, deterministic SSR, and single-icon tree-shaking after relocation.

### 4. Organize Storybook by function and preserve identity explicitly

Use explicit metadata titles rather than inferring the public hierarchy from source paths. Map Button to `Components/Actions/Button`; Checkbox, Field and its standalone atoms, FormGroup, Select, TextInput, and Textarea to `Components/Forms/<PublicName>`; Card to `Components/Surfaces/Card`; Icon to `Components/Visuals/Icon`.

Pin the existing CSF metadata IDs before changing a title or file path. Preserve story export keys, existing docs routes, and the meanings of every old ID. For example:

```ts
const meta = {
  id: 'components-textarea',
  title: 'Components/Forms/Textarea',
  component: Textarea,
};
```

This preserves `components-textarea--both-themes`. New standalone atom pages receive explicit unique IDs such as `components-field-label`; the existing `components-field` entry remains the composed Field. Preserve all Icon Gallery/Catalog and Design System IDs. Snapshot the current development story index and documentation IDs before migration and compare ID-to-meaning mappings afterward; counts alone are insufficient.

Sort roots as Design System, Components, Patterns; keep Foundation, Tokens, Spatial System, Spatial Examples within Design System. Sort component categories Actions, Forms, Surfaces, Visuals, then public names alphabetically. Within a family, put docs/playground first, followed by existing applicable state, variant/size, composition, customization, and both-theme entries, then specialized examples. Use display names for presentation changes without renaming old story export keys. Do not add placeholder stories for unsupported categories or hide/remove current examples in this change.

Alternative: mirror every source directory in sidebar titles. Rejected here because a flat source family can belong to a useful consumer category without gaining a source category directory. Storybook supports explicit hierarchy and stable IDs separately.

### 5. Give public atoms their own documentation and keep compound parts together

Add small CSF/autodocs entries for FieldLabel, FieldDescription, and FieldError within the field family's stories. Each uses the atom as its documented component and includes a real, properly associated native control. Demonstrate paragraph versus inline message semantics where applicable and link to composed Field usage. Keep existing Field stories and their IDs.

Document Card parts through the Card family's `subcomponents` metadata and representative compositions. Keep named icons discoverable through the searchable gallery and catalog rather than creating eight redundant top-level pages. No new runtime exports are needed.

Move Foundation, Tokens, and Spatial System prose/examples into `stories/foundations/`, retaining their IDs and references to authoritative root `docs/`. Add `stories/patterns/Forms.mdx` with the title `Patterns/Forms`, linking to canonical `components-formgroup--composition` and native-form stories such as `components-textarea--native-form`. This is a navigation guide, not a new form implementation or copied demo. Do not create additional empty Patterns categories.

Move gallery/Card demo styles to their owning story directories. Keep generic preview layout/typography support under `stories/shared/`, with imports preserving the cascade. Scope prose styling so it cannot override component-owned label/message spacing. Avoid unrelated CSS consolidation during relocation.

### 6. Verify navigation separately from component behavior

Retain all existing component and gallery behavior checks. Add focused assertions for the new sidebar categories, new atom docs/examples, Card subcomponent documentation, Patterns/Forms links, and legacy component/doc permalinks. Existing manager tests retain real iframe/toolbar navigation rather than relying solely on an index snapshot. Validate every old story/doc ID still resolves to the same semantic example, including specialized and theme-specific examples.

New/touched examples retain axe failures, both-theme keyboard/label/message checks, and 320px/200% text/text-spacing checks. Visually compare representative pre/post family views and record screen-reader limitations honestly. A passing JavaScript coverage gate does not establish CSS equivalence or assistive-technology behavior.

### Research basis

- [Mantine Textarea ownership](https://github.com/mantinedev/mantine/tree/master/packages/@mantine/core/src/components/Textarea): implementation, local helper, tests, and stories together.
- [Carbon TextArea ownership](https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/TextArea) and [live Storybook](https://react.carbondesignsystem.com/): colocated component material and consumer-facing documentation navigation.
- [Radix source/tests](https://github.com/radix-ui/primitives/tree/main/packages/react/checkbox/src) and [separate Storybook examples](https://github.com/radix-ui/primitives/blob/main/apps/storybook/stories/checkbox.stories.tsx): useful contrast for keeping infrastructure and consumer examples outside runtime distribution.
- Storybook guidance on [hierarchy](https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy), [stable IDs](https://storybook.js.org/docs/configure/user-interface/sidebar-and-urls), and [subcomponents](https://storybook.js.org/docs/writing-stories/stories-for-multiple-components). These inform the design; their monorepo/framework/package choices are not adopted.

## Risks / Trade-offs

- Colocated stories/tests accidentally enter declarations or runtime bundles -> explicit development boundaries plus actual package-content, consumer, and bundle assertions.
- A smaller coverage inventory looks green after a move -> compare mapped module inventories, test classification filters, and retain independent per-file thresholds and complete browser inventory.
- Changed titles break bookmarks or reuse an ID for different content -> pin IDs before moves, preserve export keys, and test both index identity and real legacy URLs.
- Moving CSS changes cascade or demo prose overrides control spacing -> preserve CSS contents/order, scope owner styles, and compare computed styles and representative visual baselines.
- Test-relative imports and hydration entry URLs break -> update them by family in the pilot and exercise SSR/hydration and filesystem fixtures before expanding.
- Development tests initially run from two locations -> use narrow discovery globs and compare discovered test identities so duplicates and omissions fail review.
- New independent atom pages add examples/coverage work -> keep them minimal, accessible, and focused on the public contract rather than copying Field's entire state matrix.
- Older unarchived deltas retain the former gallery breadcrumb -> record this intentional supersession here; reconcile when those changes are later archived, without archiving or rewriting them in this change.
- A large existing uncommitted working tree contains completed component work -> record the initial state and preserve all unrelated changes; rollback must not discard them.

## Migration Plan

1. Capture passing verification results, component/style exports, story/docs ID mappings, runtime coverage inventories, and representative visual baselines from the current working tree. Record pre-existing edits.
2. Pilot Textarea: pin its ID, relocate its implementation/CSS/unit tests/stories, and adapt discovery/exclusion/style-copy rules to support old and new locations without duplicate discovery. Verify the pilot's native editing/count/reset/ref behavior, public imports, distribution boundary, and legacy URLs.
3. Relocate remaining families in cohesive batches: field/form-group; input/select/checkbox; button/card; icon/artwork/gallery. Keep assertions and APIs unchanged. Move shared hook and scoped test support, then align central integration/E2E families and fixtures.
4. Move foundation/shared documentation support and owner-specific story styles. Remove superseded source copies only after every reference/discovery path has moved. Keep all legacy IDs intact.
5. Apply functional titles/order, add the standalone atom docs/Card subcomponent metadata and Patterns/Forms guide, and update navigation tests and links. This phase changes visible navigation after physical relocation is verified.
6. Update contributor/test documentation and focused commands. Run all existing verification commands, distribution/consumer checks, full independent coverage gates, axe, and manual theme/reflow/visual checks. Run token generation/build mutations before served browser suites to avoid preview reload races. Verify baseline ID/export/inventory mappings and review the final package contents.

Rollback reverses only this migration's moves, path/config updates, added documentation/navigation checks, and sidebar metadata; it preserves pre-existing feature edits and token sources. There is no data migration or runtime API rollback. Revert navigation changes independently from physical moves if only sidebar compatibility fails.
