import { forwardRef, type ComponentPropsWithoutRef, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';
import { FieldDescription, FieldError, FieldLabel } from '../field/FieldPrimitives.js';
import type { FieldStyle } from '../field/FieldPrimitives.js';
import { useFieldAccessibility } from '../../internal/hooks/useFieldAccessibility.js';

export type RadioStyle = FieldStyle;
type OwnedAttribute = 'aria-checked' | 'aria-label' | 'aria-labelledby' | 'role';
export type RadioProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children' | 'size' | 'readOnly' | 'style' | OwnedAttribute> & { [Attribute in OwnedAttribute]?: never } & {
  label: ReactNode;
  description?: string;
  error?: string;
  style?: RadioStyle;
  wrapperClassName?: string;
  wrapperStyle?: RadioStyle;
};

/**
 * Render one labeled native option; shared names supply native exclusive group selection.
 **/
export const Radio: ForwardRefExoticComponent<RadioProps & RefAttributes<HTMLInputElement>> = /* @__PURE__ */ forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, id, description, error, className, wrapperClassName, wrapperStyle, hidden, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref,
) {
  const control = useFieldAccessibility({ id, describedBy, invalid, error, descriptions: [['description', description]] });
  const fieldId = control.id;

  return <div className={['fs-radio-field', wrapperClassName].filter(Boolean).join(' ')} style={wrapperStyle} hidden={hidden}>
    <FieldLabel className="fs-radio__label" htmlFor={fieldId}>
      <input {...props} {...control} ref={ref} type="radio" role={undefined} aria-checked={undefined} aria-label={undefined} aria-labelledby={`${fieldId}-label`} className={['fs-radio', className].filter(Boolean).join(' ')} />
      <span className="fs-radio__body"><span id={`${fieldId}-label`}>{label}</span>{description && <FieldDescription as="span" id={`${fieldId}-description`} className="fs-radio__description">{description}</FieldDescription>}</span>
    </FieldLabel>
    {error && <FieldError id={`${fieldId}-error`} className="fs-radio__error">{error}</FieldError>}
  </div>;
});
