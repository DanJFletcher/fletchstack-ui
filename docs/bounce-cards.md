# BounceCards

A responsive fan of caller-supplied photographs, inspired by [React Bits Bounce Cards](https://www.reactbits.dev/components/bounce-cards). Photos bounce in once, straighten during inspection, and push their neighbors aside. Corporate and Luna inherit semantic frame, fallback, shadow and focus styles. No animation dependency is required.

```tsx
import { BounceCards, type BounceCardsImage } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/bounce-cards.css';

const images: BounceCardsImage[] = [
  { id: 'mountain', src: '/mountain.jpg', alt: 'Clouds above a mountain ridge' },
  { id: 'forest', src: '/forest.jpg', alt: 'Sunlight through a pine forest' },
];
<BounceCards images={images} onCardClick={(index, image) => openPhoto(image)} />;
```

| Prop                                        | Default               | Purpose                                                                                                                                                                         |
| ------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `images`                                    | required              | Readonly source strings or `{ id?, src, alt? }` objects. IDs default to the source; sources and IDs must be non-empty, IDs unique. Supply explicit IDs when repeating a source. |
| `label`                                     | Photo cards           | Accessible group name. Native `aria-labelledby` can supply an external name.                                                                                                    |
| `containerWidth`                            | 900                   | Maximum CSS pixel width; actual width never exceeds its parent.                                                                                                                 |
| `containerHeight`                           | 400                   | Preferred stage height before responsive scaling.                                                                                                                               |
| `cardSize`                                  | 200                   | Nominal square size, at least 44px.                                                                                                                                             |
| `spread`                                    | 85                    | Horizontal distance between resting card centers, in CSS pixels.                                                                                                                |
| `rotation`                                  | 10                    | Maximum irregular tilt, in degrees.                                                                                                                                             |
| `arc`                                       | 0                     | Outer-card vertical displacement, in CSS pixels; may be negative.                                                                                                               |
| `pushDistance`                              | 160                   | How far neighbors spread on either side, in CSS pixels.                                                                                                                         |
| `hoverScale`                                | 1.06                  | Inspected card scale, from 1 through 2.                                                                                                                                         |
| `bounciness`                                | 0.6                   | Entrance overshoot from 0 through 1; 0 removes overshoot.                                                                                                                       |
| `animationDelay`                            | 0.5                   | Initial delay, in seconds.                                                                                                                                                      |
| `animationStagger`                          | 0.06                  | Additional entrance delay per card, in seconds.                                                                                                                                 |
| `enableHover`                               | true                  | Enable pointer inspection; keyboard focus always makes actions prominent.                                                                                                       |
| `shadow`                                    | true                  | Show card depth shadows.                                                                                                                                                        |
| `positions`                                 | generated             | Typed `{ x, y, rotation? }` positions replace individual generated slots; no transform-string parsing.                                                                          |
| `onCardClick`                               | unset                 | `(index, image) => void`; turns each card into a native button.                                                                                                                 |
| `getCardLabel`                              | alt or Card N         | `(index, image) => string` localizes action names.                                                                                                                              |
| `emptyMessage`                              | No photos to display. | Empty collection message.                                                                                                                                                       |
| `className`, `style`, native div props, ref | forwarded             | Scoped styling, native handlers, IDs and external labeling. Ref receives the wrapper div.                                                                                       |

Geometry must be finite; container dimensions are positive, spacing/delays non-negative, and scales/bounciness stay within the documented ranges. Stable IDs preserve card identity on reorder. Changing a source retries a previously failed resource. Failed photos retain their footprint and accessible description.

The library reserves the full expanded fan and scales it within available container width. Very dense collections switch to a wrapping grid before action targets shrink below 44 CSS pixels. Parents control outer placement and spacing. Hover expansion is a visual enhancement; essential information belongs in visible page content. Without an action, cards remain passive images with no extra Tab stops. String sources have empty alt text; use object descriptions for meaningful images.

With an action, Tab follows source order, Enter/Space activate once, and focus immediately brings the focused card forward without waiting for entrance animation. Buttons use `type="button"` inside forms. Touch uses native button activation. The action and any lightbox or navigation remain consumer-owned; no selection or modal is created implicitly. Native event handlers remain forwarded.

Live reduced-motion preferences disable entrances and position transitions while keeping all photographs and actions available. The Storybook Motion toolbar provides inspection-only overrides. To replay the one-time entrance, intentionally remount with a new key; rerendering, hover and focus do not replay it.

Use `style={{ '--fs-bounce-cards-radius': '8px' }}` or a root class to customize one instance. Supported semantic hooks cover `border`, `border-width`, `radius`, `surface`, `text`, `focus`, `focus-width`, `focus-offset`, shadow offset/blur/color, fallback padding and grid gap. Internal `--fan-*` geometry properties are not public customization hooks. Nested theme regions reset semantic tokens and neighboring instances remain unaffected.

## Reference photographs

The examples bundle 480px Unsplash thumbnails used by the reference, avoiding external requests during tests. [White lilies](https://images.unsplash.com/photo-1724152312974-d4d48b8b36fd), [woodland](https://images.unsplash.com/photo-1762846818262-33c197852fa8), [mountains](https://images.unsplash.com/photo-1721407964262-f9864b562453), [blue flowers](https://images.unsplash.com/photo-1776394254711-4a0d7345269a), [sunset](https://images.unsplash.com/photo-1763440519433-5467759054fc). These are story assets, not library defaults.
