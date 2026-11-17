import { useState } from 'react';
import { Popover } from '../Popover';
import type { PopoverProps } from '../types';
import { Button } from '../../button/Button';
import { Dialog } from '../../dialog/Dialog';
import { TextInput } from '../../text-input/TextInput';
import { Link } from '../../link/Link';

/**
 * Compose persistent editable content and a following control in normal page order.
 **/
export function PopoverDemo(props: Partial<PopoverProps>) {
  return <div className="popover-demo__controls"><Popover triggerLabel="Project details" heading="Project details" description="A quick view of the current workspace." {...props}>
    <p>Three drafts are ready for review.</p><TextInput label="Project name" defaultValue="Studio" /><p><Link href="#drafts">Review drafts</Link></p>
  </Popover><Button variant="secondary">Next page control</Button></div>;
}

/**
 * Reuse the same content with inherited Corporate and Luna semantic tokens.
 **/
export function PopoverExample() {
  return <div className="popover-demo"><h1>Popover</h1><p>Anchored, non-modal content that fits the viewport.</p>{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="popover-demo__theme"><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><PopoverDemo /></section>)}</div>;
}

/**
 * Allow the parent to accept controlled requests explicitly.
 **/
export function ControlledPopover() {
  const [open, setOpen] = useState(false), [requested, setRequested] = useState(false);

  return <><Popover triggerLabel="Controlled panel" heading="Controlled content" open={open} onOpenChange={() => setRequested(true)}>The parent decides when to apply requests.</Popover><Button onClick={() => { setOpen(!open); setRequested(false); }}>Accept request</Button><output aria-label="Open request">{requested ? 'Requested' : 'Waiting'}</output></>;
}

/**
 * Keep the non-modal panel above a native modal while inheriting its theme.
 **/
export function PopoverInDialog() {
  const [open, setOpen] = useState(false);

  return <><Button onClick={() => setOpen(true)}>Open review</Button><Dialog open={open} onOpenChange={setOpen} heading="Review changes"><PopoverDemo /></Dialog></>;
}

/**
 * Compare a scoped panel override against an unchanged sibling.
 **/
export function PopoverOverrides() {
  return <><Popover triggerLabel="Custom panel" panelClassName="custom-panel" panelStyle={{ '--fs-popover-radius': '24px' }}>Custom surface</Popover><Popover triggerLabel="Default panel">Default surface</Popover></>;
}

/**
 * Demonstrate a constrained anchor at the top-right viewport boundary.
 **/
export function EdgePopover() {
  return <div className="popover-demo__edge"><PopoverDemo side="top" align="start" /></div>;
}
