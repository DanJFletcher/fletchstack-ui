import { useEffect, useRef, useState } from 'react';
import type { ComboboxProps } from './types.js';
import { validateCombobox } from './combobox-policy.js';

export interface ComboboxSelection {
  selected: string;
  query: string;
  filter: string;
  edit: (query: string) => void;
  commit: (value: string) => void;
  escape: () => void;
  reset: () => void;
}

/**
 * Separate a nullable draft from committed labels; editing immediately detaches submitted selection.
 **/
export function useComboboxSelection(props: ComboboxProps): ComboboxSelection {
  const [stored, setStored] = useState(props.defaultValue ?? '');
  const initial = useRef(stored);
  const [draft, setDraft] = useState<string | null>(null);
  const value = props.value ?? stored;
  validateCombobox(props.options, value);
  useEffect(() => {
    if (value) {
      setDraft(null);
    }
  }, [value]);
  const commit = (next: string) => {
    if (props.value === undefined) {
      setStored(next);
    }
    props.onValueChange?.(next);
  };
  const selected = draft === null ? value : '';
  const query = draft ?? props.options.find((option) => option.value === value)?.label ?? '';

  return {
    selected,
    query,
    filter: draft ?? '',
    edit: (text) => {
      setDraft(text);
      if (selected) {
        commit('');
      }
    },
    commit: (next) => {
      setDraft(null);
      commit(next);
    },
    escape: () => setDraft(selected ? null : ''),
    reset: () => {
      setStored(initial.current);
      setDraft(null);
    },
  };
}
