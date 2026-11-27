import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react';

export type CalloutTone = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type CalloutStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type CalloutProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'title' | 'role' | 'style' | 'children' | 'dangerouslySetInnerHTML'
> & {
  children: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: CalloutTone;
  role?: 'note' | 'status' | 'alert';
  style?: CalloutStyle;
};

/**
 * Omit empty optional slots while preserving renderable numeric content.
 **/
function hasContent(content: ReactNode): boolean {
  return (
    content !== undefined && content !== null && typeof content !== 'boolean' && content !== ''
  );
}

/**
 * Present persistent guidance with consumer-owned actions and explicitly chosen announcement semantics.
 **/
export const Callout: ForwardRefExoticComponent<CalloutProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, CalloutProps>(function Callout(
    { children, title, icon, action, tone = 'info', role, className, ...props },
    ref,
  ) {
    const classes = ['fs-callout', `fs-callout--${tone}`, className].filter(Boolean).join(' ');

    return (
      <div {...props} ref={ref} className={classes} role={role}>
        {hasContent(icon) && (
          <span className="fs-callout__icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="fs-callout__content">
          {hasContent(title) && <div className="fs-callout__title">{title}</div>}
          {hasContent(children) && <div className="fs-callout__body">{children}</div>}
          {hasContent(action) && <div className="fs-callout__action">{action}</div>}
        </div>
      </div>
    );
  });
