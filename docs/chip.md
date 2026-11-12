# Chip

Compact content tags and filters, based on the linked Chip reference. A chip is a static span unless selection or removal actions are provided. Both actions are native sibling buttons inside the same ref-forwarding span.

```tsx
import { Chip } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/chip.css';

<Chip>Design systems</Chip>
<Chip selected={selected} onSelect={setSelected}>Design systems</Chip>
<Chip onRemove={removeDrafts} removeLabel="Remove Drafts">Drafts</Chip>
<Chip selected={selected} onSelect={setSelected}
  onRemove={removeTopic} removeLabel="Remove topic">Topic</Chip>
```

Use `styles.css` instead of the individual stylesheets when including the whole library. Decorative artwork comes from the existing Check and Close icons; Chip supplies its own artwork sizing and stroke styling.

## Public contract

- `children` supplies a meaningful visible label and may include noninteractive React content. Do not place links or other controls inside a selectable label.
- `selected` and `onSelect(nextSelected)` must be provided together. The parent owns selection; a click requests its opposite without changing the supplied value. The selection button exposes `aria-pressed` and a decorative check when selected.
- `onRemove` and a nonempty, localized `removeLabel` must be provided together. Removal only invokes that callback. The parent decides whether to remove the chip and where focus should move afterward. The filter example restores focus to Reset filters.
- Selection and removal never nest, never invoke each other's callbacks, and use `type="button"` to avoid submitting forms. Native Enter/Space and Tab behavior applies; there is no composite keyboard navigation or extra wrapper tab stop.
- `disabled` disables available actions and applies disabled colors, including to a static chip. It does not change selection. A static chip otherwise adds no interactive role, pressed state or focusability.
- `size` is `small`, `medium` (default), or `large`, following this library's naming convention. These correspond to the reference's sm/md/lg examples. Minimum heights are 24/32/40px; padding, font size and content may make a chip taller. Removal targets are at least 24px. Labels wrap and grow, including unbroken text.
- Native span attributes/events, `hidden`, `className`, a span ref and typed `style` are forwarded. `onSelect` is reserved for the selection callback. Raw HTML is excluded so it cannot replace component-owned content.

Incomplete action pairs throw at runtime as well as failing TypeScript. No internal selection/removal state or JavaScript theme state is stored. Parents own chip collections, spacing, form values and filtering results. MultiSelect retains its existing independent tag contract.

## Themes and customization

Independent `chip.*` semantic roles reference primitives in Corporate and Luna. They cover neutral, hover, selected and disabled colors; font and size; artwork; spacing; radius; boundaries; and keyboard focus. Override `--fs-chip-*` custom properties through `style` or a scoped CSS rule. Explicit nested theme boundaries reset those roles. Chip owns internal spacing; parent rows own placement and sibling gaps.

## Verification

DOM contracts exercise forwarding, controlled callbacks, action independence, disabled state, invalid configurations and passive content. Integration contracts start with server-rendered markup and hydrate before exercising those behaviors; hydration recovery errors fail the tests. Browser journeys own native Enter/Space and Tab behavior, focus restoration after parent removal, safe form defaults, both-theme text contrast, nested theme resets, forced colors, target sizes and 320px reflow with 200% text and spacing overrides. Storybook owns render/play/axe checks for the documented states. Installed-package consumers verify exported types, stylesheet delivery and deterministic React 18/19 SSR. Spoken screen-reader output requires manual verification.

The Corporate/Luna composition was visually inspected at 1152px. Chromium journeys verified keyboard focus and restoration, 320px reflow at 200% text with spacing overrides, and forced colors. Spoken output with a screen reader has not been manually checked.
