import {
  forwardRef,
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { Field } from '../field/Field.js';
import { ChevronDownIcon } from '../icon/named/ChevronDownIcon.js';
import { SelectionLimit, SelectionPopup, SelectionTags } from './MultiSelectParts.js';
import { selectionKey, useMultiSelect } from './useMultiSelect.js';
import type { MultiSelectProps } from './types.js';
export type { MultiSelectProps, MultiSelectOption, MultiSelectStyle } from './types.js';

/**
 * Forward only native input properties, retaining composite-owned semantics and content.
 **/
function nativeInputProps(props: MultiSelectProps) {
  const native = { ...props } as Record<string, unknown>;
  for (const name of [
    'label',
    'options',
    'value',
    'defaultValue',
    'onValueChange',
    'filterOptions',
    'minSelections',
    'maxSelections',
    'minSelectionsMessage',
    'maxSelectionsMessage',
    'removeLabel',
    'clearLabel',
    'allowClear',
    'loading',
    'loadingMessage',
    'noResultsMessage',
    'helperText',
    'error',
    'size',
    'wrapperClassName',
    'wrapperStyle',
    'name',
    'list',
    'style',
    'children',
    'dangerouslySetInnerHTML',
  ]) {
    Reflect.deleteProperty(native, name);
  }
  return native as ComponentPropsWithoutRef<'input'>;
}

/**
 * Render the focusable search control and repeated successful form values.
 **/
function SearchControl({
  model,
  props,
}: {
  model: ReturnType<typeof useMultiSelect>;
  props: MultiSelectProps;
}) {
  return (
    <>
      <input
        {...nativeInputProps(props)}
        ref={model.input}
        id={model.id}
        className="fs-multi-select__input"
        type="text"
        role="combobox"
        value={model.query}
        placeholder={props.placeholder ?? 'Search options'}
        autoComplete="off"
        aria-labelledby={`${model.id}-label`}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={model.expanded}
        aria-controls={model.expanded ? `${model.id}-listbox` : undefined}
        aria-activedescendant={model.activeId}
        aria-required={Boolean(props.required || props.minSelections)}
        required={Boolean((props.required || props.minSelections) && !model.selected.length)}
        onChange={(event) => {
          model.setQuery(event.target.value);
          model.setActiveValue(null);
          model.setOpen(true);
        }}
        onFocus={(event) => {
          props.onFocus?.(event);
          model.setOpen(true);
        }}
        onBlur={props.onBlur}
        onKeyDown={(event) => {
          props.onKeyDown?.(event);
          selectionKey(event, model, props);
        }}
      />
      {props.name &&
        model.selected.map((value) => (
          <input
            type="hidden"
            key={value}
            name={props.name}
            value={value}
            disabled={props.disabled}
            form={props.form}
          />
        ))}
    </>
  );
}

/**
 * Search, choose and remove multiple named values with native form validity and reset behavior.
 **/
export const MultiSelect: ForwardRefExoticComponent<
  MultiSelectProps & RefAttributes<HTMLInputElement>
> = /* @__PURE__ */ forwardRef<HTMLInputElement, MultiSelectProps>(
  function MultiSelect(props, ref) {
    const model = useMultiSelect(props);
    useImperativeHandle(ref, () => model.input.current!, [model.input]);
    return (
      <Field
        id={model.id}
        label={
          <span id={`${model.id}-label`}>
            {props.label}
            {props.required && <span aria-hidden="true"> *</span>}
          </span>
        }
        helperText={props.helperText}
        error={model.error}
        aria-describedby={props['aria-describedby']}
        aria-invalid={props['aria-invalid']}
        descriptionIds={
          props.maxSelections !== undefined && model.selected.length >= props.maxSelections
            ? [`${model.id}-limit`]
            : []
        }
        hidden={props.hidden}
        className={[
          'fs-multi-select',
          `fs-multi-select--${props.size ?? 'medium'}`,
          props.wrapperClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        style={props.wrapperStyle}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            model.setOpen(false);
          }
        }}
      >
        {(control) => (
          <div className="fs-multi-select__anchor">
            <div
              className={['fs-multi-select__control', props.className].filter(Boolean).join(' ')}
              style={props.style}
              data-disabled={props.disabled}
              data-invalid={control['aria-invalid'] && control['aria-invalid'] !== 'false'}
            >
              <SelectionTags model={model} props={props} />
              <SearchControl
                model={model}
                props={{
                  ...props,
                  'aria-describedby': control['aria-describedby'],
                  'aria-invalid': control['aria-invalid'],
                }}
              />
              <span className="fs-multi-select__actions">
                {(props.allowClear ?? true) && model.choices.some((option) => !option.disabled) && (
                  <button
                    type="button"
                    className="fs-multi-select__clear"
                    aria-label={props.clearLabel ?? 'Clear selections'}
                    disabled={props.disabled || props.readOnly}
                    onClick={model.clear}
                  >
                    ×
                  </button>
                )}
                <span className="fs-multi-select__chevron" aria-hidden="true">
                  <ChevronDownIcon />
                </span>
              </span>
            </div>
            <SelectionPopup model={model} props={props} />
            <SelectionLimit model={model} props={props} />
          </div>
        )}
      </Field>
    );
  },
);
