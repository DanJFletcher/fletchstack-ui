# Browser behavior ownership

This is the required review matrix for browser verification. New components must assign applicable rows to concrete assertions, or explain why a row does not apply. Test counts and JavaScript coverage do not prove these guarantees.

## Layer contracts

| Guarantee | Primary owner | Distinct boundary retained |
| --- | --- | --- |
| Props, attributes, classes, refs, state/callback wiring, message relationships | Component `__tests__/` DOM tests | Representative browser accessibility-tree and label activation checks |
| Deterministic server markup and no browser globals | Node SSR tests | Browser integration before hydration and actual hydration where applicable |
| Token values, aliases, validation, CSS generation, package/types | Node unit/integration and package checks | Generated CSS cascade and built-package browser verification |
| Every eligible CSF story renders, plays successfully, and passes configured axe checks | `npm run test:storybook` | Served story-index discovery and representative preview lifecycle checks |
| Native keyboard/default actions, geometry and browser preferences | Focused Chromium integration/E2E assertions below | These are not replaced by jsdom or simulated `selectOptions` |

## Component and integration matrix

Button, Stack and CodeBlock use [private harness suites](browser-harness/specs/), with every migrated assertion recorded in the [pilot audit](browser-harness/pilot-audit.json) and verified during migration. Cluster, Container, Section, SimpleGrid and Separator also use the harness; their unchanged assertions and measurements are recorded in the [layout migration report](../docs/layout-harness-migration.md). Checkbox, Radio, Switch, TextInput, Textarea and Select are covered by the [form-control migration](../docs/forms-harness-migration.md). Badge, Spinner, ButtonGroup and FormGroup use the harness as recorded in the [feedback/actions migration](../docs/feedback-actions-harness-migration.md). Field and its atoms use the harness while documentation navigation stays in Storybook; see the [Field migration](../docs/field-harness-migration.md). Card and Icon component cases also use the harness; see the [Card/Icon migration](../docs/card-icon-harness-migration.md). AspectRatio and its media-resource ownership are covered by the [AspectRatio migration](../docs/aspect-ratio-harness-migration.md). All Typography and Link cases now use the harness; see the [Typography migration](../docs/typography-harness-migration.md) and subsequent [Link/focus migration](../docs/link-harness-migration.md). Spatial examples and sibling-theme coexistence follow the [spatial/theme migration](../docs/spatial-theme-harness-migration.md). Gallery behavior and spacing follow the [gallery migration](../docs/icon-gallery-harness-migration.md). All identified component/gallery migration candidates are now in the harness; retained [Storybook suites](e2e/) own manager, documentation, delivery and lifecycle boundaries. Every retained test in these files continues to own its named assertion. The [case audit](browser-check-audit.json) records each original standalone check and the rationale/owner for removal or consolidation. These are migration records, not frozen future test-count requirements.

