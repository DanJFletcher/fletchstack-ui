# Rating

Rating owns a numeric review summary or one native rating field. The [one-page design and behavior reference](https://themed-react-ui-foundation.replit.app/?path=/docs/components-rating--docs) approve the three symbols and whole/half-step choices. Parents own placement and form submission; the component owns stable artwork, option targets and field relationships.

## Display

`<Rating value={4.5} showValue />` renders four full stars and one half-filled star, alongside `4.5 / 5`. Display is the default mode, with five symbols and value zero when unanswered. A single named image describes the complete score; all SVG artwork is decorative and the display has no tab stop. The optional visible score is hidden from assistive technology in display mode to avoid repeating the image's score. An optional `label` is visible supporting context.

Fractional fill clips a full-size solid drawing under an independent full-size outline; it never scales or squeezes the fill. Fill proceeds from the physical left for all symbols, including in RTL layouts. Display accepts any finite score from zero through max.

## Input

`<Rating mode="input" label="Your rating" name="rating" defaultValue={3} showValue />` renders a visible legend and native radio fieldset. Whole steps offer 1–max; `step={0.5}` offers 0.5–max behind the same max visible symbols. Each symbol has a complete 48px input cell, split into two 24px pointer/focus targets for half steps. Each radio has its own localized score name. Native Tab enters/leaves the group; arrows change selection and the active target receives the focus ring.

`value` and `onValueChange` provide controlled state. `defaultValue` initializes uncontrolled state. Zero or an omitted value leaves every option unchecked and visually empty. There is no selectable zero/clear option. Native reset restores the uncontrolled mount default without firing a change callback, honors canceled resets, and preserves controlled authority. `name` supplies the selected form entry as a numeric string. An omitted name uses an instance-unique generated radio group name; supply an explicit name when submitting forms. `form` supports external form ownership.

`required` uses real radio validation: unanswered fields fail native validity and selected fields pass. `description`, `error`, `invalid`, and `aria-describedby` associate supporting text with both group and choices; errors imply invalid state. Validation messages remain caller-owned, matching other library fields. `disabled` preserves the score and prevents interaction/submission. Native `hidden`, root refs, className, style and ordinary div attributes are supported. The component owns its semantic role and accessible names; children, custom roles and tabIndex are excluded.

## Scale, symbols and formatting

- `max`: integer from 1 through 10, default 5.
- `step`: 1 (default) or 0.5. Input values must be zero or match a step exactly.
- `size`: `sm`, `md` (default), `lg`, with 20/32/48px artwork and stable input targets.
- `symbol`: `star` (default), `heart`, `thumbs`; artwork uses the library Icon primitive.
- `getRatingLabel(value, max, symbol)`: customize image/radio accessible names. Defaults include the symbol, such as `3.5 out of 5 hearts`.
- `formatValue(value, max)`: customize the visible score when `showValue` is true. Default: `value / max`.

Invalid scales, steps, out-of-range/non-finite scores, missing/blank input labels and off-step input scores throw clear errors rather than silently changing the submitted value. Defaults are read at mount; controlled updates must remain within the selected scale.

## Theme and accessibility

Dedicated rating fill/outline/disabled roles match Corporate gold and Luna orange. Shared field tokens supply text, supporting text and errors; radio tokens supply immediate focus; symbol sizes, target size and gap have semantic rating roles. Override semantic variables through `RatingStyle`; explicit nested themes reset their token contracts. All artwork dimensions and outlines remain stable across changes. No motion is introduced. Forced colors preserve static outlines and selected fill using system colors.

Display is one image. Input remains native radios, not buttons or a custom keyboard widget. Symbols can wrap within narrow containers and labels/messages can reflow. A disabled survey keeps its visible score. Browser checks own actual pointer halves, native arrows/Tab, real form submission/validity, pixel geometry and forced colors. DOM and independent hydration gates own state, relationships, formatting and SSR consistency. See the [verification record](rating-verification.md) for final evidence and limits.
