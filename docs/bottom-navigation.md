# BottomNavigation

Approved from the supplied bottom-navigation design: equal destination cells, icon above visible label, a rounded current-icon indicator, and a distinct full-link focus outline. Native links own navigation. The component uses a named `nav > ul > li` structure and renders each supplied link unchanged. No routing dependency, selection state, event interception, or viewport positioning is built in.

```tsx
<BottomNavigation aria-label="Primary">
  <BottomNavigation.Item>
    <a href="/">
      {' '}
      <HomeIcon />
      Home
    </a>
  </BottomNavigation.Item>
  <BottomNavigation.Item>
    <a href="/inbox" aria-current="page">
      <InboxIcon />
      Inbox
    </a>
  </BottomNavigation.Item>
  <BottomNavigation.Item>
    <a href="/help">
      <HelpIcon />
      Help
    </a>
  </BottomNavigation.Item>
</BottomNavigation>
```

Use one anchor or custom link component rendering an anchor per Item. Put a decorative SVG first, followed by visible label text. Named library icons are decorative automatically when unlabelled. Each anchor fills its cell so padding is clickable; labels wrap. Preserve normal Tab/Shift+Tab and Enter navigation. Focus does not move the current indicator.

## API

| Component / prop                 | Type                                                         | Default   |
| -------------------------------- | ------------------------------------------------------------ | --------- |
| BottomNavigation children        | ReactNode                                                    | required  |
| aria-label / aria-labelledby     | at least one string                                          | required  |
| ref                              | HTMLElement (native nav)                                     | —         |
| style                            | BottomNavigationStyle: CSSProperties plus `--fs-*` overrides | —         |
| native nav attributes / handlers | native props                                                 | forwarded |
| BottomNavigation.Item children   | one ReactElement producing an anchor                         | required  |

The public types are BottomNavigationProps, BottomNavigationItemProps, and BottomNavigationStyle. ID, className, handlers, native anchor attributes, router props, refs, and nested handlers remain consumer-owned. For mapped destinations place React keys on Item.

## Router consumer

```tsx
<BottomNavigation aria-label="Primary">
  <BottomNavigation.Item>
    <NavLink to="/">
      <HomeIcon />
      Home
    </NavLink>
  </BottomNavigation.Item>
  <BottomNavigation.Item>
    <NavLink to="/inbox">
      <InboxIcon />
      Inbox
    </NavLink>
  </BottomNavigation.Item>
  <BottomNavigation.Item>
    <a href="/help" aria-current={isHelpPage ? 'page' : undefined}>
      <HelpIcon />
      Help
    </a>
  </BottomNavigation.Item>
</BottomNavigation>
```

NavLink supplies `aria-current="page"`, including for `/inbox/42`; the application supplies it for ordinary anchors. Styling reads that attribute directly, including before hydration. Browser history and programmatic navigation need no component-specific integration. React Router belongs to the application, not the library runtime.

## Bottom placement and scrolling

Compose [AppShell](./app-shell.md) and [AppContent](./app-content.md). The shell's persistent bottom row stays visible while content scrolls in the remaining space. The navigation is in normal flow, not fixed or sticky. Its actual height is reserved automatically, including wrapped labels: do not add matching bottom padding to content.

```tsx
<div style={{ height: 480 }}>
  <AppShell height="parent">
    <AppContent as="div">{/* Long page content */}</AppContent>
    <BottomNavigation aria-label="Primary">{/* Destination items */}</BottomNavigation>
  </AppShell>
</div>
```

Use default viewport shell sizing for a standalone app with a normalized page margin. Parent mode needs a definite-height parent. Use `as="div"` inside an existing main landmark, such as a Storybook preview. Keep AppContent a direct shell child.

BottomNavigation adds bottom safe-area padding once through `--fs-bottom-navigation-safe-area-inset`, defaulting to `env(safe-area-inset-bottom, 0px)`. Shell/content add no extra inset. A host using edge-to-edge viewport layout may need `viewport-fit=cover` in its viewport metadata. In embedded previews override the inset to `0px`.

## Semantic styling

Corporate and Luna share layout. Surface, text, divider, current foreground, and indicator resolve through `--fs-bottom-navigation-*` roles. Focus uses existing link focus tokens. Padding, gap, icon size, pill dimensions/radius, label size and current weight are semantic roles too. Override e.g. `style={{ '--fs-bottom-navigation-indicator': 'var(--fs-surface)' }}` on one instance; neighboring bars and nested theme regions retain their own values. Import tokens.css, icon.css and bottom-navigation.css, or the aggregate styles.css.
