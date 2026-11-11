# Avatar

Approved by the supplied Avatar design reference: passive identity artwork with a stable photo/initials footprint, four sizes and three shapes. Icon provides symbols and Badge provides status; neither owns identity-image loading and fallback. Avatar adds that responsibility without owning a profile card, presence status or an action.

## Contract

`Avatar` renders a span and forwards its ref and native descriptive attributes. `name` supplies generated initials and the default accessible name. `src` supplies an optional photo. `initials` overrides generated initials. Blank overrides use generated initials; missing names display `?`. Generation uses the first Unicode code point of the first and last whitespace-separated name parts (one for a single name), uppercases them, and limits custom/generated output to two code points. Complex names can use explicit initials.

`alt` overrides the accessible name; `alt=""` makes the whole avatar decorative beside a visible name. An unnamed avatar is also decorative. The wrapper owns the single image role and label, so loading, failure and initials never change the accessible name or expose duplicate images. Avatar has no keyboard stop, live announcement or interaction handlers. Wrap a decorative Avatar in a separately named Button or Link for actions.

`size`: `small` (24px), `medium` (32px, default), `large` (48px), `xlarge` (64px). `shape`: `circle` (default), `rounded` (8px radius), `square`. A photo fills and crops to the footprint using `object-fit: cover`; `--fs-avatar-image-position` adjusts the crop. Initials remain visible while loading and after failure. Changing `src` starts a fresh attempt, including returning to a previously failed source. Cached images that finished before hydration are detected on attachment. Server markup retains initials before client image readiness.

## Styling and composition

Public semantic `--fs-avatar-*` tokens own the size scale, fallback paint, typography, radius and forced-color boundary. Corporate uses a light neutral fill with dark text; Luna uses a dark neutral fill with light text. Both meet AA text contrast. Consumers may override tokens through `AvatarStyle`. The parent owns all surrounding spacing and the person's full name/description.

Initials are a compact graphic representation, not the sole readable name. Typography uses rem tokens and is capped at one third of the footprint to keep up to two initials inside the fixed image at enlarged font preferences. The adjacent full name and description wrap and enlarge normally. Circle geometry derives from the footprint; rounded and square radii are semantic dimensions. Hidden avatars leave layout, and forced colors use system paint. No motion is introduced.

```tsx
import { Avatar } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/avatar.css';

<Avatar name="Maya Chen" src="/people/maya.jpg" size="large" />
<Avatar name="Maya Chen" initials="M" shape="rounded" />
<div><Avatar name="Maya Chen" alt="" /><span>Maya Chen</span></div>
```

Storybook: Components → Identity → Avatar. Examples use synthetic identity data and a local illustration, with no external photo dependency. Real screen-reader output and non-Chromium behavior require manual verification.

## Browser ownership

The [Avatar harness suite](../tests/browser-harness/specs/avatar/Avatar.spec.ts) imports implementation and scoped styles directly. Image adapters pin known URLs instead of accepting arbitrary runtime resource overrides. The bounded [resource forwarding analysis](../tests/browser-harness/selection/forwarded-href.mjs) follows direct destructured `src` through function components and React `forwardRef` to its callers, retaining the portrait asset as a dependency. Mutable/transformed values, defaults, later spreads, aliases, escapes and unknown paths still fall back to full verification. No filename-specific exemption is used. Regression cases also retain the existing Link forwarding behavior.

## Verification

Development checks ran without coverage. The first browser pass caught a Luna fallback contrast ratio of 3.28:1; selecting the darker palette role fixed the violation without changing the assertion. The pending-image test initially intercepted no request because Vite inlined the small SVG; a `?no-inline` fixture now exercises an actual delayed response and release, with no sleeps or timeout increase.

Final verification after implementation and review passed:

- 723 unit tests in 53 files (8.91s) and 503 integration tests in 56 files (32.92s). Both independent production gates reached 100% statements, branches, functions and lines, with coverage first collected at final readiness.
- All 415 E2E cases, including 11 Avatar journeys, with three workers and zero retries (92.25s wall time). Ordinary browser execution collected no diagnostic coverage. Shared tokens, exports and selection infrastructure correctly required the full suite; affected discovery reported no ownership issues.
- All 348 Storybook render/play/accessibility checks in 30 files (14.73s).
- Lint, both TypeScript checks, library and built-style browser verification (3.57s), static Storybook build (8.40s), and packed exports/types/CSS/bundling/React 18 and 19 SSR verification (7.88s).
- Visual inspection of the profile composition and both theme galleries. Chromium checks cover native image loading/failure/recovery, stable footprint and accessible name, sizes/shapes, contrast, 320px enlarged/spaced text, forced colors, nested theme reset, hidden and keyboard exclusion. DOM/hydration tests additionally cover cached completion, old-image events, Unicode/custom initials and untyped prop safety.

Timings are single local command observations with existing caches; logs and screenshots are under ignored `.verification/avatar/`. Remote CI, real screen-reader output and non-Chromium behavior remain unverified.
