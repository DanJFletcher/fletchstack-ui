import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { FieldDescription, FieldLabel } from '../field/FieldPrimitives.js';
import type { FieldStyle } from '../field/FieldPrimitives.js';
import { useFieldAccessibility } from '../../internal/hooks/useFieldAccessibility.js';

export type SwitchStyle = FieldStyle;
type OwnedAttribute = 'aria-checked' | 'aria-label' | 'aria-labelledby' | 'role';
export type SwitchProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'children' | 'size' | 'readOnly' | 'style' | OwnedAttribute
> & { [Attribute in OwnedAttribute]?: never } & {
  label: ReactNode;
  description?: string;
  style?: SwitchStyle;
  wrapperClassName?: string;
  wrapperStyle?: SwitchStyle;
};

/**
 * Render a stable labeled on/off setting whose switch state follows native checked state.
 **/
export const Switch: ForwardRefExoticComponent<SwitchProps & RefAttributes<HTMLInputElement>> =
  /* @__PURE__ */ forwardRef<HTMLInputElement, SwitchProps>(function Switch(
    {
      label,
      id,
      description,
      className,
      wrapperClassName,
      wrapperStyle,
      hidden,
      'aria-describedby': describedBy,
      'aria-invalid': invalid,
      ...props
    },
    ref,
  ) {
    const control = useFieldAccessibility({
      id,
      describedBy,
      invalid,
      descriptions: [['description', description]],
    });
    const fieldId = control.id;

    return (
      <div
        className={['fs-switch-field', wrapperClassName].filter(Boolean).join(' ')}
        style={wrapperStyle}
        hidden={hidden}
      >
        <FieldLabel className="fs-switch__label" htmlFor={fieldId}>
          <input
            {...props}
            {...control}
            ref={ref}
            type="checkbox"
            role="switch"
            aria-checked={undefined}
            aria-label={undefined}
            aria-labelledby={`${fieldId}-label`}
            className={['fs-switch', className].filter(Boolean).join(' ')}
          />
          <span className="fs-switch__body">
            <span id={`${fieldId}-label`}>{label}</span>
            {description && (
              <FieldDescription
                as="span"
                id={`${fieldId}-description`}
                className="fs-switch__description"
              >
                {description}
              </FieldDescription>
            )}
          </span>
        </FieldLabel>
      </div>
    );
  });
