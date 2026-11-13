import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

export type RatingStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type RatingSymbol = 'star' | 'heart' | 'thumbs';
type Owned = 'children' | 'dangerouslySetInnerHTML' | 'style' | 'defaultValue' | 'onChange' | 'tabIndex' | 'role' | 'aria-label' | 'aria-labelledby';
type Common = Omit<ComponentPropsWithoutRef<'div'>, Owned> & {
  value?: number; defaultValue?: number; onValueChange?: (value: number) => void;
  max?: number; step?: 1 | 0.5; size?: 'sm' | 'md' | 'lg'; symbol?: RatingSymbol;
  showValue?: boolean; disabled?: boolean; required?: boolean; name?: string; form?: string;
  description?: string; error?: string; invalid?: boolean; style?: RatingStyle;
  getRatingLabel?: (value: number, max: number, symbol: RatingSymbol) => string;
  formatValue?: (value: number, max: number) => string;
  children?: never; dangerouslySetInnerHTML?: never;
};
export type RatingProps = Common & ({ mode: 'input'; label: string } | { mode?: 'display'; label?: string });
