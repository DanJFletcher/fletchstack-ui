# Initial design foundation

Status: implementation foundation under the user's approved brief. Maintainers own future pattern and token decisions. Authoritative sources are `tokens/primitives.json` and `tokens/{corporate,luna}.json`; the token build exports CSS and a public reference. Edit sources, never generated CSS.

## Representative flow

A visitor edits website settings: **Save changes** is the primary action, **Cancel** is secondary, and **Learn more** is a low-emphasis ghost action. Before any changes, Save can be disabled. Tab exposes a visible focus ring; Enter or Space activates the focused enabled action. Submit is explicit in forms. Validation messages and asynchronous loading are outside this initial Button pattern.

## Visual principles

Corporate is the default: white surfaces, ink text, restrained blue actions, system sans-serif typography, 4px corners, flat borders. Luna uses midnight navy surfaces, pale text, luminous lavender actions, moon-gold focus, a Georgia-led serif control face, and 12px corners. Luna's darker hover/pressed surfaces and lavender lightness changes provide an elegant celestial character without imagery or animation. Both share identical markup and behavior.

Each variant has background, foreground and border roles for default, hover and active. Disabled uses a shared opaque palette, retaining readable text rather than fading the whole element. Focus is additive to each variant: a 3px solid ring with a 3px offset. The parent must provide ring clearance and avoid clipping it. No shadows or transitions are needed for the first pattern.

## Token structure

Exactly two layers: primitives hold raw DTCG 2025.10 values; semantics refer directly to primitives. Component roles such as `button.primary.hover.background` belong to semantics, not a third layer. Themes implement exactly the same names and types. CSS exports only `--fs-*` semantic names. Build validation rejects unknown types, malformed values, invalid references, cycles, incompatible alias types, and non-primitive semantic targets.

Typography uses rem sizes (0.875, 1, 1.125), unitless 1.5 line height and weight 600. Font stacks require no network or font-loading lifecycle. Spatial values are px: a 4px spacing rhythm, 8px label/icon gap, size-dependent vertical padding 8/10/12px and horizontal padding 12/16/20px. Minimum target sizes are 36/44/52px; these are minima, never fixed heights. All sizes exceed WCAG's 24px target minimum. Text wraps and controls may grow vertically; long unbroken labels wrap too.

Surface, foreground, font and layout spacing semantics are shared consumer roles. Button typography, geometry, state colors and focus roles are independently customizable. A semantic role can share a primitive today without coupling future intent. See the generated token reference for every public property and purpose.

## Accessibility and composition

Target WCAG 2.2 AA: enabled text contrast >=4.5:1; visible control boundaries and focus against their surrounding surface >=3:1. Disabled controls are exempt but retain >=4.5:1 text contrast by design. Default/hover/active are tested in both themes. Ghost has no resting boundary: its text identifies the action; its hover fill is supplementary.

Native buttons provide names, keyboard activation, disabled semantics and form behavior. Children render naturally; decorative icons are aria-hidden, and icon-only buttons require an aria-label. The Button owns internal padding and label/icon layout. Ordinary parent wrappers own margins, placement and sibling gaps. Consumers must preserve names, contrast, focus clearance and usable target sizes when customizing.

Verify keyboard focus and activation, 200% text, 320px reflow, and WCAG text spacing (1.5 line height, 0.12em letter spacing, 0.16em word spacing, 2em paragraph spacing). Screen-reader checks require a real assistive-technology session; automated axe is supplementary.

## Theme boundaries and handoff

`:root:not([data-theme])` defaults to Corporate. Explicit document themes never compete with these defaults, regardless of filename ordering. `[data-theme="corporate"]` and `[data-theme="luna"]` each redeclare the complete contract. Sibling and nested scopes therefore work in server-rendered HTML. Build-time alias resolution emits literal semantic values at each boundary; there are no inherited CSS aliases to bind to a parent theme. Scoped overrides inherit until a nested explicit theme resets them. New themes copy the same semantic contract and provide their own primitive references, then run the generator; no Button change is required.

No Figma import/export was exercised. The supported DTCG subset is color (sRGB), dimension (px/rem), fontFamily, fontWeight and number. Unsupported types fail explicitly. Raw sRGB components become CSS rgb(), dimensions retain units, font family arrays become quoted CSS lists, and numbers remain unitless. No typography pixel conversion is performed.

