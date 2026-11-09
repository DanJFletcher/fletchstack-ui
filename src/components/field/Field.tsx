/* eslint-disable sonarjs/no-redundant-optional -- exactOptionalPropertyTypes distinguishes omitted props from explicitly forwarded undefined. */
import { forwardRef, type AriaAttributes, type ComponentPropsWithoutRef, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';
import { FieldDescription, FieldError, FieldLabel, type FieldStyle } from './FieldPrimitives.js';
import { useFieldAccessibility } from '../../internal/hooks/useFieldAccessibility.js';

export type FieldControlProps = Pick<AriaAttributes, 'aria-describedby' | 'aria-invalid'> & { id: string };
export type FieldProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'style'> & {
  label: ReactNode;
  helperText?: string | undefined;
  error?: string | undefined;
  descriptionIds?: readonly string[];
  children: (controlProps: FieldControlProps) => ReactNode;
  classNames?: { label?: string; helper?: string; error?: string };
  style?: FieldStyle | undefined;
};

/**
 * Compose a visible label and messages around one consumer-owned native control.
 **/
export const Field: ForwardRefExoticComponent<FieldProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, helperText, error, descriptionIds, id, children, className, classNames, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref,
) {
  const control = useFieldAccessibility({ id, describedBy, invalid, error, descriptionIds, descriptions: [['help', helperText]] });

  return <div {...props} ref={ref} className={['fs-field', className].filter(Boolean).join(' ')}>
    <FieldLabel htmlFor={control.id} className={classNames?.label}>{label}</FieldLabel>
    {children(control)}
    {helperText && <FieldDescription id={`${control.id}-help`} className={classNames?.helper}>{helperText}</FieldDescription>}
    {error && <FieldError id={`${control.id}-error`} className={classNames?.error}>{error}</FieldError>}
  </div>;
});
