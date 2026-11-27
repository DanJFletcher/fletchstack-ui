import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { Field } from '../field/Field.js';
import { ChevronDownIcon } from '../icon/named/ChevronDownIcon.js';

export type SelectStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type SelectProps = Omit<
  ComponentPropsWithoutRef<'select'>,
  'size' | 'multiple' | 'value' | 'defaultValue' | 'style'
> & {
  label: ReactNode;
  helperText?: string;
  error?: string;
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  value?: string;
  defaultValue?: string;
  style?: SelectStyle;
  wrapperClassName?: string;
  wrapperStyle?: SelectStyle;
};

/**
 * Initialize an uncontrolled prompt without supplying a default to a controlled field.
 **/
function initialSelection(
  value: string | undefined,
  defaultValue: string | undefined,
  placeholder: string | undefined,
) {
  if (value !== undefined) {
    return undefined;
  }

  return defaultValue ?? (placeholder ? '' : undefined);
}

/**
 * A single-choice native field with a visible label.
 **/
export const Select: ForwardRefExoticComponent<SelectProps & RefAttributes<HTMLSelectElement>> =
  /* @__PURE__ */ forwardRef<HTMLSelectElement, SelectProps>(function Select(
    {
      label,
      id,
      helperText,
      error,
      placeholder,
      size = 'medium',
      value,
      defaultValue,
      className,
      wrapperClassName,
      wrapperStyle,
      hidden,
      'aria-describedby': describedBy,
      'aria-invalid': invalid,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <Field
        id={id}
        label={label}
        helperText={helperText}
        error={error}
        aria-describedby={describedBy}
        aria-invalid={invalid}
        classNames={{
          label: 'fs-select-field__label',
          helper: 'fs-select-field__helper',
          error: 'fs-select-field__error',
        }}
        className={['fs-select-field', wrapperClassName].filter(Boolean).join(' ')}
        style={wrapperStyle}
        hidden={hidden}
      >
        {(control) => (
          <div className="fs-select-field__control">
            <select
              {...props}
              {...control}
              ref={ref}
              value={value}
              defaultValue={initialSelection(value, defaultValue, placeholder)}
              className={['fs-select', `fs-select--${size}`, className].filter(Boolean).join(' ')}
            >
              {placeholder && (
                <option value="" disabled hidden>
                  {placeholder}
                </option>
              )}
              {children}
            </select>
            <span className="fs-select-field__chevron" aria-hidden="true">
              <ChevronDownIcon />
            </span>
          </div>
        )}
      </Field>
    );
  });