Forced-colors mode uses the operating system's ButtonText, GrayText and Highlight colors for boundaries, disabled text and focus. These platform accessibility colors intentionally override the authored sRGB palette; geometry and markup remain unchanged.

## Icon pattern

Approved through the add-icon-components change: Icon renders trusted consumer SVG children; named icons supply optional artwork on that same foundation. Icon owns its SVG dimensions and accessibility, while a parent owns placement and external spacing. Button continues to own its label/icon gap, padding, focus, and activation. An icon-only Button supplies its own accessible name and keeps the child icon decorative.

Named artwork uses a 24×24 coordinate space, outline strokes, and round line caps/joins. The first collection is Moon, Sun, Check, Close, ChevronDown, ArrowRight, Plus, and ExternalLink. These drawing conventions are shared across themes. The prior private filled moon illustration is intentionally replaced by the catalog's outline moon.

Semantic icon.size.small/medium/large resolve to 16px/20px/24px, with medium the default. Semantic icon.strokeWidth resolves to 2 SVG user units, scaling with the artwork. Both themes declare the same contract; scoped overrides inherit until an explicit nested theme resets them. Fixed icon dimensions stay px when text is enlarged; labels must still wrap without clipping. SVG intrinsic flex sizing prevents unintended shrinkage, and Icon adds no margin or gap.

Default fill is none and stroke is currentColor, inheriting semantic text/control colors, including hover, active, focus, and disabled Button states. Custom artwork can explicitly set fill/stroke. There is no separate icon palette or state machine. Icon has no keyboard interaction and remains non-focusable. An omitted or blank label is decorative (aria-hidden); a trimmed nonblank label supplies role=img and an accessible name. Label owns the naming contract, so conflicting role/naming/focus attributes are reserved.

Consumers supply SVG child elements rather than nested SVG roots or untrusted markup strings. They own unique IDs in their artwork and must not introduce focusable descendants or conflicting title-based naming. SVG refs and compatible native attributes remain available. Screen-reader review complements automated accessible-name and axe checks.

## Storybook icon discovery

Approved by add-searchable-icon-gallery: discovery is a documentation composition, not a public Input or Gallery component. A visible native search label, a polite result count, and an always-available Clear search Button precede non-interactive list cards. Decorative artwork accompanies each exact export name and intended use. Cards own no activation, selection, hover treatment, or keyboard stop; the surrounding layout owns spacing.

The user's supplied gallery reference supersedes the initial native-control presentation: use a compact heading with local theme selection, a search/size toolbar, an outlined four-column card grid that collapses intrinsically, centered decorative artwork, monospaced export names, and an import/accessibility footer. Keep an explicit clear button inside the search field. The local theme selector defaults to **Storybook**, inheriting its toolbar; choosing Corporate or Luna creates a local token scope. Native radio semantics provide arrow-key size selection (16/20/24px); artwork starts at 24px. Cards remain non-interactive.

New semantic `gallery.*` roles in both theme sources define the documentation palette, muted text, panel/card/control boundaries, accent selection, focus, typography, radii, minimum control/card dimensions, preferred column width, and spacing. Each aliases a raw primitive directly. These are public CSS customization roles, documented in the generated token reference; they add no React exports or gallery runtime to the package. The approved reference supplies the design decision for these roles instead of borrowing unrelated Button roles. Corporate uses light panels and blue selection; Luna uses navy, lavender selection, pale text, and gold focus. Decorative card borders can be subtle; interactive field boundaries must remain ≥3:1, and all supporting text ≥4.5:1. Controls retain native behavior with authored semantic appearance and visible focus. All heights are minima; typography uses rem, fixed spatial dimensions use px, names/code wrap, and the grid never requires horizontal scrolling.

## Checkbox pattern

The user's Checkbox reference approves independent native choices, a clickable label/description, checked and mixed marks, errors, disabled choices, and the Corporate/Luna language. The [Checkbox contract](checkbox.md) records 20px controls, 44px minimum hit areas, 8px label gaps, independent `checkbox.*` roles, native form/keyboard behavior, and client-only indeterminate state. A consumer-owned fieldset/legend composition demonstrates none/some/all group selection.

## Text input pattern

The user's Text Input reference approves the [TextInput contract](text-input.md): a labeled native single-line field with linked helper/error descriptions, textual adornments, read-only selection, disabled editing, and the existing Corporate/Luna theme language. Independent `textInput.*` semantic roles supply a 44px default minimum height, 16px text, and 12px horizontal padding. Native input behavior owns editing, selection, form participation, and keyboard navigation.

