import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type Dispatch,
  type SetStateAction,
  type RefObject,
} from 'react';
import { findTab, revealTab } from './tabs-dom.js';
import { tabDestination, tabMovement } from './tabs-policy.js';
import type { TabsProps } from './types.js';
import type { TabsSelection } from './useTabsSelection.js';

export interface TabsFocus {
  list: RefObject<HTMLDivElement | null>;
  entry: string | undefined;
  focus: (id: string) => void;
  blur: (event: FocusEvent<HTMLDivElement>) => void;
  key: (event: KeyboardEvent<HTMLDivElement>) => void;
  pointer: RefObject<boolean>;
  inside: RefObject<boolean>;
}

/**
 * Move to one enabled tab without allowing browser focus to scroll page ancestors.
 **/
function moveTab(
  event: KeyboardEvent<HTMLDivElement>,
  props: TabsProps,
  enabled: readonly string[],
): void {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  const list = event.currentTarget;
  const movement = tabMovement(
    event.key,
    props.orientation ?? 'horizontal',
    getComputedStyle(list).direction,
  );
  if (movement === undefined || !enabled.length) {
    return;
  }
  const id = (event.target as HTMLElement).closest<HTMLButtonElement>('[role="tab"]')?.dataset[
    'tabsId'
  ];
  const destination = tabDestination(enabled, id, movement)!;
  event.preventDefault();
  findTab(list, destination).focus({ preventScroll: true });
}

/**
 * Repair only list-owned focus when its active tab disappears or becomes disabled.
 **/
function useFocusRepair(
  model: TabsFocus,
  enabled: readonly string[],
  selected: string | undefined,
  reset: Dispatch<SetStateAction<string | undefined>>,
): void {
  useEffect(() => {
    if (!model.inside.current || (model.entry !== undefined && enabled.includes(model.entry))) {
      return;
    }
    const list = model.list.current!;
    if (selected === undefined) {
      reset(undefined);
      list.focus({ preventScroll: true });
    } else {
      findTab(list, selected).focus({ preventScroll: true });
    }
  });
}

/**
 * Reset the remembered tab when focus leaves the owning list.
 **/
function useRovingEntry(inside: RefObject<boolean>, pointer: RefObject<boolean>) {
  const [focused, setFocused] = useState<string>();
  const blur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }
    inside.current = false;
    pointer.current = false;
    setFocused(undefined);
  };

  return { focused, setFocused, blur };
}

/**
 * Keep roving focus independent from selection and reset list entry after leaving it.
 **/
export function useTabsFocus(
  props: TabsProps,
  selection: TabsSelection,
  enabled: readonly string[],
): TabsFocus {
  const list = useRef<HTMLDivElement>(null),
    pointer = useRef(false),
    inside = useRef(false);
  const { focused, setFocused, blur } = useRovingEntry(inside, pointer);
  const focus = (id: string) => {
    setFocused(id);
    if (props.activationMode !== 'manual' && !pointer.current) {
      selection.select(id);
    }
    if (props.orientation !== 'vertical') {
      revealTab(list.current!, findTab(list.current!, id));
    }
  };
  const model = {
    list,
    pointer,
    inside,
    entry: focused,
    focus,
    blur,
    key: (event: KeyboardEvent<HTMLDivElement>) => moveTab(event, props, enabled),
  };
  useFocusRepair(model, enabled, selection.selected, setFocused);

  return { ...model, entry: enabled.includes(focused!) ? focused : selection.selected };
}
