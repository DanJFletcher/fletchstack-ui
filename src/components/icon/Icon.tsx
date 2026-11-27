import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

export type IconSize = 'small' | 'medium' | 'large';
export type IconStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
type SVGAttributes = ComponentPropsWithoutRef<'svg'>;
type OwnedAttribute =
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-hidden'
  | 'focusable'
  | 'tabIndex'
  | 'width'
  | 'height';
export type IconProps = Omit<SVGAttributes, OwnedAttribute | 'style'> & {
  [Attribute in OwnedAttribute]?: never;
} & {
  size?: IconSize;
  label?: string;
  style?: IconStyle;
};
export type NamedIconProps = Omit<IconProps, 'children' | 'viewBox'> & {
  children?: never;
  viewBox?: never;
};

/**
 * Remove reserved attributes even when passed by an untyped JavaScript consumer.
 **/
function artworkAttributes(props: SVGAttributes): SVGAttributes {
  const attributes = { ...props };
  for (const name of [
    'role',
    'aria-label',
    'aria-labelledby',
    'aria-hidden',
    'focusable',
    'tabIndex',
    'width',
    'height',
  ]) {
    Reflect.deleteProperty(attributes, name);
  }

  return attributes;
}

/**
 * Render trusted SVG children with semantic sizing and non-interactive accessibility.
 **/
export const Icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>> =
  /* @__PURE__ */ forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = 'medium', label, className, viewBox = '0 0 24 24', ...props },
    ref,
  ) {
    const name = label?.trim();
    const classes = ['fs-icon', `fs-icon--${size}`, className].filter(Boolean).join(' ');

    return (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...artworkAttributes(props)}
        ref={ref}
        className={classes}
        viewBox={viewBox}
        focusable="false"
        role={name ? 'img' : undefined}
        aria-hidden={name ? undefined : true}
        aria-label={name || undefined}
      />
    );
  });
