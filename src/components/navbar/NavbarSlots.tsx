import type { ReactElement } from 'react';
import type { NavbarBrandProps, NavbarItemProps } from './types.js';

/**
 * Keep the consumer's brand content in the persistent bar without modifying its children.
 **/
export function NavbarBrand({ children }: NavbarBrandProps): ReactElement {
  return <div className="fs-navbar__brand">{children}</div>;
}

/**
 * Wrap a single consumer-owned item without cloning its children, refs or event handlers.
 **/
export function NavbarItem({ children }: NavbarItemProps): ReactElement {
  return <div className="fs-navbar__item">{children}</div>;
}
