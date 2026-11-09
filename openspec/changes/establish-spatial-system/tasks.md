# Tasks

## 1. Spatial Baseline and Guide

- [x] 1.1 Record the existing lint/type/token checks and resolved spatial values; capture representative Button, Icon, and gallery geometry/screenshots at desktop and 320px in both themes, verifying default and documented override baselines are available for comparison.
- [x] 1.2 Author docs/spatial-system.md with the selected scale, research links, four spatial categories, ownership, precision exceptions, six shared role purposes, and the classified audit table for all current spatial semantic tokens; verify every current role is accounted for and existing 10px padding and geometry exceptions are distinguished from normal spacing.

## 2. Additive Token Contract

- [x] 2.1 Add focused failing unit and real-generation integration tests for the six shared consumer roles, four independent gallery roles, preserved legacy values, source-leaf coexistence, and equal spacing across themes; verify meaningful missing-contract failures before editing sources.
- [x] 2.2 Add missing raw 2/48/64/80/96px dimensions and the ten semantic roles in both DTCG sources; use sibling stack-group/inset-container source keys, regenerate CSS/reference, and verify the focused tests pass with existing leaves intact and all semantics referencing primitives directly.
- [x] 2.3 Update the token-reference generator to link to the authored spatial guide and document intended role selection; verify focused unit/integration reference-output tests, repeat generation with identical output, and confirm existing type/reference/cycle rejection tests still pass.

## 3. Gallery Coupling Corrections

- [x] 3.1 Add browser regression cases showing that search padding changes with controlHeight, heading gap changes with general insets, and preview padding changes with borderWidth; observe meaningful failures against the new independence expectations before updating CSS.
- [x] 3.2 Map search inline/block padding, heading gap, and preview-group inset to their independent semantic roles; update the preview inner-height formula for actual border/inset allowances, then verify default geometry matches baseline and targeted override tests pass in both themes.
- [x] 3.3 Complete the guide's old-to-new migration table and compatibility notes; verify every removed incidental coupling is explicit, every existing public name/default is retained, and original gallery search/clear/size/theme browser journeys still pass.

## 4. Storybook Spatial Guidance and Examples

- [x] 4.1 Add Design System/Spatial System MDX, Foundation/README/reference links, and sidebar ordering; verify the guide uses the authored Markdown and browser navigation reaches the guide and token reference with no broken Storybook routes.
- [x] 4.2 Add Design System/Spatial Examples for the visual scale, parent-owned composition, scoped/nested themes, and responsive sections, with a labeled native spacing select and a play journey restoring its initial state; verify computed spacing and accessibility-enabled Storybook checks for both themes.
- [x] 4.3 Add browser checks for the select's keyboard behavior/focus, scoped and nested resets, unchanged theme spacing, and the example-specific 600px section-gap override; verify 64px desktop and 32px narrow values without a viewport-dependent React render.
- [x] 4.4 Exercise new examples and touched gallery layouts at 320px with 200% text and all four text-spacing overrides in both themes; inspect screenshots/focus/target clearance, verify no clipping or horizontal page overflow, and record performed and unperformed manual checks in docs/verification.md.

## 5. Integrated Acceptance

- [x] 5.1 Run lint, strict type checking, unit, integration, accessibility-enabled Storybook, and sequential CI-mode E2E commands; verify existing independent per-file 100% coverage gates/scopes remain intact, including new story modules and any changed generator branches, and record command results or concrete blockers.
- [x] 5.2 Build the library and static Storybook, exercise guide/example navigation in the served static output, and run packed-consumer verification; confirm stylesheet exports contain the additive spatial contract, React exports/SSR remain compatible, unused icons remain removable, and document that full framework builds were not added.

## Workflow follow-up

- Review and archive the completed change through the OpenSpec archive workflow when requested; implementation does not automatically archive or publish it.
