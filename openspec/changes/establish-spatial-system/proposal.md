# Proposal

## Why

The library documents a 4px rhythm but lacks a complete guide for choosing space, distinguishing spacing from geometry, and composing website layouts. As the Button, Icon, and gallery grow, broad or misused token names risk coupling unrelated visual decisions.

## What Changes

- Establish a Carbon-inspired preferred spacing scale with a 4px working rhythm, documented 2px precision exceptions, and distinct guidance for component spacing and page layout.
- Document spacing, sizing, shape/boundary geometry, and layout constraints as separate spatial concerns, with parent/component ownership rules.
- Add a small, explicit semantic spacing vocabulary for consumers while preserving every existing public CSS property, its default value, and documented role behavior.
- Audit current spatial tokens, publish a classification/migration table, and add independent gallery roles where padding or alignment currently borrows height, border, or unrelated inset roles. Preserve current default appearance and document removal of incidental cross-role coupling.
- Keep DTCG 2025.10, exactly two conceptual layers, direct semantic-to-primitive references, px spatial dimensions, and rem typography.
- Add a Spatial System page and interactive examples in Storybook, backed by reusable documentation and links from the foundation, token reference, and README.
- Verify generated contracts, scoped overrides, both themes, visual compatibility, enlarged text and reflow, and existing independent coverage/package gates.

## Capabilities

### New Capabilities

- `spatial-system`: The documented spatial model, additive semantic token contract, compatibility rules, and discoverable Storybook examples for choosing and composing space.

### Modified Capabilities

None. There are no accepted specs in the current inventory. Existing unarchived Icon and gallery changes remain intact; this change adds spatial guidance and independent roles without replacing their behavior.

## Impact

- Token sources, generated CSS/reference, gallery preview styling, foundation/README documentation, and a new Storybook documentation page/example module.
- Focused token tests, existing build/package fixtures where necessary, and Storybook/browser verification.
- Public CSS additions are additive. Existing React APIs, package export paths, default geometry, scoped theme resets, and Corporate/Luna identities remain compatible. Overrides that relied on incidental cross-role coupling require explicit migration guidance.
- No new dependency, layout React component, density mode, breakpoint API, baseline grid, fluid token type, or framework-specific runtime.
