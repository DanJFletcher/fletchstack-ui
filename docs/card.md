# Card

Approved brief: the user's three Card references authorize a passive outlined surface, a separated action footer, and a responsive media/content composition. Button and Icon cover actions and artwork; Card supplies the missing surface and internal layout. This document records that decision before implementation.

Card owns its border, radius, internal padding, and layout. Parents own width, placement, and spacing between cards. Default cards are outlined, vertically stacked, and medium padded. `variant` supports `outlined`, `filled`, and `plain`; `padding` supports `none`, `small`, `medium`, and `large`. `orientation="horizontal"` wraps media above content when space is constrained. No height is fixed. Contents are clipped to the Card's rounded outer boundary; leave internal padding around controls for focus rings, especially when using `padding="none"`.

Use `CardHeader`, `CardContent`, and `CardFooter` as padded regions. Header and content stack their children; Footer wraps and distributes its children. Footer's optional `divided` prop adds a top rule. `CardMedia` supplies an unpadded, tinted region for arbitrary images or artwork. Its width is a preferred flex basis, never a minimum that forces scrolling. A horizontal Card should contain CardMedia and one CardContent (which may contain header/footer). Vertical cards may contain any combination of regions. Bare children remain supported; use a region when padding is desired.

Card defaults to a div; `as="article"` or `as="section"` opts into document semantics. CardTitle defaults to h2 and accepts h1–h6 or p through `as`. CardDescription is a paragraph. Every part forwards its native ref and attributes, className, children, and style. Consumers can associate an article/section with its title using explicit unique IDs and aria-labelledby; Card creates no automatic naming relationships.

CardMedia and its images/videos have square corners by default; they do not inherit the Card's radius. The Card clips media at its outer corners while internal media/content boundaries remain square.

Card has no activation, selected/disabled state, hover treatment, or tab stop. Place links, Button, and native details/summary inside it for their own interactions. Supply meaningful image alt text or empty alt for decorative images. Preserve heading order, contrast, native keyboard behavior, and focus clearance when composing or overriding.

Independent `card.*` semantic tokens in both theme sources cover surface, filled surface, text, muted text, media surface, decorative border, radius, border thickness, padding sizes, content/footer gaps, media width, and body/title typography. All alias primitives directly. Corporate uses white/ink/blue-tinted media and 4px corners; Luna uses navy/pale/violet media and 12px corners. CSS custom properties can be scoped or passed in typed `style`; an explicit nested theme resets its complete contract. See [tokens](tokens.md) for generated names and defaults.

```tsx
import { Card, CardContent, CardTitle, CardDescription, CardFooter, Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Card as="article" aria-labelledby="collection-title" padding="large">
  <CardContent>
    <CardTitle id="collection-title">A foundation for every interface.</CardTitle>
    <CardDescription>Shared components with room to make it your own.</CardDescription>
  </CardContent>
  <CardFooter divided>
    <span>Keep it for later</span>
    <Button>Save collection</Button>
  </CardFooter>
</Card>;
```

For separate styles, import `tokens.css`, `card.css`, and the stylesheets of any composed controls. All parts are optional and may contain arbitrary React children. Component class names use the `fs-card` prefix; prefer semantic tokens for visual customization and className/style for consumer layout.

## Verification

- Library build, production Storybook build, type checks, and lint passed.
- Unit coverage passed the repository's 100% per-file gate, including Card. Integration tests passed for token generation and separate/combined stylesheet publication.
- All 43 Storybook stories passed their browser interactions and configured WCAG axe checks. The CI workflow runs this suite with accessibility failures treated as errors.
- Chromium checks cover native Enter/Space disclosure activation, focus retention, scoped geometry overrides, and 320px reflow with 200% root text and WCAG text-spacing overrides in both themes. The three Luna reference compositions were also visually inspected in Chromium.
- The final full Chromium run reached 100% per-file browser coverage, including Card and its stories: 77/78 tests passed. The remaining existing Corporate spatial composition test failed in the shared Storybook readiness adapter with a destroyed execution context during navigation, before its reflow assertions. Earlier full serial execution passed all 71 assertions before Card story visits were isolated for coverage. These readiness races remain a harness limitation.
- Real screen-reader testing remains unverified. Automated accessible-name, keyboard, and axe checks supplement that review.
- A focused diagnostic rerun of both Corporate and Luna spatial composition reflow tests passed (2/2); the earlier full-run navigation failure remains recorded rather than counted as a clean full-suite pass.

Process note: the initial Card tests failed because its public exports did not exist. This establishes missing-component coverage, rather than an observed semantic regression in an existing implementation. Subsequent tests and browser checks verify the completed public behavior. Storybook's simulated keyboard cannot activate native summary defaults; the story exercises click, and Playwright verifies native Enter/Space in Chromium.
