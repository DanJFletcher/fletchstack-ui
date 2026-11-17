# Motion

Motion explains a state change, a relationship, or ongoing loading. It must not delay an action or become the only way to understand the interface. Corporate and Luna share the same initial motion values.

## Shared tokens

| CSS token | Default | Use |
| --- | --- | --- |
| `--fs-motion-duration-fast` | 100ms | Small state feedback |
| `--fs-motion-duration-standard` | 160ms | Typical disclosure and state movement |
| `--fs-motion-duration-slow` | 240ms | Larger deliberate transitions |
| `--fs-motion-duration-spinner` | 1000ms | Base duration of one loading rotation |
| `--fs-motion-easing-standard` | cubic-bezier(0.2, 0.8, 0.2, 1) | General interface movement |
| `--fs-motion-easing-enter` | cubic-bezier(0.2, 1, 0.3, 1) | Entering content |
| `--fs-motion-easing-exit` | cubic-bezier(0.5, 0, 0.9, 0.3) | Leaving content |

Choose roles by purpose. Do not animate every state just because a token exists. Focus indication, activation feedback, ARIA state, and keyboard access change immediately. Spinner uses linear rotation rather than an enter/exit curve. Accordion keeps immediate panels by default; `panelMotion="expand"` opts into size and opacity transitions. Chevron rotation uses standard timing.

Override semantic properties on a containing element or the component. Overrides inherit within that scope; an explicit nested theme resets the complete token contract. A sibling scope is unaffected. See the [token reference](tokens.md).

```css
.compact-disclosures { --fs-motion-duration-standard: 100ms; }
.slow-loading-indicator { --fs-motion-duration-spinner: 1500ms; }
```

Spinner retains `--fs-spinner-rotation-seconds` (default `1`) for existing consumers. Effective duration is the shared spinner duration multiplied by this numeric value. With the default 1000ms base, `2` still means two seconds. Overriding the base to 500ms and the numeric value to `2` produces 1000ms. Prefer the shared duration for new customization.

## Reduced motion

Consumer components follow `prefers-reduced-motion`, including changes without a reload. Reduction stops Spinner rotation and makes Accordion panel and chevron changes immediate. Status text, a static loading graphic, and essential content remain available. Motion does not create a new focus stop or change expansion state.

Collapsed panels become inert and hidden from assistive technology immediately, even during a visual exit. Never await a transition event to update semantic state or remove keyboard access. Rapid repeated activation must settle at the latest state. Keep SSR and hydration behavior usable before motion is ready.

Prefer component-scoped CSS media rules that remove movement with `animation: none` or `transition: none`. Do not use a universal animation reset or tiny durations. Future JavaScript-driven automatic movement must also follow the live system preference and stop safely; introduce a shared hook only when a real consumer needs it. No consumer motion override API is provided.

## Storybook preview

The **Motion** toolbar offers:

- **System preference** (default): follow the browser preference.
- **Reduced motion**: suppress motion in library components and motion examples.
- **Full motion**: inspect ordinary motion even when the browser requests reduction. Optional Accordion panel motion still requires its prop.

Explicit modes persist through theme changes and story navigation. Returning to System removes the preview override. These controls and their styles belong only to Storybook; consumer applications always respect the visitor's preference.

Use the Motion examples to replay duration and easing comparisons, and inspect disclosure and loading behavior in both themes. Token values above describe library defaults; local overrides can change them.

## Authoring and verification

Record the purpose, triggering state, timing/easing role, and reduced-motion alternative for each new pattern. Avoid introducing new motion to unrelated components during a foundation change. Add a browser check for normal and reduced preferences, live preference changes, and the final accessible state. Update Storybook's isolated override stylesheet when adding a new animated consumer.

Verify actual rotation/transition behavior as well as content and focus. Use observable state, retrying assertions, and animation state rather than fixed sleeps. A reduced-motion test must first establish that the ordinary mode can animate. For disclosure, open with the keyboard, follow a panel link, then collapse and verify Tab skips it immediately. Storybook toolbar checks belong at the served Storybook boundary; consumer behavior belongs in the component harness.

Follow the existing [verification policy](../.agents/guidelines/testing-guidelines.md): development feedback stays coverage-free. Shared motion tokens and preview infrastructure require full local browser verification at completion, plus both full independent coverage gates and the existing build/package checks.

## Menu panels

Root and child Menu panels fade in with the shared fast duration and enter easing, indicating newly available actions without moving focus targets. Closing unmounts the branch immediately; no exit transition retains keyboard or accessibility-tree content. Live reduced-motion preferences disable the fade. Storybook Full/Reduced overrides include Menu panels and remain preview-only.

## Dialog modal boundary

Dialog uses standard duration with enter/exit easing for fade (default) or optional slide, and supports immediate `motion="none"`. The native modal remains present and accessible during a visual exit; its modal focus and inert background end together when native close completes. Native `method="dialog"` and imperative close bypass the exit. Live reduced motion cancels animation and completes close immediately. This modal-specific boundary differs from hidden disclosure content. Preview overrides affect only CSS; the component follows actual animation completion, including cancellation and rapid reopening.
