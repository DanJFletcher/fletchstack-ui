# Design

## Context

See [the proposal](proposal.md) and [spatial contract](specs/spatial-system/spec.md). The inspected implementation already uses a 4px rhythm, direct primitive aliases, generated per-theme literal CSS values, and separate parent/component spacing ownership. Both theme contracts have 90 semantic properties; Button radius is their only differing non-typographic dimension. Shared space.inline/stack/inset are 12/24/24px. Button block padding includes 10px, which is valid precision work rather than a reason to redesign it.

The raw dimension pool contains spacing alongside borders, radii, control minima, and layout constraints. Gallery search horizontal padding currently uses controlHeight; heading separation subtracts compactInset from inset; preview-group padding uses borderWidth. These are concrete cases where unrelated overrides interact. Gallery's grid-column calculation, by contrast, correctly derives column width from available space and the actual gap.

The compiler rejects semantic-to-semantic aliases and non-px spatial dimensions, checks cross-theme contract parity, and generates docs/tokens.md. Foundation and Tokens MDX pages already import Markdown; the new guide can use the same pattern. Existing unit and integration coverage include source/build scripts, while E2E inventories component and Storybook JavaScript/TypeScript. No accepted capability specs exist; the completed Icon/gallery changes remain unarchived.

## Goals / Non-Goals

**Goals:** Make spacing choices teachable, expose a small intent-based consumer vocabulary, separate actual semantic coupling problems, and retain current default geometry and React/package APIs. Include design because this crosses token sources, generator documentation, preview styles, and compatibility tests.

**Non-Goals:** A visual redesign, wholesale public-token renaming, automatic enforcement that every dimension is a multiple of four, Stack/Grid React exports, a third token layer, runtime token resolution, a universal website grid, density modes, a responsive breakpoint API, or a new design-tool exchange workflow.

## Decisions

### 1. Adapt Carbon's graduated scale to the existing px contract

Preferred space values are 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, and 96px. Small steps serve component detail; larger jumps distinguish groups and website sections. Retain 2px precision where a recorded need justifies it, including existing 10px Button block padding. A 1px technical edge inset is boundary compensation, not a normal gap. Do not round existing values to the preferred scale.

Carbon's component/parent ownership aligns with the current library. Atlassian's 8px base with fractional steps is viable but its percentage naming would add a convention without solving our semantic gaps. Spectrum's distinction between component and layout spacing is useful; separate scaling engines are premature. Preserve fletchstack-ui's px spatial values rather than adopting these systems' rem output wholesale. No rigid typography baseline grid is introduced.

