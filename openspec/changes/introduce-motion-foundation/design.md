# Design

## Context

See [proposal](proposal.md) for motivation and the [motion contract](specs/motion-foundation/spec.md) for acceptance criteria.

- The token compiler already validates and serializes DTCG `duration` and `cubicBezier`. Theme semantics alias primitives directly, and every theme redeclares the complete contract.
- Accordion consumes standard duration (160ms) and easing (`0.2, 0.8, 0.2, 1`). Panel animation is opt-in; chevrons transition normally. Native hidden state before hydration, inert panels, and immediate ARIA changes protect accessibility independently of CSS animation.
- Spinner rotates once per second via a numeric `--fs-spinner-rotation-seconds` token, default 1. Both existing motion consumers have component-scoped reduced-motion media rules.
- Storybook has a theme global and decorator but no motion global. Foundation docs use MDX plus repository Markdown and companion example stories.
- The reference documents generic 120/200/320/750ms values, while its active ACME theme computes 100/160/240/640ms. Local defaults must be explicit, documented, and tested rather than assumed from that prose.

## Goals / Non-Goals

**Goals:** Establish a stable semantic vocabulary, preserve current consumer defaults and customization, and enable realistic full/reduced previews without changing consumer preference handling.

**Non-Goals:** New component animations, a public preference hook/provider, a JavaScript animation scheduler, distance tokens, an animation package, or changes to testing cadence and coverage policy. Future JavaScript movement must honor the same contract, but there is no current consumer justifying a new runtime API.

## Decisions

### 1. Extend the existing token vocabulary

Add typed primitives and direct semantic aliases in both themes:

| Semantic CSS property | Initial value | Role |
| --- | --- | --- |
| `--fs-motion-duration-fast` | 100ms | Small state feedback |
| `--fs-motion-duration-standard` | 160ms | Typical disclosure/state movement; existing value |
| `--fs-motion-duration-slow` | 240ms | Larger deliberate transitions |
| `--fs-motion-duration-spinner` | 1000ms | One loading rotation; preserves current Spinner |
| `--fs-motion-easing-standard` | cubic-bezier(0.2, 0.8, 0.2, 1) | General state changes; existing value |
| `--fs-motion-easing-enter` | cubic-bezier(0.2, 1, 0.3, 1) | Entering content |
| `--fs-motion-easing-exit` | cubic-bezier(0.5, 0, 0.9, 0.3) | Leaving content |

Corporate and Luna start identical. Distinct semantic roles permit later approved divergence. Keep Spinner linear; enter/exit easing is demonstrated in foundation examples without changing Accordion's existing curve. Do not add a distance scale without an approved moving-component use case.

Alternative: copy the reference's documented defaults. Rejected because it changes current component feel and conflicts with its active values. Token serialization needs no new type support or compiler special case.

### 2. Preserve Spinner's numeric customization through a compatibility bridge

Use `calc(var(--fs-motion-duration-spinner) * var(--fs-spinner-rotation-seconds))` as the effective rotation duration. Keep the existing numeric token and its default 1. With shared duration at 1000ms, existing values retain their seconds meaning; with the numeric token at 1, new shared-duration overrides work directly. If both are customized, values multiply; document and test that composition explicitly. Keep linear infinite rotation and the reduced-motion static graphic/status behavior.

Alternative: remove the old token, or migrate it to a duration type. Rejected because existing numeric overrides would break. A compiler-specific alias transform or preference provider would add unnecessary complexity.

### 3. Keep consumer reduced motion CSS-native

Retain real `prefers-reduced-motion` handling in component CSS. Focus appearance, ARIA, inert/hidden state and keyboard navigation remain immediate and never await a transition end event. Preserve Accordion defaults, SSR/hydration behavior, and rapid-toggle behavior. Reduced motion uses no transition/animation rather than tiny nonzero durations or blanket universal selectors.

Alternatives: global animation resets or a new React hook used by CSS-only components. Rejected because global resets can affect consumer styling and neither component needs JavaScript preference state.

