import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactNode,
} from 'react';

export type AppContentStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type AppContentProps = Omit<
  ComponentPropsWithoutRef<'main'>,
  'children' | 'style' | 'dangerouslySetInnerHTML'
> & {
  children: ReactNode;
  as?: 'main' | 'div';
  style?: AppContentStyle;
};

/**
 * Scroll page content in the remaining shell space without imposing content padding.
 **/
export const AppContent: ForwardRefExoticComponent<AppContentProps & RefAttributes<HTMLElement>> =
  /* @__PURE__ */ forwardRef<HTMLElement, AppContentProps>(function AppContent(
    { as: Element = 'main', className, ...props },
    ref,
  ) {
    return createElement(Element, {
      ...props,
      ref,
      className: ['fs-app-content', className].filter(Boolean).join(' '),
    });
  });
