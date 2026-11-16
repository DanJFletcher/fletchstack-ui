# Design

## Context

See [proposal.md](./proposal.md) for motivation and the two capability specs for behavioral requirements. The supplied bottom-navigation PDF and screenshot establish the approved visual pattern. The request and subsequent exploration authorize the navigation and complementary layout pattern.

The library has compound Navbar placement components and ordinary Stack, Container, and Section primitives, but no bottom destination bar or finite-height scrolling shell. Stack prevents children shrinking, so reusing it directly would obstruct the intended scroll region. Named icons use the shared Icon foundation, which automatically hides unlabelled icons from assistive technology. Home, Inbox, and Help icons are missing. React Router is not currently a dependency.

Public exports, CSS exports, component inventory, package fixtures, Storybook previews, and browser scenarios have explicit registrations. Focused tests use implementation imports; dedicated consumer tests verify the package entry points. The browser harness and Storybook showcase already supply a main landmark, which affects embedded AppContent examples.

## Goals / Non-Goals

**Goals:** Keep native semantics and consumer elements intact; make layout and safe-area ownership explicit; verify observable routing and scrolling in a real browser; expose a small, predictable styling surface.

**Non-Goals:** Route matching, a selection model, cloned link props, navigation interception, fixed/sticky positioning in BottomNavigation, responsive hiding, label-free destinations, automatic shell child discovery, multiple independent content scrollers, or new motion effects.

## Decisions

### 1. Preserve link elements and use semantic selectors

Use a forwarded-ref root with `Object.assign` for the Item subcomponent, matching Navbar's public compound export pattern. Root renders nav and ul; Item renders li around `children` unchanged. Do not use cloneElement, library Link wrappers, router hooks, or generated anchor props. This preserves custom link components and nested handlers without imposing their prop/ref types on the Item API.

Use the exact BottomNavigation public types in the request: the navigation-name union, native nav props omitting owned fields, `BottomNavigationStyle` with `--fs-*` overrides, and a single ReactElement child per Item. Export all three public types from root and component-family entry points. Do not add runtime route validation or a requirement to inspect a custom link component's output during rendering. Document that it must produce one anchor with an icon followed by visible label content.

Style the actual rendered anchor, using `a[aria-current="page"]` for the current state and `:focus-visible` for focus. All selectors are scoped under the component. Anchors fill their cells; list items use equal flexible widths with `min-width: 0`; text wraps. A positioned pseudo-element on the anchor draws the icon pill without inserting wrappers inside consumer links. The first decorative SVG icon occupies the documented icon position above the label. The pill and label color reflect current state, while a separate outline surrounds the focused link. Neither an inactive current attribute nor keyboard focus creates an additional selection model.

Alternative: a render prop or cloned link could inject classes and wrap icons, but would complicate router integration and violate the supplied-child contract. CSS selectors preserve that contract and SSR appearance.

### 2. Introduce independently useful shell and content components

Proposed public layout APIs follow existing native-attribute/ref/style conventions:

- `AppShellProps`: native div attributes excluding owned children/style/dangerouslySetInnerHTML, required `children: ReactNode`, `height?: 'viewport' | 'parent'` defaulting to `viewport`, and `style?: AppShellStyle`. Root ref is HTMLDivElement.
- `AppContentProps`: common native main/div attributes excluding owned children/style/dangerouslySetInnerHTML, required `children: ReactNode`, `as?: 'main' | 'div'` defaulting to `main`, and `style?: AppContentStyle`. Root ref is HTMLElement.
- Each style type extends CSSProperties with the existing `--fs-${string}` string/number/undefined index pattern.

Use a column flex shell with `min-width: 0`, finite block size, and no shell scrolling. Its persistent direct children do not shrink. A single direct AppContent uses `flex: 1 1 0`, `min-height: 0`, `min-width: 0`, and `overflow: auto`. This supports an optional header before content and a bottom bar after content without hardcoding two grid tracks. Consumers must keep AppContent as one direct layout child; document this supported relationship instead of traversing arbitrary wrappers or reparenting children.

Viewport mode uses a `100vh` fallback followed by `100dvh`. Parent mode uses 100% of a definite-height parent. Neither is a minimum-height-only layout, since that would let long content push the navigation out of view. Document the standalone page's normal margin reset and ancestor constraints; the component does not add global page rules. AppContent adds no content padding: consumers compose Container, Section, or their own spacing.

Alternative: viewport-fixed bottom navigation would require synchronized content padding and additional overlay coordination. A shell row reserves the actual height naturally. Grid is viable, but column flex supports optional persistent siblings without a row-count API.

### 3. Own safe area once in BottomNavigation

BottomNavigation owns bottom safe-area padding through a documented scoped CSS custom property, `--fs-bottom-navigation-safe-area-inset`, defaulting to `env(safe-area-inset-bottom, 0px)`. Add it to ordinary semantic block padding. AppShell and AppContent add no second inset; normal layout reserves the navigation's complete rendered box. Embedded examples can set the inset to `0px`; a deterministic browser example can override it to verify reservation. Document the viewport `viewport-fit=cover` integration when appropriate, without changing the library's host page metadata.

