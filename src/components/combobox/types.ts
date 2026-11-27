import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export type ComboboxStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
type Owned =
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'type'
  | 'size'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'list'
  | 'style'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-expanded'
  | 'aria-controls'
  | 'aria-activedescendant'
  | 'aria-autocomplete'
  | 'aria-haspopup';
export type ComboboxProps = Omit<ComponentPropsWithoutRef<'input'>, Owned> & {
  label: ReactNode;
  options: readonly ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  filterOptions?: (options: readonly ComboboxOption[], query: string) => readonly ComboboxOption[];
  allowClear?: boolean;
  clearLabel?: string;
  loading?: boolean;
  loadingMessage?: string;
  noResultsMessage?: string;
  description?: string;
  error?: string;
  invalid?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ComboboxStyle;
  wrapperClassName?: string;
  wrapperStyle?: ComboboxStyle;
  children?: never;
  dangerouslySetInnerHTML?: never;
};
