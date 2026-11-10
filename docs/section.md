# Section

Give a meaningful page region consistent block padding. Section defaults to a native `section` with 64px padding at both block edges. Use `spacing="compact"` for 32px or `spacing="spacious"` for 96px. Both themes share these values. There is no automatic mobile breakpoint.

```tsx
import { Section, Container, Stack, SimpleGrid, Card } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Section aria-labelledby="projects-title">
  <Container>
    <Stack gap="group">
      <h2 id="projects-title">Built for your next project</h2>
      <SimpleGrid><Card>First project</Card><Card>Second project</Card></SimpleGrid>
    </Stack>
  </Container>
</Section>
```

## API and semantics

Exports: Section, SectionProps and SectionStyle. `spacing` accepts `compact`, `default` (default) or `spacious`; `as` accepts `section` (default) or `div`. Native attributes, children, className, a forwarded HTMLElement ref and typed `--fs-*` style overrides follow the other layout families. Native styles remain consumer-owned and can override padding.

Use a section for a meaningful topic and associate it with its visible heading using `aria-labelledby`. Choose heading levels for the surrounding document; the component does not generate a heading, ID, label or ARIA role. A named native section is exposed as a region. For a purely visual wrapper, use `<Section as="div">…</Section>` without an artificial region label. Preserve meaningful heading hierarchy, DOM order and native interactions. The wrapper introduces no keyboard stop or focus management.

## Ownership and spacing

Section owns **block padding only**. It adds no inline padding, surface, border, radius, shadow, fixed height, width constraint, sibling gap, stacking, columns or clipping. Container owns maximum width, centering and gutters; Stack, SimpleGrid and Cluster own their respective child relationships. Surrounding layouts own section placement, additional gaps and surfaces. Ordinary native wrappers with equivalent CSS remain supported.

Each padding preset consumes its independent semantic role:

| Preset | CSS property | Default at each edge |
| --- | --- | --- |
| compact | `--fs-section-padding-compact` | 32px |
| default | `--fs-section-padding-default` | 64px |
| spacious | `--fs-section-padding-spacious` | 96px |

These roles reference existing raw dimensions directly. They are independent of `--fs-layout-section-gap`: inset and sibling separation can evolve separately despite both currently using 64px. Existing tokens and primitive values are preserved.

Adjacent default sections contribute **128px between content edges** before any extra parent gap or child margins. Padding does not collapse between siblings. Consumer child margins are retained and can add to the breathing room; nested sections each contribute their own padding. Use Stack for inner relationships that do not need another semantic topic or another padded wrapper.

## Responsive and scoped overrides

Section has no JavaScript layout, provider, measurement, layout effect or automatic breakpoint. Consumers can adjust the selected semantic role through scoped CSS. A nested explicit theme restores its own complete defaults, and sibling scopes remain independent.

```css
.project-section { --fs-section-padding-default: 64px; }
@media (max-width: 600px) {
  .project-section { --fs-section-padding-default: 32px; }
}
```

The query above is a consumer example, not built-in component behavior. Child layouts handle wrapping and columns. Text-bearing content can grow; overflow and focus rings stay visible. Section can shrink in flex/grid parents, while the parent still decides placement or flex growth. It does not repair unsupported child minimum widths or fixed content sizes.

JavaScript imports no CSS or browser globals. Load `tokens.css` plus `section.css` and styles for composed children, or combined `styles.css`. CSS applies before hydration. Storybook outlines, marker blocks and guide surfaces are example styling only; Section itself stays transparent.

## Verification

The native-description test failed against the initial stub because attributes were dropped, then passed after native prop forwarding. Before the padding CSS and generated roles were added, source-browser assertions measured zero padding instead of the requested 32/64/96px edges. The unchanged assertions then passed in both themes with 84/148/212px outer heights around a 20px child. Additional source checks passed for 128px adjacent content-edge separation and preserved child margins before hydration.

All 527 unit tests and 218 integration tests passed with independent 100% per-file statements, branches, functions and lines. All 286 Storybook interaction/axe checks and 35 focused Chromium journeys passed. Browser coverage includes exact padding/content edges, independent role scopes and nested-theme resets, responsive 600/601px example boundaries with unchanged baseline sections, named native region/div semantics, adjacent/nested padding, additive child margins, RTL and vertical writing, flex/grid shrinking, native style precedence, native tab order and focus clearance, both themes, and 320px reflow with 200% text plus user spacing. Theme and enlarged narrow examples were also visually reviewed.

Lint, types, library/static Storybook builds and packed React 18/19 JS/types/CSS/SSR plus bundle-isolation checks passed. Existing token sources, CSS declarations and reference rows were preserved exactly; generated output reproduction passed, and the three semantic roles reuse existing primitives. No accessibility rules, assertions or coverage thresholds were weakened.

The full Chromium regression run completed with 593 passed and one Card playground timeout while waiting for Storybook's completion event, before its content assertion. The rendered snapshot contained the documented Card content. All 12 Card journeys subsequently passed in isolation with unchanged assertions/timeouts. The full run retains that observed readiness failure rather than a claimed clean pass. Its independent browser coverage gate reached 100% per file across all enforced metrics. Built-package browser verification also passed contrast, focus states, 320px reflow, 200% text and user spacing checks. Strict OpenSpec validation passed; all four tracked tasks are complete.

Real screen-reader output and non-Chromium rendering require separate verification.
