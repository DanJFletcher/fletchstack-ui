import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';
import { Icon, type IconSize } from '../icon/Icon.js';

export type SpinnerSize = IconSize;
export type SpinnerStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
const ownedAttributes = [
  'role',
  'aria-label',
  'aria-labelledby',
  'aria-hidden',
  'aria-live',
  'aria-atomic',
  'aria-valuenow',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuetext',
  'tabIndex',
  'contentEditable',
] as const;
type OwnedAttribute = (typeof ownedAttributes)[number];
export type SpinnerProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children' | 'style' | OwnedAttribute
> & { [Attribute in OwnedAttribute]?: never } & {
  children?: never;
  size?: SpinnerSize;
  label?: string;
  decorative?: boolean;
  style?: SpinnerStyle;
};

/**
 * Keep status, progress, and focus semantics owned even for untyped consumers.
 **/
function spinnerAttributes(props: ComponentPropsWithoutRef<'span'>) {
  const attributes = { ...props };
  for (const name of ownedAttributes) {
    Reflect.deleteProperty(attributes, name);
  }

  return attributes;
}

/**
 * Show indeterminate activity with visible status text or a hidden decorative duplicate.
 **/
export const Spinner: ForwardRefExoticComponent<SpinnerProps & RefAttributes<HTMLSpanElement>> =
  /* @__PURE__ */ forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
    { size = 'medium', label = 'Loading…', decorative = false, className, ...props },
    ref,
  ) {
    const text = label.trim() || 'Loading…';

    return (
      <span
        {...spinnerAttributes(props)}
        ref={ref}
        className={['fs-spinner', `fs-spinner--${size}`, className].filter(Boolean).join(' ')}
        role={decorative ? undefined : 'status'}
        aria-live={decorative ? undefined : 'polite'}
        aria-atomic={decorative ? undefined : true}
        aria-hidden={decorative || undefined}
      >
        <Icon size={size} className="fs-spinner__graphic">
          <circle className="fs-spinner__track" cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 1 9 9" />
        </Icon>
        {!decorative && <span className="fs-spinner__label">{text}</span>}
      </span>
    );
  });