| Component/boundary | Browser owner | Required behavior and sampling |
| --- | --- | --- |
| Button | [Button harness](browser-harness/specs/button/Button.spec.ts), [Storybook args](e2e/components/button/Button.spec.ts), [hydration](integration/components/button/Button.hydration.test.ts), [hidden](integration/components/button/Button.hidden.test.ts) | Native Enter/Space, submit/reset, disabled/hidden tab order; real focus and both-theme styling/reflow. DOM/SSR own exhaustive forwarding. |
| ButtonGroup | [ButtonGroup](browser-harness/specs/button-group/ButtonGroup.spec.ts), [SSR CSS](integration/components/button-group/ButtonGroup.ssr.test.tsx) | Named native actions; both-theme joined seams/corners, dynamic hidden edges, RTL, wrapping/width/alignment, offset focus including forced colors, Tab/Enter/Space, external submit/reset, 320px enlarged/spaced labels and scoped gap resets. No animation or group focus management. DOM owns defaults, refs, handlers and standalone Button regression. |
| Select | [Select suite](browser-harness/specs/select/Select.spec.ts) | Native typeahead and focus; invalid hover boundary and 320px enlarged/spaced labels in both themes. DOM owns choice/callback/description combinations; stories retain controlled/form compositions. |
| Field and atoms | [Field suite](browser-harness/specs/field/Field.spec.ts), [atoms](browser-harness/specs/field/FieldAtoms.spec.ts), [atom documentation](e2e/components/field/FieldAtoms.spec.ts), [SSR browser](integration/components/field/Field.ssr.test.tsx) | Native label activation and actual relationships, inline label content, message palette, reflow and customized CSS gap; DOM owns exhaustive descriptions/slots/tag names. |
| TextInput / Textarea | [TextInput](browser-harness/specs/text-input/TextInput.spec.ts), [Textarea](browser-harness/specs/textarea/Textarea.spec.ts) | Native editing/focus and textarea newline/resize where asserted; reflow and invalid/focus styling in both themes. Keep controlled textarea counter/native input regression. |
| Checkbox / Radio / Switch | [Checkbox](browser-harness/specs/checkbox/Checkbox.spec.ts), [Radio](browser-harness/specs/radio/Radio.spec.ts), [Switch](browser-harness/specs/switch/Switch.spec.ts) | Native selection/toggle/group keyboard behavior, label hit areas, focus, disabled behavior, forced colors, enlarged/spaced text and theme-specific states. |
| FormGroup | [FormGroup](browser-harness/specs/form-group/FormGroup.spec.ts) | Legend relationships, native disabled fieldset behavior, first-legend exception, group error/focus and responsive composition. |
| Card | [Card](browser-harness/specs/card/Card.spec.ts) | Native disclosure, media clipping/radius boundary, responsive composition and theme styling. |
| Link | [Link](browser-harness/specs/link/Link.spec.ts) | Native navigation/tab behavior and unavailable text, focus/underlines, forced colors and reflow. |
| Spinner | [Spinner](browser-harness/specs/spinner/Spinner.spec.ts), [selective CSS](integration/components/spinner/Spinner.ssr.test.tsx) | Rotation and stopped reduced-motion state with status retained, forced colors, inherited paint and focus exclusion. No keyboard activation: passive status. |
| Badge / Separator | [Badge](browser-harness/specs/badge/Badge.spec.ts), [Separator](browser-harness/specs/separator/Separator.spec.ts) | Semantic text/orientation, computed styling/contrast, forced colors and reflow. No activation: display-only components. |
| Container | [Container](browser-harness/specs/container/Container.spec.ts), [pre-hydration CSS](integration/components/container/Container.ssr.test.tsx) | Preset maxima/centering, border-box gutters and 599/600px breakpoint, nesting, flex/grid shrink, RTL, scoped resets, theme parity and focus clearance. |
| Stack | [Stack harness](browser-harness/specs/stack/Stack.spec.ts), [pre-hydration CSS](integration/components/stack/Stack.ssr.test.tsx) | Actual gaps/alignment, RTL, nested/hidden children, consumer margins, scoped/reset/responsive gaps, shrink, order/focus and 320px form use. |
| Cluster | [Cluster](browser-harness/specs/cluster/Cluster.spec.ts) | Both gap axes, intrinsic wrapping at different parent widths, baseline/mixed-height alignment, wrapped-row justification, RTL/native tab order and clearance. |
| SimpleGrid | [SimpleGrid](browser-harness/specs/simple-grid/SimpleGrid.spec.ts) | Equal tracks/reflow at parent widths, sparse tracks, row heights, hidden children, scoped resets, RTL/order/focus and enlarged cards. |
| AspectRatio | [AspectRatio](browser-harness/specs/aspect-ratio/AspectRatio.spec.ts) | Actual frame proportions, parent sizing, fitting/overflow, video/embed semantics, native focus clearance, RTL and captions outside the frame. |
| Section | [Section](browser-harness/specs/section/Section.spec.ts) | Both padding edges, responsive/scoped roles, margins/nesting, semantic regions versus divs, composition and focus clearance. |
| CodeBlock | [CodeBlock harness](browser-harness/specs/code-block/CodeBlock.spec.ts), [script-free CSS](integration/components/code-block/CodeBlock.ssr.test.tsx), [copy lifecycle](integration/components/code-block/CodeBlock.interactions.test.tsx) | Syntax token contrast and exact highlighted source/copying, plain fallback/opt-out, highlighted script-free SSR, forced-color syntax and scoped theme resets; literal whitespace/escaped content, actual Clipboard API and unavailable-API fallback, focused copy/retry/status, keyboard scrolling/escape, wrapping, RTL, scoped resets, both-theme contrast, 320px enlarged/spaced metadata and forced-color focus. DOM owns exhaustive refs, native props and stale request behavior. No animations; reduced motion adds no behavior. |
| Typography | [Heading/Text harness](browser-harness/specs/typography/Typography.spec.ts), [SSR CSS](integration/components/typography/Typography.ssr.test.tsx) | Both-theme rem scale, line height, contrast, nested token resets, hidden content, 320px/enlarged/spaced reflow, RTL and inline-link focus. Story plays own native heading levels and inline composition. No animation or control paint; composed Link owns forced-color focus. |
| Avatar | [Harness](browser-harness/specs/avatar/Avatar.spec.ts), [hydration](integration/components/avatar/Avatar.hydration.dom.test.tsx), [SSR CSS](integration/components/avatar/Avatar.ssr.test.tsx) | Real image pending/load/failure/recovery, stable footprint/name, all sizes/shapes, both-theme contrast, decorative composition, 320px enlarged/spaced reflow, hidden, forced colors and keyboard exclusion. DOM owns Unicode/custom initials, native props and stale-image events. |
| Icons/gallery | [Icon](browser-harness/specs/icon/Icon.spec.ts), [gallery](browser-harness/specs/icon/IconGallery.spec.ts), [Storybook toolbar](e2e/components/icon/icon-gallery.spec.ts) | Artwork sizing/paint, accessible icon composition, real search controls, preview sizes, local themes, spacing independence and narrow/enlarged layout; retained Storybook owns the actual toolbar. DOM also checks literal search cases. |
| Theme boundaries | [Theme coexistence](browser-harness/specs/themes/themes.spec.ts), [spatial scopes](browser-harness/specs/spatial/SpatialSystem.spec.ts), [token scopes](integration/themes/theme-scoping.test.ts) | Default/explicit/custom roots, sibling/nested reset, scoped overrides; do not substitute equal current values for reset coverage. |
| Spatial examples | [Spatial harness](browser-harness/specs/spatial/SpatialSystem.spec.ts) | Raw scale, native select typeahead/focus, parent-owned spacing, scoped resets, exact responsive boundary and both-theme enlarged/spaced reflow. |
| Served Storybook | [Documentation](e2e/storybook/documentation.spec.ts), [organization](e2e/storybook/organization.spec.ts), [spatial guide](e2e/storybook/spatial-system.spec.ts) | Public IDs/index, docs links, manager navigation, toolbar changes, preview lifecycle/play failure propagation and actual styles. |
| Distribution | [Built CSS](../scripts/verify-browser.mjs), [package](../scripts/verify-package.mjs) | Built-style contrast/focus/reflow and installed exports/types/React SSR; source Storybook is not a substitute. |

