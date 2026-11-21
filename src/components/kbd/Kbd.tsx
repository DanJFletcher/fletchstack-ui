import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';

export type KbdStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type KbdProps = Omit<ComponentPropsWithoutRef<'kbd'>, 'children' | 'style' | 'dangerouslySetInnerHTML'> & {
  children: ReactNode;
  style?: KbdStyle;
};

/**
 * Display keyboard input in a native keycap without registering a shortcut or adding a focus stop.
 **/
export const Kbd: ForwardRefExoticComponent<KbdProps & RefAttributes<HTMLElement>> = /* @__PURE__ */ forwardRef<HTMLElement, KbdProps>(function Kbd(
  { children, className, ...props }, ref,
) {
  return <kbd {...props} ref={ref} className={['fs-kbd', className].filter(Boolean).join(' ')}>{children}</kbd>;
});