Alternative: shell-only padding would leave standalone navigation without safe-area protection. A fixed height assumes labels and inset dimensions, so use intrinsic bar height instead.

### 4. Record and reuse semantic design roles

Record the new pattern in the design-system documentation before implementing its CSS. Reuse existing semantic surface, text, action, divider, focus, typography, spacing, radius, and icon-size roles by meaning. Add only missing roles for navigation's current-icon background/current foreground and layout surfaces, with Corporate/Luna parity and documented per-instance overrides. Record any new token mappings with the approved pattern; do not introduce raw palette values in component CSS or reuse unrelated component roles solely because their colors match. Keep dimensions in pixels and typography in the established relative units. No decorative transition is required.

Add named HomeIcon, InboxIcon, and HelpIcon using the existing 24-unit Icon foundation. Update the named icon barrel, root exports, gallery catalog, and export expectations. In consumer examples leave them unlabelled so the foundation makes them decorative; the current NamedIconProps intentionally owns `aria-hidden`, so do not broaden shared icon accessibility types just to reproduce illustrative markup from the request.

### 5. Demonstrate real consumers and explain layout in Storybook

Add Navigation / BottomNavigation plus Layout / AppShell and Layout / AppContent documentation. Include API/default tables, minimal usage, mapped native anchors with keys on Item, and mixed NavLink/native-link examples. Keep Home, Inbox, and Help destinations shared between themes. Demonstrate Inbox current, Help current, focus on a different link, long labels, nested themes, and one overridden instance next to an unchanged instance.

The principal app composition is:

```tsx
<AppShell height="parent">
  <AppContent as="div">{/* Long page content */}</AppContent>
  <BottomNavigation aria-label="Primary">{/* Consumer links */}</BottomNavigation>
</AppShell>
```

Place this inside a definite-height story frame. Also document standalone viewport sizing and default main semantics. Cross-link all three component docs and explain that the shell keeps the bar visible through layout, content owns its own scroll, the actual nav height is reserved, and callers need no manual compensating bottom padding. Explain safe-area ownership and the embedding override. The last content element must visibly scroll above the bar in the demo.

Add React Router as a development-only dependency compatible with the existing Node/React toolchain, using the existing project's package manager. Confine its imports to stories and integration/browser fixtures. Verify real NavLink nested-route behavior; a hand-written location-matching fake is insufficient. Storybook examples use an isolated memory router so navigation does not disrupt Storybook's URL. The history browser scenario uses a real browser router on an isolated harness-served consumer entry with fallback routing, so native Help navigation, Back/Forward, and reloads do not destroy the fixture setup. Register that boundary with the existing harness catalog and ownership tooling; do not make the ordinary gallery mount state depend on a destructive native navigation.

### 6. Verification follows the existing cadence

Use focused coverage-free DOM/SSR tests for names, attributes, refs, supplied link identity, native handlers, initial current attributes, public types, and default main/div behavior. Extend dedicated public API and installed consumer fixtures for all new entry points, styles, and icons. Use browser tests for actual focus order, current styling after attribute changes, full-cell hit targets, native and router navigation/history, both themes, wrapping, scroll boundaries, and safe-area reservation. Inspect layout positions rather than relying only on screenshots or DOM attributes.

Run coverage-free development feedback throughout the whole three-component change. At final handoff run both unfiltered coverage gates and all required component, lint/type, Storybook, browser, build, SSR, and package checks. Shared token/public-export/dependency changes require full local browser verification rather than an affected-only claim. Keep the full integration coverage run isolated from browser/build/package fixture work and run it last. Report manual assistive-technology or physical-device checks separately from automated Chromium evidence.

## Risks / Trade-offs

- [Consumer link markup differs from the documented icon-first shape] → Document the supported anchor/SVG pattern and test a custom anchor-producing component without cloning it.
- [Parent height is indefinite or an extra wrapper prevents flex sizing] → Document one direct AppContent and a definite parent height; show valid standalone and embedded examples.
- [Safe-area padding is doubled by an application] → Document the single owner and the scoped inset override; test a nonzero inset.
- [Native anchor navigation tears down browser fixture state] → Serve a dedicated route-aware consumer fixture so reloads and history retain a functioning app.
- [A focused visual test passes without checking activation or scrollability] → Assert actual navigation, URL/current state, focus movement, and final-content visibility above the bar.
- [Router dependency leaks into production] → Keep it development-only and verify installed package runtime dependencies and bundles.

## Migration Plan

This is additive. Register the pattern, tokens, components, styles, icons, stories, and tests together. Existing components and accepted testing policies remain unchanged. Consumers opt into AppShell/AppContent or place BottomNavigation with their own layout. Rollback removes the new exports and registrations as one unreleased change; no persisted application state or data migration is involved.
