# AvatarGroup

Approved by the [reference documentation](https://themed-react-ui-foundation.replit.app/?path=/docs/components-avatar-group--docs) and supplied image: a compact, ordered team composed from the existing [Avatar](avatar.md), with an overflow disclosure. Default geometry is 32px identities, 8px overlap and 2px separating rings. Parents own headings, surrounding spacing, actions, and member data.

## API and behavior

`label` is the required accessible group name. `members` is a readonly array of `AvatarGroupMember` records with stable unique `id`, meaningful `name`, optional `src`, and optional custom `initials`. IDs are React keys, not DOM IDs. The group preserves input order and delegates photo loading/failure and initials to Avatar. Members are passive identity artwork, not links or selectable controls.

`maxVisible` defaults to 3 and counts visible people, excluding the overflow control. Zero shows only `+N`; negatives clamp to zero, fractions round down, and nonfinite values use the default. Small groups have no disclosure; an empty array leaves an empty named group. `size` uses the existing Avatar names `small`, `medium` (default), `large`, and `xlarge`, corresponding to 24/32/48/64px. This adapts the reference's `md` spelling to the established library API.

Native `details`/`summary` reveals the hidden members' names in their original order, including decorative Avatar artwork. The default accessible disclosure name is `Show N more member(s)`; `overflowLabel` replaces it for localization, and `overflowListLabel` replaces `Additional team members`. Native keyboard activation uses Enter/Space and leaves focus on the summary. This is a disclosure list, not a menu or modal; it does not add arrow-key navigation, Escape/outside-click dismissal, a focus trap, or automatic focus movement. It also works before hydration and without JavaScript. A data change removes the disclosure if no overflow remains.

The root forwards its div ref, descriptive/native attributes, class and style. Role, accessible name, arbitrary children, and HTML replacement remain owned even for untyped consumers. Native `hidden` removes the whole group from layout.

```tsx
import { AvatarGroup } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/avatar.css';
import 'fletchstack-ui/avatar-group.css';

<AvatarGroup label="Project team" members={members} maxVisible={3} />
<AvatarGroup label="Assigned editors" members={members} maxVisible={0}
  overflowLabel={`View all ${members.length} assigned editors`} />
```

Combined `styles.css` includes both component stylesheets. Group semantic `avatarGroup.*` tokens independently own overlap, separating rings, overflow paint, and disclosure layout/paint/typography in Corporate and Luna. Existing Avatar tokens retain footprint and artwork ownership. Use `AvatarGroupStyle` to override scoped group tokens; set the ring color to the surrounding surface when placing a group on a custom background. The disclosure is positioned below the group and bounded by its container/viewport; do not clip it with an ancestor's overflow. Names wrap and grow with text preferences. Logical spacing supports RTL. Forced colors preserve a visible boundary and keyboard focus.

## Evidence and limits

DOM tests own member ordering, input normalization, naming, native attribute/ref forwarding, and data changes. Hydration and no-JavaScript browser tests own deterministic server output and native disclosure. The browser harness owns real keyboard activation/focus, hidden-content visibility, geometry, both themes/contrast, failed-photo fallback, RTL, forced colors, nested theme reset and 320px enlarged/spaced-name reflow. Storybook owns documentation and render/play/accessibility checks with shared plain React examples.

Image URLs are runtime member data; affected discovery retains its conservative full fallback where it cannot prove resource ownership. No dependency-analyzer changes are required for this component. Actual screen-reader output and non-Chromium behavior require manual verification.

### Affected-selection boundary

The current selector broadens to the complete inventory when any scenario graph has an unproven resource. AvatarGroup's runtime member array crosses that boundary, so it currently also broadens otherwise unrelated local selections. This preserves the existing conservative policy; precise-selection regression cases use a proven repository subset, while a separate complete-inventory regression asserts the actual fallback. Improving bounded member-array analysis is separate work.

### Authoring workflow observation

The scaffold preview and file application took 1.08s on this machine, including both command startups. Generated registrations needed no correction; the member type and additional scenario registrations were intentionally authored for the final contract. Reference reading, API/behavior/token work, examples, test authoring, and verification are outside that setup measurement. Development uncovered a nonexistent focus token, a summary-role locator mismatch in this Playwright version, and the dependency-selection fixture assumption described above. These observations do not establish a total authoring-speed improvement.

### Final verification — 2026-11-12

- 802 unit tests passed in 10.58s and 608 integration tests passed in 33.70s. Both independent gates reached 100% statements, branches, functions, and lines. Coverage first ran after implementation and review; the integration fixture repair was checked without coverage before rerunning its gate. The unchanged unit result remained valid.
- All 426 E2E tests passed in 94.99s (398 harness and 28 retained Storybook cases, three workers, no retries). All 359 Storybook render/play/accessibility checks passed in 15.87s. Ordinary browser execution collected no diagnostic coverage.
- Structural checking, lint, both TypeScript checks, built-browser/library verification (3.65s), static Storybook build (8.21s), and packed exports/types/CSS/bundling/React 18 and 19 SSR checks (7.44s) passed. Package checks caught shared fixture variable-name collisions, repaired with component-specific names; no component changes or unrelated test reruns were needed.
- Inspected the composition and expanded disclosure screenshots. Focused browser checks covered real native Enter/Space activation and focus, 32px/8px/2px geometry, all four sizes, both themes/contrast, count-only long-name reflow at 320px with enlarged/spaced text, failed photos, RTL, forced colors, hidden layout, and nested token reset. Dedicated SSR checks verified native disclosure without hydration.

These are single local observations with existing caches. Logs, timing records, affected-selection explanations and screenshots are under ignored `.verification/avatar-group/`. Remote CI, real screen-reader output, and non-Chromium behavior remain unverified.
