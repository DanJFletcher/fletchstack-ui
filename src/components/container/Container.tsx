import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type ContainerStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type ContainerProps = Omit<ComponentPropsWithoutRef<'div'>, 'style'> & {
  size?: 'reading' | 'content' | 'wide';
  gutters?: boolean;
  style?: ContainerStyle;
};

/**
 * Constrain and center content with optional responsive inline gutters; children own layout.
 **/
export const Container: ForwardRefExoticComponent<ContainerProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'content', gutters = true, className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['fs-container', `fs-container--${size}`, gutters && 'fs-container--gutters', className].filter(Boolean).join(' ')} />;
});
