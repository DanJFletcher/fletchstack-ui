import type { ReactElement } from 'react';
import { Spinner } from '../spinner/Spinner.js';
import type { ComboboxModel } from './useCombobox.js';
import type { ComboboxProps } from './types.js';

/**
 * Expose the active descendant while keeping pointer selection and loading feedback outside the tab order.
 **/
export function ComboboxPopup({ model, props }: { model: ComboboxModel; props: ComboboxProps }): ReactElement | null {
  if (!model.expanded) { return null; }
  const emptyMessage = model.matches.length === 0 ? (props.noResultsMessage ?? 'No matching options.') : '';
  const message = props.loading ? (props.loadingMessage ?? 'Loading options…') : emptyMessage;
  return <div className="fs-combobox__popup"><ul role="listbox" id={`${model.id}-listbox`} aria-labelledby={`${model.id}-label`} aria-busy={props.loading}>
    {!props.loading && model.matches.map(option => <li key={option.value} id={model.optionId(option.value)} role="option" aria-selected={model.selected === option.value} aria-disabled={option.disabled}
      data-active={model.active?.value === option.value} onMouseDown={event => event.preventDefault()} onMouseMove={() => { if (!option.disabled) { model.setActive(option.value); } }} onClick={() => model.choose(option)}>{option.label}</li>)}
  </ul>{message && <p role="status">{props.loading && <Spinner decorative size="small" />}{message}</p>}</div>;
}
