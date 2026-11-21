# Carousel

An accessible media region with caller-owned slides. Import `Carousel` and `CarouselSlide`, plus `tokens.css`, `icon.css` and `carousel.css` (or combined `styles.css`). Parents own placement and outer spacing.

```tsx
const slides: CarouselSlide[] = [
  { id: 'focus', label: 'Find your focus', content: <article>First story</article> },
  { id: 'flow', label: 'Build your flow', content: <article>Second story</article> },
];
<Carousel label="Featured stories" slides={slides} />
```

| Prop | Default | Purpose |
| --- | --- | --- |
| `label` | required | Concise name of the carousel region. |
| `slides` | required | Readonly `{ id, content, label? }` records; IDs must be unique and non-empty. |
| `index`, `onIndexChange` | uncontrolled | Zero-based controlled selection and change request. |
| `defaultIndex` | `0` | Initial uncontrolled index; invalid/out-of-range values clamp. |
| `loop` | `false` | Wrap at the boundaries. |
| `showControls` | `true` | Show previous/next buttons. |
| `indicators` | `"dots"` | `dots`, `fraction`, or `none`. |
| `indicatorTargetSize` | `"comfortable"` | 44px targets; `compact` uses 24px targets. Visual markers stay compact. |
| `controlsPosition` | `"below"` | `overlay` overlays controls only in containers wider than 480px. |
| `overlaySafeArea` | `true` | Reserve space for overlay controls around normal-flow content. Full-bleed absolute content remains caller-owned. |
| `frameAspectRatio` | unset | Positive finite width/height ratio; long content scrolls within the reserved frame. |
| `variant` | `"surface"` | `surface`, `outlined`, `subtle`, `accent`. |
| `size` | `"md"` | `sm`, `md`, `lg` internal spacing. |
| `autoPlay` | `false` | Explicit opt-in automatic rotation. |
| `autoPlayInterval` | `5000` | Milliseconds; minimum 1000. Non-finite values use the default. |
| `previousLabel`, `nextLabel` | Previous/Next slide | Localized arrow names. |
| `pauseLabel`, `startLabel` | Pause/Start slide rotation | Localized rotation-control text. |
| `getSlideLabel` | label and position | `(index, total, slide) => string`, zero-based index. |
| `getIndicatorLabel` | Go to slide N | `(index, total) => string`, zero-based index. |
| `emptyMessage` | No slides to display. | Renderable empty content. |
| `className`, `style`, native section props, ref | forwarded | Instance styling and native integration; ref receives the section. |

Focus the named carousel to use Left/Right Arrow (mirrored in RTL), Home and End. Embedded controls keep their native keyboard behavior. Touch swipes navigate horizontally while vertical page scrolling remains available. Inactive slides remain mounted to preserve state, but become inert and hidden to assistive technology immediately. Native links retain navigation behavior. Keep focus styling visible when overriding tokens.

Automatic rotation pauses during hover and stops on keyboard focus or manual navigation. The explicit rotation button starts it again. At a non-looping final slide it stops. Live reduced-motion preferences disable automatic rotation and remove transitions; the Storybook motion toolbar inspects CSS transitions only. Slide announcements are polite for manual browsing and off while rotating. Do not put essential time-limited content only in rotating slides.

Semantic `--fs-carousel-*` hooks cover surface, text, border, tint, accent, radius, padding, gap, controls, dots, slide radius and focus. Overrides on one root do not affect neighboring roots, and nested theme regions restore their theme's defaults. Slides may contain unrelated data and custom markup. Both themes share the same public example configuration.
