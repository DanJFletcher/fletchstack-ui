import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type AspectRatioStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type AspectRatioProps = Omit<ComponentPropsWithoutRef<'div'>, 'style' | 'dangerouslySetInnerHTML'> & {
  ratio?: number;
  style?: AspectRatioStyle;
};

/**
 * Keep invalid numeric ratios from collapsing or invalidating the frame's CSS geometry.
 **/
function validRatio(ratio: number) {
  return Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9;
}

/**
 * Reserve proportional media geometry while leaving fitting, semantics and captions to consumers.
 **/
export const AspectRatio: ForwardRefExoticComponent<AspectRatioProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, children, className, style, ...props }, ref,
) {
  return <div {...props} ref={ref} className={['fs-aspect-ratio', className].filter(Boolean).join(' ')} style={{ aspectRatio: validRatio(ratio), ...style }}><div className="fs-aspect-ratio__content">{children}</div></div>;
});
