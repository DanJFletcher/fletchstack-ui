import { forwardRef, useId, useImperativeHandle, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Button } from '../button/Button.js';
import { CloseIcon } from '../icon/named/CloseIcon.js';
import { usePopover } from './usePopover.js';
import { usePopoverPosition } from './usePopoverPosition.js';
import { usePopoverDismissal } from './usePopoverDismissal.js';
import type { PopoverProps } from './types.js';

/**
 * Forward native wrapper attributes without leaking panel configuration into HTML.
 **/
function rootAttributes(props: PopoverProps) {
  const native = { ...props };
  for (const key of ['children', 'triggerLabel', 'trigger', 'triggerVariant', 'triggerSize', 'heading', 'description', 'open', 'defaultOpen', 'onOpenChange', 'side', 'align', 'offset', 'collisionPadding', 'matchTriggerWidth', 'panelMaxWidth', 'autoFocus', 'closeOnEscape', 'closeOnOutsideClick', 'closeOnFocusOutside', 'showCloseButton', 'closeLabel', 'panelClassName', 'panelStyle']) { Reflect.deleteProperty(native, key); }

  return native;
}

/**
 * Compose optional panel slots and an explicitly named close control.
 **/
function PanelContents({ props, prefix, close }: { props: PopoverProps; prefix: string; close: () => void }) {
  return <>
    {(props.heading != null || props.description != null || props.showCloseButton !== false) && <header className="fs-popover__header">
      <div className="fs-popover__heading-group">{props.heading != null && <h2 id={`${prefix}-heading`} className="fs-popover__heading">{props.heading}</h2>}
        {props.description != null && <div id={`${prefix}-description`} className="fs-popover__description">{props.description}</div>}</div>
      {props.showCloseButton !== false && <Button variant="ghost" className="fs-popover__close" aria-label={props.closeLabel ?? 'Close popover'} onClick={close}><CloseIcon /></Button>}
    </header>}
    {props.children != null && <div className="fs-popover__body">{props.children}</div>}
  </>;
}

/**
 * Reveal anchored non-modal content in the native top layer without moving its React tree.
 **/
export const Popover: ForwardRefExoticComponent<PopoverProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, PopoverProps>(function Popover(props, ref) {
  const state = usePopover(props), prefix = `popover-${useId()}`, { elements, open, change } = state;
  useImperativeHandle(ref, () => elements.root.current!, [elements]);
  usePopoverPosition(elements, props, open); usePopoverDismissal(elements, props, state);
  const close = () => { if (elements.panel.current!.contains(elements.root.current!.ownerDocument.activeElement)) { elements.trigger.current!.focus(); } change(false); };

  return <div {...rootAttributes(props)} ref={elements.root} className={['fs-popover', props.className].filter(Boolean).join(' ')} onKeyDown={event => {
    props.onKeyDown?.(event);
    if (!event.defaultPrevented && event.key === 'Escape' && open && props.closeOnEscape !== false) { event.preventDefault(); event.stopPropagation(); close(); }
  }}>
    <Button ref={elements.trigger} variant={props.triggerVariant ?? 'secondary'} size={props.triggerSize ?? 'medium'} aria-label={props.triggerLabel} aria-haspopup="dialog" aria-expanded={open} aria-controls={prefix} onClick={() => change(!open)}>{props.trigger ?? props.triggerLabel}</Button>
    <div ref={elements.panel} id={prefix} popover="manual" role="dialog" tabIndex={-1} hidden={!open} className={['fs-popover__panel', props.panelClassName].filter(Boolean).join(' ')} style={props.panelStyle} aria-label={props.heading == null ? props.triggerLabel : undefined} aria-labelledby={props.heading != null ? `${prefix}-heading` : undefined} aria-describedby={props.description != null ? `${prefix}-description` : undefined}>
      <PanelContents props={props} prefix={prefix} close={close} />
    </div>
  </div>;
});
