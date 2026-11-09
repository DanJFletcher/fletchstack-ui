# Spatial system

Use space to communicate relationships: related things sit closer together; groups and page sections receive progressively more separation. This Carbon-inspired system extends the foundation's 4px working rhythm to components and Gatsby/Astro page composition. Corporate and Luna share spacing defaults; visual theme does not select density.

## Preferred scale

**0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px**

Use 4–12px for close relationships and compact details, 16–24px for related content and container interiors, and 32–96px for progressively larger groups and website sections. These are selection ranges, not automatic assignments: a label and its field belong closer together than independent sections. A large gap does not compensate for missing headings or confusing grouping.

A 4px working rhythm is not a universal geometric grid. Document a 2px precision adjustment when needed; the existing medium Button's 10px block padding is intentional. Do not round it to 8 or 12 merely to satisfy the preferred scale. Borders/focus rings and technical 1px edge compensation have separate purposes. Do not add a generic negative spacing scale: full bleed is a deliberate parent-layout exception, explained below.

## Four spatial concerns

| Concern | What it controls | Examples |
| --- | --- | --- |
| Spacing | Gaps, padding, separation | Label gap, sibling actions, card inset |
| Sizing | Artwork and minimum targets | 16/20/24px icons; 36/44/52px Button minima |
| Shape and boundaries | Radii, borders, focus geometry | 4/12px theme radii; 1px border; 3px focus ring/offset |
| Layout | Available width and page structure | 200px preferred gallery columns, section separation |

A 6px radius, 3px focus ring, 140px card minimum, and 200px column constraint are not general-purpose spacing steps. Content-bearing heights are minima and grow with text. Fixed spatial values use px; tokenized typography uses rem and appropriate unitless line height. Layouts wrap and respond to available width instead of forcing text onto a fixed grid.

## Choose semantic roles

| Public property | Default | Choose it for |
| --- | --- | --- |
| `--fs-space-gap-label` | 8px | Closely associated label/control content |
| `--fs-space-gap-actions` | 12px | Sibling actions in a wrapping parent |
| `--fs-space-gap-related` | 16px | Related siblings needing more separation |
| `--fs-space-stack-group` | 24px | Separation between related content groups |
| `--fs-space-inset-container` | 24px | A content container's interior |
| `--fs-layout-section-gap` | 64px | Major website sections |

These are initial defaults, not mandates to replace all existing component roles. Button owns its padding and label/icon gap; Icon owns its artwork size. The parent owns placement, margins, sibling gaps, and container insets. Use ordinary flex/grid wrappers; no Stack/Grid React component is required.

```css
.settings-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--fs-space-gap-actions);
}
.settings-panel { padding: var(--fs-space-inset-container); }
.settings-groups { display: grid; gap: var(--fs-space-stack-group); }
```

Exactly two conceptual token layers remain: primitives contain raw values; shared and component-specific semantic roles reference those primitives directly. A component role and a shared layout role can currently resolve to the same raw value without being aliases of each other. Consumers use semantic CSS properties; raw scale measurements in Storybook's chart are explanatory data, not a public primitive CSS API.

## Overrides, themes, and responsive space

Override the role that owns the decision. A scoped action-gap override changes sibling placement without changing Button padding:

```css
.roomy-actions { --fs-space-gap-actions: 32px; }
```

The override inherits inside that container. A nested explicit `data-theme="corporate"` or `data-theme="luna"` redeclares the complete contract, restoring that theme's default spacing. Sibling containers remain independent. Both themes start with the same spacing; compact/comfortable density modes are not introduced here.

```html
<div class="roomy-actions">
  <!-- Parent action gaps resolve to 32px. -->
  <section data-theme="luna">
    <!-- Explicit nested theme resets action gaps to 12px. -->
  </section>
</div>
```

Responsive space is a scoped CSS decision. The example below uses 64px section separation normally and 32px at or below 600px. This breakpoint belongs to the example, not a public library breakpoint API. CSS supplies the initial presentation during SSR; no window check or client theme/layout script is required.

```css
.page-sections { display: grid; gap: var(--fs-layout-section-gap); }
@media (max-width: 600px) {
  .page-sections { --fs-layout-section-gap: 32px; }
}
```

For intentional full bleed, the enclosing layout owns the exception: a child may use `margin-inline: calc(-1 * var(--fs-space-inset-container))` only when it is actually canceling that parent's matching inset. Check page overflow and focus clearance. This relationship is geometric compensation, not a general sibling-spacing pattern.

## Current spatial-role audit

The following audit covers every pre-existing non-typographic spatial dimension in both themes. The compiler's icon stroke number is included separately because it uses SVG user units. Values that match today do not imply interchangeable roles. Preserve supported legacy names and defaults; additive roles improve new composition without silently rewiring old consumers.

