import {
  forwardRef,
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { useFieldAccessibility } from '../../internal/hooks/useFieldAccessibility.js';
import { FieldLabel, FieldDescription, FieldError } from '../field/FieldPrimitives.js';
import { CloseIcon } from '../icon/named/CloseIcon.js';
import { ComboboxPopup } from './ComboboxPopup.js';
import { comboboxKey, useCombobox, type ComboboxModel } from './useCombobox.js';
import type { ComboboxProps } from './types.js';
export type { ComboboxProps, ComboboxStyle, ComboboxOption } from './types.js';

/**
 * Forward native input attributes without leaking composite configuration or permitting owned semantics.
 **/
function nativeProps(props: ComboboxProps) {
  const native = { ...props } as Record<string, unknown>;
  for (const key of [
    'label',
    'options',
    'value',
    'defaultValue',
    'onValueChange',
    'filterOptions',
    'allowClear',
    'clearLabel',
    'loading',
    'loadingMessage',
    'noResultsMessage',
    'description',
    'error',
    'invalid',
    'size',
    'wrapperClassName',
    'wrapperStyle',
    'name',
    'list',
    'style',
    'children',
    'dangerouslySetInnerHTML',
    'aria-label',
    'aria-labelledby',
  ]) {
    Reflect.deleteProperty(native, key);
  }
  return native as ComponentPropsWithoutRef<'input'>;
}

/**
 * Keep editable text unnamed and submit only a committed option identity.
 **/
function SearchInput({ props, model }: { props: ComboboxProps; model: ComboboxModel }) {
  return (
    <>
      <input
        {...nativeProps(props)}
        id={model.id}
        ref={model.input}
        className="fs-combobox__input"
        type="text"
        role="combobox"
        value={model.query}
        autoComplete="off"
        aria-labelledby={`${model.id}-label`}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={model.expanded}
        aria-controls={model.expanded ? `${model.id}-listbox` : undefined}
        aria-activedescendant={model.activeId}
        onFocus={(event) => {
          props.onFocus?.(event);
          model.setOpen(true);
        }}
        onChange={(event) => {
          model.edit(event.target.value);
          model.setActive(null);
          model.setOpen(true);
        }}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          comboboxKey(event, model, props);
        }}
      />
      {props.name && model.selected && (
        <input
          type="hidden"
          name={props.name}
          value={model.selected}
          disabled={props.disabled}
          form={props.form}
        />
      )}
    </>
  );
}

/**
 * Search visible labels while keeping option selection, native validation and form submission distinct.
 **/
export const Combobox: ForwardRefExoticComponent<ComboboxProps & RefAttributes<HTMLInputElement>> =
  /* @__PURE__ */ forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(props, ref) {
    const model = useCombobox(props);
    const accessibility = useFieldAccessibility({
      id: model.id,
      describedBy: props['aria-describedby'],
      invalid: props.invalid ?? props['aria-invalid'],
      error: props.error,
      descriptions: [['description', props.description]],
    });
    useImperativeHandle(ref, () => model.input.current!, [model.input]);
    return (
      <div
        className={['fs-combobox', `fs-combobox--${props.size ?? 'medium'}`, props.wrapperClassName]
          .filter(Boolean)
          .join(' ')}
        style={props.wrapperStyle}
        hidden={props.hidden}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            model.setOpen(false);
          }
        }}
      >
        <div className="fs-combobox__anchor">
          <div
            className={['fs-combobox__control', props.className].filter(Boolean).join(' ')}
            style={props.style}
            data-disabled={props.disabled}
            data-invalid={Boolean(
              accessibility['aria-invalid'] && accessibility['aria-invalid'] !== 'false',
            )}
          >
            <div className="fs-combobox__text">
              <FieldLabel htmlFor={model.id} id={`${model.id}-label`}>
                {props.label}
                {props.required && <span aria-hidden="true"> *</span>}
              </FieldLabel>
              <SearchInput model={model} props={{ ...props, ...accessibility }} />
            </div>
            {(props.allowClear ?? true) && model.query && (
              <button
                className="fs-combobox__clear"
                type="button"
                aria-label={props.clearLabel ?? 'Clear selection'}
                disabled={props.disabled || props.readOnly}
                onMouseDown={(event) => event.preventDefault()}
                onClick={model.clear}
              >
                <CloseIcon size="small" />
              </button>
            )}
          </div>
          <ComboboxPopup model={model} props={props} />
        </div>
        {props.description && (
          <FieldDescription id={`${model.id}-description`}>{props.description}</FieldDescription>
        )}
        {props.error && <FieldError id={`${model.id}-error`}>{props.error}</FieldError>}
      </div>
    );
  });