Research consulted during exploration:
- [Carbon spacing](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview)
- [Atlassian spacing](https://atlassian.design/foundations/spacing)
- [Spectrum spacing](https://spectrum.adobe.com/page/spacing/)
- [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [WCAG text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html)

### 2. Classify purpose without renaming all primitives

Document four concerns: spacing (gaps/insets), sizing (icons/control minima), shape/boundaries (radii/borders/focus), and layout (widths/columns/sections). Grouping within primitives/semantics does not create more conceptual layers. Keep current pxN raw values and reuse them; add missing raw 2/48/64/80/96px dimensions for the documented scale/precision. A raw value can legitimately support unrelated semantic roles. Do not introduce duplicate primitive groups or rename existing palette/font dimensions just to make the JSON look organized.

Publish an audit table for every existing spatial semantic role: category, value, intended use, consumers, coupling assessment, and action (retain, clarify, or additive replacement). This is documentation of observed mappings, not a generic discovery task. Keep 36/44/52px target minima and 140/200px gallery constraints outside the preferred spacing scale even when divisible by four. Shapes can differ by theme while default spacing remains equal.

### 3. Add only six shared spacing roles initially

| Semantic path | Public CSS property | Initial value | Intended use |
| --- | --- | --- | --- |
| space.gap.label | --fs-space-gap-label | 8px | Closely associated label/control content |
| space.gap.actions | --fs-space-gap-actions | 12px | Sibling actions in a wrapping parent |
| space.gap.related | --fs-space-gap-related | 16px | Related siblings needing more separation |
| space.stack-group | --fs-space-stack-group | 24px | Separation between related content groups |
| space.inset-container | --fs-space-inset-container | 24px | Default content-container padding |
| layout.section.gap | --fs-layout-section-gap | 64px | Separation between major website sections |

Every role references its raw primitive directly in both themes. Do not make component roles alias these semantic roles; component semantics remain peers with independent intent. Existing space.stack and space.inset are token leaves, so use sibling keys `stack-group` and `inset-container` under space rather than inserting children inside those leaves. The resulting public CSS names remain --fs-space-stack-group and --fs-space-inset-container. Tests must verify that neither legacy leaf nor new role is lost by flattening. This is a source-path compatibility constraint, not a third layer.

Use literal expected public names/values in tests. Keep existing inline/stack/inset as supported legacy vocabulary, not removed/deprecated automatically. Their custom overrides continue controlling their documented consumers. New roles do not silently replace all old roles; no aliases between semantics are introduced. Density remains independent of theme and is deferred.

### 4. Correct three observed gallery couplings with additive roles

| New semantic role | Default | Replacement |
| --- | --- | --- |
| gallery.search.paddingInline | 36px | Search padding-inline borrowing controlHeight |
| gallery.search.paddingBlock | 8px | Explicit independent search block padding |
| gallery.headingGap | 16px | Heading separation calculated as inset minus compactInset |
| gallery.previewInset | 1px | Preview-group padding borrowing borderWidth |

Retain the rest of the gallery contract and existing controlHeight, borderWidth, inset and compactInset names/defaults. The new padding roles preserve the existing box geometry but intentionally stop height overrides from changing padding. Likewise, border/inset overrides cease affecting the unrelated values in this table. The migration guide must name these behavior corrections; do not claim every incidental old coupling is preserved. The 1px role documents edge compensation. Derived sizing that actually depends on border-box geometry, such as inner target height minus border and inset allowances, can stay calculated with rationale. For the preview group, replace the old controlHeight - 4*borderWidth relationship with controlHeight - 2*borderWidth - 2*previewInset, so minimum sizing follows the actual border box after decoupling padding.

This narrow audit avoids adding one token per declaration or moving styles into a new runtime abstraction. Further independent roles require a demonstrated consumer need and are outside this initial correction.

### 5. Make documentation usable through Storybook

Create docs/spatial-system.md for rationale, sources, role-selection tables, classified exceptions, parent/component ownership, override behavior, and migration notes. Add stories/SpatialSystem.mdx at Design System/Spatial System using the existing Markdown import pattern. Link from Foundation, README, and the generated token reference; change the token generator's reference template rather than hand-editing its output. Keep relative links in Markdown and working Storybook routes for preview navigation.

Add stories/SpatialSystem.stories.tsx at Design System/Spatial Examples, with runnable scale, composition, scoped override/nested theme, and responsive section examples. The MDX guide can embed or link these stories. A small native select for action spacing offers the named label/actions/related roles; native controls stay labeled and use the approved gallery documentation-control styling or a documented equivalent without new input API. A play journey changes spacing and restores its initial state. Parent wrappers use gap/padding, never external margins owned by Button/Icon. No new shipped layout component is needed.

The responsive section example uses a local CSS media query at max-width:600px to override --fs-layout-section-gap to 32px; its normal default is 64px. Document this as example-specific, not a library breakpoint API. Initial HTML remains deterministic, and scoped values reset at nested explicit themes. Show intentional full-bleed/negative-margin use separately from normal gaps rather than adding a general negative spacing scale.

### 6. Verify contracts and visible equivalence at their boundaries

Before migration capture resolved values and representative Button/Icon/gallery boxes at fixed desktop and 320px viewports in both themes, including ordinary and existing documented overrides. Validate exact computed default dimensions/positions after migration; use screenshots for human inspection, not approval by automatic rebaselining. Explicitly test the corrected override behavior for height, border padding, and heading gap.

Unit token tests check the six new consumer roles, four gallery roles, all preserved legacy names/values, and cross-theme spacing equality. Integration tests run real generation in temporary token projects, validate CSS/reference output and nested scopes through browser composition where appropriate. Existing compiler tests cover invalid types/references/cycles; add targeted cases only when changing their behavior. Generator changes and new Storybook modules must retain independent coverage gates without exclusions.

E2E checks actual sidebar discovery and links, computed gaps/padding, select operation and visible focus, sibling/nested scopes, both themes, 600px example behavior, and 320px/200%-text/text-spacing resilience. Storybook axe checks remain failures. Maintain AA target-size constraints (24px minimum subject to WCAG exceptions); 44px is a stronger target, not a blanket AA minimum. Record real screen-reader/cross-browser checks as performed or unperformed. Run existing package verification for exports/CSS/React 18/19 SSR and unused-icon removal; no full Gatsby/Astro project is required for a token/documentation change.

## Risks / Trade-offs

- Semantic vocabulary grows too quickly -> six shared roles and four concrete gallery corrections; require purpose and usage for each.
- Existing consumers rely on accidental coupling -> retain names/defaults, demonstrate the correction, and publish explicit old-to-new migration guidance.
- A new nested role is placed beneath an existing DTCG token leaf -> use sibling source keys stack-group and inset-container; test flattening and generated names.
- Strict spacing enforcement breaks valid geometry -> separate classifications, keep precision exceptions, and do not add a blanket modulo-four validator.
- Fixed px gaps are mistaken for fixed layouts -> typography remains rem, text controls use minima, and examples wrap/reflow with user settings.
- Duplicate docs drift -> one authored Markdown guide, generated token reference, and tested Storybook links.
- Broader layout/density requirements emerge -> document deferred boundaries rather than committing to unsupported public APIs.

## Migration Plan

1. Record the current token/visual baseline and spatial-role audit; establish focused failing tests for new contract and corrected coupling.
2. Add missing primitives, ten semantic roles, and focused gallery mappings while preserving defaults; regenerate CSS/reference.
3. Publish the guide and interactive examples; update navigation, migration documentation, and targeted tests.
4. Run independent gates and builds/package checks sequentially around E2E; record visual/manual evidence and limits.
5. Roll back by reverting the additive source roles, mapped gallery declarations, generated outputs, and docs/examples together. Preserve unrelated Icon/gallery work. No React API or consumer data migration occurs.
