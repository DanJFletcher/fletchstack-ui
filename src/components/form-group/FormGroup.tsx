import { forwardRef, type AriaAttributes, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';
import { FieldDescription, FieldError } from '../field/FieldPrimitives.js';
import { useFieldAccessibility } from '../../internal/hooks/useFieldAccessibility.js';

export type FormGroupStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type FormGroupControlProps = Pick<AriaAttributes, 'aria-describedby' | 'aria-invalid'>;
export type FormGroupProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'style'> & {
  legend: ReactNode;
  description?: string;
  helperText?: string;
  error?: string;
  orientation?: 'vertical' | 'horizontal';
  children?: ReactNode | ((controlProps: FormGroupControlProps) => ReactNode);
  style?: FormGroupStyle;
};

/**
 * Group native controls with a shared legend and opt-in control descriptions.
 **/
export const FormGroup: ForwardRefExoticComponent<FormGroupProps & RefAttributes<HTMLFieldSetElement>> = /* @__PURE__ */ forwardRef<HTMLFieldSetElement, FormGroupProps>(function FormGroup(
  { legend, description, helperText, error, orientation = 'vertical', children, id, className, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref,
) {
  const { id: groupId, ...controlProps } = useFieldAccessibility({ id, describedBy, invalid, error, descriptions: [['description', description], ['help', helperText]] });

  return <fieldset {...props} {...controlProps} ref={ref} id={groupId} className={['fs-form-group', className].filter(Boolean).join(' ')}>
    <legend className="fs-form-group__legend">{legend}</legend>
    {description && <FieldDescription className="fs-form-group__description" id={`${groupId}-description`}>{description}</FieldDescription>}
    <div className={`fs-form-group__controls fs-form-group__controls--${orientation}`}>{typeof children === 'function' ? children(controlProps) : children}</div>
    {helperText && <FieldDescription className="fs-form-group__helper" id={`${groupId}-help`}>{helperText}</FieldDescription>}
    {error && <FieldError className="fs-form-group__error" id={`${groupId}-error`}>{error}</FieldError>}
  </fieldset>;
});
