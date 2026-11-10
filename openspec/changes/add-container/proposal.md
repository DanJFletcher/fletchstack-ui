# Proposal

## Why

Consumers need a consistent optional wrapper for centered page widths and responsive inline gutters. The supplied Container design and explicit approval define its layout contract without replacing ordinary flex/grid composition.

## What Changes

- Add a passive div Container with reading/content/wide widths, content as default, and optional gutters enabled by default.
- Add identical maximum-width and gutter semantics to both themes through the existing generator.
- Add family-owned stories/tests, public exports, standalone and combined CSS, consumer checks, and spatial guidance.
- Preserve every existing spatial token and all unrelated component work. No breakpoint objects, polymorphism, providers, browser layout logic, surfaces, or child layout are introduced.

## Capabilities

### New Capabilities

- `content-container`: Centered bounded content with responsive inline gutters and native div composition.

### Modified Capabilities

None. The durable spec inventory is empty; the existing spatial-system change remains intact.

## Impact

The new component family, theme token sources and generated outputs, package exports/style copier, test/consumer inventories, Storybook Layout navigation, spatial guide, and documentation. No runtime dependencies or breaking changes.
