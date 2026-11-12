import type { MultiSelectOption, MultiSelectProps } from './types.js';

/**
 * Reject ambiguous option/value identities and inconsistent selection limits.
 **/
export function validateSelection(props: MultiSelectProps, selected: readonly string[]): void {
  for (const limit of [props.minSelections, props.maxSelections]) {
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) { throw new Error('Selection limits must be non-negative integers.'); }
  }
  if (Math.max(props.minSelections ?? 0, props.required ? 1 : 0) > (props.maxSelections ?? Infinity)) { throw new Error('minSelections cannot exceed maxSelections.'); }
  const values = props.options.map(option => option.value);
  if (new Set(values).size !== values.length || new Set(selected).size !== selected.length) { throw new Error('Options and selected values must be unique.'); }
  if (!props.loading && selected.some(value => !values.includes(value))) { throw new Error('Selected values must match an option unless loading.'); }
}

/**
 * Match visible labels case-insensitively without treating the query as executable syntax.
 **/
export function filterLabels(options: readonly MultiSelectOption[], query: string): MultiSelectOption[] {
  const normalized = query.trim().toLowerCase();
  return options.filter(option => option.label.toLowerCase().includes(normalized));
}

/**
 * Resolve selected labels, retaining an unavailable value as text during loading.
 **/
export function selectedOptions(options: readonly MultiSelectOption[], values: readonly string[]): MultiSelectOption[] {
  return values.map(value => options.find(option => option.value === value) ?? { value, label: value });
}

/**
 * Derive the native validity message; explicit errors take precedence over minimum validation.
 **/
export function selectionError(props: MultiSelectProps, count: number): string {
  const minimum = Math.max(props.minSelections ?? 0, props.required ? 1 : 0);
  if (props.error) { return props.error; }
  if (count >= minimum) { return ''; }
  const noun = minimum === 1 ? 'option' : 'options';
  return props.minSelectionsMessage?.(minimum) ?? `Select at least ${minimum} ${noun}.`;
}

/**
 * Keep explicitly disabled choices immutable; limits disable additions but allow removals.
 **/
export function unavailable(option: MultiSelectOption, values: readonly string[], maximum: number = Infinity): boolean {
  return Boolean(option.disabled || !values.includes(option.value) && values.length >= maximum);
}

/**
 * Move among navigable options with wrapping and explicit Home/End boundaries.
 **/
export function nextActive(values: readonly string[], active: string | null, key: string, open: boolean): string | null {
  if (values.length === 0) { return null; }
  if (key === 'Home' || !open && key === 'ArrowDown') { return values[0]!; }
  if (key === 'End' || !open && key === 'ArrowUp') { return values.at(-1)!; }
  const index = Math.max(0, values.indexOf(active ?? values[0]!));
  return values[(index + (key === 'ArrowDown' ? 1 : values.length - 1)) % values.length]!;
}
