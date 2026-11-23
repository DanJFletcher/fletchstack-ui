import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { ToastAnnouncement } from './types.js';

/**
 * Ignore empty optional slots while retaining numeric content.
 **/
export function hasContent(content: ReactNode): boolean {
  return content !== undefined && content !== null && typeof content !== 'boolean' && content !== '';
}

/**
 * Seed a persistent live region after mount without announcing decorative or actionable content.
 **/
export function ToastMessage({ title, children, open, announcement }: { title: ReactNode; children: ReactNode; open: boolean; announcement: ToastAnnouncement }): ReactElement {
  const message = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  useEffect(() => { setText(open ? message.current!.textContent! : ''); }, [open, title, children]);

  return <><span className="fs-toast__announcement" role={announcement === 'assertive' ? 'alert' : 'status'} aria-live={announcement} aria-atomic="true">{open ? text : ''}</span>
    <div ref={message} className="fs-toast__message">
      {hasContent(title) && <div className="fs-toast__title">{title}</div>}
      {hasContent(title) && hasContent(children) && ' '}
      {hasContent(children) && <div className="fs-toast__body">{children}</div>}
    </div></>;
}
