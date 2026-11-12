import type { ReactElement } from 'react';
import type { MultiSelectModel } from './useMultiSelect.js';
import type { MultiSelectProps } from './types.js';
import { unavailable } from './multiselect-policy.js';

/**
 * Show selected labels with separately named native removal buttons.
 **/
export function SelectionTags({ model, props }: { model: MultiSelectModel; props: MultiSelectProps }): ReactElement {
  return <>{model.choices.map(option => <span className="fs-multi-select__tag" key={option.value}><span>{option.label}</span>
    <button type="button" disabled={props.disabled || props.readOnly || option.disabled} aria-label={props.removeLabel?.(option) ?? `Remove ${option.label}`} onClick={() => model.remove(option.value)}>×</button>
  </span>)}</>;
}

/**
 * Keep focus on the combobox while the multiselectable listbox exposes active/selected state.
 **/
export function SelectionPopup({ model, props }: { model: MultiSelectModel; props: MultiSelectProps }): ReactElement | null {
  if (!model.expanded) { return null; }
  const emptyMessage = model.filtered.length === 0 ? (props.noResultsMessage ?? 'No matching options.') : '';
  const message = props.loading ? (props.loadingMessage ?? 'Loading options…') : emptyMessage;
  return <div className="fs-multi-select__popup"><ul role="listbox" id={`${model.id}-listbox`} aria-labelledby={`${model.id}-label`} aria-multiselectable="true" aria-busy={props.loading}>
    {!props.loading && model.filtered.map(option => <li key={option.value} id={model.optionId(option.value)} role="option" aria-selected={model.selected.includes(option.value)} aria-disabled={unavailable(option, model.selected, props.maxSelections)}
      data-active={model.active?.value === option.value} onMouseDown={event => event.preventDefault()} onClick={() => model.toggle(option)}>{option.label}<span aria-hidden="true">{model.selected.includes(option.value) ? ' ✓' : ''}</span></li>)}
  </ul>{message && <p role="status">{message}</p>}</div>;
}

/**
 * Announce a reached selection cap without removing existing controlled values.
 **/
export function SelectionLimit({ model, props }: { model: MultiSelectModel; props: MultiSelectProps }): ReactElement {
  const reached = props.maxSelections !== undefined && model.selected.length >= props.maxSelections;
  return <span className="fs-multi-select__limit" id={`${model.id}-limit`} role="status">{reached && (props.maxSelectionsMessage?.(props.maxSelections!) ?? `${model.selected.length} of ${props.maxSelections} selected. Remove a selection to choose another.`)}</span>;
}
