import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export interface AccordionItem { id: string; title: ReactNode; content: ReactNode; disabled?: boolean }
export type AccordionStyle = CSSProperties & { [token: `--fs-${string}`]: string | number | undefined };
export type AccordionProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'style' | 'dangerouslySetInnerHTML'> & {
  items: readonly AccordionItem[];
  label?: string;
  variant?: 'divided' | 'outlined' | 'surface';
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  multiple?: boolean;
  openItems?: readonly string[];
  defaultOpenItems?: readonly string[];
  onOpenItemsChange?: (ids: string[]) => void;
  panelMotion?: 'none' | 'expand';
  style?: AccordionStyle;
  children?: never;
  dangerouslySetInnerHTML?: never;
};
