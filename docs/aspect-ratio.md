# AspectRatio

Keep images, videos and embeds proportional as available parent width changes. AspectRatio fills its parent's available inline width and derives height as `width ÷ ratio`, defaulting to `16 / 9`. Use `ratio={1}` for square, `ratio={3 / 4}` for portrait or any finite positive width/height ratio. Zero, negative, NaN and infinite numeric values fall back to 16:9.

```tsx
import { AspectRatio } from 'fletchstack-ui';
import 'fletchstack-ui/aspect-ratio.css';

<figure>
  <AspectRatio ratio={16 / 9}>
    <img className="project-art" src="/project.jpg" alt="A mountain landscape at sunrise" />
  </AspectRatio>
  <figcaption>Project landscape. Captions remain outside the ratio frame.</figcaption>
</figure>
```

```css
.project-art {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
```

Use `object-fit:contain` on an image or video to show the whole media with possible empty space; `cover` fills the frame with possible cropping. Embeds also need consumer width/height sizing. AspectRatio does not choose fitting, remove iframe borders, generate alt text, add video controls or supply iframe titles. Use appropriate image alternatives and titled embeds; native child controls retain their own behavior.

## API and ownership

Exports: AspectRatio, AspectRatioProps and AspectRatioStyle. The native div wrapper accepts children, div attributes, className, a forwarded HTMLDivElement ref and typed `--fs-*` style values. The `ratio` prop is numeric, not a string preset. Consumer native styles are applied last: `style={{ aspectRatio:'4 / 3' }}` overrides the ratio prop, and explicit sizes/placement remain consumer choices.

The wrapper owns geometry. Its internal positioned content layer keeps intrinsic media dimensions out of the frame's height calculation. Supply content through children; raw `dangerouslySetInnerHTML` is excluded because it conflicts with this owned content layer. Children are not cloned or automatically resized: explicitly size media to fill the layer as shown above. Internal content markup is not a public slot API. Keep captions and reflowing text outside the frame. Avoid fixed-ratio frames for text sections or whole cards.

The component adds no padding, surface, border, radius, shadow, automatic clipping or keyboard behavior. It does not introduce a role, tab stop or focus management. Parents own width and placement; children own presentation. Both themes share the same geometry, and theme changes do not color the transparent wrapper. Overflow remains visible, including unfitted oversized children and focus rings. Consumers who intentionally clip media own that decision and must preserve access to controls and focus.

This is CSS-driven layout before hydration: no measurement, browser global, provider or layout effect is needed. JavaScript imports no stylesheet. Load standalone `aspect-ratio.css` with any styles/tokens needed by surrounding components, or the combined `styles.css`. No new token is introduced: the ratio is content geometry rather than a visual theme choice.

## Composition

SimpleGrid can arrange Cards containing proportional media; Container and Stack can own page width and vertical spacing. Put captions and native actions in CardContent outside the frame. Card may apply its own overflow behavior; verify controls have enough inset for focus clearance. AspectRatio itself never hides overflow. Ordinary native CSS aspect-ratio wrappers remain supported.

Storybook demonstrates default/common/custom ratios, wide/narrow parents in one viewport, cover/contain, real image/video/iframe elements, nested frames, hidden state, overflow, native focus order and both themes. All artwork and measurement outlines are consumer-owned demo content, not component styling.

## Verification

The native-description test failed against the initial stub because attributes were dropped, then passed after forwarding native props. A source-browser geometry test initially measured approximately 1004px heights from intrinsic oversized images; the unchanged assertions passed after adding the positioned content layer, yielding 240×240, 240×135, 240×320 and240×100 frames. Additional source checks passed for empty/zero-width parents and flex/grid cross-axis stretching before hydration.

All 512 unit tests and 209 integration tests passed with independent 100% per-file statements, branches, functions and lines. All 272 Storybook interaction/axe checks passed. An invalid ARIA label on the generic overflow demo block was caught by axe and replaced with a real image and meaningful alt text; no accessibility rule was suppressed. DOM unit style assertions use CSS-aware comparisons to account for native ratio serialization.

All 40 focused Chromium journeys passed, covering common/custom/invalid ratios, same-viewport wide/narrow parents, 320px reflow, 200% text and user spacing, independently growing captions, cover/contain fitting, native video controls, titled local embed content, native style precedence, oversized visible overflow, focus rings extending outside the frame, native tab order, theme consistency, nested/empty/hidden frames and RTL. Fitting, both themes and enlarged narrow captions were visually reviewed. Lint, types, library/Storybook builds and packed React 18/19 JS/types/CSS/SSR and bundle-isolation checks passed. No tokens were added or changed by AspectRatio.

The complete Chromium regression run passed all 559 tests with independent 100% per-file browser coverage across all enforced metrics. Built-package browser verification passed contrast, focus states, 320px reflow, 200% text and user spacing checks. Strict OpenSpec validation passed; all four tracked tasks are complete.

Real screen-reader output, non-Chromium rendering and media decoding/playback require separate verification. The video example intentionally loads no media source; embed content is local and does not verify remote providers.
