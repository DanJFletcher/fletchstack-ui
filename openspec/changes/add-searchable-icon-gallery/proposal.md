# Proposal

## Why

The current Icon catalog compares sizes and themes but requires scanning a long list to find suitable artwork. A searchable Storybook gallery lets consumers find icons by name or purpose as the collection grows.

## What Changes

- Add a Gallery story under Components/Icon with a responsive collection of non-interactive icon cards showing artwork, export names, and intended uses.
- Filter immediately by case-insensitive literal matches across export names, intended uses, and curated keywords, ignoring surrounding whitespace.
- Include a labeled search field, result count, clear-search action, and helpful no-results state with keyboard-accessible controls.
- Follow the existing Corporate/Luna toolbar selection while preserving the current Catalog story and all size-comparison examples.
- Share Storybook-only catalog metadata between the Gallery and Catalog to prevent drift; keep gallery/search code outside library exports and bundles.
- Verify filtering, clearing, empty results, keyboard behavior, themes, and reflow through Storybook and browser tests without weakening coverage or accessibility gates.
- Exclude selection, detail views, copy actions, fuzzy search, remote services, pagination, and new public library components.

## Capabilities

### New Capabilities

- `icon-gallery`: Browsing and searching named icons within Storybook, including accessible feedback, responsive presentation, and theme integration.

### Modified Capabilities

None. No accepted capability specs exist yet. The implemented but unarchived add-icon-components change already owns named artwork and the comparison catalog; this change adds discovery behavior without replacing or revising that contract.

## Impact

- Storybook icon stories, shared story-only catalog metadata, scoped preview styles, and discovery documentation.
- Focused UI checks, Storybook play interactions, and E2E journeys using the existing preview adapter and coverage fixture.
- Depends on the completed add-icon-components implementation in this working tree; preserve that work and its comparison catalog.
- No new dependency, runtime registry, package export, shipped stylesheet, or public token contract change. Gallery controls use native search semantics and existing theme/layout foundations.
