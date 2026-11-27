# Design

## Context

See [proposal.md](./proposal.md) for motivation and [the Tabs spec](./specs/tabs/spec.md) for behavior. There is no existing tablist/tabpanel implementation in the component source. Accordion supplies stable keyed panel and instance-ID conventions, while Menu supplies examples of enabled-item traversal and ownership-aware keyboard handling. Their state machines differ from Tabs and should not be generalized or imported as tab behavior.

The supplied design sheet is the visual authority: line/automatic and pills/manual examples with Overview selected, Activity optionally focused, and Settings disabled. The [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) supplies the accessibility baseline. The linked reference site's page could not be read through web retrieval during exploration; the proposal does not claim reference runtime behavior beyond the supplied sheet.

The project supports React 18/19, strict TypeScript, explicit declaration annotations, semantic theme tokens, and scoped `--fs-*` styling. Inventory, package CSS, Storybook, public exports, installed consumers, and browser ownership require explicit registration. Existing testing cadence defers coverage until the whole implementation is ready for final handoff.

## Goals / Non-Goals

**Goals:** Keep selection, focused tab, and mounted panel identity separate; preserve controlled authority; make dynamic fallback deterministic without callback loops; keep browser-dependent direction, focus, and scrolling behavior local to Tabs.

**Non-Goals:** URL or router integration, closable tabs, drag reordering, lazy mounting, asynchronous content fetching, panel transitions, typeahead, a compound/render-prop API, or a generalized composite-widget framework. Consumers can reorder the supplied items; Tabs does not provide a reordering UI.

## Decisions

### 1. Use the design sheet's item API and existing native-root conventions

Public types:

```ts
export type TabsItem = {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};
export type TabsStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type TabsProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'style' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'onChange'
> & {
  label: string;
  items: readonly TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  fullWidth?: boolean;
  style?: TabsStyle;
};
```

Forward an HTMLDivElement ref to the root. `label` names the tablist, not the root. Document that labels must have meaningful visible text and contain no interactive descendants; optional decorative icons can be included. Nonempty unique item IDs are validated following existing collection conventions. Missing/disabled selected IDs fall back instead of throwing, because dynamic collections explicitly support that case. No enabled item means an internal undefined effective selection; a public nullable/clearable selection API is unnecessary.

Alternative: compound children offer per-slot composition, but introduce more registration and identity machinery than the requested item model needs. Keep the first version data-driven, with native root styling and semantic token overrides.

### 2. Model requested selection separately from effective selection

The effective selection is the requested ID if it belongs to an enabled item, otherwise the first enabled ID. In uncontrolled mode initialize from defaultValue through this resolver and reconcile stored selection when items invalidate it. That reconciliation must settle the stored value, so reintroducing a previously removed ID does not revive an old selection. In controlled mode derive the effective display each render without updating internal selection or notifying the parent; a supplied ID that becomes valid again resumes control.

Only a user activation requesting a different effective enabled ID calls onValueChange. Click, keyboard activation, and automatic focus-selection share one transition function. Native focus-plus-click sequences must not issue duplicate requests, including when a controlled parent delays or rejects the update. Focus can change while the old valid controlled panel remains visible. Avoid callbacks from render or effects and avoid effect-driven request loops. Document the fallback contract so applications can reconcile their own data if desired.

Alternative: throw on invalid selected IDs, as some existing collection validation does, would break the design's dynamic fallback. Mutating a controlled value or announcing fallback as a user event would blur ownership.

### 3. Use roving focus within a named native-button tablist

Maintain focused ID independently of selection. Within the list, the focused enabled button is the roving tab stop. On leaving the list, reset its entry stop to the effective selected tab, so later Tab/Shift+Tab entry returns there even after manual exploration. Automatic mode selects on focus; manual mode waits for native Enter/Space or click. Keep activation centralized so native button key activation does not double-call callbacks. Buttons use `type="button"` and native disabled behavior.

Read the tablist's computed direction for horizontal key actions, honoring inherited RTL without a separate direction state. Horizontal lists handle Left/Right; vertical lists handle Up/Down. Both handle Home/End, skip disabled IDs, and wrap at enabled boundaries. Leave other arrows, modified shortcuts, and Tab/Shift+Tab to the browser. Scope handlers to the owning list so nested Tabs in panel content cannot drive their parent.

Track actual focus ownership across item updates. Repair a removed/disabled focused tab to the effective selected enabled tab only if the affected list owned focus; otherwise preserve the user's current position. If no enabled item remains, focus the named list programmatically using `tabIndex=-1`, without adding it to normal Tab order. Ordinary controlled value updates do not force focus to follow selection. Do not add a focus trap or Escape behavior.

Alternative: make every tab tabbable, or store only selection and derive focus from it, would break composite navigation or manual activation. Reuse small traversal ideas from Menu without coupling their distinct behavior models.

