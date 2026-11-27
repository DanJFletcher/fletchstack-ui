import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactNode,
} from 'react';

export type AppShellStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type AppShellProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'style' | 'dangerouslySetInnerHTML'
> & {
  children: ReactNode;
  height?: 'viewport' | 'parent';
  style?: AppShellStyle;
};

/**
 * Reserve persistent sibling rows around one direct scrolling AppContent region.
 **/
export const AppShell: ForwardRefExoticComponent<AppShellProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
    { children, height = 'viewport', className, ...props },
    ref,
  ) {
    return (
      <div
        {...props}
        ref={ref}
        className={['fs-app-shell', `fs-app-shell--${height}`, className].filter(Boolean).join(' ')}
      >
        {children}
      </div>
    );
  });
