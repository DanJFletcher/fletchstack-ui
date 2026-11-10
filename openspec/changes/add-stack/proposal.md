# Proposal

## Why

Consumers need an optional, consistent vertical relationship primitive that preserves existing spacing customization. The supplied Stack reference and explicit approval define sibling spacing and alignment without replacing ordinary CSS wrappers.

## What Changes

- Add Stack with related/group/section/none gaps and stretch/start/center/end alignment, rendering a passive native div.
- Use existing semantic spacing variables directly; introduce no tokens or semantic-to-semantic aliases.
- Add family-owned source, CSS, tests, stories, public exports, packaged styles, SSR checks, and spatial documentation.
- Compose existing form controls and Container. Preserve child margins, DOM order, existing components, and ordinary flex/grid composition.
- Exclude horizontal/reverse/wrapping APIs, breakpoint objects, automatic separators, surfaces, insets, and Cluster implementation.

## Capabilities

### New Capabilities

- `vertical-stack`: Vertical direct-child spacing and cross-axis alignment with native composition and shared semantic gaps.

### Modified Capabilities

None. The durable spec inventory remains empty; existing completed changes remain untouched.

## Impact

A new component family; public JS/types and standalone/combined stylesheet exports; package/test inventories; Storybook Layout navigation; spatial and component guides. No new dependencies, token values, or breaking changes.
