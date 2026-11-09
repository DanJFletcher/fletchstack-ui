# Proposal

## Why

Consumers currently hand-author SVG wrappers, including the moon in the Button stories, without a shared sizing or accessibility contract. A reusable Icon foundation lets consumers supply their own artwork while an opt-in named collection grows consistently alongside the design system.

## What Changes

- Add a public, typed, ref-forwarding SVG Icon that renders consumer-supplied SVG children, inherits color, uses semantic size tokens, and supports decorative or accessibly labeled output.
- Supply eight individually importable named components built on Icon: MoonIcon, SunIcon, CheckIcon, CloseIcon, ChevronDownIcon, ArrowRightIcon, PlusIcon, and ExternalLinkIcon.
- Establish a coherent 24×24 outline drawing convention and document ownership of artwork, sizing, accessibility, and external spacing in the design foundation.
- Extend both Corporate and Luna with the same icon semantic token contract and scoped customization behavior.
- Demonstrate custom artwork, the named catalog, meaningful/decorative modes, overrides, both themes, and Button composition in Storybook; replace the private story-only moon.
- Extend exports, stylesheets, declarations, packed-consumer checks, and independently covered test suites without changing Button's public API or React support.
- Keep runtime icon-name lookup, third-party icon collections, loading/animation, interactive icon controls, and automatic directional mirroring out of scope.

## Capabilities

### New Capabilities

- `icon-rendering`: Consumer-supplied SVG composition, accessible semantics, theme-aware sizing/customization, Button composition, and server-compatible package consumption.
- `named-icons`: An explicitly imported catalog of consistent icon artwork built on the same public rendering contract, with unused artwork removable from consumer bundles.

### Modified Capabilities

None. The project currently has no accepted capability specs; existing Button behavior remains unchanged.

## Impact

- Public exports and declarations in `src/`; new icon CSS, stylesheet publication, and package export configuration.
- Primitive/semantic token documents, generated CSS/reference, foundation documentation, README, and framework consumption examples.
- Storybook stories and preview CSS imports; unit, integration, E2E, and packed-package verification fixtures.
- No additional runtime dependency, external asset request, or supported-framework/React version change. Existing independent coverage thresholds remain intact; E2E continues to exclude scripts.
