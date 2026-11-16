# Tasks

Keep baseline, implementation, test authoring, repair, and review feedback coverage-free. Final coverage starts only after all agreed component, layout, story, documentation, and cleanup work is finished. Requirements live in [bottom-navigation](./specs/bottom-navigation/spec.md) and [app-shell-layout](./specs/app-shell-layout/spec.md); architecture and ownership live in [design.md](./design.md).

## 1. Pattern, tokens, and icons

- [x] 1.1 Record the approved bottom navigation and scrolling shell patterns in design-system documentation, including state, theme, focus, spacing, and safe-area ownership; verify mappings against the supplied PDF and existing semantic roles before implementing styles.
- [x] 1.2 Add only the missing semantic roles with Corporate/Luna parity, generated outputs, and scoped override documentation; verify token validation/generation and relevant coverage-free token tests pass.
- [x] 1.3 Add HomeIcon, InboxIcon, and HelpIcon through the existing Icon foundation and update icon exports, catalog, and documentation; verify decorative defaults, accessible naming support, gallery registration, and public export expectations with focused coverage-free tests.

## 2. BottomNavigation public component

- [x] 2.1 Implement the exact requested root/style/Item types, forwarded nav ref, named landmark, and `nav > ul > li` composition without cloning consumer links; verify DOM, root attributes/handlers, labelled-by naming, child refs, and nested handlers through focused coverage-free tests.
- [x] 2.2 Implement equal-width full-cell anchors, icon-over-label layout, wrapping, `aria-current="page"` styling, distinct focus, and the documented safe-area override; verify both themes, non-current focus, scoped override isolation, narrow labels, and padded-area activation through owned browser scenarios.
- [x] 2.3 Add SSR and type-contract tests for initial native-anchor current state, required navigation names, one-element Item children, custom anchor-producing links, and exact public types; verify relevant coverage-free unit/integration tests pass.
- [x] 2.4 Add consumer documentation and initial Navigation / BottomNavigation stories for Inbox current, Help current, keyboard focus on a different link, mapped anchors, narrow labels, and theme inheritance; verify render/play/accessibility checks for these stories and compare the themed examples with the design.

## 3. AppShell and AppContent layout

- [x] 3.1 Implement AppShell with native div props/ref, scoped styles, viewport default, and parent-height mode; implement AppContent with native props/ref and main default/div override; verify attributes, defaults, refs, and semantic roots in focused coverage-free DOM/SSR tests.
- [x] 3.2 Implement a finite-height column shell with persistent direct siblings and one shrinking, independently scrolling AppContent without default content padding; verify optional header, bottom bar visibility, final-content visibility above the bar, and parent versus viewport sizing through browser layout assertions.
- [x] 3.3 Verify intrinsic height reservation when navigation labels wrap and a nonzero safe-area override applies; add browser assertions proving content and navigation boxes do not overlap and the inset is counted once.
- [x] 3.4 Add Layout / AppShell and Layout / AppContent stories/docs, including a definite-height embedded example with `as="div"`, standalone viewport usage, API defaults, and a long-content composition; verify valid landmarks and scrolling in rendered stories.
- [x] 3.5 Cross-link all three component docs and explain normal-flow bottom placement, sizing constraints, direct-child composition, consumer-owned spacing, single safe-area ownership, embedding overrides, and no compensating bottom padding; verify the documented examples run as written.

## 4. Real navigation consumers

- [x] 4.1 Add React Router as a development-only dependency with its lockfile change, then add shared mixed NavLink/native-anchor consumer examples using an isolated story router; verify nested Inbox matching and that production source and runtime/peer dependencies do not import or require the router.
- [x] 4.2 Add a real browser-router consumer fixture on an isolated harness-served route with reload fallback and synthetic destination pages; verify `/inbox/42`, native Help activation, programmatic navigation, Back, and Forward update URLs and current indicators correctly.
- [x] 4.3 Add keyboard and native-link browser scenarios for Tab/Shift+Tab order, Enter activation, modified/new-tab navigation, and full-cell click targets; verify each link's accessible name/href, focused non-current styling, and one focusable anchor per Item.
- [x] 4.4 Document router matching ownership, native `aria-current` ownership, and the supported icon-first anchor markup; verify examples retain consumer handlers and refs and do not intercept native destination behavior.

## 5. Library and test-infrastructure registration

- [x] 5.1 Register all three components and types in family/root exports, component inventory, CSS/package exports and copy inventory, aggregate styles, and Storybook preview imports/categories; verify `component:check` passes for BottomNavigation, AppShell, and AppContent.
- [x] 5.2 Extend public-entry tests and installed consumer fixtures for component/icon imports, CSS entry points, React 18/19 SSR, declarations, and negative type cases; verify targeted coverage-free public API tests and `npm run verify:package` pass without production router coupling.
- [x] 5.3 Register owned browser scenarios in the harness catalog and behavior matrix, including the router fixture boundary and shell composition; verify discovery/ownership checks and execute the new scenarios without coverage.

## 6. Final integration verification and handoff

- [x] 6.1 Review the complete change from consumer call sites, clean up touched code, and verify `git diff --check`, `npm run lint`, `npm run typecheck`, and the three component checks pass before starting final coverage.
- [x] 6.2 Run `npm run test:storybook` and `npm run build-storybook`; verify all render/play/accessibility checks and the production Storybook build pass, and inspect both themes, focus, text enlargement, wrapping, and the long-content shell example.
- [x] 6.3 Run complete coverage-free browser verification using `npm run test:e2e:components -- --workers=2` and `npm run test:e2e:storybook -- --workers=1`, plus the repository's build/browser/package checks; verify all pass and record the full fallback reason: shared tokens, new public exports, and dependency/fixture registration changes.
- [x] 6.4 Run the unfiltered `npm run test:unit:coverage -- --maxWorkers=2` after the whole implementation and review are complete; verify the independent full production coverage gate passes. Repair failures with focused coverage-free feedback, then rerun invalidated gates.
- [x] 6.5 Run the unfiltered `npm run test:integration:coverage -- --maxWorkers=1` alone after browser, build, and package work finishes; verify the independent integration coverage gate passes without fixture contention. Reuse prior passing results only when subsequent changes cannot invalidate them.
- [x] 6.6 Report executed scope, coverage mode, timings, visual/keyboard/scroll findings, failures or unrun checks, manual assistive-technology/device gaps, and pending CI; verify the report distinguishes automated browser evidence from manual screen-reader testing and does not claim completion with required checks pending.
