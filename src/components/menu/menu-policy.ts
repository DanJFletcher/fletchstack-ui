import type { MenuItem } from './types.js';

/**
 * Reject ambiguous sibling identities and invisible labels throughout a recursive configuration.
 **/
export function validateMenu(items: readonly MenuItem[]): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (!item.id.trim() || ids.has(item.id)) {
      throw new Error('Menu IDs must be non-empty and unique among siblings.');
    }
    ids.add(item.id);
    if (item.type !== 'divider' && !item.label.trim()) {
      throw new Error('Menu items require visible labels.');
    }
    if (item.type === 'submenu') {
      validateMenu(item.items);
    }
  }
}

/**
 * Limit navigation to enabled items directly owned by this level, excluding descendants.
 **/
export function enabledItems(menu: HTMLElement): HTMLElement[] {
  return Array.from(menu.querySelectorAll<HTMLElement>('[role="menuitem"]')).filter(
    (item) =>
      item.closest('[role="menu"]') === menu && item.getAttribute('aria-disabled') !== 'true',
  );
}

/**
 * Move within the current level with wrapping arrows and explicit boundary keys.
 **/
export function moveMenuFocus(menu: HTMLElement, key: string): void {
  const items = enabledItems(menu);
  const index = items.indexOf(document.activeElement as HTMLElement);
  const last = items.length - 1;
  let target = key === 'ArrowDown' ? (index + 1) % items.length : index - 1;
  if (key === 'ArrowUp' && index <= 0) {
    target = last;
  }
  if (key === 'Home') {
    target = 0;
  }
  if (key === 'End') {
    target = last;
  }

  items[target]?.focus();
}

export interface MenuSearch {
  menu: string;
  text: string;
  time: number;
}

/**
 * Match a buffered label prefix; repeated letters cycle and a new level starts a fresh search.
 **/
export function searchMenu(menu: HTMLElement, key: string, time: number, search: MenuSearch): void {
  const items = enabledItems(menu);
  const prefix =
    search.menu === menu.id && time - search.time < 700
      ? search.text + key.toLowerCase()
      : key.toLowerCase();
  const start = items.indexOf(document.activeElement as HTMLElement) + 1;
  const ordered = [...items.slice(start), ...items.slice(0, start)];
  const find = (text: string) =>
    ordered.find((item) => item.dataset['menuLabel']!.toLowerCase().startsWith(text));
  const match = find(prefix) ?? find(key.toLowerCase());
  Object.assign(search, { menu: menu.id, text: match ? prefix : '', time });

  match?.focus();
}
