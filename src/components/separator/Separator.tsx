import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
const ownedAttributes = [
  'role',
  'aria-hidden',
  'aria-orientation',
  'tabIndex',
  'contentEditable',
  'aria-live',
  'aria-atomic',
  'aria-valuenow',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuetext',
  'children',
  'dangerouslySetInnerHTML',
] as const;
type OwnedAttribute =
  (typeof ownedAttributes)[number] | Extract<keyof ComponentPropsWithoutRef<'div'>, `on${string}`>;
export type SeparatorProps = Omit<ComponentPropsWithoutRef<'div'>, 'style' | OwnedAttribute> & {
  [Attribute in OwnedAttribute]?: never;
} & {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
  style?: SeparatorStyle;
};

/**
 * Preserve native descriptive attributes while reserving static separator semantics.
 **/
function separatorAttributes(props: ComponentPropsWithoutRef<'div'>) {
  const attributes = { ...props };
  for (const name of Object.keys(attributes)) {
    if ((ownedAttributes as readonly string[]).includes(name) || /^on[A-Z]/.test(name)) {
      Reflect.deleteProperty(attributes, name);
    }
  }

  return attributes;
}

/**
 * Draw a passive rule, optionally exposing a meaningful boundary to assistive technology.
 **/
export const Separator: ForwardRefExoticComponent<SeparatorProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
    { orientation = 'horizontal', decorative = true, className, ...props },
    ref,
  ) {
    return (
      <div
        {...separatorAttributes(props)}
        ref={ref}
        className={['fs-separator', `fs-separator--${orientation}`, className]
          .filter(Boolean)
          .join(' ')}
        role={decorative ? undefined : 'separator'}
        aria-hidden={decorative || undefined}
        aria-orientation={decorative ? undefined : orientation}
      />
    );
  });
