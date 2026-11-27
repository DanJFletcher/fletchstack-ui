# Design

## Context

See [the proposal](proposal.md#why) for motivation and [the rendering](specs/icon-rendering/spec.md) and [catalog](specs/named-icons/spec.md) contracts for behavior. The library currently exports only Button. Its stories define a private 20px filled MoonIcon, whereas the proposed catalog uses consistent outline artwork. The replacement therefore intentionally changes that illustration while preserving the control's names and behavior.

The existing foundation supports two DTCG token layers and complete semantic contracts per theme. Icon has no recorded sizing or artwork pattern yet, so this design proposes the foundation addition before authoring components. Library JavaScript is a single Vite ESM entry with React externalized; declarations are emitted separately with isolated declarations enabled. Styles are explicitly published by a copy script, and CSS is retained through package sideEffects metadata. Unit/integration coverage includes source and build scripts; E2E inventories component/Storybook browser modules only.

## Goals / Non-Goals

**Goals:** Keep arbitrary consumer artwork and named artwork on one rendering contract; keep naming predictable; preserve native SVG access and server rendering; prove catalog opt-in behavior through a packed consumer.

**Non-Goals:** SVG-string ingestion or sanitization, icon fetching, a dynamic name registry, third-party collections, automatic RTL mirroring, animation, new interactive controls, or changes to Button's props. Consumer-provided SVG is trusted React children, not markup injected with dangerouslySetInnerHTML.

## Decisions

### 1. One SVG foundation and thin named components

Add Icon with React SVG children, a default `viewBox="0 0 24 24"`, an overridable viewBox for custom artwork, `size` (small/medium/large, medium default), optional `label`, className, semantic-token-capable style, compatible SVG attributes, and a forwarded SVGSVGElement ref. Match Button's React 18-compatible forwardRef and explicit declaration typing. Export IconProps, IconSize, and IconStyle.

Icon supplies the SVG root; consumers supply SVG children such as path, circle, or group elements rather than nesting another SVG. Default paint is `fill="none"` and stroke currentColor. Custom artwork can explicitly supply fill/stroke attributes. CSS owns dimensions through semantic tokens; width/height are excluded from the public props to avoid competing size authorities. Native role, naming attributes, focusable, and tabIndex are also owned by the accessibility contract rather than independently customizable props.

Each named icon lives in its own source module, delegates to Icon, forwards its SVG ref, and fixes its own children/viewBox. Export shared NamedIconProps omitting those two artwork inputs. Avoid a generalized icon factory or registry for eight static components: thin wrappers keep artwork ownership and tree-shaking review straightforward.

Alternative: accepting a rendered SVG element or an `as` component requires cloning elements or coordinating two wrappers. Direct SVG children keep prop/ref/style ownership clear. A runtime name prop would couple the whole collection to every caller.

### 2. Accessibility derives from one label input

Trim `label`. Omitted, empty, or whitespace-only labels produce decorative `aria-hidden="true"` output. A nonblank label produces `role="img"` and `aria-label` with that trimmed value; aria-hidden is absent. Always set `focusable="false"` and do not add tabIndex. Strip reserved focus and naming props from incoming runtime attributes before spreading the remainder, then apply owned attributes last so JavaScript consumers cannot override the contract through a spread.

Use aria-label directly rather than title/aria-labelledby wiring, avoiding instance ID generation and cross-instance collisions. Custom artwork must not include focusable descendants or conflicting title-based naming; document these composition constraints. Icon-only Button examples label the Button and leave Icon decorative. Labeled images do not imply a click target, keyboard behavior, or their own hover/disabled state.

Alternative: a mandatory decorative flag on every usage is noisy for the common label-plus-icon composition. Decorative default with explicit labeling matches the existing Button guidance.

### 3. Extend the two-layer token contract and foundation

Proposed initial roles, identical in Corporate and Luna:

| Semantic path    | CSS property           | Initial value | Type      |
| ---------------- | ---------------------- | ------------- | --------- |
| icon.size.small  | --fs-icon-size-small   | 16px          | dimension |
| icon.size.medium | --fs-icon-size-medium  | 20px          | dimension |
| icon.size.large  | --fs-icon-size-large   | 24px          | dimension |
| icon.strokeWidth | --fs-icon-stroke-width | 2             | number    |

Reference existing primitives when suitable and add missing raw values in primitives.json. The sizes match a compact icon rhythm and preserve the old moon's 20px default. Stroke width is unitless in SVG coordinate space; it is not a CSS spacing token. The 24×24 viewBox and round caps/joins describe the artwork convention, not a third token layer. Use ordinary scaling strokes, so 2 user units scale with icon size rather than vector-effect non-scaling-stroke.

Color comes from currentColor, which already resolves through semantic foreground/control tokens in both themes. Do not add a duplicate palette or icon variants. The SVG has zero margin and does not impose parent gaps; Button retains its existing gap and wrapping behavior. Record these decisions in the foundation and regenerate CSS/token reference using the existing generator. Complete explicit theme scopes reset overrides as they do for Button.

Fixed spatial sizes remain px under repository guidance. Text enlargement does not itself resize a fixed icon; verify label wrapping and clipping rather than claiming the icon doubles with text. Consumers can customize semantic dimensions in a scope or on the SVG.

### 4. Explicit exports with evidence of unused-code removal

Export Icon and the eight named components/types from the existing root entry. Start with root named imports; do not introduce a new runtime dependency or require catalog-wide imports. Preserve the existing React peer range and externalization. Ensure forwardRef declarations are tree-shakable, using a narrowly placed pure annotation when needed and verified safe. Do not add package-wide JavaScript side-effect exemptions that could alter unrelated behavior.

Extend the packed-consumer fixture to bundle a MoonIcon-only entry and a Button-only entry in addition to type/SSR checks. Assert the former retains moon artwork but excludes unique geometry from the seven unused icons; assert the latter retains no catalog geometry. Use fixtures whose geometry markers survive minification, with a positive control that importing an additional icon retains its artwork. Export-name checks alone are insufficient because minifiers remove names. If the current Vite output retains unused initialization, correct the build/purity boundary and rerun this evidence before accepting the contract.

Add `icon.css` to the copy script, publish `fletchstack-ui/icon.css`, and include it in `styles.css`. Retain `**/*.css` side effects and document `tokens.css` plus `icon.css` for selective imports. Update copy-script unit/integration expectations to reflect the new required stylesheet; do not drop script coverage to accommodate the change.

### 5. Ground verification in custom artwork and real composition

Create Icon stories for custom paths/groups and viewBox, three sizes, default and blank-label decoration, named image semantics, the complete catalog, ref/native/customization forwarding, two themes together, nested scopes/overrides, and Button composition. Keep assertions and consumer inputs visible. Include a custom filled SVG example to prove consumers can opt out of the outline paint default. Replace the private MoonIcon in Button stories and import icon.css into the preview.

Extend RTL unit tests and Node SSR tests for Icon and every named wrapper. Integration tests independently render the same source to exercise covered logic, then verify real CSS dimensions, color inheritance, scopes, hydration, and button keyboard behavior in Chromium. Extend Playwright journeys through the actual Storybook UI. Generalize the existing Button-prefixed preview adapter to accept complete story IDs and update its callers; retain the successful storyFinished readiness check and automatic browser coverage fixture.

Keep unit, integration, and E2E at independent 100% per-file statements/branches/functions/lines over their existing respective scopes. New source modules and authored stories must enter those inventories automatically. Storybook axe checks continue to fail on violations. Record actual screen-reader/visual review evidence, or explicitly state unperformed checks; do not present execution coverage as accessibility certification.

## Risks / Trade-offs

- Unused forwardRef initialization retains catalog artwork → verify actual packed production bundles, not only source-module structure.
- Custom SVG contains hard-coded paint, fixed IDs, or interactive descendants → document trusted composition boundaries and demonstrate inherited/explicit paint; consumers own unique identifiers in their artwork.
- Label props and SVG attributes conflict → reserve owned attributes in public types and set them last at runtime; add typing and JavaScript-spread checks.
- Fixed px icons beside enlarged text differ in scale → preserve label reflow, avoid text clipping, and expose semantic size overrides.
- New stroke-style moon changes the existing illustration → document the intentional artwork change and visually review both theme compositions.
- Existing local agent-guides-installer tarball dependency blocks clean CI installation → report this existing setup issue if still present; changing that dependency is outside this icon change.

## Migration Plan

1. Record current checks, then add the foundation/token roles and generated outputs.
2. Introduce Icon and the catalog with public exports/styles, then migrate only the private story illustration.
3. Extend independent tests, Storybook, package fixtures, and framework import examples; run all required gates and inspect actual bundle contents.
4. Publish the additive exports in a normal library release. Rollback removes only icon exports, styles, token additions, and migrated examples; existing Button consumers retain their API and CSS imports.

No production code is changed by this proposal. Proposed token defaults and API refinements are reviewable decisions for the implementation change, not claims about existing behavior.
