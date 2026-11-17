import { useState, type ReactElement } from 'react';
import { Tabs } from '../Tabs';
import { Button } from '../../button/Button';
import type { TabsItem, TabsProps } from '../types';

export const workspaceItems: TabsItem[] = [
  { id: 'overview', label: 'Overview', content: <><h3>Workspace overview</h3><div className="tabs-demo__stats"><span>3 projects</span><span>8 members</span></div></> },
  { id: 'activity', label: 'Activity', content: <><h3>Recent activity</h3><a href="#activity">View all activity</a></> },
  { id: 'settings', label: 'Settings', content: <p>Workspace settings</p>, disabled: true },
];

/**
 * Share the sheet's panel data across visual variants and active themes.
 **/
export function WorkspaceTabs(props: Omit<TabsProps, 'items' | 'label'>): ReactElement {
  return <Tabs label="Workspace" items={workspaceItems} {...props} />;
}

/**
 * Recreate the sheet's line/automatic and pills/manual examples in both themes.
 **/
export function TabsExample(): ReactElement {
  return <div className="tabs-demo"><h1>Tabs</h1><p>Switch between related panels within the same view.</p>{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="tabs-demo__theme"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><div className="tabs-demo__grid"><section><h3>Line / automatic</h3><div className="tabs-demo__card"><WorkspaceTabs /></div></section><section><h3>Pills / manual</h3><div className="tabs-demo__card"><WorkspaceTabs variant="pills" activationMode="manual" /></div></section></div></section>)}</div>;
}

/**
 * Make local React state observable after tab switches and item reordering.
 **/
function DraftPanel(): ReactElement {
  const [draft, setDraft] = useState('Initial draft');

  return <label>Draft<input value={draft} onChange={event => setDraft(event.target.value)} /></label>;
}

/**
 * Reorder stable identities without remounting the edited panel.
 **/
export function PersistentTabs(): ReactElement {
  const [reversed, setReversed] = useState(false);
  const items: TabsItem[] = [{ id: 'draft', label: 'Draft', content: <DraftPanel /> }, { id: 'preview', label: 'Preview', content: <a href="#preview">Open preview</a> }];

  return <><Button onClick={() => setReversed(!reversed)}>Reverse items</Button><Tabs label="Editor" items={reversed ? [...items].reverse() : items} /></>;
}

/**
 * Demonstrate a parent accepting selection immediately or through an explicit deferred action.
 **/
export function ControlledTabs({ deferred = false }: { deferred?: boolean }): ReactElement {
  const [value, setValue] = useState('overview'), [request, setRequest] = useState(''), [count, setCount] = useState(0);
  const change = (id: string) => { setCount(count + 1); setRequest(id); if (!deferred) { setValue(id); } };

  return <><Tabs label="Workspace" items={workspaceItems} value={value} onValueChange={change} /><output aria-label="Requests">{count}</output>{deferred && <Button disabled={!request} onClick={() => setValue(request)}>Accept request</Button>}</>;
}

/**
 * Exercise declarative collection changes without coupling them to selection internals.
 **/
export function DynamicTabs({ remove = false, disable = false, allDisabled = false }: { remove?: boolean; disable?: boolean; allDisabled?: boolean }): ReactElement {
  const items = workspaceItems.filter(item => !(remove && item.id === 'activity')).map(item => ({ ...item, disabled: allDisabled || Boolean(item.disabled) || (disable && item.id === 'activity') }));

  return <><input aria-label="Elsewhere" /><Tabs label="Workspace" items={items} defaultValue="activity" /></>;
}

/**
 * Show intrinsic overflow and full-width distribution without changing panel behavior.
 **/
export function OverflowTabs({ fullWidth = false }: { fullWidth?: boolean }): ReactElement {
  const items = Array.from({ length: 10 }, (_, index) => ({ id: String(index), label: `Workspace section ${index + 1}`, content: <p>Section {index + 1} content</p> }));

  return <div style={{ maxWidth: 380 }}><Tabs label="Sections" items={items} fullWidth={fullWidth} /></div>;
}

/**
 * Verify nested widgets own their keyboard events and tab buttons remain non-submitting.
 **/
export function NestedTabs(): ReactElement {
  const [submissions, setSubmissions] = useState(0);

  return <form onSubmit={event => { event.preventDefault(); setSubmissions(submissions + 1); }}><Tabs label="Outer" items={[{ id: 'nested', label: 'Nested', content: <Tabs label="Inner" items={workspaceItems} /> }, { id: 'other', label: 'Other', content: 'Other panel' }]} /><Button type="submit">Submit example</Button><output aria-label="Submissions">{submissions}</output></form>;
}

/**
 * Compare a scoped override with an unchanged neighbor and explicit nested theme.
 **/
export function TabsOverrides(): ReactElement {
  return <><WorkspaceTabs style={{ '--fs-tabs-indicator-width': '6px' }} /><WorkspaceTabs /><section data-theme="luna" className="tabs-demo__theme"><WorkspaceTabs variant="pills" /></section></>;
}

/**
 * Let a consumer remove, disable and restore its initially selected item.
 **/
export function DynamicTabsDemo(): ReactElement {
  const [remove, setRemove] = useState(false), [disable, setDisable] = useState(false);

  return <><label><input type="checkbox" checked={remove} onChange={event => setRemove(event.target.checked)} />Remove Activity</label><label><input type="checkbox" checked={disable} onChange={event => setDisable(event.target.checked)} />Disable Activity</label><DynamicTabs remove={remove} disable={disable} /></>;
}
