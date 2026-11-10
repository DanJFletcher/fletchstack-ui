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

These are initial defaults, not mandates to replace all existing component roles. Button owns its padding and label/icon gap; Icon owns its artwork size. The parent owns placement, margins, sibling gaps, and container insets. Use ordinary flex/grid wrappers for child layout; they remain fully supported. The optional [Stack](./stack.md) component is a convenience for vertical direct-child gaps and cross-axis alignment; no Grid component is required. The optional [SimpleGrid](./simple-grid.md) distributes collection items into equal-width auto-fit columns, with a 240px preferred minimum that shrinks to fit narrow parents. It uses existing related/group gap roles directly and adds only the semantic `--fs-simple-grid-min-item-width` sizing role (240px in both themes). Use ordinary CSS Grid for unequal tracks or spanning; children own their internal layout and surfaces. The optional [Container](./container.md) primitive owns only maximum width, centering, and responsive inline gutters, and can surround those wrappers. Ordinary CSS wrappers remain fully supported.

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

Existing `--fs-space-inline`, `--fs-space-stack`, and `--fs-space-inset` remain supported at 12/24/24px. Every existing public token name/default remains available. The original spatial-role migration required no React API changes. The optional additive Container API and `container.css` export described below leave those existing tokens and wrappers unchanged. The new `stack-group` and `inset-container` source keys are siblings of the legacy token leaves, so adding them cannot hide the old tokens during flattening.

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


## Optional Container

[Container](./container.md) bounds and centers content without replacing a section, stack, grid, or ordinary CSS wrapper. Its border-box maxima include gutters: reading 720px, content 1120px (default), wide 1440px. It fills a narrower parent and can shrink in flex/grid. Inline gutters are 16px below the 600px viewport breakpoint and 24px at and above it; a narrow parent on desktop still uses 24px. Corporate and Luna share these layout values.

Use `gutters={false}` inside an already inset parent or nested Container to avoid doubled gutters. That opt-out preserves width limits and centering. Parents own vertical spacing and semantic sections; children own internal layout, wrapping and minimum sizes. Container adds no background, border, shadow, fixed height, vertical padding, overflow clipping, section semantics, or keyboard behavior. Reading is a width preset, not a guarantee of ideal text measure. Long unbreakable text, fixed-width content, or child intrinsic minima can still overflow; fix those children rather than hiding overflow or focus rings.

```tsx
<section aria-labelledby="projects" className="page-section">
  <Container>
    <h2 id="projects">Projects</h2>
    <div className="project-grid">{/* Ordinary grid/flex wrappers still own layout. */}</div>
    <Container size="reading" gutters={false}>{/* No second inset. */}</Container>
  </Container>
</section>
```

New semantic roles are `--fs-container-max-width-reading`, `--fs-container-max-width-content`, `--fs-container-max-width-wide`, `--fs-container-gutter-small`, and `--fs-container-gutter-large`. All reference primitives directly, with no changes to prior spatial roles. Override them in a scope or typed Container styles; nested explicit themes restore their own complete defaults. The component's 600px viewport query is fixed CSS behavior and does not turn the spatial guide's independent responsive example into a global breakpoint API.

Storybook's [Container examples](http://localhost:6006/?path=/story/components-container--width-presets) label outlines and measurements as demonstration guides. Those guides are not Container styles. Import tokens plus `container.css`, or combined `styles.css`; JavaScript includes no stylesheet import, browser global, provider, or layout effect.


## Optional Stack

[Stack](./stack.md) is a convenience for column flexbox with CSS gap, not a replacement for ordinary flex/grid wrappers. Use related (default) for `--fs-space-gap-related` (16px), group for `--fs-space-stack-group` (24px), section for `--fs-layout-section-gap` (64px), or none for zero. These variables are consumed directly, retain scoped overrides and nested-theme resets, and have identical Corporate/Luna defaults. No Stack-specific token aliases are introduced.

Stack owns only participating direct-child gaps and cross-axis alignment. Stretch is the default; start/center/end position content across the inline axis, with start/end following writing direction. DOM, reading and keyboard order stay unchanged. Stack stays vertical at every width. Consumers can override the existing roles through scoped CSS and media queries; horizontal wrapping can use the optional [Cluster](./cluster.md) or an ordinary wrapping flex row.

Keep composed fields as individual children: TextInput, Textarea, Select and FormGroup already own label/control/message spacing and accessibility associations. Splitting those parts into outer Stack children gives them the wrong sibling relationship. React fragments do not establish a grouped flex item. Nest a real Stack or ordinary wrapper when several nodes form one relationship.

CSS gap inserts no spacer nodes and reserves no space for display:none or native hidden children. Visibility:hidden still participates. Consumer child margins are preserved and can add to the gap; reset your own margins explicitly when precise edge-to-edge gap measurement is needed. Nested stacks independently own their direct-child relationships. Stack adds no padding, surface, border, shadow, fixed height or clipping, and does not force widths onto descendants. Items retain their block sizes; constrained-height parents own any overflow/scroll decision. Wrapping and long unbreakable content remain child responsibilities.

