import { filterLabels } from '../multi-select/multiselect-policy.js';
import type { ComboboxOption, ComboboxProps } from './types.js';

/**
 * Reject ambiguous identities, invisible labels and selections that cannot name a canonical option.
 **/
export function validateCombobox(options: readonly ComboboxOption[], selected: string): void {
  const values = options.map((option) => option.value);
  if (options.some((option) => !option.value.trim() || !option.label.trim())) {
    throw new Error('Combobox options need nonempty values and visible labels.');
  }
  if (new Set(values).size !== values.length) {
    throw new Error('Combobox option values must be unique.');
  }
  if (selected && !values.includes(selected)) {
    throw new Error('Combobox value must match an option.');
  }
}

/**
 * Honor custom matching/order while preserving canonical labels, disabled state and option identity.
 **/
export function comboboxMatches(props: ComboboxProps, query: string): ComboboxOption[] {
  const matches = (props.filterOptions ?? filterLabels)(props.options, query);
  const values = matches.map((option) => option.value);
  if (
    new Set(values).size !== values.length ||
    values.some((value) => !props.options.some((option) => option.value === value))
  ) {
    throw new Error('filterOptions must return unique options from options.');
  }

  return values.map((value) => props.options.find((option) => option.value === value)!);
}
