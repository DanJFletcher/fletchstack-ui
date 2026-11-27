import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { Button } from '../button/Button.js';
import { CloseIcon } from '../icon/named/CloseIcon.js';
import { useDialogModal } from './useDialogModal.js';
import { useDialogEvents } from './dialog-events.js';
import type { DialogProps } from './types.js';

/**
 * Label the modal and keep its close action alongside the first heading line.
 **/
function DialogHeader({ props, prefix }: { props: DialogProps; prefix: string }) {
  const Heading = `h${props.headingLevel ?? 2}` as const;

  return (
    <header className="fs-dialog__header">
      <div className="fs-dialog__heading-group">
        {props.heading != null && (
          <Heading className="fs-dialog__heading" id={`${prefix}-heading`}>
            {props.heading}
          </Heading>
        )}
        {props.description != null && (
          <div className="fs-dialog__description" id={`${prefix}-description`}>
            {props.description}
          </div>
        )}
      </div>
      {props.showCloseButton !== false && (
        <Button
          className="fs-dialog__close"
          variant="ghost"
          aria-label={props.closeLabel ?? 'Close dialog'}
          onClick={() => props.onOpenChange(false)}
        >
          <CloseIcon />
        </Button>
      )}
    </header>
  );
}

/**
 * Compose optional content without reserving space for absent slots.
 **/
function DialogContents({ props, prefix }: { props: DialogProps; prefix: string }) {
  return (
    <>
      {(props.heading != null || props.description != null || props.showCloseButton !== false) && (
        <DialogHeader props={props} prefix={prefix} />
      )}
      {props.children != null && <div className="fs-dialog__body">{props.children}</div>}
      {props.footer != null && <footer className="fs-dialog__footer">{props.footer}</footer>}
    </>
  );
}

/**
 * A controlled native modal with theme inheritance, content slots and configurable dismissal.
 **/
export const Dialog: ForwardRefExoticComponent<DialogProps & RefAttributes<HTMLDialogElement>> =
  /* @__PURE__ */ forwardRef<HTMLDialogElement, DialogProps>(function Dialog(props, forwardedRef) {
    const ref = useRef<HTMLDialogElement>(null),
      prefix = `dialog-${useId()}`;
    useImperativeHandle(forwardedRef, () => ref.current!, []);
    useDialogModal(ref, props.open, props.motion ?? 'fade');
    const events = useDialogEvents(props);
    const { heading, description, className, size = 'md', motion = 'fade', ...native } = props;
    for (const name of [
      'open',
      'onOpenChange',
      'headingLevel',
      'footer',
      'showCloseButton',
      'closeLabel',
      'closeOnEscape',
      'closeOnBackdropClick',
      'children',
    ]) {
      Reflect.deleteProperty(native, name);
    }

    return (
      <dialog
        {...native}
        {...events}
        ref={ref}
        className={['fs-dialog', `fs-dialog--${size}`, className].filter(Boolean).join(' ')}
        data-motion={motion}
        aria-labelledby={
          props['aria-labelledby'] ??
          (props['aria-label'] === undefined && heading != null ? `${prefix}-heading` : undefined)
        }
        aria-describedby={
          [props['aria-describedby'], description != null && `${prefix}-description`]
            .filter(Boolean)
            .join(' ') || undefined
        }
      >
        <DialogContents props={props} prefix={prefix} />
      </dialog>
    );
  });