### 4. Emulate the media preference only within Storybook

Add a Storybook `motion` global with `system`, `reduced`, and `full`, defaulting to `system`. A preview-only adapter sets an explicit marker on the preview document root and removes it for System. Clean up the marker when the adapter unmounts. Put restoration rules in a Storybook-only stylesheet: Reduced suppresses motion on the known library consumers and foundation examples; Full restores their normal transition/animation declarations even under an OS reduce preference. Limit selectors to those consumers, with deliberate specificity over their reduced-motion rules. Never ship this adapter or override stylesheet in package styles.

System keeps the component media queries authoritative and therefore responds to preference changes without a React hook. Full restores component behavior, not forced animation: Accordion panels still need `panelMotion="expand"`. Theme changes and nested theme panels must not reset the document-level mode. The global applies to all story canvases in Docs as well as Canvas view. Use one preview-level lifecycle owner rather than competing per-canvas effects.

Alternative: zero out duration tokens for Reduced. Rejected because Spinner has an infinite animation and reduced duration is not equivalent to a static graphic; it also fails to make Full override existing media rules. Browser media emulation remains the test tool for actual OS behavior, not the toolbar implementation.

### 5. Add a focused foundation and authoring contract

Add a repository motion guide and a discoverable `Design System/Motion` docs entry, plus replayable duration/easing examples and representative Accordion/Spinner examples in both themes. Docs show approved defaults; examples consume generated semantic tokens. Replay is user-initiated and introduces no automatic movement beyond Spinner. Compare modes visually without changing functional state.

Link motion guidance from the design-system foundation, component authoring recipe, and applicable component/token guidelines. Prefer one authoritative guide over repeating rules in every skill. Explain purpose, role selection, reduced-motion alternatives, legacy Spinner composition, immediate focus/semantic changes, and a future JavaScript-motion requirement without inventing a public hook now.

### 6. Verify at the correct boundaries

Extend existing token contracts for all roles, values, matching theme contracts, and generated output. Browser harness checks cover ordinary/reduced system behavior, live preference changes, consumer token overrides, rapid toggles, and keyboard access before an exit completes. Retained served-Storybook checks cover all six combinations of toolbar mode and browser preference, Docs and Canvas, navigation/theme changes, nested themes, and returning to System. Package checks ensure preview override code/styles do not leak into distributed artifacts.

Assert observable state and actual animation/transition behavior rather than sleeping for a guessed duration. A reduced-motion check must prove no active rotation/transition, not merely pass because an animation was disabled in the test setup. Preserve existing test boundaries and use coverage-free focused feedback during implementation. At the final handoff run both complete unit/integration coverage gates, full browser verification, all Storybook render/play/a11y checks, lint/type/build/SSR/package checks and Storybook build; shared tokens and preview infrastructure require the full browser fallback.

## Risks / Trade-offs

- [Storybook Full rules drift from component CSS] → Keep the adapter small, cover both consumers and examples under OS reduce, and require updating preview support when introducing a new motion consumer.
- [Multiple Docs canvases compete over preview attributes] → Own the marker once per preview lifecycle and test simultaneous canvases, navigation and System cleanup.
- [Legacy Spinner values and shared duration combine unexpectedly] → Document multiplication, preserve the one-second baseline, and test legacy-only, shared-only and combined overrides.
- [Future animations bypass the reduced-motion contract] → Put the contract in authoring guidance and require a focused browser check for every new motion pattern.
- [Theme boundaries reset scoped token overrides] → Document existing explicit-theme reset behavior and verify customization in each intended scope.

## Migration Plan

1. Add shared roles and regenerate outputs without changing the existing standard roles or Spinner numeric token.
2. Update Spinner duration consumption and retain Accordion's existing behavior.
3. Add isolated Storybook preference tooling, foundation examples and guidance.
4. Complete focused checks, inline review, then the required final gates. Record browser scope and coverage mode accurately.

Rollback by reverting component consumption and preview tooling together, then regenerating the previous token sources. No stored user data, new dependency or consumer prop migration is involved.
