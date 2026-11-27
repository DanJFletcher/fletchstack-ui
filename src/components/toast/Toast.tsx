import {
  forwardRef,
  useImperativeHandle,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { CloseIcon } from '../icon/named/CloseIcon.js';
import { ToastMessage, hasContent } from './ToastMessage.js';
import { useToast } from './useToast.js';
import { useToastTimer } from './timer.js';
import type { ToastProps } from './types.js';
export type {
  ToastProps,
  ToastStyle,
  ToastTone,
  ToastAnnouncement,
  ToastPosition,
} from './types.js';

/**
 * Present an action outcome without taking focus; the consumer owns actions and notification queues.
 **/
export const Toast: ForwardRefExoticComponent<ToastProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProps>(function Toast(props, ref) {
    const {
      children,
      title,
      icon,
      action,
      tone = 'info',
      announcement = 'polite',
      duration = 0,
      position,
      dismissLabel = 'Dismiss notification',
      open: controlledOpen,
      defaultOpen,
      onOpenChange,
      className,
      onKeyDown,
      ...native
    } = props;
    const state = useToast({
      open: controlledOpen,
      defaultOpen,
      onOpenChange,
      hidden: props.hidden,
    });
    useImperativeHandle(ref, () => state.element.current!);
    useToastTimer(state.element, { active: state.open, duration }, state.dismiss);

    return (
      <div
        {...native}
        ref={state.element}
        hidden={!state.open}
        className={[
          'fs-toast',
          `fs-toast--${tone}`,
          position && 'fs-toast--positioned',
          position && `fs-toast-placement--${position}`,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === 'Escape' && !event.defaultPrevented) {
            event.preventDefault();
            event.stopPropagation();
            state.dismiss();
          }
        }}
      >
        {hasContent(icon) && (
          <span className="fs-toast__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="fs-toast__content">
          <ToastMessage title={title} open={state.open} announcement={announcement}>
            {children}
          </ToastMessage>
          {hasContent(action) && <div className="fs-toast__action">{action}</div>}
        </div>
        <button
          className="fs-toast__dismiss"
          type="button"
          aria-label={dismissLabel}
          onClick={state.dismiss}
        >
          <CloseIcon />
        </button>
      </div>
    );
  });
