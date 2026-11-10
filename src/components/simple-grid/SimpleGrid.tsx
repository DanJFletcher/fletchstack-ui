import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type SimpleGridStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type SimpleGridProps = Omit<ComponentPropsWithoutRef<'div'>, 'style'> & {
  gap?: 'none' | 'related' | 'group';
  style?: SimpleGridStyle;
};

/**
 * Arrange collections in equal-width columns that adapt to their available parent space.
 **/
export const SimpleGrid: ForwardRefExoticComponent<SimpleGridProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, SimpleGridProps>(function SimpleGrid(
  { gap = 'related', className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['fs-simple-grid', `fs-simple-grid--gap-${gap}`, className].filter(Boolean).join(' ')} />;
});
