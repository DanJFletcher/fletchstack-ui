import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { CheckIcon } from '../icon/named/CheckIcon.js';
import { CloseIcon } from '../icon/named/CloseIcon.js';

export type ChipStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
type Selection =
  | { selected: boolean; onSelect: (selected: boolean) => void }
  | { selected?: never; onSelect?: never };
type Removal =
  { onRemove: () => void; removeLabel: string } | { onRemove?: never; removeLabel?: never };
export type ChipProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children' | 'style' | 'onSelect' | 'dangerouslySetInnerHTML'
> &
  Selection &
  Removal & {
    children: ReactNode;
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    style?: ChipStyle;
    dangerouslySetInnerHTML?: never;
  };

/**
 * Reject incomplete actions rather than silently rendering an unnamed or inert control.
 **/
function validateActions(props: ChipProps): void {
  if (Boolean(props.onSelect) !== (props.selected !== undefined)) {
    throw new Error('Chip selection requires selected and onSelect together.');
  }
  if (Boolean(props.onRemove) !== Boolean(props.removeLabel?.trim())) {
    throw new Error('Chip removal requires onRemove and a nonempty removeLabel together.');
  }
}

/**
 * Display a static content tag, a controlled toggle, or independent sibling selection/removal actions.
 **/
export const Chip: ForwardRefExoticComponent<ChipProps & RefAttributes<HTMLSpanElement>> =
  /* @__PURE__ */ forwardRef<HTMLSpanElement, ChipProps>(function Chip(chipProps, ref) {
    validateActions(chipProps);
    const {
      children,
      size = 'medium',
      disabled = false,
      selected,
      onSelect,
      onRemove,
      removeLabel,
      className,
      ...props
    } = chipProps;
    Reflect.deleteProperty(props, 'dangerouslySetInnerHTML');

    return (
      <span
        {...props}
        ref={ref}
        data-disabled={disabled}
        data-selected={selected}
        className={['fs-chip', `fs-chip--${size}`, className].filter(Boolean).join(' ')}
      >
        {onSelect ? (
          <button
            type="button"
            className="fs-chip__select"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => onSelect(!selected)}
          >
            {selected && (
              <span className="fs-chip__icon" aria-hidden="true">
                <CheckIcon />
              </span>
            )}
            <span className="fs-chip__label">{children}</span>
          </button>
        ) : (
          <span className="fs-chip__label">{children}</span>
        )}
        {onRemove && (
          <button
            type="button"
            className="fs-chip__remove"
            aria-label={removeLabel}
            disabled={disabled}
            onClick={() => onRemove()}
          >
            <span className="fs-chip__icon" aria-hidden="true">
              <CloseIcon />
            </span>
          </button>
        )}
      </span>
    );
  });
