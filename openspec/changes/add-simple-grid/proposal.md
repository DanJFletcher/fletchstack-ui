# Proposal

## Why

Collections need equal-width columns that respond to available parent space. The supplied SimpleGrid design complements Container, Stack and Cluster without duplicating their responsibilities or adding interactive semantics.

## What Changes

- Add SimpleGrid, SimpleGridProps and SimpleGridStyle with related (default), group and zero gaps, native div attributes and refs.
- Add an approved 240px preferred item minimum semantic role in both themes, reusing existing gap roles directly.
- Integrate standalone/combined CSS, public package consumers, SSR coverage, Storybook examples and spatial documentation.
- Verify equal tracks, intrinsic reflow, row sizing, themes, scoped overrides, keyboard order and accessible narrow text layouts.

## Capabilities

### New Capabilities

- `adaptive-simple-grid`: Passive, parent-responsive equal-width collection layout with semantic spacing and an overridable preferred item minimum.

### Modified Capabilities

None.

## Impact

New simple-grid component family and tests; additive public exports and stylesheet entrypoint; authoritative token sources plus generated outputs; layout navigation, documentation and package verification. No dependencies or changes to existing component behavior.
