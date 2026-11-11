import { Children, cloneElement, forwardRef, isValidElement, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';
import { Button, type ButtonProps } from '../button/Button.js';

export type ButtonGroupStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
type GroupName = { 'aria-label': string; 'aria-labelledby'?: string } | { 'aria-labelledby': string; 'aria-label'?: string };
export type ButtonGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'style' | 'role' | 'aria-label' | 'aria-labelledby'> & GroupName & {
  appearance?: 'separated' | 'joined';
  orientation?: 'horizontal' | 'vertical';
  align?: 'start' | 'center' | 'end';
  wrap?: boolean;
  fullWidth?: boolean;
  equalWidth?: boolean;
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  disabled?: boolean;
  style?: ButtonGroupStyle;
};

/**
 * Apply defaults to direct Buttons without replacing child refs, handlers or attributes.
 * Reject unsupported children rather than silently losing group behavior.
 **/
function applyDefaults(child: ReactNode, defaults: Pick<ButtonGroupProps, 'size' | 'variant' | 'disabled'>) {
  if (child === null) {
    return null;
  }
  if (!isValidElement<ButtonProps>(child) || child.type !== Button) {
    throw new Error('ButtonGroup supports direct Button children only.');
  }

  const size = child.props.size ?? defaults.size;
  const variant = child.props.variant ?? defaults.variant;

  return cloneElement(child, { ...(size === undefined ? {} : { size }), ...(variant === undefined ? {} : { variant }), disabled: defaults.disabled || child.props.disabled });
}

/**
 * Name and arrange related native Button actions without changing their keyboard model.
 **/
export const ButtonGroup: ForwardRefExoticComponent<ButtonGroupProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { appearance = 'separated', orientation = 'horizontal', align = 'start', wrap = true, fullWidth = false, equalWidth = false, disabled = false, size, variant, children, className, ...props }, ref,
) {
  const name = props['aria-labelledby'] || props['aria-label'];
  if (!name?.trim()) {
    throw new Error('ButtonGroup requires aria-label or aria-labelledby.');
  }
  const classes = ['fs-button-group', `fs-button-group--${appearance}`, `fs-button-group--${orientation}`, `fs-button-group--align-${align}`, wrap && 'fs-button-group--wrap', fullWidth && 'fs-button-group--full-width', equalWidth && 'fs-button-group--equal-width', className].filter(Boolean).join(' ');

  return <div {...props} role="group" ref={ref} className={classes}>{Children.map(children, child => applyDefaults(child, { size, variant, disabled }))}</div>;
});