## Select pattern

The user's supplied Select design approves a visible-label single-choice field with helper/error descriptions, disabled choices, keyboard navigation, and Corporate/Luna variants. The [Select contract](select.md) records native select semantics, platform popup rendering, 44px default minimum control height, and independent `select.*` semantic roles. Native option/optgroup children retain selection, form, and keyboard behavior.

## Card pattern

The user's Card reference layouts approve the passive surface, optional separated footer, and responsive media/content composition recorded in the [Card contract](card.md). Independent `card.*` semantic roles in both themes supply its visual values; it composes existing Button and Icon without taking over their semantics. Card supplies no activation, hover, selected, or disabled state.

## Spatial system handoff

The [spatial system](spatial-system.md) expands this foundation with a preferred scale, intent-based layout roles, a complete spatial-role audit, precision exceptions, and compatibility guidance. Component padding and parent placement remain separate responsibilities. Both themes use the same default spacing; shape and color can differ. The gallery uses independent search-padding, heading-gap, and preview-edge-inset roles so unrelated geometry overrides no longer change spacing.

## Form group pattern

The supplied Form Group reference approves the native fieldset/legend composition recorded in the [FormGroup contract](form-group.md), shared descriptions and errors, native descendant disabling, and vertical/horizontal layouts. Independent `formGroup.*` semantic roles provide both theme palettes, an 8px legend gap, 12px control gap, and 8px message gap. Parents own the 24px space between groups.

## Shared field primitives

The approved extraction introduces the [Field contract](field.md): native FieldLabel, paragraph/inline FieldDescription and FieldError, and a Field composition with consumer-owned controls. Independent `field.*` roles follow existing form typography, message colors, and spacing. Existing component-specific token roles and native semantics remain authoritative within TextInput, Select, Checkbox, and FormGroup.

## Textarea pattern

The supplied multiline field reference approves the [Textarea contract](textarea.md): native textarea semantics, shared Field label/messages, vertical resizing, optional character guidance, read-only and disabled behavior. Independent `textarea.*` semantic roles in both themes provide a 120px minimum height, 16px type, 12px padding, and current form-state colors.

## Radio pattern

The supplied Radio design approves the native mutually exclusive option recorded in the [Radio contract](radio.md). It composes FormGroup and shared field messages, with independent `radio.*` roles for circular 20px controls, 44px minimum hit areas, 8px label gaps, blue/lavender selection, errors, disabled choices, and focus. Native groups retain keyboard, validation, form, and reset behavior.

## Link pattern

The supplied Link reference approves the [Link contract](link.md): native anchors for navigation, inherited text sizing, visible underlines, inline/standalone use, optional decorative icons, explicit new-tab announcements, and unavailable text when no href exists. Independent `link.*` roles provide Corporate blue/purple and Luna lavender states with visible offset focus. External destinations do not automatically open new tabs.

## Switch pattern

The supplied Switch reference approves the [Switch contract](switch.md): a native checkbox with switch semantics for immediate on/off settings, a stable label, optional description, and native keyboard/form behavior. Independent `switch.*` roles define a 40 × 24px track, 20px thumb, 44px minimum hit area, contrast-preserving off states, and Corporate blue/Luna lavender on states. Checkbox remains the pattern for selection within a list.

## Spinner pattern

The supplied Spinner reference approves the [Spinner contract](spinner.md): indeterminate activity, inherited color, 16/20/24px artwork, optional decorative reuse with one announcement owner, and persistent status text under reduced motion. Independent `spinner.*` roles define sizing, gap, stroke, track opacity, rotation speed, and optional Corporate/Luna accent colors. Consumers own pending state, busy regions, and removal on completion.

## Badge

The owner-provided Badge reference approves a passive pill for concise status, category, or exact count, with optional decorative artwork and neutral, info, success, warning, and danger tones in Corporate and Luna. The [Badge contract](./badge.md) records semantics, sizing, token customization, and consumer-owned announcements.

## Separator

The owner-provided Separator reference approves horizontal and vertical neutral 1px rules, with decorative grouping by default and opt-in semantic separation. Parent layouts own surrounding spacing and available dimensions. The [Separator contract](./separator.md) records static semantics, sizing, theme tokens, and customization.

