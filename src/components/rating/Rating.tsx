import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { FieldDescription, FieldError } from '../field/FieldPrimitives.js';
import { useFieldAccessibility } from '../../internal/hooks/useFieldAccessibility.js';
import { RatingSymbol } from './RatingSymbol.js';
import { ratingLabel } from './rating-policy.js';
import { useRating } from './useRating.js';
import type { RatingProps } from './types.js';
export type { RatingProps, RatingStyle, RatingSymbol } from './types.js';

type Model = ReturnType<typeof useRating>;

/**
 * Overlay native radio hit areas on a single visual symbol; each half remains an independent choice.
 **/
function InputSymbols({
  props,
  model,
  describedBy,
}: {
  props: RatingProps;
  model: Model;
  describedBy: ReturnType<typeof useFieldAccessibility>;
}) {
  const { max = 5, step = 1, symbol = 'star', getRatingLabel = ratingLabel } = props;
  return (
    <span className="fs-rating__symbols">
      {Array.from({ length: max }, (_, index) => (
        <span key={index} className="fs-rating__cell">
          <RatingSymbol symbol={symbol} fill={Math.min(1, Math.max(0, model.value - index))} />
          <span className="fs-rating__targets">
            {Array.from({ length: 1 / step }, (_, half) => {
              const choice = index + (half + 1) * step;
              return (
                <label key={choice} className="fs-rating__option">
                  <input
                    type="radio"
                    name={props.name ?? `rating-${describedBy.id}`}
                    form={props.form}
                    value={choice}
                    checked={model.value === choice}
                    required={props.required}
                    disabled={props.disabled}
                    aria-label={getRatingLabel(choice, max, symbol)}
                    aria-describedby={describedBy['aria-describedby']}
                    aria-invalid={describedBy['aria-invalid']}
                    onChange={() => model.select(choice)}
                  />
                  <span className="fs-rating__focus" aria-hidden="true" />
                </label>
              );
            })}
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * Expose display artwork as one image with an optional visible score alongside it.
 **/
function Display({ props, model }: { props: RatingProps; model: Model }) {
  const { max = 5, symbol = 'star', getRatingLabel = ratingLabel } = props;
  return (
    <>
      {props.label && <span className="fs-rating__label">{props.label}</span>}
      <span
        role="img"
        aria-label={getRatingLabel(model.value, max, symbol)}
        className="fs-rating__symbols"
      >
        {Array.from({ length: max }, (_, index) => (
          <RatingSymbol
            key={index}
            symbol={symbol}
            fill={Math.min(1, Math.max(0, model.value - index))}
          />
        ))}
      </span>
    </>
  );
}

/**
 * Render a stable review summary or native radio field without custom keyboard emulation.
 **/
export const Rating: ForwardRefExoticComponent<RatingProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, RatingProps>(function Rating(props, ref) {
    const model = useRating(props);
    const {
      className,
      size = 'md',
      mode = 'display',
      disabled,
      label,
      description,
      error,
      invalid,
      showValue,
      formatValue = (value, max) => `${value} / ${max}`,
      ...native
    } = props;
    const control = useFieldAccessibility({
      id: props.id,
      describedBy: props['aria-describedby'],
      invalid: invalid ?? props['aria-invalid'],
      error,
      descriptions: [['description', description]],
    });
    for (const key of [
      'tabIndex',
      'id',
      'aria-describedby',
      'aria-invalid',
      'value',
      'defaultValue',
      'onValueChange',
      'max',
      'step',
      'symbol',
      'getRatingLabel',
      'required',
      'name',
      'form',
      'children',
      'dangerouslySetInnerHTML',
      'role',
      'aria-label',
      'aria-labelledby',
      'onChange',
    ]) {
      Reflect.deleteProperty(native, key);
    }
    const score = showValue && (
      <span className="fs-rating__score" aria-hidden={mode === 'display' ? true : undefined}>
        {formatValue(model.value, props.max ?? 5)}
      </span>
    );

    return (
      <div
        {...native}
        ref={ref}
        id={control.id}
        className={['fs-rating', `fs-rating--${size}`, className].filter(Boolean).join(' ')}
        data-disabled={disabled || undefined}
      >
        {mode === 'input' ? (
          <fieldset
            ref={model.group}
            form={props.form}
            disabled={disabled}
            className="fs-rating__group"
            aria-describedby={control['aria-describedby']}
            aria-invalid={control['aria-invalid']}
          >
            <legend className="fs-rating__label">
              {label}
              {props.required && <span aria-hidden="true"> *</span>}
            </legend>
            <div className="fs-rating__row">
              <InputSymbols props={props} model={model} describedBy={control} />
              {score}
            </div>
          </fieldset>
        ) : (
          <div className="fs-rating__row">
            <Display props={props} model={model} />
            {score}
          </div>
        )}
        {description && (
          <FieldDescription id={`${control.id}-description`}>{description}</FieldDescription>
        )}
        {error && <FieldError id={`${control.id}-error`}>{error}</FieldError>}
      </div>
    );
  });
