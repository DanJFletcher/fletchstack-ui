# Proposal

## Why

Accordion introduced shared motion tokens, while Spinner still owns its rotation timing and Storybook has no motion preview control. Establish a small motion foundation now so future components share purposeful timing, reliable reduced-motion behavior, and consistent authoring guidance.

## What Changes

- Expand the two-layer token system with shared fast/standard/slow durations, loading rotation duration, and standard/enter/exit easing, initially identical in Corporate and Luna.
- Preserve Accordion's current standard timing and opt-in panel motion, and align Spinner with shared timing without changing its current rotation speed or removing its existing customization token.
- Define reduced-motion and interaction rules: honor system preference in consumer applications, keep essential information available, and never delay focus, semantic state, or keyboard access behind a transition.
- Add a Motion foundation page with interactive examples and a Storybook-only System / Reduced / Full motion toolbar.
- Update authoring guidance and verification for preference changes, preview isolation, and animation-independent behavior.
- Keep this change CSS-first: no animation dependency, public preference hook, consumer motion provider, distance scale, or broad animation rollout.

## Capabilities

### New Capabilities

- `motion-foundation`: Shared motion tokens, accessible component motion, Storybook preference previews, and documented authoring rules.

### Modified Capabilities

None. Existing browser verification and coverage requirements remain unchanged.

## Impact

- Token sources and generated artifacts; existing duration/cubicBezier validation is reused.
- Accordion and Spinner styles, their motion contracts, and backward-compatible Spinner customization.
- Storybook preview configuration, foundation stories/docs, and browser boundary checks.
- Design-system documentation and component authoring guidance; no new runtime dependency or component prop is required.
- Implementation requires full local browser verification because shared tokens and preview infrastructure are affected. Development feedback remains coverage-free; final verification retains both independent full coverage gates and the existing build/package checks.

Reference inspiration: [Motion foundation](https://themed-react-ui-foundation.replit.app/?path=/docs/foundations-motion--docs). Its documented timings differ from the active ACME theme; this change defines local values explicitly rather than copying those conflicting values.
