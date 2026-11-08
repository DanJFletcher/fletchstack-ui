import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type ButtonStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'style'> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  style?: ButtonStyle;
};

/**
 * A native, ref-forwarding action control. Parents own placement and sibling spacing.
 **/
export const Button: ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>> = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'medium', type = 'button', className, ...props }, ref,
) {
  const classes = ['fs-button', `fs-button--${variant}`, `fs-button--${size}`, className].filter(Boolean).join(' ');

  return <button {...props} ref={ref} type={type} className={classes} />;
});
