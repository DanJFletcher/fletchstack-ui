import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

export interface BreadcrumbAncestor {
  label: string;
  href: string;
  current?: false;
}
export interface BreadcrumbCurrent {
  label: string;
  current: true;
  href?: never;
}
export type BreadcrumbItem = BreadcrumbAncestor | BreadcrumbCurrent;
export type BreadcrumbsStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type BreadcrumbsProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'role' | 'style' | 'dangerouslySetInnerHTML'
> & {
  items: readonly BreadcrumbItem[];
  collapseAt?: string;
  style?: BreadcrumbsStyle;
  role?: never;
};
