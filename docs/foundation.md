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
