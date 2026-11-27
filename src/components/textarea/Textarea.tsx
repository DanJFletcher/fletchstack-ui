import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
  type RefObject,
} from 'react';
import { Field } from '../field/Field.js';
import type { FieldStyle } from '../field/FieldPrimitives.js';

export type TextareaStyle = FieldStyle;
export type TextareaProps = Omit<
  ComponentPropsWithoutRef<'textarea'>,
  'children' | 'value' | 'defaultValue' | 'style'
> & {
  label: ReactNode;
  value?: string;
  defaultValue?: string;
  helperText?: string;
  error?: string;
  showCount?: boolean;
  style?: TextareaStyle;
  wrapperClassName?: string;
  wrapperStyle?: TextareaStyle;
};

/**
 * Observe native edits and completed, non-canceled form resets without controlling the value.
 **/
function observeCharacterCount(element: HTMLTextAreaElement, update: () => void) {
  const form = element.form;
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  const reset = (event: Event) => {
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      if (!event.defaultPrevented) {
        update();
      }
    }, 0);
  };
  element.addEventListener('input', update);
  form?.addEventListener('reset', reset);

  return () => {
    clearTimeout(resetTimer);
    element.removeEventListener('input', update);
    form?.removeEventListener('reset', reset);
  };
}

/**
 * Derive controlled counts from props; observe native edits only for uncontrolled values.
 **/
function useTextareaCount(
  input: RefObject<HTMLTextAreaElement | null>,
  {
    value,
    defaultValue,
    form,
    showCount,
  }: Pick<TextareaProps, 'value' | 'defaultValue' | 'form' | 'showCount'>,
) {
  const [length, setLength] = useState((value ?? defaultValue ?? '').length);
  const controlled = value !== undefined;
  useEffect(() => {
    if (!showCount || controlled) {
      return;
    }
    const element = input.current!;
    const update = () => setLength(element.value.length);
    update();

    return observeCharacterCount(element, update);
  }, [input, showCount, defaultValue, form, controlled]);

  return value === undefined ? length : value.length;
}

/**
 * Render a length and an optional native character limit without live announcements.
 **/
function CharacterCount({
  id,
  length,
  maxLength,
}: {
  id: string;
  length: number;
  maxLength: number | undefined;
}) {
  return (
    <span id={id} className="fs-textarea__count">
      {length}
      {maxLength !== undefined && maxLength >= 0 ? ` / ${maxLength}` : ''}
    </span>
  );
}

/**
 * A labeled, vertically resizable native multiline text field.
 **/
export const Textarea: ForwardRefExoticComponent<
  TextareaProps & RefAttributes<HTMLTextAreaElement>
> = /* @__PURE__ */ forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    id,
    helperText,
    error,
    showCount = false,
    rows = 4,
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
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const input = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => input.current!, []);
  const length = useTextareaCount(input, { ...props, showCount });

  return (
    <Field
      id={fieldId}
      label={label}
      helperText={helperText}
      error={error}
      descriptionIds={showCount ? [`${fieldId}-count`] : []}
      aria-describedby={describedBy}
      aria-invalid={invalid}
      classNames={{
        label: 'fs-textarea-field__label',
        helper: 'fs-textarea-field__helper',
        error: 'fs-textarea-field__error',
      }}
      className={['fs-textarea-field', wrapperClassName].filter(Boolean).join(' ')}
      style={wrapperStyle}
      hidden={hidden}
    >
      {(control) => (
        <>
          <textarea
            {...props}
            {...control}
            ref={input}
            rows={rows}
            className={['fs-textarea', className].filter(Boolean).join(' ')}
          />
          {showCount && (
            <CharacterCount id={`${fieldId}-count`} length={length} maxLength={props.maxLength} />
          )}
        </>
      )}
    </Field>
  );
});
