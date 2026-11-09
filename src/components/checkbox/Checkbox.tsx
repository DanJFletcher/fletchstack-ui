import { forwardRef, useEffect, useImperativeHandle, useRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardedRef, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';
import { FieldDescription, FieldError, FieldLabel } from '../field/FieldPrimitives.js';
import { useFieldAccessibility } from '../../internal/hooks/useFieldAccessibility.js';
import { Icon } from '../icon/Icon.js';
import { CheckIcon } from '../icon/named/CheckIcon.js';

export type CheckboxStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
type OwnedAttribute = 'aria-checked' | 'aria-label' | 'aria-labelledby';
export type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children' | 'size' | 'readOnly' | 'style' | OwnedAttribute> & { [Attribute in OwnedAttribute]?: never } & {
  label: ReactNode;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  style?: CheckboxStyle;
  wrapperClassName?: string;
  wrapperStyle?: CheckboxStyle;
};

/**
 * Expose the native input ref and synchronize its client-only mixed property.
 **/
function useCheckboxInput(indeterminate: boolean, forwardedRef: ForwardedRef<HTMLInputElement>) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(forwardedRef, () => input.current!, []);
  useEffect(() => { input.current!.indeterminate = indeterminate; }, [indeterminate]);

  return input;
}

/**
 * A native independent choice with a visible clickable label.
 **/
export const Checkbox: ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>> = /* @__PURE__ */ forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, id, description, error, indeterminate = false, className, wrapperClassName, wrapperStyle, hidden, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref,
) {
  const control = useFieldAccessibility({ id, describedBy, invalid, error, descriptions: [['description', description]] });
  const fieldId = control.id;
  const input = useCheckboxInput(indeterminate, ref);

  return <div className={['fs-checkbox-field', wrapperClassName].filter(Boolean).join(' ')} style={wrapperStyle} hidden={hidden}>
    <FieldLabel className="fs-checkbox__label" htmlFor={fieldId}><span className="fs-checkbox__box">
      <input {...props} {...control} ref={input} type="checkbox" aria-checked={undefined} aria-labelledby={`${fieldId}-label`} className={['fs-checkbox', className].filter(Boolean).join(' ')} />
      <span className="fs-checkbox__marks" aria-hidden="true"><CheckIcon className="fs-checkbox__check" /><Icon className="fs-checkbox__dash"><path d="M6 12h12" /></Icon></span></span>
      <span className="fs-checkbox__body"><span id={`${fieldId}-label`}>{label}</span>{description && <FieldDescription as="span" id={`${fieldId}-description`} className="fs-checkbox__description">{description}</FieldDescription>}</span></FieldLabel>
    {error && <FieldError id={`${fieldId}-error`} className="fs-checkbox__error">{error}</FieldError>}
  </div>;
});
