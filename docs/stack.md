# Stack

The owner-supplied Stack design and request approve this optional vertical layout primitive. Stack owns gaps between direct participating children and their cross-axis alignment. Ordinary CSS flex/grid wrappers remain supported.

## Contract

`Stack` renders a native div. It supports children, native div attributes, className, a forwarded HTMLDivElement ref and typed `StackStyle` CSS/token overrides. `gap` is `none`, `related` (default), `group`, or `section`. `align` is `stretch` (default), `start`, `center`, or `end`. No horizontal direction, reverse, wrapping, breakpoint objects, automatic separators or arbitrary styling props are supplied.

| Gap | Existing semantic role | Initial value in both themes |
| --- | --- | --- |
| none | Literal zero | 0 |
| related | `--fs-space-gap-related` | 16px |
| group | `--fs-space-stack-group` | 24px |
| section | `--fs-layout-section-gap` | 64px |

These existing variables are used directly: no new tokens or aliases are needed. Scoped overrides inherit normally, while explicit nested themes restore their complete defaults. The component CSS contains no breakpoint. Consumers can change the existing roles with their own scoped CSS/media queries; Stack stays vertical at every width. Use the optional [Cluster](./cluster.md) component for horizontal wrapping relationships. Ordinary wrapping flex rows remain available.

## Ownership and accessibility

Stack uses column flexbox and CSS gap, preserving DOM, reading and keyboard order. Start/end alignment follows writing direction; stretch affects auto-sized children through normal flex alignment without forcing descendant widths. Stack can shrink within flex/grid parents. Direct items do not shrink in the block axis, so content can grow; a constrained-height parent may overflow and must own its height/scrolling decision.

Gaps appear only between participating flex items. Native hidden or display:none children do not participate; visibility:hidden children still occupy layout. No spacer elements or child margins implement the gap. Stack does not reset consumer margins: a child's block margins add to visible separation. Reset margins explicitly on your own content when exact gap measurements are needed. Nested stacks own their respective direct-child relationships.

Keep a composed field such as TextInput, Textarea, Select, or FormGroup as one Stack child. Splitting a field's label, control and messages into separate children incorrectly gives their internal relationships the outer sibling gap; the field already owns its own spacing and accessibility associations. React fragments do not create grouping elements, so use an actual wrapper when multiple nodes should form one layout item.

Stack adds no padding, background, border, shadow, fixed height, focus stop or section semantics. Parents own width, inset and placement; use Container for centered constrained width/gutters. Children own wrapping and overflowing content. Stack deliberately does not impose widths, hide overflow/focus rings, or repair long unbreakable text. Semantic form/section elements remain consumer-owned.

```tsx
import { Container, Stack, TextInput, Button } from 'fletchstack-ui';
import 'fletchstack-ui/tokens.css';
import 'fletchstack-ui/container.css';
import 'fletchstack-ui/stack.css';
import 'fletchstack-ui/field.css';
import 'fletchstack-ui/text-input.css';
import 'fletchstack-ui/button.css';

<Container>
  <form>
    <Stack gap="group">
      <TextInput label="Project name" name="project" />
      <Stack align="start"><Button type="submit">Save changes</Button></Stack>
    </Stack>
  </form>
</Container>
```

Use combined `styles.css` or the appropriate standalone stylesheets. JavaScript imports no CSS, browser globals, providers or layout effects, and CSS layout works before hydration. Storybook: Components → Layout → Stack. All example outlines, measurement blocks and margin resets belong to demonstration CSS or consumer content; they are not Stack's appearance.

## Verification

The native-description test failed against the initial wrapper because attributes were dropped, then passed after forwarding native div props. All 466 unit tests and 185 integration tests passed, each independently reaching 100% per-file statements, branches, functions and lines. All 222 Storybook interaction/axe checks and 39 focused Chromium checks passed.

Lint, type checks, library/Storybook builds, packed React 18/19 exports/types/SSR/CSS/bundle-isolation checks and strict OpenSpec validation passed. Authoritative token sources and generated outputs remain unchanged, and generation reproduces exactly. Both theme form compositions were visually reviewed.

Browser coverage checks actual 0/16/24/64px gaps, all alignments and fixed-width children, RTL start/end, nested relationships, hidden/display:none children, additive consumer margins, scoped role independence and theme resets, responsive CSS, flex/grid shrinking, long-content growth, native hiding, form keyboard order/reset, focus clearance and 320px forms with 200% text and user spacing. Source-browser checks confirm CSS layout before hydration and child sizes/visible overflow in a constrained-height parent.

Real screen-reader output and non-Chromium rendering remain unverified. Consumer margins can add to gap, and fixed/unbreakable overflowing children remain consumer-owned; Stack does not conceal them.

The complete Chromium regression suite passed all 437 tests with three workers. Every scoped production and authored Storybook module reached 100% statements, branches, functions and lines. Coverage thresholds and exclusions were unchanged. All four tracked tasks in the add-stack OpenSpec change are complete; archive remains a separate review/finalization action.
