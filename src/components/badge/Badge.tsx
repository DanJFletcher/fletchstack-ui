import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type BadgeStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };

const ownedAttributes = ['role', 'tabIndex', 'contentEditable', 'aria-live', 'aria-atomic', 'aria-hidden', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML'] as const;
type OwnedAttribute = typeof ownedAttributes[number] | Extract<keyof ComponentPropsWithoutRef<'span'>, `on${string}`>;

export type BadgeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'style' | OwnedAttribute> & { [Attribute in OwnedAttribute]?: never } & {
  children: string | number;
  tone?: BadgeTone;
  icon?: ReactNode;
  style?: BadgeStyle;
};

/**
 * Preserve native attributes while keeping a badge passive for untyped consumers too.
 **/
function badgeAttributes(props: ComponentPropsWithoutRef<'span'>) {
  const attributes = { ...props };
  for (const name of Object.keys(attributes)) {
    if ((ownedAttributes as readonly string[]).includes(name) || /^on[A-Z]/.test(name)) {
      Reflect.deleteProperty(attributes, name);
    }
  }

  return attributes;
}

/**
 * Display a concise status, category, or exact count with optional decorative artwork.
 **/
export const Badge: ForwardRefExoticComponent<BadgeProps & RefAttributes<HTMLSpanElement>> = /* @__PURE__ */ forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, tone = 'neutral', icon, className, ...props }, ref,
) {
  return <span {...badgeAttributes(props)} ref={ref} className={['fs-badge', `fs-badge--${tone}`, className].filter(Boolean).join(' ')}>
    {icon ? <span className="fs-badge__icon" aria-hidden="true">{icon}</span> : null}
    <span className="fs-badge__label">{children}</span>
  </span>;
});
