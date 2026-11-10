# Separator

The owner-supplied Separator reference approves a neutral 1px rule between related sections, with horizontal and vertical orientations, decorative or meaningful separation, and parent-owned dimensions and spacing.

## Contract

`Separator` renders an empty native `div`. `orientation` is `horizontal` (default) or `vertical`. `decorative` defaults to `true`, hiding visual grouping rules from assistive technology. Set `decorative={false}` for a meaningful boundary: the component exposes `role="separator"` and the matching `aria-orientation`. This is a static separator, with no keyboard focus, interaction, or adjustable value. It has no children or label slot. An optional native `aria-label` can name a semantic boundary when needed.

Native IDs, title, description relationships, hidden, className, styles, and div refs are supported. Role, orientation semantics, hidden accessibility state, focus, editing, live-region and range-value semantics, children, HTML injection, and interaction handlers are reserved, including for untyped consumers.

## Layout and themes

The rule is 1px thick, uses a neutral semantic color in Corporate and Luna, and has no padding or margin. Horizontal rules fill available inline space. Vertical rules stretch to the parent's available block size in a flex row or grid; give the parent a height or siblings that establish its height. The parent owns orientation-appropriate dimensions and surrounding gaps. A vertical rule outside a stretching layout needs an explicit height. This is not a draggable panel resizer.

Use `SeparatorStyle` and `--fs-separator-color` / `--fs-separator-thickness` for local customization. Forced colors uses the system text color. Preserve a meaningful visible boundary when changing colors or thickness.

```tsx
import { Separator } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/separator.css';

<div style={{ display: 'grid', gap: 'var(--fs-space-stack)' }}>
  <section><h2>Profile</h2><p>Your name and contact details.</p></section>
  <Separator decorative={false} />
  <section><h2>Preferences</h2><p>Your display and notification settings.</p></section>
</div>
```

Storybook: Components → Layout → Separator. Use semantic separation intentionally and decorative grouping otherwise. Real screen-reader output and non-Chromium rendering require manual verification.

## Verification

The focused semantic-boundary test failed against the initial empty div because it exposed no separator role. The unchanged test passed after adding opt-in separator semantics and explicit orientation.

All 439 unit tests, 170 integration tests, and 199 Storybook interaction/axe checks passed. Unit and integration independently reached 100% per-file statements, branches, functions, and lines with existing gates unchanged. Lint, type checks, library/Storybook builds, and packed React 18/19 public types, stylesheet exports, SSR, and bundle-isolation checks passed. Both theme compositions were visually reviewed.

Coverage includes decorative versus semantic separation, both orientations, optional semantic naming, refs and native attributes, hidden behavior, hydration, consumer overrides, and static semantics for untyped integrations. Real screen-reader output and non-Chromium rendering remain unverified.

The final complete Chromium suite passed all 369 tests with three workers. Every scoped production and Storybook module reached 100% statements, branches, functions, and lines, with coverage thresholds and exclusions unchanged. Browser journeys verify 1px geometry and parent dimensions, theme contrast, keyboard focus exclusion, forced colors, right-to-left layout, 320px reflow at 200% text size with user spacing, native hidden behavior, customization, and passive semantics.
