import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import type { ToastViewportProps } from './types.js';

/**
 * Arrange consumer-owned notifications in a themed page-edge stack or an in-flow preview.
 **/
export const ToastViewport: ForwardRefExoticComponent<ToastViewportProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastViewportProps>(function ToastViewport(
  { position = 'bottom-end', inline = false, className, 'aria-label': label = 'Notifications', ...props }, ref,
) {
  return <div {...props} ref={ref} role="region" aria-label={label} className={['fs-toast-viewport', `fs-toast-viewport--${position}`, `fs-toast-placement--${position}`, inline && 'fs-toast-viewport--inline', className].filter(Boolean).join(' ')} />;
});
