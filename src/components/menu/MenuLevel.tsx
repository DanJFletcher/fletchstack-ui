import { useRef, type ReactElement } from 'react';
import type { MenuItem, MenuProps, MenuSelectEvent } from './types.js';
import type { MenuModel } from './useMenu.js';
import { menuKey } from './menu-keyboard.js';
import { useMenuPosition } from './useMenuPosition.js';

interface LevelProps { model: MenuModel; items: readonly MenuItem[]; path: string[]; label: string; config: MenuProps }

/**
 * Render one named menu level with independent navigation and an accessible empty state.
 **/
export function MenuLevel({ model, items, path, label, config }: LevelProps): ReactElement {
  const panel = useRef<HTMLUListElement>(null);
  useMenuPosition(panel, path.length ? model.itemId(path) : model.triggerId, path.length > 0);

  return <ul ref={panel} id={model.menuId(path)} role="menu" aria-label={label} tabIndex={-1}
    className={`fs-menu__panel${path.length ? ' fs-menu__panel--child' : ''}`} onKeyDown={event => menuKey(event, model, path)}>
    {items.length ? items.map(item => <MenuRow key={item.id} item={item} model={model} path={path} config={config} />)
      : <li role="menuitem" aria-disabled="true" className="fs-menu__empty">{config.emptyMessage ?? 'No actions available.'}</li>}
  </ul>;
}

/**
 * Invoke the consumer exactly once and let cancellation retain both menu and native-link semantics.
 **/
function selectLeaf(event: MenuSelectEvent, item: Exclude<MenuItem, { type: 'divider' | 'submenu' }>, model: MenuModel, config: MenuProps): void {
  if (item.disabled) { event.preventDefault(); return; }
  item.onSelect?.(event);
  if (config.closeOnSelect !== false && !event.defaultPrevented) { model.change(false, true); }
}

/**
 * Keep decorative icons out of accessible labels and reserve a trailing chevron for branches.
 **/
function MenuLabel({ item }: { item: Exclude<MenuItem, { type: 'divider' }> }) {
  return <>{item.icon != null && <span className="fs-menu__icon" aria-hidden="true">{item.icon}</span>}<span className="fs-menu__label">{item.label}</span>
    {item.type === 'submenu' && <span className="fs-menu__chevron" aria-hidden="true" />}</>;
}

/**
 * Render an enabled/disabled native link or button with component-owned semantics.
 **/
function MenuControl({ item, model, path, config, expanded }: { item: Exclude<MenuItem, { type: 'divider' }>; model: MenuModel; path: string[]; config: MenuProps; expanded: boolean }) {
  const common = { id: model.itemId(path), role: 'menuitem', tabIndex: -1, 'aria-disabled': item.disabled || undefined, className: 'fs-menu__item', 'data-menu-label': item.label } as const;
  if (item.type === 'submenu') {
    return <button {...common} type="button" disabled={item.disabled} data-menu-path={JSON.stringify(path)} aria-haspopup="menu" aria-expanded={expanded}
      aria-controls={expanded ? model.menuId(path) : undefined} onClick={() => model.toggle(path, false)}><MenuLabel item={item} /></button>;
  }
  if (item.href !== undefined) { return <a {...common} href={item.disabled ? undefined : item.href} target={item.target} rel={item.rel} onClick={event => selectLeaf(event, item, model, config)}><MenuLabel item={item} /></a>; }

  return <button {...common} type="button" disabled={item.disabled} onClick={event => selectLeaf(event, item, model, config)}><MenuLabel item={item} /></button>;
}

/**
 * Compose recursive branches without nesting interactive elements.
 **/
function MenuRow({ item, model, path, config }: { item: MenuItem; model: MenuModel; path: string[]; config: MenuProps }) {
  if (item.type === 'divider') { return <li role="separator" className="fs-menu__divider" />; }
  const rowPath = [...path, item.id];
  const expanded = item.type === 'submenu' && model.branch[path.length] === item.id;

  return <li role="none" className="fs-menu__row"><MenuControl item={item} model={model} path={rowPath} config={config} expanded={expanded} />
    {expanded && item.type === 'submenu' && <MenuLevel model={model} items={item.items} path={rowPath} label={item.label} config={config} />}
  </li>;
}
