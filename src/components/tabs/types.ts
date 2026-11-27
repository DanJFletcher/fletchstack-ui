import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type TabsItem = { id: string; label: ReactNode; content: ReactNode; disabled?: boolean };
export type TabsStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type TabsProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'style' | 'dangerouslySetInnerHTML' | 'defaultValue' | 'onChange'
> & {
  label: string;
  items: readonly TabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: 'line' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  fullWidth?: boolean;
  style?: TabsStyle;
};