## Container

The owner-approved Container design adds optional centered 720/1120/1440px maximum widths, inclusive of 16px gutters below 600px and 24px from 600px. Both themes share layout values. Parents retain vertical spacing and section semantics; children retain internal layout. See the [Container contract](./container.md) and [spatial guide](./spatial-system.md).

## Stack

The owner-approved Stack design adds optional vertical direct-child relationships with related/group/section gaps using existing shared roles directly, plus zero gap and logical cross-axis alignment. It preserves child margins and order, adds no inset/surface, and composes with existing Container and fields. See the [Stack contract](./stack.md) and [spatial guide](./spatial-system.md). No tokens are added.

## Cluster

The owner-approved Cluster design adds passive intrinsic wrapping rows with existing actions/related gap roles, logical row justification and within-row alignment, including baseline. It preserves native child interactions/order/margins and adds no toolbar semantics or surface. See the [Cluster contract](./cluster.md) and [spatial guide](./spatial-system.md). No tokens are added.

## SimpleGrid

The supplied SimpleGrid pattern adds passive equal-width auto-fit columns with a 240px preferred item minimum, related/group gaps and no surface or interactive semantics. Both themes expose the same `--fs-simple-grid-min-item-width` role. See the [SimpleGrid contract](./simple-grid.md) and [spatial guide](./spatial-system.md).

## AspectRatio

The supplied AspectRatio pattern adds passive proportional geometry for images, videos and embeds. It defaults to 16:9, isolates intrinsic child dimensions, and supplies no surface or clipping. Child presentation and captions remain consumer-owned. See the [AspectRatio contract](./aspect-ratio.md). No theme tokens are added.

## Section

The supplied Section pattern adds semantic page regions with compact 32px, default 64px and spacious 96px block padding. Independent Section semantic roles reference existing primitives in both themes. Section stays transparent, supplies no inline gutters or child layout, and supports a div alternative for visual grouping. See the [Section contract](./section.md) and [spatial guide](./spatial-system.md).

## Avatar pattern

The supplied Avatar reference approves a passive identity image with photo/generated/custom-initial fallbacks, four fixed footprints and three shapes. The [Avatar contract](avatar.md) records image lifecycle, accessible naming/decorative use, semantic `avatar.*` roles, and parent-owned profile composition. These roles are independent of status badges and SVG icon sizing.

## AvatarGroup pattern

The linked AvatarGroup reference and supplied image approve an ordered shared-Avatar stack with 32px default identities, 8px overlap and 2px separating rings. Native details/summary reveals hidden names, including a count-only case. The [AvatarGroup contract](avatar-group.md) records member ownership, localization, geometry, semantic `avatarGroup.*` roles, and verification boundaries.

## MultiSelect pattern

The linked MultiSelect reference and supplied image approve a searchable combobox with removable tags, label-filtered multiselectable options, limits, minimum validation and native form support. Independent `multiSelect.*` semantic roles cover surfaces, tags, active options, focus, disabled/error states and sizing in both themes. See the [MultiSelect contract](multi-select.md).

## Chip pattern

The owner-linked Chip reference approves compact static content tags, controlled toggle selection, and independently named removal actions. The [Chip contract](chip.md) records sibling native buttons, parent-owned state/focus restoration, three sizes, wrapping and independent `chip.*` semantic roles in Corporate and Luna. Existing shared Check/Close artwork stays decorative.

## Accordion pattern

The one-page Accordion design and linked behavior reference approve divided, outlined and shared-surface disclosure groups. Existing semantic roles supply appearance. The [Accordion contract](accordion.md) records heading buttons, controlled/uncontrolled single or multiple expansion, mounted accessible panels and immediate-by-default behavior. Shared standard duration/easing tokens reproduce the reference for opt-in size/opacity transitions and honor reduced motion.

## Motion

Use the [motion foundation](motion.md) for shared timing, easing, reduced-motion behavior, and preview modes.

## Rating pattern

The owner-supplied one-page Rating sheet and linked behavior reference approve fractional display and native whole/half-step input, with star, heart and thumbs artwork. The [Rating contract](rating.md) records stable clipping, visible labels, native validation, localization and disabled behavior. Rating fill/outline roles use Corporate gold and Luna orange with stable 20/32/48px symbols and 48px input cells (24px per half); existing field tokens supply typography, focus, errors and description styling. No motion is introduced.

