import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react';

export type NavbarMobilePlacement = 'bar' | 'menu';
export type NavbarStyle = CSSProperties & {
  [token: `--fs-${string}`]: string | number | undefined;
};
export type NavbarProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'style' | 'dangerouslySetInnerHTML'
> & {
  children: ReactNode;
  style?: NavbarStyle;
  /** Label for the compact menu trigger. Defaults to "Menu". */
  menuLabel?: string;
  /** Controls whether the compact menu is open. */
  open?: boolean;
  /** Initial uncontrolled state. Defaults to false. */
  defaultOpen?: boolean;
  /** Called when an interaction requests a change in open state. */
  onOpenChange?: (open: boolean) => void;
};
export type NavbarBrandProps = { children: ReactNode };
export type NavbarItemProps = {
  children: ReactNode;
  /** Compact layout placement. Defaults to "menu". */
  // eslint-disable-next-line sonarjs/no-redundant-optional -- Mapped optional values must accept explicit undefined under exactOptionalPropertyTypes.
  mobilePlacement?: NavbarMobilePlacement | undefined;
};
