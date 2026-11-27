# Callout

Persistent, in-flow guidance approved from the publishing-warning design sheet and [reference behavior](https://themed-react-ui-foundation.replit.app/?path=/docs/components-callout--docs). Callout owns its internal layout; parents own placement and removal. Existing Badge is compact status text, while Callout supports a message and next action.

```tsx
import { Callout, Button } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

<Callout
  tone="warning"
  title="Review before publishing"
  action={<Button variant="secondary">Review pages</Button>}
>
  Two pages still need approval.
</Callout>;
```

| Prop                | Type                                          | Default  |
| ------------------- | --------------------------------------------- | -------- |
| children            | ReactNode; message body                       | required |
| title, icon, action | ReactNode                                     | omitted  |
| tone                | info / success / warning / error / neutral    | info     |
| role                | note / status / alert                         | unset    |
| className           | string                                        | omitted  |
| style               | CalloutStyle: CSSProperties plus --fs-* hooks | omitted  |
| ref                 | HTMLDivElement                                | omitted  |

Native div attributes and event handlers are forwarded. The native string title attribute is replaced by the renderable title slot. Icons are decorative: do not put interactive controls in the icon slot. Use action for links and buttons; their native semantics and visible focus are preserved. No automatic dismissal or timers run. Callout does not choose announcement semantics from tone. Select note for supplemental content, status for a suitable polite update, or alert for an urgent update; leave persistent guidance generic by default. The message must express its meaning in words.

## Layout and semantic tokens

Title, body and action share one text column beside an optional first-line icon. Empty optional values add no slots; numeric zero remains valid content. Body-only messages fit one compact row when their content fits. Content grows and wraps, including long unbroken words and action labels.

Both themes publish `callout.{tone}.{surface,text,accent}` using existing palette primitives. Corporate warning uses amber tint with amber artwork and leading accent; Luna uses a dark panel with light text and amber accent. Layout roles supply a 6px leading accent, 1px outer border, 6px radius, 12px block / 16px inline padding, 12px icon gap and 8px content gap. Typography follows the body font with an emphasized title. Nested theme boundaries resolve their own semantic values. Forced colors retain boundaries and text.

Scoped hooks `--fs-callout-surface`, `--fs-callout-text`, `--fs-callout-accent` and `--fs-callout-border` override the current tone. Accent controls the leading stripe, artwork and default outer border; border can independently override the outer boundary. All published layout and typography roles are also available as `--fs-callout-*` variables. Pass hooks through style or apply a consumer class to one instance; values inherit normally. For example:

```tsx
<Callout style={{ '--fs-callout-radius': '0px', '--fs-callout-padding-inline': '24px' }}>
  Customized instance
</Callout>
<Callout>Unchanged neighbor</Callout>
```

Load `tokens.css` and `callout.css` for individual styles, plus the styles of composed icons/actions, or use combined styles. Storybook: Components / Feedback / Callout, with playground, both-theme publishing sheet, five tones, body-only, narrow wrapping, explicit role, keyboard action and scoped overrides.

See [verification evidence](callout-verification.md) for executed checks, visual review and remaining manual assistive-technology limitations.