### 4. Render persistent panels with deterministic relationships

Generate one useId-based instance prefix, incorporating encoded item IDs for tab/panel relationships. The native root ID remains consumer-owned. Key each tab and each panel by item ID in persistent list and panel containers; do not move the same content between parents or render only the selected item. This preserves local state across selection and data reordering, while actual item removal unmounts its content.

Render native button `role="tab"` elements with aria-selected and aria-controls, and `role="tabpanel"` elements labeled by their tab IDs. Inactive panels use the native hidden attribute immediately, with a scoped hidden rule that cannot be undone by ordinary component display styles. With no panel motion there is no need for delayed visibility, transition lifecycle, or an inert-installation hydration phase. Only the active panel receives `tabIndex=0`, giving a predictable next keyboard stop for plain-text panels without querying arbitrary consumer markup for focusability.

Document that persistence retains component effects and fetching too; visibility is not lifecycle suspension. Keep state-preservation tests on an observable input/control value rather than private mount counters.

Alternative: conditional panel rendering saves mounted work, but loses local state. Lazy-first-mount and suspension semantics need a separate requirement and API, so are excluded.

### 5. Separate tab-list overflow from page and panel layout

For horizontal lists, use a nonwrapping flex row with an independently scrollable inline axis. Without fullWidth, tabs use their intrinsic label widths. With fullWidth, equal flexible cells fill available space but retain intrinsic minimum widths, producing list overflow when labels cannot fit instead of clipping them. Use logical properties; vertical lists stack buttons and place the panel beside the list, with zero minimum inline sizing and wrapping for narrow containers. Do not introduce automatic orientation changes.

Reveal a newly focused offscreen tab by scrolling only its list to the nearest visible edge. Avoid page-level scrollIntoView that can move an embedded app shell or distant ancestor unexpectedly. Keep overflow movement immediate, including under reduced motion. Panel content changes immediately; no indicator animation is required in this version.

Line uses a semantic list divider and selected underline. Pills uses a semantic selected background and radius. Both retain a separate focus outline and disabled text treatment without changing dimensions on selection. Record the approved pattern and map existing text/surface/focus/spacing roles first; add missing Tabs semantic roles for selected state, divider/indicator, pill surface, geometry, and disabled state with Corporate/Luna parity. Do not borrow an unrelated component-specific role just because its current color matches.

### 6. Keep examples and tests attached to their behavioral boundary

Create a Tabs family under the existing component layout. Shared plain-React examples use direct implementation imports, with separate Storybook metadata and harness adapters. Reproduce Workspace overview (3 projects, 8 members) for line/automatic and pills/manual in both themes. Include a story whose Activity tab is focused but Overview remains selected, plus controlled acceptance/delayed acceptance, dynamic items, empty/all-disabled lists, nested instances, vertical/RTL, full-width overflow, scoped overrides, and an editable persisted panel.

DOM tests cover transitions, disabled no-ops, callback counts, attributes/refs, and ID relationships. SSR/hydration checks cover initial defaults, selected panels, instance isolation, hidden panels, and stable relationships. Browser journeys cover native keyboard order, manual focus/selection, RTL/vertical arrows, real visibility and scrolling, focus repair without stealing background focus, local state after reorder/switch, 320px reflow, enlarged text, and theme inheritance. Keep public export, declaration-negative, CSS and React 18/19 installed-consumer checks independent of focused direct imports.

Register the family in inventory, root/family exports, CSS package exports/aggregate distribution, preview imports/category, public API expectations, installed consumers, browser catalog and behavior matrix. No dependency addition is required. Development tests stay coverage-free; at final handoff run both full independent coverage gates and required builds, types, lint, Storybook and browser/package checks. Shared tokens/public-export registration require full browser fallback. Never run overlapping Playwright commands sharing output directories; isolate final integration coverage after browser/build/package fixtures finish.

## Risks / Trade-offs

- [Hidden mounted content continues effects and requests] → Document eager persistence and offer manual activation for expensive content; do not imply hidden content is suspended.
- [Controlled fallback differs from the parent's stale value] → Document derived display and restoration when the supplied ID becomes valid; callbacks remain interaction-only.
- [Manual focus accidentally becomes selection] → Separate state and test focused Activity while Overview remains active.
- [Dynamic focus repair steals focus from another control] → Track list ownership and verify background updates with an unrelated input focused.
- [Overflow scrolling moves the page or app shell] → Scroll only the list and assert ancestor scroll positions remain stable.
- [Semantic roles collide across instances or nested lists] → Stable instance-prefixed IDs and keyboard ownership checks, exercised through SSR and nested browser examples.

## Migration Plan

This is additive. Land the recorded pattern/tokens, component, registrations, examples, and behavioral tests together. Existing components and testing policies are unchanged. Rollback removes the unreleased family and its registrations; no stored application data or external service migration is involved.
