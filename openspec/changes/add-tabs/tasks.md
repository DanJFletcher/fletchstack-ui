# Tasks

Keep baseline, development, debugging, and review checks coverage-free. Full coverage starts only after the entire agreed Tabs implementation, examples, tests, documentation, and cleanup are finished. See [requirements](./specs/tabs/spec.md) and [design decisions](./design.md).

## 1. Pattern, tokens, and component integration

- [x] 1.1 Record the supplied line/pills Tabs pattern and its selected, focused, disabled, orientation, and overflow states in design-system documentation; verify semantic-role mappings against existing Corporate/Luna tokens before implementing styles.
- [x] 1.2 Add missing Tabs semantic roles and generated outputs with theme parity and scoped override documentation; verify `npm run tokens` and focused coverage-free token tests pass without introducing raw palette values into component CSS.
- [x] 1.3 Prepare the Tabs family and register root/family exports, public types, CSS distribution/package exports, inventory, preview import/category, and initial harness ownership; verify structural registration findings are resolved as authored component tests and stories land below.

## 2. Public contract and selection lifecycle

- [x] 2.1 Implement the item-driven public types, native root/ref forwarding, named button tablist, unique ID validation, and instance-specific tab/panel relationships; verify focused coverage-free DOM tests cover native props, refs, disabled items, invalid identities, and multiple instances.
- [x] 2.2 Implement controlled/uncontrolled selection and deterministic initialization/fallback without effect-driven callbacks; verify tests cover valid/invalid defaults, controlled acceptance/delay/rejection, disabled/already-selected no-ops, removal/reintroduction, and empty/all-disabled items.
- [x] 2.3 Keep inactive panels mounted and immediately hidden, with keyed state preservation and an active keyboard-reachable panel; verify observable editable state across tab switching/reordering and that hidden controls disappear from accessibility queries and keyboard navigation. Document that hidden content continues effects/fetching.
- [x] 2.4 Add SSR/hydration tests for effective initial selection, hidden panels, stateful content, and collision-free stable IDs; verify the focused integration suite passes without coverage and without hydration recovery errors.
- [x] 2.5 Document API types/defaults and copyable item-driven controlled/uncontrolled usage, including the fallback and restoration contract; verify the examples compile and explain the initial exclusions without implying routing or lazy lifecycle behavior.

## 3. Keyboard, focus, and responsive presentation

- [x] 3.1 Implement independent focus/selection with automatic and manual activation and selected-tab entry on list re-entry; verify native Enter/Space and pointer requests occur once, including focus-plus-click with a delayed controlled parent, through focused DOM and browser tests.
- [x] 3.2 Implement enabled-item wrapping, Home/End, horizontal/vertical arrows, inherited RTL, and owning-list isolation; verify browser journeys preserve ordinary Tab/Shift+Tab, unrelated scrolling keys, nested Tabs behavior, and non-submitting buttons in forms.
- [x] 3.3 Implement focus repair for a removed/disabled focused tab and a programmatic list target when no enabled tab remains; verify browser tests retain unrelated input focus during background updates and never move focus into hidden content.
- [x] 3.4 Implement line/pills styling, independent focus indication, fullWidth distribution, vertical presentation, narrow wrapping, and horizontal list overflow; verify Corporate/Luna, nested themes, scoped overrides, 320px reflow, 200% text/user spacing, and no page-level horizontal overflow.
- [x] 3.5 Reveal offscreen focused tabs by scrolling only their list, without animation dependencies; verify keyboard access to overflowing tabs and unchanged ancestor/page scroll positions under normal and reduced-motion preferences. Document orientation and fullWidth behavior alongside these examples.

## 4. Storybook and consumer verification

- [x] 4.1 Add shared plain-React examples, Navigation / Tabs stories, and separate harness adapters; reproduce the sheet's Workspace overview with 3 projects/8 members, line/automatic and pills/manual, Overview selected and Activity focused in manual mode, in both themes. Verify relevant render/play/accessibility checks and visual comparison.
- [x] 4.2 Add focused examples for controlled/delayed state, dynamic fallback, empty/all-disabled items, editable persistence, nested instances, vertical/RTL, full-width overflow, and scoped overrides; verify story interactions and owned browser scenarios exercise their stated outcomes, and docs explain the API and lifecycle trade-offs.
- [x] 4.3 Extend public API expectations and installed typed/runtime consumers for Tabs, its public types, and standalone/aggregate CSS; verify required naming/types reject invalid usage, React 18/19 SSR works, and package verification retains tree shaking without new runtime dependencies.
- [x] 4.4 Finalize browser catalog and behavior-matrix ownership, consumer documentation links, and source/style registration; verify `npm run component:check -- Tabs`, discovery/ownership checks, and all new coverage-free DOM/integration/browser scenarios pass.

## 5. Final integration checks and handoff

- [x] 5.1 Review the complete change from consumer usage, clean up touched implementation, and verify `git diff --check`, `npm run lint`, `npm run typecheck`, and `npm run component:check -- Tabs` pass before starting final coverage.
- [x] 5.2 Run all Storybook render/play/accessibility checks and `npm run build-storybook`, plus library/browser/package verification; verify all pass and inspect both themes, manual focus/selection, overflow, and persisted panel state. Record manual accessibility evidence and concrete gaps separately.
- [x] 5.3 Run complete coverage-free browser verification with `npm run test:e2e:components -- --workers=2` and `npm run test:e2e:storybook -- --workers=1`; verify all pass, record shared token/public-export registration as the full fallback reason, and avoid overlapping Playwright runs sharing output directories.
- [x] 5.4 Run unfiltered `npm run test:unit:coverage -- --maxWorkers=2` at the completed implementation boundary; verify the independent full production coverage gate passes. Return failures to focused coverage-free repair before rerunning any invalidated gate.
- [x] 5.5 Run unfiltered `npm run test:integration:coverage -- --maxWorkers=1` alone after browser/build/package fixture work finishes; verify the independent integration coverage gate passes without relaxed thresholds, retries, or timeouts.
- [x] 5.6 Report actual checks, coverage modes, timings, corrective registration edits, final behavior findings, remaining manual screen-reader/device gaps, and pending CI; verify the report distinguishes development feedback from final coverage and does not claim completion with required local gates pending.
