import { forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes } from 'react';

export type ProgressStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type ProgressSize = 'small' | 'medium' | 'large';
export type ProgressProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'style' | 'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow' | 'dangerouslySetInnerHTML'> & {
  [Attribute in 'role' | 'aria-valuemin' | 'aria-valuemax' | 'aria-valuenow']?: never;
} & {
  // eslint-disable-next-line sonarjs/no-redundant-optional -- Unknown completion accepts explicit undefined under exactOptionalPropertyTypes.
  value?: number | null | undefined;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: ProgressSize;
  getValueLabel?: (value: number | null, max: number) => string;
  style?: ProgressStyle;
};

/**
 * Normalize task bounds and completion without manufacturing a percentage for unknown work.
 **/
function progressState(value: number | null | undefined, max: number) {
  const maximum = Number.isFinite(max) && max > 0 ? max : 100;
  const current = value === null || value === undefined || !Number.isFinite(value) ? null : Math.min(maximum, Math.max(0, value));

  return { maximum, current };
}

/**
 * Describe unknown work without a percentage, or format measured completion as a rounded percent.
 **/
function progressText(current: number | null, maximum: number) {
  return current === null ? 'In progress' : `${Math.round(current / maximum * 100)}%`;
}

/**
 * Render optional label/value content and a decorative track without adding duplicate announcements.
 **/
function ProgressContents({ label, showValue, text, current, maximum }: { label: string | undefined; showValue: boolean; text: string; current: number | null; maximum: number }) {
  return <>
    {(label || showValue) && <div className="fs-progress__header" aria-hidden="true">{label && <span className="fs-progress__label">{label}</span>}{showValue && <span className="fs-progress__value">{text}</span>}</div>}
    <div className="fs-progress__track" aria-hidden="true"><div className="fs-progress__indicator" style={{ inlineSize: current === null ? undefined : `${current / maximum * 100}%` }} /></div>
  </>;
}

/**
 * Present measured or indeterminate task completion while the application owns task state and announcements.
 **/
export const Progress: ForwardRefExoticComponent<ProgressProps & RefAttributes<HTMLDivElement>> = /* @__PURE__ */ forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value, max = 100, label, showValue = false, size = 'medium', getValueLabel, className, 'aria-valuetext': valueText, ...props }, ref,
) {
  const { maximum, current } = progressState(value, max);
  const text = getValueLabel ? getValueLabel(current, maximum) : progressText(current, maximum);
  const name = props['aria-labelledby'] ? undefined : props['aria-label'] ?? label ?? 'Progress';

  return <div {...props} ref={ref} className={['fs-progress', `fs-progress--${size}`, className].filter(Boolean).join(' ')} role="progressbar" aria-label={name}
    aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={current ?? undefined} aria-valuetext={valueText ?? text} data-state={current === null ? 'indeterminate' : 'determinate'}>
    <ProgressContents label={label} showValue={showValue} text={text} current={current} maximum={maximum} />
  </div>;
});
