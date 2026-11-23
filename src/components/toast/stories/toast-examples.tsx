import { useRef, useState } from 'react';
import { Toast } from '../Toast';
import { ToastViewport } from '../ToastViewport';
import type { ToastPosition, ToastTone } from '../types';
import { Button } from '../../button/Button';
import { CheckIcon } from '../../icon/named/CheckIcon';
import { Icon } from '../../icon/Icon';
import './toast.stories.css';

const messages: Record<ToastTone, string> = { info: 'Your export is ready to download.', success: 'Your changes are now available to the team.', warning: 'Your session expires soon. Save your work.', error: 'We could not upload the file. Please try again.', neutral: 'This project has been archived.' };

/**
 * Compose optional artwork using the existing icon contract.
 **/
export function ToastGlyph({ tone }: { tone: ToastTone }) {
  return tone === 'success' ? <CheckIcon /> : <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v6m0 4v.01" /></Icon>;
}

/**
 * Show persistent feedback and an action whose result is owned by the consumer.
 **/
export function SavedToast() {
  const [open, setOpen] = useState(true);
  const [undone, setUndone] = useState(false);
  return <><Toast open={open} onOpenChange={setOpen} tone="success" title="Changes saved" icon={<CheckIcon />} announcement="off"
    action={<Button size="small" variant="secondary" onClick={() => { setUndone(true); setOpen(false); }}>Undo changes</Button>}>
    Your team can see the latest version.</Toast>{undone && <p role="status">Changes undone.</p>}{!open && <Button variant="ghost" onClick={() => { setUndone(false); setOpen(true); }}>Show notification</Button>}</>;
}

/**
 * Compare the same notification design in independently inherited themes.
 **/
export function ToastExample() {
  return <main className="toast-demo"><p className="toast-demo__eyebrow">fletchstack-ui / Feedback</p><h1>Toast</h1><p>Keep people informed without interrupting their work.</p>
    <div className="toast-demo__themes">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="toast-demo__theme" aria-label={theme}>
      <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><ToastViewport inline><SavedToast /></ToastViewport>
    </section>)}</div><h2>Every outcome has a voice</h2><ToastTones /></main>;
}

/**
 * Show all semantic tones without announcing static documentation on load.
 **/
export function ToastTones() {
  return <ToastViewport inline position="top">{(Object.keys(messages) as ToastTone[]).map(tone => <Toast key={tone} tone={tone} title={tone[0]!.toUpperCase() + tone.slice(1)} icon={<ToastGlyph tone={tone} />} announcement="off">{messages[tone]}</Toast>)}</ToastViewport>;
}

/**
 * Keep a bounded consumer-owned queue with stable keys and explicit fixed positioning.
 **/
export function ToastQueue() {
  const nextId = useRef(0);
  const [notifications, setNotifications] = useState<number[]>([]);
  return <div className="toast-demo__interactive"><h2>Project settings</h2><p>Save a change to add a notification. Up to three are kept in this example.</p>
    <Button onClick={() => { const id = ++nextId.current; setNotifications(current => [...current.slice(-2), id]); }}>Save changes</Button>
    <ToastViewport>{notifications.map(id => <Toast key={id} title={`Revision ${id} saved`} tone="success" icon={<CheckIcon />} dismissLabel={`Dismiss revision ${id}`} onOpenChange={() => setNotifications(current => current.filter(value => value !== id))}>Your team has the latest version.</Toast>)}</ToastViewport></div>;
}

/**
 * Demonstrate optional timing while preserving the underlying result on the page.
 **/
export function TimedToast() {
  const [open, setOpen] = useState(false);
  return <div className="toast-demo__interactive"><Button onClick={() => setOpen(true)}>Copy project link</Button><p>The project link is always available in project settings.</p>
    <ToastViewport inline><Toast open={open} onOpenChange={setOpen} duration={10000} title="Link copied" action={<a href="#project-settings">Project settings</a>}>Ready to share. Dismisses after ten seconds of idle time.</Toast></ToastViewport>
    <a id="project-settings" href="#settings">Open project settings</a></div>;
}

/**
 * A controlled action explicitly dismisses the toast; ordinary actions need not do so.
 **/
export function ControlledToast() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  return <div className="toast-demo__interactive"><Button onClick={() => setOpen(true)}>Archive project</Button><ToastViewport inline>
    <Toast open={open} onOpenChange={setOpen} title="Project archived" tone="neutral" action={<Button variant="secondary" onClick={() => setCount(count + 1)}>View archived projects</Button>}>You can restore it from settings.</Toast>
  </ToastViewport><output aria-label="View requests">{count} requests</output><a href="#next">Next page action</a></div>;
}

/**
 * Exercise long text, wrapped actions and independent scoped overrides.
 **/
export function NarrowToast() {
  return <div className="toast-demo__narrow"><Toast title="Your workspace invitation could not be delivered" tone="error" announcement="off" icon={<ToastGlyph tone="error" />} action={<Button variant="secondary">Review the invitation and send it again</Button>}>Please check the address and try again. VeryLongUnbrokenProjectNamesMustWrapWithoutClipping.</Toast></div>;
}

/**
 * Change only one card while retaining the surrounding theme contract.
 **/
export function ToastOverrides() {
  return <ToastViewport inline><Toast title="Custom notification" announcement="off" style={{ '--fs-toast-radius': '0px', '--fs-toast-accent-width': '8px' }}>Only this notification is customized.</Toast><Toast title="Neighbor" announcement="off">This notification uses the theme defaults.</Toast></ToastViewport>;
}

/**
 * Reveal a standalone notification or a stack at an explicitly chosen page edge.
 **/
export function PositionedToast({ stacked = false }: { stacked?: boolean }) {
  const [position, setPosition] = useState<ToastPosition>('bottom-right');
  const [open, setOpen] = useState(false);
  const positions: ToastPosition[] = ['top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left', 'top-start', 'top-end', 'bottom-start', 'bottom-end'];
  const message = <Toast open={open} onOpenChange={setOpen} title="Changes saved" {...(stacked ? {} : { position })}>Your team has the latest version.</Toast>;

  return <div className="toast-demo__interactive"><label>Notification position <select value={position} onChange={event => setPosition(event.target.value as ToastPosition)}>{positions.map(value => <option key={value}>{value}</option>)}</select></label>
    <Button onClick={() => setOpen(true)}>Show notification</Button><p>Dismiss, then show again to replay the entrance. Reduced motion shows the message immediately.</p>
    {stacked ? <ToastViewport position={position}>{message}<Toast open={open} onOpenChange={setOpen} title="Export ready" dismissLabel="Dismiss export">Your download is ready.</Toast></ToastViewport> : message}</div>;
}
