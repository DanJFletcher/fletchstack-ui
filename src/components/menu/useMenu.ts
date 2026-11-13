import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import type { MenuProps } from './types.js';
import { enabledItems, validateMenu, type MenuSearch } from './menu-policy.js';

interface FocusRequest { id: string; last: boolean }

export interface MenuModel {
  root: RefObject<HTMLDivElement | null>; trigger: RefObject<HTMLButtonElement | null>;
  expanded: boolean; branch: string[]; triggerId: string; search: RefObject<MenuSearch>;
  menuId: (path: string[]) => string; itemId: (path: string[]) => string;
  change: (open: boolean, restore?: boolean, last?: boolean) => void;
  toggle: (path: string[], enter: boolean) => void; back: (path: string[]) => void;
}

/**
 * Focus an enabled boundary item, falling back to an empty menu's named container.
 **/
function focusMenu(id: string, last: boolean): void {
  const menu = document.getElementById(id)!;
  const items = enabledItems(menu);
  (items[last ? items.length - 1 : 0] ?? menu).focus();
}

/**
 * Reset closed branches and focus requested panels only after their DOM exists.
 **/
function useMenuFocus(model: MenuModel, pending: RefObject<FocusRequest | null>): void {
  useEffect(() => {
    if (model.expanded) {
      const request = pending.current;
      if (request && document.getElementById(request.id)) { focusMenu(request.id, request.last); pending.current = null; }
    }
  }, [model.expanded, model.branch, pending]);
}

/**
 * Dismiss on outside pointer activation without cancelling native pointer or focus behavior.
 **/
function useOutsideMenu(model: MenuModel): void {
  useEffect(() => {
    if (!model.expanded) { return; }
    const outside = (event: PointerEvent) => { if (!model.root.current!.contains(event.target as Node)) { model.change(false); } };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [model.expanded, model.change, model.root]);
}

/**
 * Namespace path-based relationships by component instance without depending on sibling indices.
 **/
function useMenuIds(): Pick<MenuModel, 'triggerId' | 'menuId' | 'itemId'> {
  const id = useId();

  return { triggerId: `${id}-trigger`, menuId: path => `${id}-menu-${encodeURIComponent(JSON.stringify(path))}`,
    itemId: path => `${id}-item-${encodeURIComponent(JSON.stringify(path))}` };
}

/**
 * Own one open path at every depth while deferring root expansion to controlled consumers.
 **/
export function useMenu(props: MenuProps): MenuModel {
  validateMenu(props.items);
  const ids = useMenuIds();
  const root = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null);
  const [stored, setStored] = useState(props.defaultOpen ?? false), [branch, setBranch] = useState<string[]>([]);
  const pending = useRef<FocusRequest | null>(null), search = useRef<MenuSearch>({ menu: '', text: '', time: 0 });
  const change = (open: boolean, restore = false, last = false) => {
    if (props.open === undefined) { setStored(open); } props.onOpenChange?.(open);
    search.current.text = '';
    setBranch([]); pending.current = open ? { id: ids.menuId([]), last } : null; if (restore) { trigger.current!.focus(); }
  };
  const model = { root, trigger, expanded: props.open ?? stored, branch, ...ids, search, change };

  return useMenuBranches(model, { setBranch, pending });
}

/**
 * Toggle a branch or return one level, restoring focus to the exact parent item.
 **/
function useMenuBranches(model: Omit<MenuModel, 'toggle' | 'back'>, state: { setBranch: (path: string[]) => void; pending: RefObject<FocusRequest | null> }): MenuModel {
  const toggle = (path: string[], enter: boolean) => {
    const expanded = model.branch[path.length - 1] === path.at(-1);
    state.setBranch(expanded && !enter ? path.slice(0, -1) : path);
    if (!expanded || enter) { state.pending.current = { id: model.menuId(path), last: false }; }
  };
  const back = (path: string[]) => { state.setBranch(path.slice(0, -1)); document.getElementById(model.itemId(path))!.focus(); };
  const result = { ...model, toggle, back };
  useEffect(() => { if (!model.expanded && model.branch.length) { state.setBranch([]); } }, [model.expanded, model.branch, state.setBranch]);
  useMenuFocus(result, state.pending);
  useOutsideMenu(result);

  return result;
}
