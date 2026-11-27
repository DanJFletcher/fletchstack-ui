import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

export type HeadingStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type HeadingProps = Omit<ComponentPropsWithoutRef<'h2'>, 'style'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'page' | 'section' | 'subheading';
  style?: HeadingStyle;
};

/**
 * Render a native heading with document semantics independent of visual hierarchy.
 **/
export const Heading: ForwardRefExoticComponent<HeadingProps & RefAttributes<HTMLHeadingElement>> =
  /* @__PURE__ */ forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
    { as: Element = 'h2', size = 'section', className, ...props },
    ref,
  ) {
    return createElement(Element, {
      ...props,
      ref,
      className: ['fs-heading', `fs-heading--${size}`, className].filter(Boolean).join(' '),
    });
  });
