# Design

## Context

See [proposal](./proposal.md). The existing spatial guide uses ordinary wrappers and semantic px roles. Families own their source, CSS, unit tests and CSF stories; central integration/E2E and package fixtures inventory public modules. Theme generation redeclares every semantic role on explicit data-theme boundaries. This cross-cutting component touches those contracts without changing existing spatial defaults.

## Goals / Non-Goals

**Goals:** Keep Container a thin SSR-safe div and put all responsive geometry in CSS. Add independently overrideable roles and preserve native consumer attributes. Capture the supplied design as the approved contract.

**Non-Goals:** No polymorphic element, breakpoint-object API, automatic stack/grid, surfaces, vertical spacing, overflow repair, providers, or client viewport checks.

## Decisions

- Use forwardRef with native div props (only style replaced by ContainerStyle), default size content and default gutters true. Native attributes and children pass through without an attribute filtering layer; Container introduces no interaction itself. This follows the passive Card convention rather than the restricted control semantics of Separator.
- CSS uses box-sizing:border-box, inline-size:100%, max-inline-size from the preset, min-inline-size:0, margin-inline:auto and conditional padding-inline. Native block flow remains intact; children define their own layout. Do not set overflow or add flex/grid to the wrapper.
- Semantic roles: container.maxWidth.reading/content/wide and container.gutter.small/large, with direct primitive aliases. Add px720, px1120, px1440 only if missing; reuse px16 and px24. Identical values across themes. Select gutter.small below 600px, gutter.large in a fixed min-width:600px CSS query; breakpoint is documented CSS behavior, not an ineffective custom-property media query or new breakpoint API.
- Keep gutter selection on the component declaration, using the two inherited semantic properties. Avoid a third inherited active-gutter variable, which could leak from outer Container state. Explicit nested themes reset complete generated roles; verify both override inheritance and reset behavior.
- Storybook Layout/Container uses family-local demonstration CSS for outlines, measurements, page padding removal and content grids. Label guides clearly. Examples compose existing Cards, Buttons and fields while parent CSS supplies gaps. No demo guide ships in container.css.
- Verification layers: focused red/green public API tests, source integration geometry/SSR/hydration, package React 18/19 consumer checks, Storybook axe/play checks, and Chromium journeys for all preset/breakpoint/parent/RTL/theme/focus contracts. Preserve each existing 100% coverage gate and all baseline spatial tokens.

## Risks / Trade-offs

- Gutters use viewport width, so a narrow nested parent in a wide viewport still receives 24px → document and test; use gutters=false when the parent already owns inset.
- A fixed pixel reading preset cannot guarantee typographic measure → document font/content dependence and retain normal typography.
- Children with intrinsic minima or unbreakable content can overflow → retain visible overflow and show consumer-owned min-width/wrapping choices; never conceal it with clipping.
- Native props permit consumer styling that changes layout → document the provided contract and scoped token customization; avoid an arbitrary styling-prop API.

## Migration Plan

Additive exports/tokens/CSS and optional adoption. Existing wrappers and every spatial token retain their contract. Consumers can remove the new wrapper and retain their previous layout to roll back; no data migration is required.