```tsx
<Container>
  <form>
    <Stack gap="group">
      <TextInput label="Project name" name="project" />
      <Textarea label="Description" name="description" />
      <Stack align="start"><Button type="submit">Save changes</Button></Stack>
    </Stack>
  </form>
</Container>
```

```css
/* Consumer-owned responsive decision; Stack itself has no breakpoint. */
.project-sections { --fs-layout-section-gap: 64px; }
@media (max-width: 600px) {
  .project-sections { --fs-layout-section-gap: 32px; }
}
```

Use `gap="section"` with that consumer class to change the section gap while preserving vertical flow. JavaScript imports no CSS or browser globals and requires no provider/layout effect/hydration. Import tokens and `stack.css` (plus composed component CSS), or combined `styles.css`. Demonstration outlines and measurement blocks in Storybook are consumer guides, not Stack's appearance.


## Optional Cluster

[Cluster](./cluster.md) is an optional wrapping row of intrinsic children, using CSS flexbox with row direction and wrap enabled. It complements Container's width/gutters and Stack's vertical relationships without replacing ordinary CSS wrappers. It does not supply equal-width Grid tracks or interactive toolbar/ButtonGroup/selection behavior.

The actions default consumes `--fs-space-gap-actions` (12px) directly on both axes; related consumes `--fs-space-gap-related` (16px), and none is zero. Existing scoped overrides, consumer media queries and explicit nested-theme resets apply without new aliases or tokens. Corporate and Luna share layout defaults. Wrapping responds to the parent width at the same viewport size; Cluster has no breakpoint or automatic mobile column mode.

Align start/center/end/baseline controls the cross axis within each row. Justify start/center/end positions each row along available inline space, respecting writing direction. DOM, reading and native tab order are unchanged. Cluster adds no roles, tabindex, arrow navigation, focus management, padding, surface, border, shadow or fixed height. Parents own group labels and specialized interaction semantics.

Children retain intrinsic widths and native interactions; Cluster imposes no growth/equal-width or broad descendant styles. Supported controls such as Button can shrink and wrap their own text. Unsupported fixed-minimum or unbreakable content still needs consumer-owned handling. Overflow and focus rings are not clipped. Hidden/display:none items reserve no gap, while visibility:hidden still participates. Consumer child margins can add to CSS gap; nested clusters independently own their direct relationships.

```tsx
<Container>
  <Stack gap="group">
    <h2>Project overview</h2>
    <Cluster>
      <Button>Save changes</Button>
      <Button variant="secondary">Preview</Button>
      <Badge tone="info">New</Badge>
    </Cluster>
  </Stack>
</Container>
```

Import tokens plus `cluster.css` and composed component styles, or combined `styles.css`. CSS layout works before hydration with no provider, browser global or layout effect. Storybook's guides, measurement blocks and fixed parent sizes are demonstration styles, not Cluster styling. Ordinary wrapping flex wrappers remain fully supported.

## Optional AspectRatio

[AspectRatio](./aspect-ratio.md) reserves proportional media geometry from available width, defaulting to 16:9; `ratio={1}` is square and `ratio={3 / 4}` is portrait. It complements SimpleGrid and Card without owning their gaps, surfaces or insets. The ratio is content geometry, with no new theme tokens or JavaScript measurement. Parents own width and placement, children own media fitting and native semantics, and captions stay outside the frame. No automatic clipping or keyboard behavior is added. Ordinary native CSS aspect-ratio wrappers remain supported; avoid fixed-ratio containers for reflowing text.

## Optional Section

[Section](./section.md) gives a meaningful page topic block padding: compact 32px, default 64px or spacious 96px at both ends. The public roles `--fs-section-padding-compact`, `--fs-section-padding-default` and `--fs-section-padding-spacious` directly reference existing 32/64/96px primitives, independently of `--fs-layout-section-gap`. Both themes share defaults; scoped CSS may override them, and explicit nested themes reset their contract.

Compose Section → Container → Stack/SimpleGrid: Section owns block padding, Container owns width and gutters, child layouts own gaps and wrapping, and the parent owns any extra separation between sections. Adjacent default sections contribute both 64px edges (128px between content edges before child margins or parent gaps). Section preserves child margins and adds no surface, border, inline padding, clipping, heading or keyboard stop. Associate meaningful sections with visible headings; use `as="div"` for visual grouping.

Responsive padding is an explicit consumer decision, with no built-in breakpoint. For example, apply `.project-section { --fs-section-padding-default: 64px; }` and override that role to 32px inside `@media (max-width:600px)`. Child layouts handle columns and text reflow. Ordinary native wrappers remain supported.
