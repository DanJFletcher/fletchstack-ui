# Badge

Approved by the supplied Badge design reference. Badge communicates a short status, category, or exact count. It is passive text, not an action, selection, dismissible tag, or automatic live announcement.

## Contract

`Badge` renders a native `span`. Required `children` is a string or number; zero and large counts remain unchanged. `tone` is `neutral` (default), `info`, `success`, `warning`, or `danger`. An optional `icon` is decorative and must contain only noninteractive artwork. Text conveys meaning independently of color. Native IDs, title, description relationships, hidden, className, style, and a span ref are supported.

Badge owns passive semantics: interaction handlers, keyboard focus, content editing, replacement accessible names, hidden accessibility content, and live/role overrides are excluded. To announce a changing count when needed, a consumer can place Badge inside a separately owned persistent live region. Do not announce every badge automatically. Use Button for removable tags.

## Styling

Corporate and Luna use the same five semantic tone roles, with contrasting foreground/background pairs. Badge uses 12px text at the 16px root reference (0.75rem), a 20px minimum height, 8px horizontal padding, and a pill radius. It grows and wraps rather than truncating. Optional artwork uses 12px dimensions and a 4px gap. The parent owns placement and sibling spacing. Public `--fs-badge-*` tokens and `BadgeStyle` support local overrides.

```tsx
import { Badge, CheckIcon } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/badge.css';
import 'fletchstack-ui/icon.css';

<Badge tone="success" icon={<CheckIcon />}>Published</Badge>
<Badge>{12}</Badge>
```

Storybook: Components → Feedback → Badge. No keyboard stop or motion. Real screen-reader output and non-Chromium rendering require manual verification.

Load `icon.css` when using the library's artwork, or supply independently styled SVG artwork. The combined `styles.css` includes both stylesheets.

## Verification

The focused decorative-artwork test failed against the initial plain span because the icon was exposed as a separately named image. It passed after adding the hidden decorative wrapper; the visible status text remained readable.

All 413 unit tests, 164 integration tests, and 191 Storybook interaction/axe checks passed. Unit and integration independently reached 100% per-file statements, branches, functions, and lines with existing gates unchanged. Lint, type checks, library/Storybook builds, and packed React 18/19 types, stylesheet exports, SSR, and bundle-isolation checks passed. Both theme panels were visually reviewed.

Chromium Badge checks cover all five tones at AA text contrast in both themes, exact counts including zero, consumer-owned announcements, keyboard focus exclusion, 320px reflow at 200% text size with user spacing, custom artwork sizing when Icon styles load last, forced colors, native hidden behavior, and passive semantics for untyped consumers. Real screen-reader output and non-Chromium behavior remain unverified.

The final complete Chromium suite passed all 349 tests with three workers. Every scoped production and Storybook module reached 100% statements, branches, functions, and lines; coverage thresholds and exclusions were unchanged.
