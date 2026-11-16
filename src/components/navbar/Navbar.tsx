import { Fragment, forwardRef, useImperativeHandle, type ForwardRefExoticComponent, type ReactElement, type RefAttributes } from 'react';
import { Button } from '../button/Button.js';
import { NavbarBrand, NavbarItem } from './NavbarSlots.js';
import { navbarGroups, type NavbarGroups } from './navbar-children.js';
import { useNavbar, type NavbarModel } from './useNavbar.js';
import type { NavbarProps } from './types.js';

type NavbarComponent = ForwardRefExoticComponent<NavbarProps & RefAttributes<HTMLElement>> & { Brand: typeof NavbarBrand; Item: typeof NavbarItem };

/**
 * Render persistent groups so compact layout never moves a child between React parents.
 **/
function NavbarContents({ groups, model, menuLabel }: { groups: NavbarGroups; model: NavbarModel; menuLabel: string }): ReactElement {
  const brand = <Fragment key="brand">{groups.brand}</Fragment>;
  const bar = groups.bar.length > 0 && <div key="bar" className="fs-navbar__bar">{groups.bar}</div>;
  const trigger = groups.menu.length > 0 && <Button key="trigger" ref={model.trigger} className="fs-navbar__trigger" variant="secondary" size="small" hidden={!model.compact}
    aria-expanded={model.expanded} aria-controls={model.panelId} onClick={() => model.change(!model.expanded)}>{menuLabel}</Button>;
  const panel = groups.menu.length > 0 && <div key="menu" ref={model.panel} id={model.panelId} className="fs-navbar__menu" hidden={model.compact && !model.expanded}>{groups.menu}</div>;

  return <>{model.compact ? [brand, bar, trigger, panel] : [brand, panel, bar, trigger]}</>;
}

/**
 * Compose consumer navigation and controls with a container-responsive, native disclosure.
 **/
const NavbarRoot: ForwardRefExoticComponent<NavbarProps & RefAttributes<HTMLElement>> = /* @__PURE__ */ forwardRef<HTMLElement, NavbarProps>(function Navbar(
  { children, menuLabel = 'Menu', open, defaultOpen, onOpenChange, className, onKeyDown, onClick, ...props }, ref,
) {
  const model = useNavbar({ open, defaultOpen, onOpenChange });
  const groups = navbarGroups(children);
  useImperativeHandle(ref, () => model.root.current!, [model.root]);

  return <nav {...props} ref={model.root} data-compact={model.compact || undefined} className={['fs-navbar', className].filter(Boolean).join(' ')}
    onClick={event => { onClick?.(event); model.select(event); }} onKeyDown={event => { onKeyDown?.(event); model.escape(event); }}><NavbarContents groups={groups} model={model} menuLabel={menuLabel} /></nav>;
});

export const Navbar: NavbarComponent = /* @__PURE__ */ Object.assign(NavbarRoot, { Brand: NavbarBrand, Item: NavbarItem });
