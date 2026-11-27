import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

export type BottomNavigationStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
type NavigationName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-labelledby': string; 'aria-label'?: string };
export type BottomNavigationProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'aria-label' | 'aria-labelledby' | 'children' | 'dangerouslySetInnerHTML' | 'style'
> &
  NavigationName & {
    children: ReactNode;
    style?: BottomNavigationStyle;
  };
export type BottomNavigationItemProps = {
  /** One anchor or link component that renders an anchor. */
  children: ReactElement;
};

/**
 * Place one unchanged consumer link in a destination cell.
 **/
function BottomNavigationItem({ children }: BottomNavigationItemProps): ReactElement {
  return <li className="fs-bottom-navigation__item">{children}</li>;
}

/**
 * Render a named destination landmark without owning routing or page positioning.
 **/
const BottomNavigationRoot: ForwardRefExoticComponent<
  BottomNavigationProps & RefAttributes<HTMLElement>
> = /* @__PURE__ */ forwardRef<HTMLElement, BottomNavigationProps>(function BottomNavigation(
  { children, className, ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      className={['fs-bottom-navigation', className].filter(Boolean).join(' ')}
    >
      <ul className="fs-bottom-navigation__list">{children}</ul>
    </nav>
  );
});

export const BottomNavigation: typeof BottomNavigationRoot & { Item: typeof BottomNavigationItem } =
  /* @__PURE__ */ Object.assign(BottomNavigationRoot, { Item: BottomNavigationItem });
