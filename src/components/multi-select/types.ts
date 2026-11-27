import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
export type MultiSelectStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
type Owned =
  | 'children'
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
  | 'aria-haspopup'
  | 'dangerouslySetInnerHTML';
export type MultiSelectProps = Omit<ComponentPropsWithoutRef<'input'>, Owned> & {
  [Key in Exclude<Owned, 'size' | 'value' | 'defaultValue' | 'style'>]?: never;
} & {
  label: ReactNode;
  options: readonly MultiSelectOption[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (values: string[]) => void;
  filterOptions?: (
    options: readonly MultiSelectOption[],
    query: string,
  ) => readonly MultiSelectOption[];
  minSelections?: number;
  maxSelections?: number;
  minSelectionsMessage?: (count: number) => string;
  maxSelectionsMessage?: (count: number) => string;
  removeLabel?: (option: MultiSelectOption) => string;
  clearLabel?: string;
  allowClear?: boolean;
  loading?: boolean;
  loadingMessage?: string;
  noResultsMessage?: string;
  helperText?: string;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  style?: MultiSelectStyle;
  wrapperClassName?: string;
  wrapperStyle?: MultiSelectStyle;
};
