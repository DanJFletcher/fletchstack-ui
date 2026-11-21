import type { ComponentPropsWithoutRef, CSSProperties, ReactElement, ReactNode } from 'react';

export type TooltipStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type TooltipProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'content' | 'style' | 'dangerouslySetInnerHTML'> & {
  /** One focusable element or component that forwards aria-describedby. */
  children: ReactElement<{ 'aria-describedby'?: string }>;
  /** Supplementary, non-interactive description; never essential instructions. */
  content: ReactNode;
  placement?: TooltipPlacement;
  style?: TooltipStyle;
};
