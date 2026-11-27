# Accordion

A group of disclosures following the one-page team FAQ design and linked Accordion reference. The full heading row is a native button. A stable trailing chevron points down when closed and up when open; panel padding aligns content with the title text. `divided` (default) separates items with rules, `outlined` adds one group border, and `surface` uses one shared tinted surface.

```tsx
import { Accordion, type AccordionItem } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/accordion.css';

const items: AccordionItem[] = [
  { id: 'join', title: 'Who can join?', content: 'Anyone invited to your team.' },
  {
    id: 'invite',
    title: 'How do I invite someone?',
    content: <a href="#settings">Team settings</a>,
  },
];
<Accordion items={items} label="Team FAQ" defaultOpenItems={['invite']} headingLevel={3} />;
```

Use `styles.css` instead of individual CSS imports when including the whole library. Existing ChevronDown artwork is sized/stroked by Accordion's scoped CSS; separate icon CSS is unnecessary.

## API and expansion

`items` provides stable unique nonempty `id` strings, renderable `title`/`content`, and optional `disabled`. Titles must contain meaningful noninteractive label content. `openItems` and `onOpenItemsChange(ids)` provide controlled state; `defaultOpenItems` initializes uncontrolled state. No selection means all panels begin collapsed. Activating an open item closes it; opening a different item replaces the previous selection. `multiple` allows independent toggles and more than one initial selection. Disabled trigger buttons cannot be activated; a parent may still explicitly supply their expansion state.

Callbacks receive a fresh array, and controlled props remain authoritative until the parent updates them. Selected IDs must be unique and belong to the current items; more than one selection requires `multiple`. Invalid identities/selections throw rather than creating ambiguous relationships. Keep selections synchronized when removing items or changing expansion modes. Content stays mounted, so closing/reopening preserves input and child component state.

`headingLevel` accepts 1–6 and defaults to 3. Match the surrounding page hierarchy. `label` optionally names a group. Native div attributes, class names, styles, hidden state and refs are forwarded to the root. The component owns its children and raw HTML is excluded. A React instance ID is combined with each item's stable ID for trigger/panel relationships, independently of root IDs or item order. Callers should still give any explicit root `id` a unique document value.

## Accessibility and motion

Each heading contains a native `type="button"` trigger with `aria-expanded` and `aria-controls`. Each panel is a region labelled by that trigger. Normal Tab/Shift+Tab and Enter/Space apply; no custom arrow-key navigation or roving tab index is introduced. The focus ring follows the focused trigger independently of the expanded item. Collapsed content is hidden from assistive technology and cannot receive keyboard focus.

`panelMotion="none"` is the default: closed panels use native `hidden`, and panel changes are immediate. `panelMotion="expand"` transitions grid size and opacity with shared motion duration/easing tokens. Animated closing panels become inert and `aria-hidden` during the DOM commit, before the fade/size transition finishes; visibility becomes hidden at the end. This preserves mounted content without exposing fading links or controls. Before hydration, closed panels retain native `hidden`; the component only enables animated layout after inert has been installed. DOM-property assignment avoids React 18/19 differences in rendering the inert attribute. Reduced-motion CSS removes panel and chevron transitions and applies the closed state immediately. No timer or animation event is needed for correctness.

## Tokens and verification

Accordion directly uses the existing Corporate/Luna text, heading/body typography, gallery surface, card border/radius, semantic spacing, button focus/disabled/minimum target, and icon roles. The repository previously lacked shared disclosure motion roles. `motion.duration.standard` (160ms) and `motion.easing.standard` (cubic-bezier(0.2, 0.8, 0.2, 1)) reproduce the reference's existing motion tokens. New DTCG duration/cubicBezier validation and serialization preserve units and reject invalid control points. Both themes expose the same motion contract; scoped overrides are supported through typed `style`.

DOM tests own callback/selection policy, attributes, refs, all heading levels, identity validation and persistent content. Integration tests hydrate real server markup, reject recovery errors and exercise those contracts. Node token tests independently validate motion values; generation integration verifies distributable CSS. Harness journeys own native keyboard/link behavior, focus, geometry, both-theme contrast, 320px enlarged/spaced reflow, forced/reduced motion, actual size/opacity transitions, inert exclusion during closing, and instance-unique relationships. Storybook render/play/axe covers the documented variants and states; its motion play waits for visible final opacity before scanning. Packed consumers verify public types/styles and React 18/19 SSR.

The team FAQ composition was visually inspected at 1152px with Invite expanded in both themes and focus independently on the Corporate Join trigger. Spoken screen-reader output and non-Chromium browser behavior remain manually unverified.

## Motion foundation

See [motion](motion.md) for shared timing, preview modes and reduced motion. Panel motion remains opt-in. Focus, expanded state, and keyboard access update immediately, including during exit; rapid activation follows the latest state.