## Consolidation rules

- Story render-success loops can be removed only when their IDs remain testable in the served story index and the Storybook project discovers their CSF files. A missing or excluded story fails the retained inventory check.
- Each original case has a recorded decision in the case audit. Pure forwarding stays in DOM/SSR; native input, browser accessibility relationships and CSS remain asserted in a real browser.
- Measure all variants already present in one fixture with named steps rather than reopening the same story for each variant. Keep unrelated journeys isolated.
- Shared layout can use one exhaustive functional matrix with explicit both-theme parity and nested reset checks. Preserve both themes for divergent palettes, focus, typography or state styling.
- Keep distinct 320px, 200% root text and user text-spacing checks for each applicable CSS contract/composition. Passive layouts do not require activation tests, but their descendants' order and focus clearance do.
- Reduced motion applies to animated components; forced colors applies to painted controls/indicators. Transparent layout wrappers do not add preference-specific paint, so their composed controls own those checks.
- Browser coverage is execution evidence, not CSS coverage, screen-reader certification, or proof of this matrix. Chromium emulation does not establish cross-browser or real-OS accessibility behavior.

## AvatarGroup

The AvatarGroup harness owns ordered shared-Avatar geometry, both-theme overflow contrast, native summary Enter/Space and focus, hidden-name disclosure, count-only/small groups, failed photos, RTL, forced colors, nested theme reset and 320px enlarged/spaced-name reflow. Dedicated SSR browser checks retain disclosure before hydration; DOM/hydration tests own member input boundaries and accessible/native forwarding. Storybook retains its render/play/a11y and delivery boundaries.
| Chip | [Chip harness](browser-harness/specs/chip/Chip.spec.ts), [hydration](integration/components/chip/Chip.hydration.dom.test.tsx) | Native Enter/Space and tab order, disabled exclusion, controlled selection, independent removal and parent focus restoration, no form submission, both-theme contrast and sizing, nested scope reset, forced colors and 320px enlarged/spaced reflow. DOM owns exhaustive forwarding, action-pair validation and refs; Storybook owns render/play/axe. No animation, resources or custom navigation. |
| Accordion | [Accordion harness](browser-harness/specs/accordion/Accordion.spec.ts), [hydration](integration/components/accordion/Accordion.hydration.dom.test.tsx) | Native Enter/Space, normal Tab/link activation and collapsed-link exclusion, disabled skipping, focus independent of expansion, both-theme variants/contrast, title/panel/chevron alignment and 320px enlarged/spaced reflow, unique relationships, real opt-in size/opacity transitions, immediate defaults/reduced motion and inert exclusion while closing. DOM owns exhaustive state, refs, headings and mounted content; Storybook owns render/play/axe. |

