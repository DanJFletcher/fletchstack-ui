# Design

## Context

See [the proposal](proposal.md#why) and [gallery contract](specs/icon-gallery/spec.md). The working tree contains the completed, unarchived add-icon-components implementation. Its Icon stories maintain an eight-entry catalog with export name, intended use, and Artwork component. Catalog currently renders 48 previews: eight icons × three sizes × two themes. It is useful for comparison but is not a compact discovery page.

Storybook already provides theme globals, a themed preview wrapper, semantic typography/spacing, Button, accessibility checks configured as failures, and a browser test adapter accepting complete story IDs. E2E inventories all authored JavaScript/TypeScript in stories, including new helper modules. Unit/integration coverage intentionally targets library and build code, not Storybook helpers.

## Goals / Non-Goals

**Goals:** Add discovery with a small local stateful view; keep catalog membership consistent; retain native keyboard semantics and focus during filtering; avoid shipping documentation-only runtime to package consumers.

**Non-Goals:** An exported Gallery/Input component, public search API, icon selection, clickable cards, copy buttons, detail panels, fuzzy ranking, pagination, asynchronous search, query persistence, URL synchronization, or a search dependency.

## Decisions

### 1. Keep a separate Gallery story and share story-only metadata

Add Gallery to the existing Components/Icon CSF module, at `components-icon--gallery`. Preserve Catalog and its current size/theme presentation. Move its explicit catalog array to `stories/icon-catalog.ts`, retaining order and extending entries with curated keywords. Both stories read this one list. Keep the type and component references local to stories, never exported from src/index.ts or imported by library modules.

Initial keyword suggestions:

| Export           | Keywords in addition to name/use |
| ---------------- | -------------------------------- |
| MoonIcon         | night, dark, theme               |
| SunIcon          | day, light, theme                |
| CheckIcon        | confirm, done, complete          |
| CloseIcon        | dismiss, cancel, remove          |
| ChevronDownIcon  | down, expand, dropdown           |
| ArrowRightIcon   | next, forward, navigate          |
| PlusIcon         | add, create, new                 |
| ExternalLinkIcon | external, link, open             |

A focused catalog integrity test compares story entries against current public named-icon exports so additions cannot silently disappear from discovery. Metadata is intentionally explicit: deriving names from module introspection would not supply meaningful intended uses or synonyms. This is a documentation catalog, not a runtime registry.

### 2. Use one query state and literal local filtering

Implement a small `IconGallery` view in `stories/icon-gallery.tsx`, rendered by Gallery. Store only the raw query. Derive matches on each render from the catalog, using a trimmed lowercase query and a lowercase joined corpus of name, use, and keywords. Use literal substring matching; do not compile a regular expression or tokenize/rank queries. Empty normalized queries naturally match every entry. Preserve source order and filter entries once, preventing duplicates across fields.

For eight icons, direct filtering is simpler than debounce timers, memoization, search indexes, workers, or a service. Multiword input is a literal substring, with only surrounding whitespace normalized. Do not persist state across story navigation; ordinary typing and clearing stay in this component's lifecycle.

### 3. Native controls, stable focus, and non-interactive cards

Render a visible Search icons label associated with `input type="search"` using React useId, avoiding collisions if Storybook docs render multiple instances. Use a controlled value/onChange and retain the input outside conditional results so typing does not recreate it. There is no form submission, autocomplete, combobox popup, or arrow-key selection model.

Always render an explicit Button with default type=button and text Clear search, including when the query is already empty. Its handler clears the query and focuses the mounted input through a ref. This keeps tab order and layout stable and avoids a conditional disappearing button. Browser-provided search clearing can use the same controlled onChange path; it is not the sole recovery control.

Expose a concise count such as `8 icons`, `1 icon`, or `0 icons` in a polite status region. Updates announce results without changing focus. Keep an accessible Icon results list, with non-focusable list items containing decorative large (24px) artwork, an export-name heading, and intended-use text. An empty list is accompanied by a visible no-results message with guidance to try another term or clear search. Do not render buttons, anchors, selection roles, or duplicate image names inside cards.

### 4. Use existing themed presentation without introducing a public input pattern

Add scoped gallery styles to the existing preview stylesheet. Reuse semantic surface/text and spacing roles, inherit typography, and use ordinary wrapping layout for cards and controls. Cards have no hover/active affordance because they are not actions. Prefer intrinsic wrapping (for example, flex items with content-based basis) and min-inline-size:0 over fixed-height cards or new hard-coded layout dimensions. Allow export names and descriptions to wrap anywhere when necessary.

The search field retains browser-native control appearance and focus indication, with color-scheme light/dark mapped from the existing Corporate/Luna preview theme. This is an intentional native documentation-control appearance, not a new styled library Input contract. Use inherited font sizing, box sizing, and max-inline-size:100% for text enlargement/reflow. Clear search uses the existing Button styling. Record the documentation-only pattern in the foundation, without adding raw palette values, Button-specific tokens repurposed as input roles, or public gallery/input tokens.

The Gallery follows the active preview theme rather than duplicating every card into two simultaneous panels. The existing Catalog remains the two-theme comparison. Verify native search text/control contrast and visible focus under both selected themes rather than assuming OS defaults establish WCAG compliance.

### 5. Verify the UI boundary and preserve existing gates

Add RTL tests under `tests/unit/storybook/`, importing the existing DOM setup. Exercise the rendered Gallery through a named searchbox and clear button: initial eight entries, name/use/keyword matches, case/whitespace normalization, literal special characters, singular/plural/zero counts, clearing from filtered/empty/already-empty states, focus restoration, and no card actions. Catalog membership checks use current public named exports as the boundary. These tests verify gallery behavior but do not change the unit coverage include list to claim coverage for Storybook code.

Add a representative Storybook play journey for search, empty state, and clear; leave the story restored to its initial complete collection. Add Playwright journeys through the real Gallery preview and actual theme toolbar in both themes, including keyboard-only recovery, focus while typing, 320px/200% text/text-spacing reflow, and status/list assertions. Preserve Catalog's current E2E comparison assertions. Ensure new story/helper callbacks and branches meet the existing independent 100% browser coverage gate; do not add ignores or exclude helper modules.

Run lint, types, all three independently covered suites, accessibility-enabled Storybook tests, and both builds. Reuse the packed-package/bundle checks to confirm discovery metadata and search UI do not enter library output and unused icons remain removable. Visually inspect both themes and narrow/enlarged states; record any unperformed assistive-technology checks honestly.

## Risks / Trade-offs

- Catalog and gallery drift → one metadata module plus public-export membership checks; retain the comparison story.
- Native control appearance varies by browser/platform → map color-scheme, test contrast/focus in the supported Chromium environment, and record cross-browser/manual limits.
- Keyword matching feels incomplete → document literal substring behavior and curate a small synonym list; fuzzy matching is deferred deliberately.
- Result announcements become noisy → announce one concise count with polite status semantics; do not automatically focus the list or every matching card.
- A new helper bypasses E2E coverage → keep it in stories, already included by the complete-inventory browser gate.
- Existing icon work is uncommitted → preserve it and keep gallery edits scoped; this proposal depends on that implementation but does not archive or rewrite its change artifacts.
- Existing local installer tarball blocks clean remote dependency installation → report it if still present; repairing dependency distribution is outside this gallery change.

## Migration Plan

1. Establish a green baseline for the existing icon stories and browser coverage, then extract shared metadata without changing Catalog output.
2. Add the native-control gallery and its focused UI tests/styles/documentation, then wire the Gallery story.
3. Extend Storybook/E2E coverage and run the complete existing gates and packed-bundle checks.
4. Rollback removes Gallery, its scoped styles/tests, and metadata keywords; Catalog can keep the shared metadata extraction. There is no library API, token, data, or consumer migration.

## Approved visual revision

The user supplied a replacement gallery reference after initial completion. It authorizes a breadcrumb strip, compact heading and theme selector, icon-prefixed search with a retained explicit clear action, native-radio size selector, centered bordered cards in up to four columns, monospaced export names, and an import/accessibility footer. Local theme selection defaults to Storybook (toolbar inheritance), with explicit Corporate/Luna scopes. The revision supersedes decision 4's native appearance/no-new-tokens restriction: shared DTCG primitives and semantic gallery roles now drive authored controls, documentation colors, typography and geometry, with no new React library export or runtime dependency. The original search, non-interactive card, package boundary, and accessibility contracts remain in force.
