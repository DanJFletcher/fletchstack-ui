# Tabs

Switch related panels within one view. Use line (default) or pills styling, automatic (default) or manual activation, and horizontal (default) or vertical orientation. Tabs is an in-view panel widget, not route navigation.

```tsx
import { Tabs, type TabsItem } from 'fletchstack-ui';
import 'fletchstack-ui/styles.css';

const items: TabsItem[] = [
  { id: 'overview', label: 'Overview', content: <WorkspaceOverview /> },
  { id: 'activity', label: 'Activity', content: <ActivityFeed /> },
  { id: 'settings', label: 'Settings', content: <Settings />, disabled: true },
];
<Tabs label="Workspace" items={items} defaultValue="overview" />
```

| Prop | Type | Default |
| --- | --- | --- |
| label | string; accessible name of the tablist | required |
| items | readonly TabsItem[] | required |
| value / defaultValue | item ID | first enabled item |
| onValueChange | (id: string) => void | — |
| variant | 'line' or 'pills' | 'line' |
| orientation | 'horizontal' or 'vertical' | 'horizontal' |
| activationMode | 'automatic' or 'manual' | 'automatic' |
| fullWidth | boolean; distributes horizontal tabs when they fit | false |
| style | TabsStyle; CSSProperties plus `--fs-*` overrides | — |
| ref / native div props | HTMLDivElement / native attributes and handlers | forwarded |

Exports: Tabs, TabsProps, TabsItem, TabsStyle. An item has a unique nonempty `id`, visible `label: ReactNode`, `content: ReactNode`, and optional `disabled`. Labels must convey text and contain no interactive descendants. Decorative icons can accompany labels. `id` on the root remains consumer-owned; internal tab/panel relationships use stable per-instance IDs. Blank list names and duplicate/blank item IDs are rejected.

```tsx
function ControlledWorkspace() {
  const [value, setValue] = useState('overview');
  return <Tabs label="Workspace" items={items} value={value} onValueChange={setValue} />;
}
```

Import `useState` from React in the controlled example.

## Selection and focus

`value` makes selection controlled. User activation requests a different enabled ID through onValueChange; the current panel changes only when the parent supplies a new value. Use defaultValue only to initialize an uncontrolled instance. Disabled and already-selected items do not emit changes, and native pointer focus/click does not duplicate requests.

If the selected item disappears or becomes disabled, the first enabled panel is displayed; with none enabled no panel is shown. Uncontrolled fallback becomes the stored selection, so a reintroduced old ID is not automatically restored. Controlled fallback only changes the effective display: it never rewrites the parent's value or emits a fallback callback. If that supplied ID becomes valid again, it resumes selection. Applications can reconcile their own selection when updating their data.

In automatic mode focus selects immediately. In manual mode arrows move focus while the selected panel remains unchanged until Enter or Space. Choose manual activation for content where selecting a tab triggers expensive application work. Tab/Shift+Tab enter on the selected tab and leave the list normally. Horizontal arrows mirror under inherited RTL; vertical lists use Up/Down. Home/End reach enabled boundaries, and arrows wrap past disabled items. Other arrows and modified shortcuts remain native. Each active panel is a keyboard stop, including plain-text panels.

A focused tab that is removed/disabled returns focus to the effective selected tab. If no enabled tab remains, the list receives programmatic focus without joining normal Tab order. Background updates do not move focus from unrelated controls. Focus indication and selected styling are separate.

## Persistent panels and responsive layout

Every supplied panel remains mounted; inactive panels are immediately hidden from keyboard users and assistive technology. Local control values survive selection changes and item reordering with the same IDs. Actual item removal unmounts its panel. Hidden content can still run effects and fetch data: persistence does not suspend work.

Horizontal labels use an independently scrollable tab list. fullWidth distributes tabs when they fit and retains scrolling when they do not. Keyboard movement reveals clipped tabs inside that list without scrolling page ancestors. Vertical labels wrap beside their panel. Orientation does not change automatically with viewport width. Panel and scrolling updates are immediate, including with reduced motion.

## Themes and scoped styles

Use semantic `--fs-tabs-*` roles for text, selected/disabled text, divider, indicator, pill/hover surface, spacing, font size, weight, and radius. Focus reuses the link-focus foundation. Corporate and Luna supply the palette; nested themes reset the token contract. An instance override such as `style={{ '--fs-tabs-indicator-width': '4px' }}` affects only that subtree. Parent layout owns placement and outer spacing. Import tokens.css and tabs.css, or styles.css.

Routing, closable tabs, drag reordering, lazy mounting, and panel animation are outside the initial API.
