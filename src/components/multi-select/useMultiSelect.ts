import { useEffect, useId, useRef, useState, type RefObject, type KeyboardEvent } from 'react';
import { filterLabels, nextActive, selectedOptions, selectionError, unavailable, validateSelection } from './multiselect-policy.js';
import type { MultiSelectOption, MultiSelectProps } from './types.js';

/**
 * Connect native form reset and custom validity to selected values rather than query text.
 **/
function useFormSelection(input: React.RefObject<HTMLInputElement | null>, error: string, reset: () => void) {
  useEffect(() => { input.current!.setCustomValidity(error); }, [input, error]);
  useEffect(() => {
    const form = input.current!.form;
    const onReset = (event: Event) => { queueMicrotask(() => { if (!event.defaultPrevented) { reset(); } }); };
    form?.addEventListener('reset', onReset);
    return () => form?.removeEventListener('reset', onReset);
  }, [input, reset]);
}

/**
 * Keep the active option visible when keyboard navigation scrolls a long popup.
 **/
function useActiveScroll(id: string | undefined) {
  useEffect(() => { if (id) { document.getElementById(id)?.scrollIntoView?.({ block: 'nearest' }); } }, [id]);
}

/**
 * Store transient search/navigation state separately from the selected form values.
 **/
function useSearchState(props: MultiSelectProps): SearchState {
  const input = useRef<HTMLInputElement>(null);
  const generatedId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeValue, setActiveValue] = useState<string | null>(null);
  const id = props.id ?? generatedId;
  const expanded = open && !props.disabled && !props.readOnly;

  return { input, id, query, setQuery, expanded, setOpen, activeValue, setActiveValue };
}

/**
 * Keep selection authoritative for controlled parents and restore the mount defaults on reset.
 **/
function useSelectedValues(props: MultiSelectProps): SelectedValues {
  const [stored, setStored] = useState<readonly string[]>(props.defaultValue ?? []);
  const initial = useRef(stored);
  const selected = props.value ?? stored;
  validateSelection(props, selected);
  const commit = (values: readonly string[]) => {
    if (props.value === undefined) { setStored(values); }
    props.onValueChange?.([...values]);
  };

  return { selected, commit, restore: () => setStored(initial.current) };
}

interface SearchState {
  input: RefObject<HTMLInputElement | null>; id: string; query: string;
  setQuery: (query: string) => void; expanded: boolean; setOpen: (open: boolean) => void;
  activeValue: string | null; setActiveValue: (value: string | null) => void;
}
interface SelectedValues { selected: readonly string[]; commit: (values: readonly string[]) => void; restore: () => void }
interface SelectionActions { remove: (value: string) => void; toggle: (option: MultiSelectOption) => void; clear: () => void }
interface NavigationModel {
  filtered: readonly MultiSelectOption[]; navigable: MultiSelectOption[]; active: MultiSelectOption | undefined;
  optionId: (value: string) => string; activeId: string | undefined;
}
export interface MultiSelectModel extends SearchState, SelectedValues, SelectionActions, NavigationModel {
  error: string; choices: MultiSelectOption[];
}

/**
 * Apply additions/removals while preserving explicitly disabled selections.
 **/
function selectionActions(props: MultiSelectProps, state: SearchState, values: SelectedValues): SelectionActions {
  const { selected, commit } = values;
  const remove = (value: string) => { commit(selected.filter(item => item !== value)); state.input.current!.focus(); };
  const toggle = (option: MultiSelectOption) => {
    if (unavailable(option, selected, props.maxSelections)) { return; }
    commit(selected.includes(option.value) ? selected.filter(value => value !== option.value) : [...selected, option.value]);
    state.setQuery('');
    state.setActiveValue(option.value);
  };
  const clear = () => { commit(selected.filter(value => props.options.find(option => option.value === value)?.disabled)); state.input.current!.focus(); };

  return { remove, toggle, clear };
}

/**
 * Resolve the filtered navigation target without moving keyboard focus from the search input.
 **/
function navigationModel(props: MultiSelectProps, state: SearchState): NavigationModel {
  const filtered = (props.filterOptions ?? filterLabels)(props.options, state.query);
  const navigable = filtered.filter(option => !option.disabled);
  const active = navigable.find(option => option.value === state.activeValue) ?? navigable[0];
  const optionId = (value: string) => `${state.id}-option-${encodeURIComponent(value)}`;
  const activeId = state.expanded && !props.loading && active ? optionId(active.value) : undefined;

  return { filtered, navigable, active, optionId, activeId };
}

/**
 * Combine the form-selection and search models with native reset and active-option scrolling.
 **/
export function useMultiSelect(props: MultiSelectProps): MultiSelectModel {
  const state = useSearchState(props);
  const values = useSelectedValues(props);
  const navigation = navigationModel(props, state);
  const error = selectionError(props, values.selected.length);
  const reset = () => { values.restore(); state.setQuery(''); state.setOpen(false); state.setActiveValue(null); };
  useFormSelection(state.input, error, reset);
  useActiveScroll(navigation.activeId);

  return { ...state, ...values, ...navigation, ...selectionActions(props, state, values), error, choices: selectedOptions(props.options, values.selected) };
}


/**
 * Apply composite keyboard actions without replacing text-editing or composition behavior.
 **/
export function selectionKey(event: KeyboardEvent<HTMLInputElement>, model: MultiSelectModel, props: MultiSelectProps): void {
  if (event.defaultPrevented || event.nativeEvent.isComposing || props.readOnly || props.disabled) { return; }
  const { key } = event;
  if (['ArrowDown', 'ArrowUp'].includes(key) || model.expanded && ['Home', 'End'].includes(key)) {
    event.preventDefault(); model.setActiveValue(nextActive(model.navigable.map(option => option.value), model.active?.value ?? null, key, model.expanded)); model.setOpen(true); return;
  }
  if (key === 'Escape' || key === 'Tab') { model.setOpen(false); return; }
  if (key === 'Enter' && model.expanded && model.active && !props.loading) { event.preventDefault(); model.toggle(model.active); }
  if (key === 'Backspace' && !model.query) {
    const last = [...model.choices].reverse().find(option => !option.disabled);
    if (last) { event.preventDefault(); model.remove(last.value); }
  }
}
