# Proposal

## Why

Meaningful page regions need consistent vertical breathing room independent of width, gutters and sibling gaps. The supplied Section design complements Container and the child layout primitives with an optional semantic wrapper and approved block-padding presets.

## What Changes

- Export Section, SectionProps and SectionStyle with compact 32px, default 64px and spacious 96px block padding; render section by default with a div option.
- Add independent Section padding semantic roles in both themes, reusing existing raw dimensions without changing existing tokens.
- Integrate native props/refs, public JS/types, standalone/combined styles, SSR/package checks, Storybook examples and spatial guidance.
- Verify semantics, padding geometry, composition, explicit responsive overrides, adjacent padding edges, theme consistency and narrow enlarged content.

## Capabilities

### New Capabilities

- `page-section-spacing`: Optional semantic page regions with consistent block padding independent of content layout and parent-owned separation.

### Modified Capabilities

None.

## Impact

New section family and tests; additive public exports/styles; authoritative semantic sources and regenerated CSS/reference; layout stories, package fixtures and documentation. No new dependencies or primitive values. Preserve prior uncommitted components and unrelated work.
