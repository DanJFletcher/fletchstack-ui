import type { KeyboardEvent } from 'react';
import { moveMenuFocus, searchMenu } from './menu-policy.js';
import type { MenuModel } from './useMenu.js';

/**
 * Dispatch level-local keyboard movement without handling a child's bubbled event twice.
 **/
export function menuKey(
  event: KeyboardEvent<HTMLUListElement>,
  model: MenuModel,
  path: string[],
): void {
  const target = event.target as HTMLElement;
  if (target.closest('[role="menu"]') !== event.currentTarget || event.defaultPrevented) {
    return;
  }
  event.stopPropagation();
  if (event.key === 'Tab') {
    model.change(false, true);
    return;
  }
  if (['Escape', 'ArrowLeft'].includes(event.key)) {
    event.preventDefault();
    if (path.length) {
      model.back(path);
    } else if (event.key === 'Escape') {
      model.change(false, true);
    }
    return;
  }
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    moveMenuFocus(event.currentTarget, event.key);
    return;
  }
  if (event.key === 'ArrowRight') {
    openChild(event, model);
    return;
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    target.closest<HTMLElement>('[role="menuitem"]')?.click();
    return;
  }
  if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
    event.preventDefault();
    searchMenu(event.currentTarget, event.key, event.timeStamp, model.search.current);
  }
}

/**
 * Enter only enabled submenu triggers; leaf items retain their normal activation keys.
 **/
function openChild(event: KeyboardEvent<HTMLUListElement>, model: MenuModel): void {
  const item = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]');
  if (
    item?.getAttribute('aria-haspopup') !== 'menu' ||
    item.getAttribute('aria-disabled') === 'true'
  ) {
    return;
  }
  event.preventDefault();
  model.toggle(JSON.parse(item.dataset['menuPath']!), true);
}

/**
 * Open at the requested boundary from the native trigger and dismiss without trapping Tab.
 **/
export function menuTriggerKey(event: KeyboardEvent<HTMLButtonElement>, model: MenuModel): void {
  if (event.defaultPrevented) {
    return;
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    model.change(true, false, event.key === 'ArrowUp');
  }
  if (event.key === 'Escape' && model.expanded) {
    event.preventDefault();
    model.change(false, true);
  }
  if (event.key === 'Tab' && model.expanded) {
    model.change(false);
  }
}
