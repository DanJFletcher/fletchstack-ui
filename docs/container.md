# Container

The owner-supplied Container design and request approve this optional passive layout primitive and its semantic tokens. It constrains content width, centers it, and provides responsive inline gutters. Ordinary flex/grid wrappers remain fully supported.

## Contract

`Container` renders a native div. `size` is `reading`, `content` (default), or `wide`. `gutters` is boolean and defaults to true. Native div attributes, children, className, a forwarded HTMLDivElement ref, and typed `ContainerStyle` overrides are supported. There is no polymorphic element, breakpoint object, provider, viewport script, or hydration requirement.

| Preset  | Maximum outer width |
| ------- | ------------------- |
| reading | 720px               |
| content | 1120px              |
| wide    | 1440px              |

Width is 100% of the parent's available inline space up to the maximum. Border-box sizing includes gutter padding within that maximum; logical auto margins center it. `min-inline-size: 0` allows shrinking within flex/grid parents. Gutters are 16px below a 600px viewport and 24px at and above it, even when the parent itself is narrow. `gutters={false}` removes only inline padding. Use it when nesting inside a parent that already supplies the required inset.

Container adds no background, border, shadow, fixed height, vertical padding, focus stop, section semantics, or stack/grid behavior. Parents own vertical separation. Children own their internal layout, wrapping and intrinsic minimum sizes. Container does not repair overflowing children or hide overflow/focus rings. The `reading` preset is a width choice, not a guarantee of optimal text line length: font metrics, font size and content affect the measure.

```tsx
import { Container } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/container.css';

<section aria-labelledby="overview">
  <Container size="content">
    <h2 id="overview">Project overview</h2>
    <div className="project-grid">{/* Children supply the layout. */}</div>
  </Container>
</section>;
```

Corporate and Luna share identical layout defaults. Override `--fs-container-max-width-reading`, `--fs-container-max-width-content`, `--fs-container-max-width-wide`, `--fs-container-gutter-small`, or `--fs-container-gutter-large` on a scope or in `ContainerStyle`. Explicit nested themes redeclare all roles, restoring their defaults. A token override on the same element takes normal CSS cascade precedence. The 600px viewport query is fixed CSS behavior, not a token or runtime breakpoint API.

Use combined `styles.css`, or tokens.css plus container.css; JavaScript never imports CSS. Storybook: Components → Layout → Container. All outlines, shaded measurements and grids in examples belong to demonstration wrappers or children; Container itself has no visible surface or guides. See the [spatial guide](./spatial-system.md) for ownership and ordinary-wrapper examples.

## Verification

The focused native-description test failed against the initial wrapper because native attributes were dropped, then passed after adding native div prop forwarding. All 450 unit tests, 177 integration tests, and 209 Storybook interaction/axe checks passed. Unit and integration independently reached 100% per-file statements, branches, functions, and lines with the existing gates unchanged.

Lint, type checks, library/Storybook builds, packed React 18/19 types/SSR/CSS/bundle-isolation verification, and strict OpenSpec validation passed. Generated CSS/reference reproduce exactly, and a semantic-source comparison plus the frozen legacy-token integration check confirmed preservation of prior roles. Both theme compositions were visually reviewed.

All 29 focused Chromium checks passed: actual 720/1120/1440px inclusive maxima, centering, 599px/600px gutter transition, opt-out, nesting, inherited overrides and explicit theme reset, sibling independence, flex/grid shrinking, RTL, theme consistency, passive appearance, focus clearance, hidden behavior, and representative content at 320px with 200% text and user spacing. Source-browser checks also prove oversized child content stays visible rather than being concealed or repaired.

Real screen-reader output and non-Chromium rendering remain unverified. Reading width does not guarantee optimal text measure, and overflowing children still require consumer-owned fixes.

The complete Chromium regression suite passed all 398 tests with three workers. Every scoped production and authored Storybook module reached 100% statements, branches, functions, and lines. Coverage thresholds and exclusions were unchanged. The OpenSpec change's five tracked tasks are complete; review can precede a separately requested archive.
