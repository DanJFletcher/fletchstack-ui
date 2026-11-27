# Kbd

Kbd displays keyboard input with native `<kbd>` semantics. KbdGroup is an unboxed outer `<kbd>` that arranges individual keys or sequences in source order, with wrapping. Inspired by the [shadcn Kbd reference](https://ui.shadcn.com/docs/components/base/kbd).

```tsx
import { Kbd, KbdGroup } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/kbd.css';

<p>
  Open the command palette with{' '}
  <KbdGroup>
    <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
  </KbdGroup>
  .
</p>;
```

| API                            | Type and default                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| `children`                     | Required ReactNode; key text, decorative icons or composed keys                             |
| `className`                    | Optional class merged with the component's base class                                       |
| `style`                        | Native CSSProperties plus `--fs-*` overrides                                                |
| Native attributes and handlers | Forwarded to the native kbd element, including hidden, dir, lang, title and data attributes |
| `ref`                          | Forwarded as HTMLElement for both components                                                |

Public exports: Kbd, KbdGroup, KbdProps, KbdGroupProps, KbdStyle and KbdGroupStyle. There is one keycap appearance, with no variants, state, platform detection or animation. Import combined styles.css instead of split styles if preferred. Parents own surrounding layout; groups own only the gap between related keys. Separators are caller-supplied so chords (`Ctrl + K`) and sequences (`G then I`) can be expressed explicitly.

## Accessibility and behavior

Neither component adds a role, live region, tab stop or shortcut listener. Applications implement shortcuts and put `aria-keyshortcuts` on the actual actionable control when appropriate. A visual hint alone does not create that shortcut. Native buttons remain the only interaction target when containing keycaps; avoid links or buttons inside Kbd. Supply readable key names such as Escape, Enter or Command. For symbolic text or artwork, hide the decorative glyph and include readable text (visually hidden if desired) inside the keycap; do not depend on screen readers pronouncing symbols consistently.

```tsx
<Button aria-keyshortcuts="Control+S" onClick={save}>
  Save{' '}
  <KbdGroup>
    <Kbd>Ctrl</Kbd>
    <Kbd>S</Kbd>
  </KbdGroup>
</Button>
```

The application must also implement Control+S if it advertises that combination. The Storybook examples demonstrate button activation, tooltip descriptions, a search-field hint, explicit RTL ordering, both themes and local styling. The displayed sequence is never automatically reversed; set `dir="ltr"` on a shortcut in RTL text when that is the intended notation.

## Theming

Both themes provide `--fs-kbd-surface`, `--fs-kbd-text`, `--fs-kbd-border`, `--fs-kbd-border-width`, `--fs-kbd-shadow-offset`, `--fs-kbd-radius`, `--fs-kbd-minimum-size`, `--fs-kbd-padding-inline`, `--fs-kbd-padding-block`, `--fs-kbd-icon-size`, `--fs-kbd-gap`, `--fs-kbd-group-gap` and `--fs-kbd-font-{family,size,weight,line-height}`. Typography follows user font preferences; dimensions are minimums rather than fixed heights. Labels can wrap, groups wrap and forced-colors mode retains a visible native keycap boundary. Tokens inherit through nested theme regions.

```tsx
<Kbd style={{ '--fs-kbd-radius': '0px' }}>Enter</Kbd>
<KbdGroup style={{ '--fs-kbd-group-gap': '8px' }}><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
```

Overrides are scoped to the instance and descendants. Adjacent keys retain theme defaults.
