import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import type { KbdProps, KbdStyle } from './Kbd.js';

export type KbdGroupStyle = KbdStyle;
export type KbdGroupProps = KbdProps;

/**
 * Group a sequence of keyboard keys in source order with wrapping, leaving separators to the caller.
 **/
export const KbdGroup: ForwardRefExoticComponent<KbdGroupProps & RefAttributes<HTMLElement>> = /* @__PURE__ */ forwardRef<HTMLElement, KbdGroupProps>(function KbdGroup(
  { children, className, ...props }, ref,
) {
  return <kbd {...props} ref={ref} className={['fs-kbd-group', className].filter(Boolean).join(' ')}>{children}</kbd>;
});
