# Design

## Context

See [proposal](./proposal.md). Container already handles width, centering and gutters. The spatial guide recommends ordinary wrappers and supplies direct primitive-backed related/group/section roles. Family-owned CSS/CSF/unit tests and central integration/E2E/package inventories govern new exports. Stack extends this system without altering Container or any token source.

## Goals / Non-Goals

**Goals:** A thin native div, stable direct-child relationships and SSR-effective CSS. Preserve existing role overrides, child margins, DOM order and consumer layout control.

**Non-Goals:** No generic layout engine, horizontal/reversed/wrapping modes, new tokens, automatic separator, input-field reconstruction, provider or viewport script. Cluster remains a separate proposal.

## Decisions

- Follow Container's forwardRef/native div props convention, replacing only style with StackStyle and adding gap/align unions. Native attributes and children pass through; no interaction or role is introduced.
- Set display:flex, flex-direction:column, align-items:stretch, min-inline-size:0 and direct existing-variable gap. Modifier classes choose zero/group/section or flex-start/center/flex-end. flex-start/end follow the inline direction for the column's cross axis; do not reorder children.
- Prevent direct flex items from shrinking in the block axis with flex-shrink:0 so a constrained parent cannot compress their specified/content height. Do not set widths, flex-basis, margins, or overflow on descendants. Hidden/display:none children naturally do not participate in flex gap; visibility:hidden still occupies layout. Honor Stack's own hidden attribute despite its explicit flex display.
- Use existing variables directly rather than adding Stack-specific aliases. Consumer media queries change those roles in their own scope; nested explicit themes retain the existing reset behavior. Component CSS has no breakpoint and remains vertical.
- Provide family-local demo styles for outlines, fixed measurement boxes and explicit consumer margin resets in examples. Production CSS never resets child margins. Use composed TextInput/Textarea/Select/Checkbox/FormGroup rather than making labels and controls separate flex items.
- Browser tests measure real gaps/alignment/order and cover hidden children, nested scopes, RTL, flex/grid shrinking, child growth, consumer margins, no clipping, focus clearance and narrow enlarged forms. Source integration proves layout before hydration and visible overflowing children; package fixtures exercise React 18/19 exports, refs/types and standalone CSS.

## Risks / Trade-offs

- Consumer child margins increase visible separation beyond gap → document and demonstrate the additive geometry; only demos reset their own margins explicitly.
- Long unbreakable text or fixed-width children can overflow → keep overflow visible and document child-owned wrapping/minimums rather than silently fixing them.
- Cross-axis stretch can make auto-sized controls fill width → use start/center/end when content-sized controls are wanted; never impose explicit descendant widths.
- A constrained-height parent can overflow because items retain content sizes → intentional visible overflow; parent height and scrolling decisions remain consumer-owned.

## Migration Plan

Adopt Stack optionally inside existing semantic sections/Container. Existing flex/grid wrappers and spacing tokens continue to work. Removing the wrapper or restoring the equivalent ordinary column-flex CSS rolls back adoption without data or dependency changes.
