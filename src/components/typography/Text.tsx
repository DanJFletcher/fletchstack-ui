import { createElement, forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type TextStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type TextProps = Omit<ComponentPropsWithoutRef<'p'>, 'style'> & {
  as?: 'p' | 'span';
  size?: 'lead' | 'body' | 'small';
  tone?: 'default' | 'muted';
  style?: TextStyle;
};

/**
 * Render wrapping paragraph or inline content while leaving spacing to its parent.
 **/
export const Text: ForwardRefExoticComponent<TextProps & RefAttributes<HTMLParagraphElement | HTMLSpanElement>> = /* @__PURE__ */ forwardRef<HTMLParagraphElement | HTMLSpanElement, TextProps>(function Text(
  { as: Element = 'p', size = 'body', tone = 'default', className, ...props }, ref,
) {
  return createElement(Element, { ...props, ref, className: ['fs-text', `fs-text--${size}`, `fs-text--${tone}`, className].filter(Boolean).join(' ') });
});