## Motion foundation

The [Spinner harness](browser-harness/specs/spinner/Spinner.spec.ts) owns default, legacy/shared/combined timing, live system preferences, and consumer isolation from preview markers. The [Accordion harness](browser-harness/specs/accordion/Accordion.spec.ts) owns immediate semantic and focus changes, opt-in transitions, rapid activation and collapsed-link exclusion during exit. The [served Storybook checks](e2e/storybook/motion.spec.ts) own the six mode/preference combinations, Docs canvases, sibling/nested themes, toolbar/theme navigation and returning to System. Token contracts verify the approved defaults in both generated themes.

## Rating

The [Rating harness](browser-harness/specs/rating/Rating.spec.ts) owns both-theme fractional full-size clipping, native whole/half-step arrows and Tab, independent groups, pointer/keyboard 3.5 parity in artwork, naming and real submitted FormData, required native validation, disabled score retention, 20/32/48px symbol geometry, 320px enlarged/spaced ten-point reflow and forced-color focus/fill. DOM contracts own localization, controlled/uncontrolled changes, ref/native forwarding, form reset and validation relationships. Independent SSR/hydration tests retain native checked state before JavaScript and reject hydration recovery. Storybook owns render/play/a11y for the design-sheet composition, sizes, symbols and form states; package consumers retain public exports, types, styles and React 18/19 SSR.

## Combobox

The [Combobox harness](browser-harness/specs/combobox/Combobox.spec.ts) owns both-theme pointer/keyboard form flows, query versus selected FormData, required validity, noncommitting highlights, clear/edit removal, focus/Tab/Escape, disabled choices, loading/no-results announcements, aligned 320px enlarged/spaced long-label reflow and forced-color focus/highlight. Shared DOM contracts own filtering, controlled/uncontrolled state, option validation, refs, native reset and field relationships; independent SSR/hydration runs preserve labels and submitted identities without recovery. Storybook owns render/play/accessibility states. Installed React 18/19 package consumers independently check exports, types, stylesheet availability and SSR. Actual screen-reader speech remains unverified.

## Table

