import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react';

export type LinkStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'style' | 'role'> & {
  children: ReactNode;
  variant?: 'inline' | 'standalone';
  icon?: ReactNode;
  style?: LinkStyle;
  role?: never;
};

/**
 * Preserve native navigation and announce explicit new-tab targets; omit href for plain text.
 **/
export const Link: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>> =
  /* @__PURE__ */ forwardRef<HTMLAnchorElement, LinkProps>(function Link(
    {
      children,
      href,
      target,
      rel,
      variant = 'inline',
      icon,
      className,
      tabIndex,
      onClick,
      onAuxClick,
      'aria-describedby': describedBy,
      ...props
    },
    ref,
  ) {
    const noticeId = useId();
    const navigable = href !== undefined;
    const newTab = navigable && target?.toLowerCase() === '_blank';
    const description = [describedBy, newTab && noticeId].filter(Boolean).join(' ') || undefined;
    const relationship = newTab ? [rel, 'noopener'].filter(Boolean).join(' ') : rel;

    return (
      <a
        {...props}
        ref={ref}
        href={href}
        role={undefined}
        target={navigable ? target : undefined}
        rel={navigable ? relationship : undefined}
        tabIndex={navigable ? tabIndex : undefined}
        onClick={navigable ? onClick : undefined}
        onAuxClick={navigable ? onAuxClick : undefined}
        aria-describedby={description}
        className={['fs-link', `fs-link--${variant}`, className].filter(Boolean).join(' ')}
      >
        {children}
        {icon && (
          <span className="fs-link__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {newTab && (
          <span id={noticeId} hidden>
            Opens in a new tab.
          </span>
        )}
      </a>
    );
  });
