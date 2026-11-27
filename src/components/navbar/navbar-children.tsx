import { Children, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import { NavbarBrand, NavbarItem } from './NavbarSlots.js';
import type { NavbarItemProps } from './types.js';

export interface NavbarGroups {
  brand: ReactNode[];
  bar: ReactNode[];
  menu: ReactNode[];
}

/**
 * Flatten arrays and fragments while retaining consumer keys across conditional and mapped siblings.
 **/
function collect(children: ReactNode, groups: NavbarGroups, prefix: string): void {
  Children.toArray(children).forEach((child) => {
    if (!isValidElement(child)) {
      throw new Error('Navbar children must be Navbar.Brand or Navbar.Item.');
    }
    const key = `${prefix}/${child.key}`;
    if (child.type === Fragment) {
      collect((child.props as { children: ReactNode }).children, groups, key);
      return;
    }
    const group = placement(child);
    groups[group].push(<Fragment key={key}>{child}</Fragment>);
  });
}

/**
 * Classify only explicit placement slots; the slot children remain entirely consumer-owned.
 **/
function placement(child: ReactElement): keyof NavbarGroups {
  if (child.type === NavbarBrand) {
    return 'brand';
  }
  if (child.type !== NavbarItem) {
    throw new Error('Navbar children must be Navbar.Brand or Navbar.Item.');
  }

  return (child.props as NavbarItemProps).mobilePlacement === 'bar' ? 'bar' : 'menu';
}

/**
 * Assign persistent React parents once by placement, independently of width and disclosure state.
 **/
export function navbarGroups(children: ReactNode): NavbarGroups {
  const groups: NavbarGroups = { brand: [], bar: [], menu: [] };
  collect(children, groups, 'navbar');

  return groups;
}
