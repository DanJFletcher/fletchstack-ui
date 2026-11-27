## Why

Applications need a compact destination bar that works equally with native anchors and router links, plus a layout that keeps the bar visible without covering page content. The library currently has neither bottom navigation nor an app shell with an independently scrolling content region.

## What Changes

- Add `BottomNavigation` and `BottomNavigation.Item` with semantic list structure, equal-width link targets, theme-aware current indicators, and independent keyboard focus styling.
- Preserve consumer link elements, refs, handlers, and navigation behavior; derive current appearance directly from the rendered anchor's `aria-current="page"`.
- Add `AppShell` and `AppContent` to allocate persistent header/footer space and scroll content without manual bottom padding, with viewport-height and parent-height modes.
- Add Home, Inbox, and Help named icons using the existing icon foundation.
- Add consumer documentation and Storybook examples for native links, real React Router links, theme inheritance, keyboard focus, and bottom placement with long scrolling content.
- Keep React Router confined to development examples and integration fixtures. Register the components and styles in existing public-entry, package, Storybook, and test infrastructure.

## Capabilities

### New Capabilities

- `bottom-navigation`: Named navigation containing consumer-owned links, semantic current styling, native interaction, public types, and documented examples.
- `app-shell-layout`: Viewport or parent-sized app layout with persistent sibling regions and a scrolling content region, including bottom-navigation composition guidance.

### Modified Capabilities

None. Existing browser and coverage policies remain unchanged.

## Impact

Adds public component and icon exports, component styles and semantic tokens, inventory entries, stories, documentation, and unit/integration/browser coverage. Adds a development-only React Router dependency for consumer verification. No existing component API changes, automatic route matching, or fixed positioning in the base navigation component.