| Existing semantic path | Category | Corporate / Luna value | Intended use | Consumer | Audit action |
| --- | --- | --- | --- | --- | --- |
| `space.inline` | Spacing | 12px | inline spacing for consumer layouts. | Parent wrappers | Retain |
| `space.stack` | Spacing | 24px | stack spacing for consumer layouts. | Parent wrappers | Retain |
| `space.inset` | Spacing | 24px | inset spacing for consumer layouts. | Parent wrappers | Retain |
| `button.radius` | Shape/boundary | 4px / 12px | Control corner radius. | Button CSS | Retain |
| `button.borderWidth` | Shape/boundary | 1px | Control border thickness. | Button CSS | Retain |
| `button.gap` | Spacing | 8px | Gap between label and decorative icon. | Button CSS | Retain |
| `button.focus.width` | Shape/boundary | 3px | Focus ring thickness. | Button CSS | Retain |
| `button.focus.offset` | Shape/boundary | 3px | Space between control and focus ring. | Button CSS | Retain |
| `button.size.small.block` | Spacing | 8px | small vertical padding. | Button CSS | Retain |
| `button.size.small.inline` | Spacing | 12px | small horizontal padding. | Button CSS | Retain |
| `button.size.small.minimum` | Sizing | 36px | small minimum target width and height. | Button CSS | Retain |
| `button.size.medium.block` | Spacing | 10px | medium vertical padding. | Button CSS | Retain |
| `button.size.medium.inline` | Spacing | 16px | medium horizontal padding. | Button CSS | Retain |
| `button.size.medium.minimum` | Sizing | 44px | medium minimum target width and height. | Button CSS | Retain |
| `button.size.large.block` | Spacing | 12px | large vertical padding. | Button CSS | Retain |
| `button.size.large.inline` | Spacing | 20px | large horizontal padding. | Button CSS | Retain |
| `button.size.large.minimum` | Sizing | 52px | large minimum target width and height. | Button CSS | Retain |
| `icon.size.small` | Sizing | 16px | Small icon width and height in CSS pixels. | Icon CSS/artwork | Retain |
| `icon.size.medium` | Sizing | 20px | Medium icon width and height in CSS pixels. | Icon CSS/artwork | Retain |
| `icon.size.large` | Sizing | 24px | Large icon width and height in CSS pixels. | Icon CSS/artwork | Retain |
| `icon.strokeWidth` | Shape/boundary | 2 | Outline stroke width in SVG user units; scales with the viewBox. | Icon CSS/artwork | Retain |
| `gallery.radius` | Shape/boundary | 6px | Gallery card and control corner radius. | Storybook gallery CSS | Retain |
| `gallery.borderWidth` | Shape/boundary | 1px | Gallery boundary thickness. | Storybook gallery CSS | Retain boundary; separate preview edge inset |
| `gallery.controlHeight` | Sizing | 36px | Minimum gallery input and preview-size target height. | Storybook gallery CSS | Retain height role; separate search padding |
| `gallery.cardHeight` | Sizing | 140px | Minimum gallery card height; grows with content. | Storybook gallery CSS | Retain |
| `gallery.columnWidth` | Layout | 200px | Minimum preferred gallery column width before wrapping. | Storybook gallery CSS | Retain |
| `gallery.gap` | Spacing | 12px | Gallery grid and control spacing. | Storybook gallery CSS | Retain |
| `gallery.inset` | Spacing | 24px | Gallery section and card insets. | Storybook gallery CSS | Retain inset; separate heading margin |
| `gallery.compactInset` | Spacing | 8px | Compact gallery control inset. | Storybook gallery CSS | Retain |
| `gallery.artworkGap` | Spacing | 16px | Space below gallery artwork. | Storybook gallery CSS | Retain |
| `gallery.focusWidth` | Shape/boundary | 3px | Visible keyboard outline thickness. | Storybook gallery CSS | Retain |
| `gallery.focusOffset` | Shape/boundary | 3px | Outline clearance around gallery controls. | Storybook gallery CSS | Retain |
| `gallery.clearSize` | Sizing | 24px | Minimum explicit clear-search target size. | Storybook gallery CSS | Retain |

## Compatibility and gallery migration

Existing `--fs-space-inline`, `--fs-space-stack`, and `--fs-space-inset` remain supported at 12/24/24px. Every existing public token name/default remains available. No React API or package export changes are required. The new `stack-group` and `inset-container` source keys are siblings of the legacy token leaves, so adding them cannot hide the old tokens during flattening.

| Previous incidental coupling | Independent role | Preserved default | Override migration |
| --- | --- | --- | --- |
| Search horizontal padding borrowed control height | `--fs-gallery-search-padding-inline` | 36px | Set this role when changing horizontal padding; control height now affects minimum height only |
| Search vertical padding borrowed general compact inset | `--fs-gallery-search-padding-block` | 8px | Set this role for vertical search padding |
| Heading margin subtracted compact inset from general inset | `--fs-gallery-heading-gap` | 16px | Set this role for heading separation; container inset no longer changes it |
| Preview-group edge padding borrowed border thickness | `--fs-gallery-preview-inset` | 1px | Set this boundary-compensation role for edge inset; border width now changes boundaries |

Defaults preserve the current appearance. Overrides that relied on these incidental relationships must set the independent role explicitly. Other documented uses of the original tokens remain supported. Preview inner sizing still subtracts its actual border and inset allowances from the minimum target, because that dependency describes the real box model.

## Accessibility and verification

A spacing scale does not establish accessibility. Maintain usable targets, text contrast, visible focus, and clearance from clipping containers. WCAG 2.2 AA target size is 24×24 CSS pixels subject to its exceptions; 44×44 is a stronger target, not the blanket AA minimum. Test at 320px, 200% text, and user text-spacing overrides (1.5 line height, 0.12em letter spacing, 0.16em word spacing, 2em paragraph spacing) without lost content or horizontal page overflow.

The spacing-demo select retains native appearance and keyboard focus with inherited typography and semantic padding. It is a documentation control, not a public Input component. Screen-reader and browser-specific manual checks supplement automated scans; actual results belong in the [verification record](verification.md).

## Research and rationale

- [Carbon spacing](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview): graduated detail/layout scale and parent-owned composition informed this foundation.
- [Atlassian spacing](https://atlassian.design/foundations/spacing): use-case ranges and an 8px base with fractional steps are a useful comparison; this library keeps its existing naming and px contract.
- [Spectrum spacing](https://spectrum.adobe.com/page/spacing/): proximity communicates relationships, and component/layout spacing serve different purposes.
- [WCAG target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [text-spacing guidance](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) constrain implementation and verification.
