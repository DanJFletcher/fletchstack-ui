import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type DialogStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type DialogProps = Omit<
  ComponentPropsWithoutRef<'dialog'>,
  'open' | 'style' | 'dangerouslySetInnerHTML'
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heading?: ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  description?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  motion?: 'none' | 'fade' | 'slide';
  closeOnEscape?: boolean;
  /** Dismiss on a complete backdrop click. Defaults to true. */
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  closeLabel?: string;
  style?: DialogStyle;
};
