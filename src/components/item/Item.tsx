import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

export type ItemStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type ItemVariant = 'default' | 'outline' | 'muted';
export type ItemSize = 'default' | 'sm' | 'xs';
type Appearance = { variant?: ItemVariant; size?: ItemSize; style?: ItemStyle };
export type ItemProps = Appearance &
  (
    | ({ as?: 'div' } & Omit<ComponentPropsWithoutRef<'div'>, 'style' | 'dangerouslySetInnerHTML'>)
    | ({ as: 'a'; href: string } & Omit<
        ComponentPropsWithoutRef<'a'>,
        'style' | 'dangerouslySetInnerHTML' | 'href'
      >)
  );

/**
 * Present a compact content row or native destination link; consumers own its content and actions.
 **/
export const Item: ForwardRefExoticComponent<ItemProps & RefAttributes<HTMLElement>> =
  /* @__PURE__ */ forwardRef<HTMLElement, ItemProps>(function Item(props, ref) {
    const { variant = 'default', size = 'default', className, as: element, ...attributes } = props;
    const classes = ['fs-item', `fs-item--${variant}`, `fs-item--size-${size}`, className]
      .filter(Boolean)
      .join(' ');

    if (element === 'a') {
      return (
        <a
          {...(attributes as ComponentPropsWithoutRef<'a'>)}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
        />
      );
    }

    return (
      <div
        {...(attributes as ComponentPropsWithoutRef<'div'>)}
        ref={ref as React.Ref<HTMLDivElement>}
        className={classes}
      />
    );
  });
