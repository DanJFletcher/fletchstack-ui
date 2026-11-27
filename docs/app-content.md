# AppContent

The independently scrolling content region of [AppShell](./app-shell.md). Use one direct AppContent child between persistent header and [BottomNavigation](./bottom-navigation.md) siblings. The shell reserves their actual height automatically. Content needs no compensating bottom padding and the bottom bar needs no viewport-fixed positioning.

```tsx
<AppShell>
  <AppContent>
    <YourPage />
  </AppContent>
  <BottomNavigation aria-label="Primary">{/* Destination items */}</BottomNavigation>
</AppShell>
```

| Prop                 | Type                                                   | Default   |
| -------------------- | ------------------------------------------------------ | --------- |
| children             | ReactNode                                              | required  |
| as                   | 'main' or 'div'                                        | 'main'    |
| style                | AppContentStyle: CSSProperties plus `--fs-*` overrides | —         |
| native props and ref | HTMLElement                                            | forwarded |

The default is the page's main landmark. Choose `as="div"` inside an existing main landmark, including Storybook's preview. The component owns overflow and zero minimum sizing, but no default content padding. Use Container, Section, or native layout inside it for spacing.

For a standalone app, AppShell defaults to viewport sizing; normalize the host page margin. For an embedded app use `height="parent"` on AppShell and provide a definite-height parent. See [the working shell composition](./app-shell.md) for a copyable example and long-content stories. Scroll content to reach the final element above the persistent bar. BottomNavigation owns safe-area padding once; disable its inset in embedded previews when appropriate.
