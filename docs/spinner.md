# Spinner

The supplied Spinner reference approves indeterminate loading, a circular track and indicator arc, visible status text, 16/20/24px sizes, inherited color, and no keyboard focus. Independent `spinner.*` semantic roles provide sizes, SVG stroke width, label gap, track opacity, and rotation speed. Optional accent colors follow Corporate blue and Luna lavender; the default inherits its surrounding color, including inside buttons. SVG artwork composes Icon; it does not add a public named icon.

`Spinner` defaults to medium (20px), visible “Loading…” text, and a polite atomic status. `label` supplies contextual status text; blank labels fall back to “Loading…”. It represents unknown duration and exposes no percentage or progressbar values. The artwork is decorative and non-focusable. `decorative` hides the entire spinner from assistive technology and omits its text/status role: use this when a button label or a single parent status already supplies the message. Do not nest announcing spinners in other live regions. Announce once through one status owner, rather than adding a live region to each graphic.

The consumer owns pending state, conditional removal when work finishes, and `aria-busy` on the content region being updated. Keep a persistent status outside a busy region when announcements must be delivered during loading, since assistive technology can defer changes inside busy regions. Use Progress when completion can be measured. Native span refs, classes, styles, and scoped semantic overrides are supported; children and status/progress/focus semantics are reserved.

Rotation is steady and CSS-only. The unitless `spinner.rotationSeconds` token is converted to seconds with `calc(... * 1s)`; track opacity is unitless and stroke width uses SVG viewBox units. Reduced motion disables rotation while retaining the static arc and visible status text. Size and sibling placement remain separate: Spinner owns its label gap, Button owns spacing beside a decorative spinner, and parents own surrounding layout. Text wraps and grows while artwork keeps its pixel dimensions.

```tsx
<Spinner label="Loading projects…" />
<Button disabled aria-busy="true"><Spinner decorative size="small" />Saving…</Button>
```

Import combined styles, or tokens.css + spinner.css. Spinner's CSS supplies its complete graphic geometry when composed Icon styles are not imported separately. Keep contextual text visible, provide one status announcement, preserve contrast when changing inherited colors/opacity, and remove the indicator when work finishes.

## Verification

The loading-status test failed against a plain text span, then passed after adding owned status semantics. A browser integration test also reproduced Icon CSS loaded last overriding Spinner's independent size/stroke settings (20px/2px instead of the requested 32px/4px); scoped graphic selectors corrected the cascade and the unchanged test passed.

Full checks passed 388 unit tests, 155 integration tests, and 182 Storybook interaction/axe checks. Unit and integration each independently reached 100% per-file statements, branches, functions, and lines. Lint, type checks, package/Storybook builds, and packed React 18/19 public types/CSS/SSR/bundle-isolation verification passed. Both theme panels were visually reviewed.

Browser journeys cover sizes, steady/reduced motion, inherited button color, decorative announcement suppression, one persistent status outside a busy region, removal on completion, keyboard focus exclusion, forced colors, native hidden behavior, and 320px reflow with enlarged/spaced text. Hidden behavior uses an explicit story because the original URL argument was not forwarded by Storybook; the rendered DOM had no hidden attribute. Real screen-reader announcement count/output and non-Chromium behavior remain unverified.

The final complete Chromium suite passed all 324 tests with three workers. Every scoped production and Storybook module reached 100% statements, branches, functions, and lines; coverage thresholds and exclusions were unchanged. The explicit hidden-story check passed after the original URL-driven setup failed, and the full suite was rerun successfully afterward.
