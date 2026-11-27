import {
  createElement,
  forwardRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from 'react';

export type CardStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type CardPartProps = Omit<HTMLAttributes<HTMLDivElement>, 'style'> & { style?: CardStyle };
export type CardProps = Omit<HTMLAttributes<HTMLElement>, 'style'> & {
  as?: 'div' | 'article' | 'section';
  variant?: 'outlined' | 'filled' | 'plain';
  padding?: 'none' | 'small' | 'medium' | 'large';
  orientation?: 'vertical' | 'horizontal';
  style?: CardStyle;
};
export type CardFooterProps = CardPartProps & { divided?: boolean };
export type CardTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'style'> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';
  style?: CardStyle;
};
export type CardDescriptionProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> & {
  style?: CardStyle;
};

/**
 * Join component and consumer classes without changing consumer attributes.
 **/
function classes(...names: (string | false | undefined)[]) {
  return names.filter(Boolean).join(' ');
}

/**
 * A passive themed surface. Compose regions inside it; parents own placement.
 **/
export const Card: ForwardRefExoticComponent<CardProps & RefAttributes<HTMLElement>> = forwardRef<
  HTMLElement,
  CardProps
>(function Card(
  {
    as: Element = 'div',
    variant = 'outlined',
    padding = 'medium',
    orientation = 'vertical',
    className,
    ...props
  },
  ref,
) {
  return createElement(Element, {
    ...props,
    ref,
    className: classes(
      'fs-card',
      `fs-card--${variant}`,
      `fs-card--${padding}`,
      `fs-card--${orientation}`,
      className,
    ),
  });
});

/**
 * A padded introductory region with vertically spaced children.
 **/
export const CardHeader: ForwardRefExoticComponent<CardPartProps & RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement, CardPartProps>(function CardHeader({ className, ...props }, ref) {
    return <div {...props} ref={ref} className={classes('fs-card__header', className)} />;
  });

/**
 * A growing padded body region that may also contain nested card parts.
 **/
export const CardContent: ForwardRefExoticComponent<CardPartProps & RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement, CardPartProps>(function CardContent({ className, ...props }, ref) {
    return <div {...props} ref={ref} className={classes('fs-card__content', className)} />;
  });

/**
 * A wrapping action region with an optional separating rule.
 **/
export const CardFooter: ForwardRefExoticComponent<
  CardFooterProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, CardFooterProps>(function CardFooter(
  { divided = false, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={classes('fs-card__footer', divided && 'fs-card__footer--divided', className)}
    />
  );
});

/**
 * A tinted, unpadded media region. Consumers own artwork and alternative text.
 **/
export const CardMedia: ForwardRefExoticComponent<CardPartProps & RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement, CardPartProps>(function CardMedia({ className, ...props }, ref) {
    return <div {...props} ref={ref} className={classes('fs-card__media', className)} />;
  });

/**
 * A title whose heading level is chosen to fit the consumer's document.
 **/
export const CardTitle: ForwardRefExoticComponent<
  CardTitleProps & RefAttributes<HTMLHeadingElement>
> = forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Element = 'h2', className, ...props },
  ref,
) {
  return <Element {...props} ref={ref} className={classes('fs-card__title', className)} />;
});

/**
 * Supporting paragraph text on the card surface.
 **/
export const CardDescription: ForwardRefExoticComponent<
  CardDescriptionProps & RefAttributes<HTMLParagraphElement>
> = forwardRef<HTMLParagraphElement, CardDescriptionProps>(function CardDescription(
  { className, ...props },
  ref,
) {
  return <p {...props} ref={ref} className={classes('fs-card__description', className)} />;
});
