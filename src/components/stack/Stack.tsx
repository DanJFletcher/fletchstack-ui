import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type StackStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type StackProps = Omit<ComponentPropsWithoutRef<'div'>, 'style'> & {
  gap?: 'none' | 'related' | 'group' | 'section';
  align?: 'stretch' | 'start' | 'center' | 'end';
  style?: StackStyle;
};

/**
 * Arrange direct children vertically with semantic gaps and logical cross-axis alignment.
 **/
export const Stack: ForwardRefExoticComponent<StackProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, StackProps>(function Stack(
  { gap = 'related', align = 'stretch', className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['fs-stack', `fs-stack--gap-${gap}`, `fs-stack--align-${align}`, className].filter(Boolean).join(' ')} />;
});
