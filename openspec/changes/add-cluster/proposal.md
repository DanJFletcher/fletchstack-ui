# Proposal

## Why

Consumers need consistent horizontal relationships that wrap naturally within their available parent width. The supplied Cluster design approves a passive wrapping row primitive complementing existing Container and Stack.

## What Changes

- Add Cluster with none/actions/related gaps, start/center/end/baseline alignment and start/center/end row justification.
- Reference existing shared gap variables directly; add no tokens or aliases.
- Add family source, CSS, tests, stories, documentation, public exports, standalone/combined styles, and package/SSR verification.
- Demonstrate intrinsic wrapping and Container → Stack → Cluster composition with existing actions and badges.
- Preserve native child interactions/order/margins, existing components, and ordinary CSS wrappers. Exclude toolbar behavior, equal-width distribution, direction switching, reverse, nowrap, breakpoint objects, and automatic separators.

## Capabilities

### New Capabilities

- `wrapping-cluster`: Intrinsic horizontal wrapping, row gaps, cross-axis alignment and row justification in a passive native wrapper.

### Modified Capabilities

None. Existing completed changes remain unchanged; the durable spec inventory is empty.

## Impact

New family, public JS/types/CSS exports, package and test inventories, Storybook Layout navigation and spatial guidance. No dependencies, token changes, or breaking API changes.
