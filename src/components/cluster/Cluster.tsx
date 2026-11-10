import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type ClusterStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type ClusterProps = Omit<ComponentPropsWithoutRef<'div'>, 'style'> & {
  gap?: 'none' | 'actions' | 'related';
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end';
  style?: ClusterStyle;
};

/**
 * Arrange intrinsic direct children in wrapping rows while preserving native order and interactions.
 **/
export const Cluster: ForwardRefExoticComponent<ClusterProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ClusterProps>(function Cluster(
  { gap = 'actions', align = 'center', justify = 'start', className, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['fs-cluster', `fs-cluster--gap-${gap}`, `fs-cluster--align-${align}`, `fs-cluster--justify-${justify}`, className].filter(Boolean).join(' ')} />;
});
