import {
  createElement,
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

export type FieldStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type FieldLabelProps = Omit<ComponentPropsWithoutRef<'label'>, 'htmlFor' | 'style'> & {
  htmlFor: string;
  style?: FieldStyle;
};
export type FieldMessageProps = Omit<ComponentPropsWithoutRef<'p'>, 'style'> & {
  as?: 'p' | 'span';
  style?: FieldStyle;
};

/**
 * Associate a visible native label with its control.
 **/
export const FieldLabel: ForwardRefExoticComponent<
  FieldLabelProps & RefAttributes<HTMLLabelElement>
> = /* @__PURE__ */ forwardRef<HTMLLabelElement, FieldLabelProps>(function FieldLabel(
  { className, ...props },
  ref,
) {
  return (
    <label
      {...props}
      ref={ref}
      className={['fs-field-label', className].filter(Boolean).join(' ')}
    />
  );
});

/**
 * Render supporting text as a paragraph or inline label content.
 **/
export const FieldDescription: ForwardRefExoticComponent<
  FieldMessageProps & RefAttributes<HTMLParagraphElement | HTMLSpanElement>
> = /* @__PURE__ */ forwardRef<HTMLParagraphElement | HTMLSpanElement, FieldMessageProps>(
  function FieldDescription({ as: Element = 'p', className, ...props }, ref) {
    return createElement(Element, {
      ...props,
      ref,
      className: ['fs-field-description', className].filter(Boolean).join(' '),
    });
  },
);

/**
 * Render a validation message without imposing live-announcement behavior.
 **/
export const FieldError: ForwardRefExoticComponent<
  FieldMessageProps & RefAttributes<HTMLParagraphElement | HTMLSpanElement>
> = /* @__PURE__ */ forwardRef<HTMLParagraphElement | HTMLSpanElement, FieldMessageProps>(
  function FieldError({ as: Element = 'p', className, ...props }, ref) {
    return createElement(Element, {
      ...props,
      ref,
      className: ['fs-field-error', className].filter(Boolean).join(' '),
    });
  },
);