The [Table harness](browser-harness/specs/table/Table.spec.ts) owns both-theme five-column portfolio semantics, badges/date display, numeric/date sorting, native header Enter/Space focus, filtered select-all/mixed/disabled behavior, preserved stable selections, unrelated computed inventory/footer content, controlled/manual data ownership, sticky header geometry, keyboard horizontal scrolling at 320px with enlarged/spaced text, content-state spans, theme inheritance, customization interactions, forced colors and selected-paint precedence over stripes/hover. DOM contracts independently retain query/sort/selection control, custom accessors/matching/comparators, validation, row/cell contexts and style precedence; SSR/hydration retains native table structure, initial sorting and selection without recovery. Storybook owns render/play/a11y states, and React 18/19 package consumers independently check public exports, generic accessor/renderer inference, styles and SSR. Actual assistive-technology speech remains unverified.

## Callout

Owner: `tests/browser-harness/specs/callout/Callout.spec.ts`. Persistent publishing guidance: native keyboard action, focus retention, no tone-driven announcement roles, readable colors in both themes, first-column alignment and wrapping at 320px with enlarged/spaced text, compact body-only content, scoped overrides, nested theme inheritance, and forced-colors boundaries. DOM/SSR/hydration contracts independently verify explicit roles, composable nodes, decorative icons and consumer-owned actions. Actual screen-reader speech remains a manual verification gap.

## Menu

Owner: `tests/browser-harness/specs/menu/Menu.spec.ts`. Named action-menu keyboard round trip and reopening in both themes; focus ring, boundary and typeahead navigation, recursive sibling switching, disabled skipping, native-link navigation, cancellation/controlled opening, Tab/Shift Tab continuation, outside dismissal, desktop alignment/viewport flipping, inline narrow reflow with enlarged/spaced text, native touch toggling and single leaf activation, live reduced motion and forced-colors boundaries. DOM and SSR/hydration contracts independently verify configurations, parent-controlled state, names, IDs and native attributes. Member-driven link destinations conservatively retain full affected-browser fallback where discovery cannot prove resource ownership. Manual screen-reader speech remains unverified.

## Breadcrumbs

Owner: `tests/browser-harness/specs/breadcrumbs/Breadcrumbs.spec.ts`. Both-theme native links, ordered navigation, current-page emphasis and focus; Enter/Space disclosure with retained button focus and next-Tab access to revealed ancestors; immediate removal of collapsed links; inclusive default/custom viewport boundaries and restoration of the complete wide trail; two-item trails without disclosure; native destinations; wrapping at 320px with enlarged/spaced text; isolated token overrides and forced-colors focus. DOM and SSR/hydration contracts independently retain semantic attributes, instance independence, validation and a complete server-rendered trail. Storybook owns render/play/accessibility checks. Actual assistive-technology speech remains unverified.

## Navbar

Owner: `tests/browser-harness/specs/navbar/Navbar.spec.ts`. Both-theme locally stateful text/switch controls survive container-only resizing, close/reopen and widening while the CTA remains visible. Native Tab order matches each layout, Enter/Space toggles, Escape restores focus, nested link content navigates and dismisses, embedded controls remain open, controlled requests await parent acceptance, typed mapped/conditional/fragment items retain group order, all-visible items omit disclosure, instance overrides stay isolated and forced colors preserve focus/boundaries. Enlarged/spaced text reflows at 320px. DOM/SSR/hydration contracts independently verify forwarded attributes/refs, child refs and values, root handlers, per-instance relationships and unavailable hidden content. Actual screen-reader speech and physical-device behavior remain unverified.

## Bottom navigation and app shell

| Guarantee | Owner |
| --- | --- |
| Equal full-cell native links; distinct focus/current; both themes; scoped overrides; narrow and enlarged text | `tests/browser-harness/specs/bottom-navigation/BottomNavigation.spec.ts` |
| Real router nested Inbox matching, native Help, Back/Forward, programmatic and modified activation | `tests/browser-harness/specs/bottom-navigation/BottomNavigation.spec.ts`; isolated `/navigation-demo/*` consumer |
| Viewport and parent shell sizing; persistent header/bar; independently scrollable final content; wrapped labels and one safe-area inset | `tests/browser-harness/specs/app-shell/AppShell.spec.ts` |
| Embedded content avoids nested main; keyboard focus scrolls final link into view | `tests/browser-harness/specs/app-content/AppContent.spec.ts` |

