import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { nextActive } from '../multi-select/multiselect-policy.js';
import { comboboxMatches } from './combobox-policy.js';
import { useComboboxSelection, type ComboboxSelection } from './useComboboxSelection.js';
import type { ComboboxOption, ComboboxProps } from './types.js';

export interface ComboboxModel extends ComboboxSelection {
  input: RefObject<HTMLInputElement | null>; id: string; expanded: boolean;
  matches: ComboboxOption[]; enabled: string[]; active: ComboboxOption | undefined; activeId: string | undefined;
  optionId: (value: string) => string; setOpen: (open: boolean) => void; setActive: (value: string | null) => void;
  choose: (option: ComboboxOption) => void; clear: () => void;
}

/**
 * Validate the selected identity rather than query text and respect native reset cancellation.
 **/
function useComboboxForm(input: RefObject<HTMLInputElement | null>, message: string, reset: () => void) {
  useEffect(() => { input.current!.setCustomValidity(message); }, [input, message]);
  useEffect(() => {
    const form = input.current!.form;
    const onReset = (event: Event) => { queueMicrotask(() => { if (!event.defaultPrevented && input.current) { reset(); } }); };
    form?.addEventListener('reset', onReset);
    return () => form?.removeEventListener('reset', onReset);
  }, [input, reset]);
}

/**
 * Select only enabled choices, keep input focus and clear without submitting query text.
 **/
function selectionActions(model: Omit<ComboboxModel, 'choose' | 'clear'>): Pick<ComboboxModel, 'choose' | 'clear'> {
  const choose = (option: ComboboxOption) => {
    if (option.disabled) { return; }
    model.commit(option.value); model.setActive(option.value); model.input.current!.focus(); model.setOpen(false);
  };
  const clear = () => { model.edit(''); model.setActive(null); model.input.current!.focus(); model.setOpen(true); };

  return { choose, clear };
}

/**
 * Resolve active descendants without moving focus into the popup or committing highlighted values.
 **/
export function useCombobox(props: ComboboxProps): ComboboxModel {
  const selection = useComboboxSelection(props);
  const input = useRef<HTMLInputElement>(null);
  const generated = useId();
  const [open, setOpen] = useState(false);
  const [highlight, setActive] = useState<string | null>(null);
  const id = props.id ?? generated;
  const expanded = open && !props.disabled && !props.readOnly;
  const matches = comboboxMatches(props, selection.filter);
  const enabled = matches.filter(option => !option.disabled).map(option => option.value);
  const active = props.loading ? undefined : matches.find(option => option.value === (enabled.includes(highlight ?? '') ? highlight : selection.selected) && !option.disabled) ?? matches.find(option => !option.disabled);
  const optionId = (value: string) => `${id}-option-${encodeURIComponent(value)}`;
  const activeId = expanded && active ? optionId(active.value) : undefined;
  return useComboboxEffects(props, { ...selection, input, id, expanded, matches, enabled, active, activeId, optionId, setOpen, setActive });
}

/**
 * Connect form lifecycle and active-row scrolling after deriving the public navigation model.
 **/
function useComboboxEffects(props: ComboboxProps, model: Omit<ComboboxModel, 'choose' | 'clear'>): ComboboxModel {
  const message = props.error || (props.required && !model.selected ? 'Choose an option.' : '');
  useComboboxForm(model.input, message, () => { model.reset(); model.setOpen(false); model.setActive(null); });
  useEffect(() => { if (model.activeId) { document.getElementById(model.activeId)?.scrollIntoView?.({ block: 'nearest' }); } }, [model.activeId]);

  return { ...model, ...selectionActions(model) };
}

/**
 * Preserve native text editing and IME while handling list navigation and explicit commitment.
 **/
export function comboboxKey(event: KeyboardEvent<HTMLInputElement>, model: ComboboxModel, props: ComboboxProps): void {
  if (event.defaultPrevented || event.nativeEvent.isComposing || props.disabled || props.readOnly) { return; }
  if (['ArrowDown', 'ArrowUp'].includes(event.key) || model.expanded && ['Home', 'End'].includes(event.key)) {
    event.preventDefault(); model.setActive(nextActive(model.enabled, model.active?.value ?? null, event.key, model.expanded)); model.setOpen(true); return;
  }
  if (event.key === 'Escape') { event.preventDefault(); model.escape(); model.setOpen(false); }
  if (event.key === 'Tab') { model.setOpen(false); }
  if (event.key === 'Enter' && model.expanded) { event.preventDefault(); if (model.active) { model.choose(model.active); } }
}