## Bottom destinations and application layout

The bottom-navigation design approves equal-width destinations with decorative icons above visible labels, a rounded current-icon indicator and an independent full-link keyboard focus ring. Use semantic surface/text/divider/link-focus roles and dedicated current foreground/indicator roles; dimensions follow existing spacing/icon/radius primitives in both themes. Navigation owns internal target padding and the bottom safe-area inset. Parent layout owns placement.

The complementary AppShell pattern uses persistent siblings around one direct AppContent scrolling region. Reserve intrinsic navigation height in normal flow rather than synchronizing fixed-position offsets and page padding. Viewport and definite-parent sizing are supported. See [BottomNavigation](./bottom-navigation.md), [AppShell](./app-shell.md), and [AppContent](./app-content.md).

## Tabs within one view

The supplied Tabs design approves line and pills variants for related in-view panels. The default line/automatic pattern selects on focus; pills/manual demonstrates Activity focused while Overview remains selected. Both require distinct selected and focus indicators, disabled text, wrapping vertical labels, an independently scrolling horizontal list, and optional full-width distribution. Use text/surface/focus foundations with dedicated Tabs selection, pill, divider and spacing roles in Corporate and Luna. Panels change immediately and remain mounted while hidden; routing and lazy mounting are separate concerns.

## Modal dialog

The requested reference approves a controlled native modal with heading/description/body/footer slots, sm/md/lg widths, close button, Escape by default and configurable backdrop dismissal. The owner-requested library default dismisses on backdrop clicks; callers can opt out. Keep the DOM ancestry for inherited themes; the browser owns top-layer modality, focus containment, inert background and restoration. Surface/text/border roles follow Card, with a dedicated translucent backdrop, 12px radius, 24px content inset and 400/512/720px width roles. The consumer owns triggers and confirmation actions.

Fade is the default entrance/exit; slide adds a small vertical offset and none is immediate. Shared standard enter/exit timing communicates opening/dismissal. Native modality and its focus remain active during the brief visual exit, then close together; native form/imperative close is immediate. This deliberately preserves a modal boundary rather than leaving its focus trapped in semantically hidden content. Live reduced motion removes the animation immediately.

## Popover

The reference Popover approves an anchored, non-modal native top-layer panel. A Button toggles it; Escape, outside pointer activation and focus leaving dismiss by default. It inherits its authored theme boundary. Four sides, logical alignment, flipping and viewport clamping support constrained layouts. Surface, text, border, radius, padding, width and collision spacing have semantic popover roles. Entrance uses the fast fade motion; dismissal and reduced motion are immediate.

## Tooltip

The requested Tooltip reference approves short, non-interactive supplementary help attached to one consumer trigger. Hover, focus and touch reveal it; Escape dismisses without moving focus. Preserve refs, handlers and existing descriptions. A native manual popover escapes transformed/clipped containers while retaining theme ancestry. Reuse Popover's pure viewport collision policy. Corporate uses an ink surface with white text and 6px corners; Luna uses a pale surface with navy text and 32px corners. Internal padding is 8px/12px, maximum width 288px and viewport/anchor spacing 8px. Tooltips stay beside the trigger: vertical height is constrained to the available side, and horizontal placement falls back vertically if clamping would cover the focused control. Opening and semantic dismissal are immediate with no animation. A 100ms pointer-transfer grace permits hovering the tooltip across its gap; focus ownership prevents pointer exit from hiding keyboard help.

## Carousel

The reference Carousel establishes caller-owned, stable-ID slides in a named region, below-content controls by default, optional safe-area overlay controls, surface/outlined/subtle/accent treatments and sm/md/lg spacing. Carousel owns internal spacing; parents place it. Inactive slides remain mounted but become hidden to assistive technology and inert immediately. Navigation supports arrows, Home/End, dots and horizontal touch swipes. Autoplay is opt-in, pauses on hover, stops on focus/manual navigation and respects live reduced motion. The standard duration/easing govern slide translation; reduced motion makes changes immediate. Component semantic roles cover frame, border, spacing, controls, indicator and focus; themes resolve these roles independently.

## BounceCards

