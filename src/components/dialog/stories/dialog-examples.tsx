import { useRef, useState, type ReactElement } from 'react';
import { Dialog } from '../Dialog';
import type { DialogProps } from '../types';
import { Button } from '../../button/Button';
import { TextInput } from '../../text-input/TextInput';
import { Link } from '../../link/Link';

export type DialogDemoProps = Partial<Omit<DialogProps, 'onOpenChange'>> & { initialOpen?: boolean; long?: boolean; nativeForm?: boolean; veto?: boolean };

/**
 * Keep trigger and confirmation state in the consumer while composing a native modal.
 **/
export function DialogDemo({ initialOpen = false, long = false, nativeForm = false, veto = false, ...props }: DialogDemoProps): ReactElement {
  const [open, setOpen] = useState(initialOpen), [confirmed, setConfirmed] = useState(0), [requests, setRequests] = useState(0);
  const ref = useRef<HTMLDialogElement>(null);
  const change = (next: boolean) => { setRequests(value => value + 1); setOpen(next); };
  const footer = <><Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { setConfirmed(confirmed + 1); setOpen(false); }}>Confirm</Button></>;

  return <><Button onClick={() => setOpen(true)}>Open dialog</Button><output className="dialog-demo__status" aria-label="Confirmations">{confirmed}</output><output className="dialog-demo__status" aria-label="Close requests">{requests}</output>
    <Dialog ref={ref} heading="Confirm the changes?" description="Review this action before continuing." footer={footer} onCancel={event => { if (veto) { event.preventDefault(); } }} {...props} open={open} onOpenChange={change}>
      <p>Your draft changes are ready to save. Confirm to keep them, or cancel to return to editing.</p><TextInput label="Change summary" defaultValue="Draft changes" />
      {long && Array.from({ length: 25 }, (_, index) => <p key={index}>Review section {index + 1}. Check the content before publishing changes to your workspace.</p>)}
      {nativeForm && <form method="dialog"><Button type="submit" value="saved">Save and close natively</Button><Button variant="secondary" onClick={() => ref.current!.close()}>Close through ref</Button></form>}
      <Link href="#review-help">Review help</Link>
    </Dialog></>;
}

/**
 * Share identical confirmation content under Corporate and Luna token regions.
 **/
export function DialogExample(): ReactElement {
  return <div className="dialog-demo"><h1>Dialog</h1><p>Review changes without leaving the current view.</p>{(['corporate', 'luna'] as const).map(theme => <section key={theme} className="dialog-demo__theme" data-theme={theme}><h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><DialogDemo /></section>)}</div>;
}

/**
 * Let a controlled parent defer accepting a close request without ending modality.
 **/
export function DeferredDialog(): ReactElement {
  const [open, setOpen] = useState(false), [requested, setRequested] = useState(false);

  return <><Button onClick={() => setOpen(true)}>Open dialog</Button><Dialog open={open} onOpenChange={() => setRequested(true)} heading="Controlled review" footer={requested && <Button onClick={() => setOpen(false)}>Accept close</Button>}>The parent keeps this open until it accepts dismissal.</Dialog></>;
}

/**
 * Compare a per-instance override with an unchanged sibling.
 **/
export function DialogOverrides(): ReactElement {
  return <><section aria-label="Custom dialog"><DialogDemo style={{ '--fs-dialog-radius': '24px', '--fs-dialog-width-md': '440px' }} /></section><section aria-label="Default dialog"><DialogDemo /></section></>;
}

/**
 * Exercise independent native top-layer focus and dismissal for stacked modals.
 **/
export function NestedDialog(): ReactElement {
  const [open, setOpen] = useState(false), [childOpen, setChildOpen] = useState(false);

  return <><Button onClick={() => setOpen(true)}>Open parent</Button><Dialog open={open} onOpenChange={setOpen} heading="Parent review"><Button onClick={() => setChildOpen(true)}>Open child</Button><Dialog open={childOpen} onOpenChange={setChildOpen} heading="Child review">Nested confirmation</Dialog></Dialog></>;
}
