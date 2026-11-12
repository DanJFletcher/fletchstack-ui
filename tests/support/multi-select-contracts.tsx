import { createRef, useState, type ReactElement } from 'react';
import { fireEvent, screen, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MultiSelect } from '../../src/components/multi-select/MultiSelect';
import { filterLabels, nextActive, selectedOptions, selectionError, unavailable, validateSelection } from '../../src/components/multi-select/multiselect-policy';

const options = [{ value: 'react', label: 'React' }, { value: 'disabled', label: 'Archived', disabled: true }, { value: 'design', label: 'Design systems' }, { value: 'product', label: 'Product design' }];
const base = { label: 'Topics', options };
type Mount = (element: ReactElement) => unknown;

/**
 * Exercise the public component contract through either a fresh DOM mount or SSR hydration.
 **/
export function multiSelectContracts(mount: Mount) {
  describe('MultiSelect selection and form contract', () => {
    it('forwards its search input ref and native attributes', () => {
      // arrange
      const ref = createRef<HTMLInputElement>();
      // act
      mount(<MultiSelect {...base} ref={ref} id="topics" title="Choose topics" size="large" className="consumer" wrapperClassName="wrapper" helperText="Help" aria-describedby="external" />);
      // assert
      expect(ref.current).toBe(screen.getByRole('combobox', { name: 'Topics' }));
      expect(ref.current).toHaveAttribute('title', 'Choose topics');
      expect(ref.current).toHaveAttribute('aria-describedby', 'external topics-help');
    });
    it('filters visible labels without losing selected tags', () => {
      // arrange
      mount(<MultiSelect {...base} defaultValue={['react']} />);
      // act
      fireEvent.change(screen.getByRole('combobox'), { target: { value: ' DES ' } });
      // assert
      expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['Design systems', 'Product design']);
      expect(screen.getByRole('button', { name: 'Remove React' })).toBeEnabled();
    });
    it('uses the caller matching policy', () => {
      // arrange
      mount(<MultiSelect {...base} filterOptions={(items, query) => items.filter(item => item.value === query)} />);
      // act
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'react' } });
      // assert
      expect(screen.getAllByRole('option')).toHaveLength(1);
    });
    it('adds an option through pointer selection while preserving focus', () => {
      // arrange
      const onValueChange = vi.fn();
      mount(<MultiSelect {...base} onValueChange={onValueChange} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.click(screen.getByRole('option', { name: 'React' }));
      // assert
      expect(onValueChange).toHaveBeenCalledWith(['react']);
      expect(screen.getByRole('option', { name: 'React' })).toHaveAttribute('aria-selected', 'true');
    });
    it('toggles an existing selection off', () => {
      // arrange
      mount(<MultiSelect {...base} defaultValue={['react']} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.click(screen.getByRole('option', { name: 'React' }));
      // assert
      expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
    });
    it('removes a tag with its named button', () => {
      // arrange
      mount(<MultiSelect {...base} defaultValue={['react']} removeLabel={option => `Delete ${option.label}`} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Delete React' }));
      // assert
      expect(screen.queryByRole('button', { name: 'Delete React' })).not.toBeInTheDocument();
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
    it('clears only selections that are not explicitly disabled', () => {
      // arrange
      mount(<MultiSelect {...base} defaultValue={['react', 'disabled']} clearLabel="Erase choices" />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Erase choices' }));
      // assert
      expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove Archived' })).toBeDisabled();
    });
    it('can hide the clear button', () => {
      // arrange
      // act
      mount(<MultiSelect {...base} defaultValue={['react']} allowClear={false} />);
      // assert
      expect(screen.queryByRole('button', { name: 'Clear selections' })).not.toBeInTheDocument();
    });
    it('keeps controlled selection authoritative until the parent changes it', () => {
      // arrange
      const changed = vi.fn();
      mount(<MultiSelect {...base} value={['react']} onValueChange={changed} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Clear selections' }));
      // assert
      expect(changed).toHaveBeenCalledWith([]);
      expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    });
    it('reflects controlled updates', () => {
      // arrange
      mount(<ControlledFixture />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Remove React' }));
      // assert
      expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
    });
    it('submits repeated selected values without submitting query text', () => {
      // arrange
      mount(<form aria-label="Editor"><MultiSelect {...base} name="topics" defaultValue={['react', 'design']} /></form>);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'product' } });
      // act
      const result = new FormData(screen.getByRole('form') as HTMLFormElement).getAll('topics');
      // assert
      expect(result).toEqual(['react', 'design']);
    });
    it('restores mount defaults on native form reset', async () => {
      // arrange
      mount(<form aria-label="Editor"><MultiSelect {...base} name="topics" defaultValue={['react']} /><button type="reset">Reset</button></form>);
      fireEvent.click(screen.getByRole('button', { name: 'Clear selections' }));
      // act
      await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Reset' })); });
      // assert
      expect(screen.getByRole('button', { name: 'Remove React' })).toBeInTheDocument();
    });
    it('respects a cancelled native reset', async () => {
      // arrange
      mount(<form onReset={event => event.preventDefault()}><MultiSelect {...base} defaultValue={['react']} /><button type="reset">Reset</button></form>);
      fireEvent.click(screen.getByRole('button', { name: 'Clear selections' }));
      // act
      await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Reset' })); });
      // assert
      expect(screen.queryByRole('button', { name: 'Remove React' })).not.toBeInTheDocument();
    });
    it('keeps a required field invalid when only query text is present', () => {
      // arrange
      mount(<MultiSelect {...base} required />);
      // act
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'React' } });
      // assert
      expect(screen.getByRole('combobox')).toBeInvalid();
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Select at least 1 option.');
    });
    it('clears minimum invalidity once sufficient options are selected', () => {
      // arrange
      mount(<MultiSelect {...base} minSelections={1} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
      // assert
      expect(screen.getByRole('combobox')).toBeValid();
    });
    it('shows the localized minimum error', () => {
      // arrange
      // act
      mount(<MultiSelect {...base} minSelections={2} minSelectionsMessage={count => `Choose ${count} topics`} />);
      // assert
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Choose 2 topics');
    });
    it('preserves explicit error precedence', () => {
      // arrange
      // act
      mount(<MultiSelect {...base} required error="Unsupported topics." />);
      // assert
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Unsupported topics.');
    });
    it('announces the maximum and prevents new selections', () => {
      // arrange
      mount(<MultiSelect {...base} defaultValue={['react']} maxSelections={1} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.click(screen.getByRole('option', { name: 'Design systems' }));
      // assert
      expect(screen.queryByRole('button', { name: 'Remove Design systems' })).not.toBeInTheDocument();
      expect(screen.getByText('1 of 1 selected. Remove a selection to choose another.')).toBeVisible();
    });
    it('localizes a zero-capacity status', () => {
      // arrange
      // act
      mount(<MultiSelect {...base} maxSelections={0} maxSelectionsMessage={count => `Capacity ${count}`} />);
      // assert
      expect(screen.getByText('Capacity 0')).toBeVisible();
    });
    it('retains controlled selections above a new maximum', () => {
      // arrange
      // act
      mount(<MultiSelect {...base} value={['react', 'design']} maxSelections={1} />);
      // assert
      expect(screen.getByRole('button', { name: 'Remove Design systems' })).toBeEnabled();
    });
    it.each([{ props: { disabled: true }, disabled: true }, { props: { readOnly: true }, disabled: false }])('prevents edits for $props', ({ props, disabled }) => {
      // arrange
      mount(<MultiSelect {...base} {...props} defaultValue={['react']} />);
      // act
      fireEvent.focus(screen.getByRole('combobox'));
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' });
      // assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove React' })).toBeDisabled();
      expect((screen.getByRole('combobox') as HTMLInputElement).disabled).toBe(disabled);
    });
    it('keeps pending selected values while options load', () => {
      // arrange
      mount(<MultiSelect label="Topics" options={[]} defaultValue={['pending']} loading />);
      // act
      fireEvent.focus(screen.getByRole('combobox'));
      // assert
      expect(screen.getByRole('button', { name: 'Remove pending' })).toBeEnabled();
      expect(screen.getByText('Loading options…')).toBeVisible();
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
    });
    it('localizes loading text', () => {
      // arrange
      mount(<MultiSelect {...base} loading loadingMessage="Fetching topics" />);
      // act
      fireEvent.focus(screen.getByRole('combobox'));
      // assert
      expect(screen.getByText('Fetching topics')).toBeVisible();
    });
    it.each([undefined, 'Nothing found'])('renders empty text $0 without an active target', message => {
      // arrange
      mount(<MultiSelect label="Topics" options={[]} {...(message ? { noResultsMessage: message } : {})} />);
      // act
      fireEvent.focus(screen.getByRole('combobox'));
      // assert
      expect(screen.getByText(message ?? 'No matching options.')).toBeVisible();
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
    });
  });
  multiSelectNativeContracts(mount);
  keyboardContracts(mount);
  policyContracts();
}

/**
 * Provide a controlled parent for the selection authority contract.
 **/
function ControlledFixture() {
  const [value, setValue] = useState<readonly string[]>(['react']);
  return <MultiSelect {...base} value={value} onValueChange={setValue} />;
}

/**
 * Verify focus, navigation and text-editing behavior at the DOM boundary.
 **/
function keyboardContracts(mount: Mount) {
  describe('MultiSelect keyboard contract', () => {
    it.each([
      { keys: ['ArrowDown'], expected: 'design' }, { keys: ['End'], expected: 'product' },
      { keys: ['End', 'ArrowDown'], expected: 'react' }, { keys: ['ArrowUp'], expected: 'product' },
      { keys: ['End', 'Home'], expected: 'react' },
    ])('moves $keys to $expected while skipping explicitly disabled options', ({ keys, expected }) => {
      // arrange
      mount(<MultiSelect {...base} id="topics" />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      keys.forEach(key => fireEvent.keyDown(screen.getByRole('combobox'), { key }));
      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', `topics-option-${expected}`);
    });
    it.each(['ArrowDown', 'ArrowUp'])('reopens with $0 at the correct boundary', key => {
      // arrange
      mount(<MultiSelect {...base} id="topics" />);
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key });
      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', key === 'ArrowDown' ? 'topics-option-react' : 'topics-option-product');
    });
    it.each(['Escape', 'Tab'])('closes on $0 without trapping focus', key => {
      // arrange
      mount(<MultiSelect {...base} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key });
      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
    it('closes when focus leaves the composite', () => {
      // arrange
      mount(<MultiSelect {...base} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.blur(screen.getByRole('combobox'), { relatedTarget: document.body });
      // assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('keeps the popup open when focus moves to a tag button', () => {
      // arrange
      mount(<MultiSelect {...base} defaultValue={['react']} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.blur(screen.getByRole('combobox'), { relatedTarget: screen.getByRole('button', { name: 'Remove React' }) });
      // assert
      expect(screen.getByRole('listbox')).toBeVisible();
    });
    it('removes the last enabled tag on empty Backspace', () => {
      // arrange
      mount(<MultiSelect {...base} defaultValue={['react', 'design', 'disabled']} />);
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' });
      // assert
      expect(screen.queryByRole('button', { name: 'Remove Design systems' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remove Archived' })).toBeDisabled();
    });
    it.each([{ defaultValue: [] }, { defaultValue: ['disabled'] }])('leaves immutable or empty selections unchanged on Backspace: $defaultValue', ({ defaultValue }) => {
      // arrange
      const change = vi.fn();
      mount(<MultiSelect {...base} defaultValue={defaultValue} onValueChange={change} />);
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' });
      // assert
      expect(change).not.toHaveBeenCalled();
    });
    it('lets Backspace edit a nonempty query', () => {
      // arrange
      const change = vi.fn();
      mount(<MultiSelect {...base} defaultValue={['react']} onValueChange={change} />);
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'x' } });
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Backspace' });
      // assert
      expect(change).not.toHaveBeenCalled();
    });
    it.each([{ loading: true }, { options: [] }])('does not select a missing or loading target: $0', props => {
      // arrange
      const change = vi.fn();
      mount(<MultiSelect {...base} {...props} onValueChange={change} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
      // assert
      expect(change).not.toHaveBeenCalled();
    });
    it('does not select when the popup is closed', () => {
      // arrange
      const change = vi.fn();
      mount(<MultiSelect {...base} onValueChange={change} />);
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
      // assert
      expect(change).not.toHaveBeenCalled();
    });
    it('respects a parent key handler that prevents default', () => {
      // arrange
      mount(<MultiSelect {...base} onKeyDown={event => event.preventDefault()} />);
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
    it('leaves IME composition keys alone', () => {
      // arrange
      mount(<MultiSelect {...base} />);
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown', isComposing: true });
      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
    it('preserves search focus during pointer option activation', () => {
      // arrange
      mount(<MultiSelect {...base} />);
      fireEvent.focus(screen.getByRole('combobox'));
      // act
      const result = fireEvent.mouseDown(screen.getByRole('option', { name: 'React' }));
      // assert
      expect(result).toBe(false);
    });
    it('scrolls the active option into view when supported', () => {
      // arrange
      const scroll = vi.fn();
      const previous = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = scroll;
      mount(<MultiSelect {...base} />);
      // act
      fireEvent.focus(screen.getByRole('combobox'));
      Element.prototype.scrollIntoView = previous;
      // assert
      expect(scroll).toHaveBeenCalledWith({ block: 'nearest' });
    });
  });
}

/**
 * Cover rejected configurations and policy boundaries independently of DOM mechanics.
 **/
function policyContracts() {
  describe('MultiSelect configuration policy', () => {
    it.each([
      { minSelections: -1 }, { maxSelections: 1.5 }, { minSelections: Number.NaN },
      { minSelections: 2, maxSelections: 1 }, { required: true, maxSelections: 0 },
      { options: [{ value: 'a', label: 'A' }, { value: 'a', label: 'B' }] },
    ])('rejects ambiguous or impossible configuration $0', props => {
      // arrange
      const given = { ...base, ...props };
      // act
      const result = () => validateSelection(given, []);
      // assert
      expect(result).toThrow(Error);
    });
    it.each([{ selected: ['react', 'react'] }, { selected: ['missing'] }])('rejects invalid selected values $selected', ({ selected }) => {
      // arrange
      // act
      const result = () => validateSelection(base, selected);
      // assert
      expect(result).toThrow(Error);
    });
    it('permits unknown selected values during loading', () => {
      // arrange
      // act
      const result = validateSelection({ ...base, loading: true }, ['pending']);
      // assert
      expect(result).toBeUndefined();
    });
    it('retains literal missing labels while loading', () => {
      // arrange
      // act
      const result = selectedOptions([], ['pending']);
      // assert
      expect(result).toEqual([{ value: 'pending', label: 'pending' }]);
    });
    it('matches label substrings case insensitively', () => {
      // arrange
      // act
      const result = filterLabels(options, ' REACT ');
      // assert
      expect(result).toEqual([{ value: 'react', label: 'React' }]);
    });
    it('uses plural default minimum validation', () => {
      // arrange
      // act
      const result = selectionError({ ...base, minSelections: 2 }, 0);
      // assert
      expect(result).toBe('Select at least 2 options.');
    });
    it('keeps selected options removable at the maximum', () => {
      // arrange
      // act
      const result = unavailable(options[0]!, ['react'], 1);
      // assert
      expect(result).toBe(false);
    });
    it.each([
      { values: [], active: null, key: 'ArrowDown', open: true, expected: null },
      { values: ['a', 'b'], active: null, key: 'ArrowDown', open: true, expected: 'b' },
      { values: ['a', 'b'], active: 'missing', key: 'ArrowUp', open: true, expected: 'b' },
    ])('resolves navigation for $0', ({ values, active, key, open, expected }) => {
      // arrange
      // act
      const result = nextActive(values, active, key, open);
      // assert
      expect(result).toBe(expected);
    });
  });
}

/**
 * Verify native integration details that must survive both mount and hydration.
 **/
export function multiSelectNativeContracts(mount: Mount) {
  describe('MultiSelect native interoperability', () => {
    it.each(['small', 'medium', 'large'] as const)('renders the %s geometry and custom properties', size => {
      // arrange
      // act
      mount(<MultiSelect {...base} size={size} className="custom-control" style={{ '--fs-multi-select-radius': '8px' }} wrapperClassName="custom-field" wrapperStyle={{ width: '240px' }} />);
      // assert
      expect(screen.getByRole('combobox').closest('.fs-multi-select')).toHaveClass(`fs-multi-select--${size}`, 'custom-field');
      expect(screen.getByRole('combobox').parentElement).toHaveClass('custom-control');
      expect(screen.getByRole('combobox').parentElement).toHaveStyle('--fs-multi-select-radius: 8px');
    });
    it('composes native focus and blur callbacks', () => {
      // arrange
      const focus = vi.fn();
      const blur = vi.fn();
      mount(<MultiSelect {...base} onFocus={focus} onBlur={blur} />);
      // act
      fireEvent.focus(screen.getByRole('combobox'));
      fireEvent.blur(screen.getByRole('combobox'));
      // assert
      expect(focus).toHaveBeenCalledOnce();
      expect(blur).toHaveBeenCalledOnce();
    });
    it('honors an explicit valid aria state without invalid paint', () => {
      // arrange
      // act
      mount(<MultiSelect {...base} aria-invalid="false" />);
      // assert
      expect(screen.getByRole('combobox').parentElement).toHaveAttribute('data-invalid', 'false');
    });
    it('protects composite ownership from untyped props', () => {
      // arrange
      const unsafe = { role: 'button', type: 'password', 'aria-label': 'Wrong name', list: 'wrong-list', children: 'Wrong content', dangerouslySetInnerHTML: { __html: 'Wrong markup' } } as unknown as Partial<Parameters<typeof MultiSelect>[0]>;
      // act
      mount(<MultiSelect {...base} {...unsafe} />);
      // assert
      expect(screen.getByRole('combobox', { name: 'Topics' })).toHaveAttribute('type', 'text');
      expect(screen.getByRole('combobox')).not.toHaveAttribute('list');
      expect(screen.queryByText('Wrong content')).not.toBeInTheDocument();
    });
    it('associates repeated hidden values with an external form', () => {
      // arrange
      mount(<><form id="external" aria-label="External" /><MultiSelect {...base} form="external" name="topics" defaultValue={['react']} /></>);
      // act
      const result = new FormData(screen.getByRole('form') as HTMLFormElement).getAll('topics');
      // assert
      expect(result).toEqual(['react']);
    });
    it('excludes disabled values from form submission', () => {
      // arrange
      mount(<form aria-label="Editor"><MultiSelect {...base} disabled name="topics" defaultValue={['react']} /></form>);
      // act
      const result = new FormData(screen.getByRole('form') as HTMLFormElement).getAll('topics');
      // assert
      expect(result).toEqual([]);
    });
    it('allows a loading selection without an option to be cleared', () => {
      // arrange
      mount(<MultiSelect label="Topics" options={[]} loading defaultValue={['pending']} />);
      // act
      fireEvent.click(screen.getByRole('button', { name: 'Clear selections' }));
      // assert
      expect(screen.queryByRole('button', { name: 'Remove pending' })).not.toBeInTheDocument();
    });
    it('keeps keyboard opening safe when every option is disabled', () => {
      // arrange
      mount(<MultiSelect label="Topics" options={[{ value: 'fixed', label: 'Fixed', disabled: true }]} />);
      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
    });
  });
}
