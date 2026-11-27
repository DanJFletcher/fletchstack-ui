import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

export type SectionStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type SectionProps = Omit<ComponentPropsWithoutRef<'section'>, 'style'> & {
  as?: 'section' | 'div';
  spacing?: 'compact' | 'default' | 'spacious';
  style?: SectionStyle;
};

/**
 * Give a native topic or visual wrapper semantic block padding without owning its child layout.
 **/
export const Section: ForwardRefExoticComponent<SectionProps & RefAttributes<HTMLElement>> =
  /* @__PURE__ */ forwardRef<HTMLElement, SectionProps>(function Section(
    { as: Element = 'section', spacing = 'default', className, ...props },
    ref,
  ) {
    return createElement(Element, {
      ...props,
      ref,
      className: ['fs-section', `fs-section--spacing-${spacing}`, className]
        .filter(Boolean)
        .join(' '),
    });
  });
