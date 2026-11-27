# AppShell

A finite-height column layout around one **direct** [AppContent](./app-content.md) child. Persistent siblings remain above or below it in source order. Put [BottomNavigation](./bottom-navigation.md) after content: its intrinsic height is reserved automatically while content scrolls, with no synchronized bottom padding and no fixed positioning.

```tsx
<AppShell>
  <header>Application header</header>
  <AppContent>
    <YourPage />
  </AppContent>
  <BottomNavigation aria-label="Primary">{/* Destination items */}</BottomNavigation>
</AppShell>
```

| Prop                     | Type                                                 | Default    |
| ------------------------ | ---------------------------------------------------- | ---------- |
| children                 | ReactNode                                            | required   |
| height                   | 'viewport' or 'parent'                               | 'viewport' |
| style                    | AppShellStyle: CSSProperties plus `--fs-*` overrides | —          |
| native div props and ref | HTMLDivElement                                       | forwarded  |

Viewport mode uses dynamic viewport height with a 100vh fallback. Normalize the host page's default margin. Parent mode uses 100% of a **definite-height** parent, suitable for embedded app regions and Storybook frames. This is a fixed-size layout region, not a minimum-height document wrapper. Persistent siblings must fit the available height.

```tsx
<div style={{ height: 480 }}>
  <AppShell height="parent">
    <AppContent as="div">{/* Long content */}</AppContent>
    <BottomNavigation
      aria-label="Primary"
      style={{ '--fs-bottom-navigation-safe-area-inset': '0px' }}
    >
      {/* Items */}
    </BottomNavigation>
  </AppShell>
</div>
```

The last content element can scroll fully above the navigation. Do not wrap AppContent in an extra layout element: it must be the shell's direct flexible child. Use `as="div"` when embedding within another main landmark. AppContent supplies scrolling, not content padding; compose your preferred content layout inside it.

The active theme supplies shell surface/text. Native className/style and semantic overrides affect only the instance. BottomNavigation alone owns bottom safe-area padding; neither shell nor content duplicates it. Override its inset to zero for embedded regions. See [BottomNavigation safe-area guidance](./bottom-navigation.md#bottom-placement-and-scrolling). Import tokens.css, app-shell.css and app-content.css plus your composed component CSS, or styles.css.