## Tabs

Owner: `tests/browser-harness/specs/tabs/Tabs.spec.ts`. Both-theme automatic/manual activation, independent focus/selection, enabled wrapping, RTL/vertical keys, native panel Tab order, persistent editable state across switching/reordering, delayed controlled requests, dynamic focus repair, nested ownership, overflow without ancestor scrolling, equal-width distribution, reduced motion, scoped tokens and nested theme inheritance. DOM and SSR/hydration contracts independently cover initialization/fallback, unique relationships, native props/refs and hidden content. Storybook owns the sheet and focused render/play/accessibility examples. Installed React 18/19 consumers verify public types, runtime exports, stylesheet distribution and deterministic SSR. Physical-device and screen-reader speech remain manual verification gaps.

## Dialog

Owner: `tests/browser-harness/specs/dialog/Dialog.spec.ts`. Native top-layer modality, focus containment/restoration, controlled dismissal, Escape cancellation, default full-backdrop dismissal with an explicit opt-out, native form/imperative close, nested modal round trips, persistent editable content, viewport-bounded scrolling, both-theme inheritance, isolated style hooks and live reduced-motion exit. DOM/hydration contracts independently verify content associations, IDs, native ref/handler forwarding and controlled notifications; installed consumers verify public exports/types/CSS and closed deterministic SSR under React 18/19. Storybook owns render/play/accessibility checks and its motion preview boundary. Actual screen-reader speech and physical-device behavior remain manual gaps.

## Popover

Owner: [Popover browser suite](./browser-harness/specs/popover/Popover.spec.ts). Non-modal Tab/Escape/outside focus, persistent input, viewport flipping/clamping, theme inheritance, native Dialog composition, controlled requests, independent dismissal policies, scoped style, reduced motion, forced colors and narrow reflow with enlarged/spaced text. DOM and hydration contracts independently verify names, IDs, forwarded attributes/ref, optional slots and viewport sizing; pure policy cases cover every side/alignment and RTL. Installed React 18/19 consumers verify public types, exports, CSS and deterministic SSR. Storybook checks render/play/accessibility and closed-on-landing documentation. Screen-reader speech and physical-device behavior remain unverified.

## Tooltip

Owner: [Tooltip browser suite](./browser-harness/specs/tooltip/Tooltip.spec.ts). Hover/focus/touch visibility, hoverable content, Escape without moving focus, preserved trigger activation/descriptions, viewport edge flipping/clamping, transformed clipping, scrolling, theme inheritance and isolated overrides. Native Dialog/Popover composition and narrow enlarged/spaced text are browser guarantees. DOM/hydration contracts independently verify refs, handlers, IDs, timers and server-rendered descriptions. Screen-reader speech and physical devices remain manual gaps.

## Carousel

Owner: [Carousel browser suite](./browser-harness/specs/carousel/Carousel.spec.ts). Named region, boundary/loop navigation, retained inactive state, keyboard/RTL, touch swipe, controlled selection, live reduced-motion autoplay, themed/reflow controls and reserved frames.

## BounceCards

Owner: [BounceCards browser suite](./browser-harness/specs/bounce-cards/BounceCards.spec.ts). Reference photo fan, staggered overshoot, stable hover inspection, native keyboard/touch actions, live reduced motion, width-only resize and dense-grid fallback, theme/frame overrides. Keyboard inspection cancels entrance permanently; blur does not replay it. Screen-reader speech and physical devices remain manual gaps.

## DataTable

Owner: [DataTable browser tests](browser-harness/specs/data-table/DataTable.spec.ts). Both themes cover filter/sort/page ordering, mixed current-page selection and retained off-page keys, column visibility independent of search, controlled requests, record actions, loading/retry, another dataset and narrow enlarged layouts.
