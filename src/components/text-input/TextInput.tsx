import { forwardRef, useId, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type ReactNode, type RefAttributes } from 'react';
import { Field } from '../field/Field.js';

export type TextInputStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type TextInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'children' | 'size' | 'type' | 'prefix' | 'style'> & {
  label: ReactNode;
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
  size?: 'small' | 'medium' | 'large';
  helperText?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  style?: TextInputStyle;
  wrapperClassName?: string;
  wrapperStyle?: TextInputStyle;
};

/**
 * Render non-editable context text only when the adornment has content.
 **/
function TextAdornment({ id, text, side }: { id: string; text: string | undefined; side: 'prefix' | 'suffix' }) {
  return text ? <span id={id} className={`fs-text-input__adornment fs-text-input__adornment--${side}`}>{text}</span> : null;
}

/**
 * A native single-line text field with a visible label.
 **/
export const TextInput: ForwardRefExoticComponent<TextInputProps & RefAttributes<HTMLInputElement>> = /* @__PURE__ */ forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { label, id, type = 'text', size = 'medium', helperText, error, prefix, suffix, className, wrapperClassName, wrapperStyle, hidden, 'aria-describedby': describedBy, 'aria-invalid': invalid, ...props }, ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionIds = [prefix && `${fieldId}-prefix`, suffix && `${fieldId}-suffix`].filter((value): value is string => Boolean(value));

  return <Field id={fieldId} label={label} helperText={helperText} error={error} descriptionIds={descriptionIds} aria-describedby={describedBy} aria-invalid={invalid} classNames={{ label: 'fs-text-input-field__label', helper: 'fs-text-input-field__helper', error: 'fs-text-input-field__error' }} className={['fs-text-input-field', `fs-text-input-field--${size}`, wrapperClassName].filter(Boolean).join(' ')} style={wrapperStyle} hidden={hidden}>
    {control => <div className="fs-text-input__control"><TextAdornment id={`${fieldId}-prefix`} text={prefix} side="prefix" />
      <input {...props} {...control} ref={ref} type={type} className={['fs-text-input', className].filter(Boolean).join(' ')} />
      <TextAdornment id={`${fieldId}-suffix`} text={suffix} side="suffix" /></div>}
  </Field>;
});