The React Bits Bounce Cards reference and supplied recording establish a decorative fan of square photographs: staggered scale entrances with a brief overshoot, irregular tilts, and neighbors separating when a card is inspected. This library adapts the pattern without an animation dependency. Public geometry uses CSS pixels; typed positions replace transform-string parsing. Native buttons are used only when the consumer supplies an action, and focus receives the same visual prominence as hover. Live reduced motion removes animation and transitions without hiding photos or disabling actions. Corporate and Luna provide independent frame, fallback, shadow and focus tokens. Parent layout owns outer spacing. The fan scales within available width, reserving space for spread neighbors; extremely dense sets fall back to a wrapping grid rather than shrinking action targets below 44px.

## DataTable

The supplied Payments design establishes a composed, client-side DataTable: reuse Table's semantic rendering, columns, selection and theme roles; add an external search/filter toolbar, column disclosure and pagination footer. Search and scalar filters combine before stable sorting and pagination. Visibility affects presentation only. Selection remains keyed across pages and filters, while the header checkbox selects the current page. Loading takes precedence; errors offer retry, and no matches offer clear filters. Reuse table surface, divider, typography, spacing and radius roles for this related composition; existing fields, buttons and popovers retain their own semantic roles. No additional animation.

## Keyboard input hints

The requested shadcn Kbd reference establishes small neutral keycaps for textual keyboard input and grouped shortcuts. Kbd renders a native kbd; KbdGroup renders an unboxed outer kbd containing individual keys in source order. Both are passive by default, without focus stops, shortcut listeners, automatic platform substitution or motion. Applications own command handling and aria-keyshortcuts on the actual control. Compact monospace text, subtle surface and border, a small bottom edge, minimum dimensions and a rounded rectangle distinguish keycaps from status pills. Theme-specific semantic kbd roles supply text, surface, border, spacing and typography; groups wrap and long labels can grow. Symbol examples include readable names as text, rather than relying on symbol pronunciation.

## Item content rows

Item follows the requested shadcn Item reference: passive, wrapping media/content/actions rows with default, outline and muted appearances and default, sm and xs density. Card remains the larger surface pattern; Item supplies compact rows and optional full-width header/footer regions. Native links use `as="a"` and `href`; separate actions stay in passive rows to avoid nested controls. Group supplies vertical layout without inventing list semantics. Consumers choose native list markup around rows when needed. Theme-specific item roles alias existing primitives, with no new palette or motion.

## Task completion progress

The requested shadcn Progress reference establishes a compact completion bar. Progress supplements Spinner with measurable value/max and an indeterminate state for an unknown amount. The passive root owns progressbar semantics and its accessible name; optional visible label/value are decorative duplicates of that name and value text. Consumers own the task, updates, completion/error messages and busy regions. Values clamp to 0..max; a missing/null/nonfinite value is indeterminate, and invalid max falls back to100. Three thicknesses share theme-specific track, indicator, radius, spacing and typography aliases. Measured changes use the standard transition; indeterminate movement uses the spinner duration with a static centered segment under reduced motion. Neither mode introduces a focus stop or live region.

## Sequential questionnaire

The supplied Questionnaire proposal and PDF establish a data-driven, one-question-at-a-time form. It composes native Radio/Checkbox/TextInput/Textarea, Field messaging, Button and Kbd primitives. Selection never advances; Previous preserves drafts, optional Skip explicitly replaces an answer, and final submission validates and normalizes all current questions. Answers and active ID can be controlled independently. The application owns persistence, transport, cancellation and success destinations. Task position is concise text, not a completion percentage. Scoped shortcuts operate only on enabled choices while focus is inside the form, excluding editable targets and modified/repeated/composing key events. Pending saves synchronously lock interaction, catch failures with a friendly retry message, and preserve drafts. Native reset requests mount-time defaults. New semantic questionnaire roles supply card selection, disabled and focus paint, spacing, minimum touch targets and wrapping typography in both themes; step changes are immediate, with no added motion.

## Sequential questionnaires

The supplied Questionnaire design and application contract establish a one-question form flow using native choice and text controls. Choices never auto-advance. Optional questions distinguish explicit skip from unanswered; Next validates the current question and Submit validates all. The component owns drafts, independent controlled navigation, error focus and guarded pending/retry states; the application owns persistence and success navigation. Corporate and Luna alias questionnaire surfaces, selected/disabled states, borders, typography, spacing and focus to existing primitives. Focus rings remain distinct from selection. No transition is introduced. See [Questionnaire](questionnaire.md) for the approved API, normalization and keyboard rules.
