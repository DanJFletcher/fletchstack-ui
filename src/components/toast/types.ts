import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type ToastTone = 'info' | 'success' | 'warning' | 'error' | 'neutral';
export type ToastAnnouncement = 'polite' | 'assertive' | 'off';
export type ToastPosition = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left'
  | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
export type ToastStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type ToastProps = Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'role' | 'aria-live' | 'style' | 'children' | 'dangerouslySetInnerHTML'> & {
  children: ReactNode;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: ToastTone;
  announcement?: ToastAnnouncement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Positive milliseconds; defaults to persistent (0). */
  duration?: number;
  /** Fix a single toast to a page edge; omit when composing a ToastViewport stack. */
  position?: ToastPosition;
  dismissLabel?: string;
  style?: ToastStyle;
};
export type ToastViewportProps = Omit<ComponentPropsWithoutRef<'div'>, 'style' | 'dangerouslySetInnerHTML'> & {
  position?: ToastPosition;
  inline?: boolean;
  style?: ToastStyle;
};
