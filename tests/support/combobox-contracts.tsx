import { createRef, useState, type ReactElement } from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Combobox } from '../../src/components/combobox/Combobox';

const options = [{ value: 'gb', label: 'United Kingdom' }, { value: 'closed', label: 'Unavailable', disabled: true }, { value: 'us', label: 'United States' }, { value: 'ca', label: 'Canada' }];
const base = { label: 'Region', options };

/**
 * Apply the same observable field contract to fresh client rendering and server hydration.
 **/
export function comboboxContracts(mount: (element: ReactElement) => unknown) {
  describe('Combobox', () => {
    it('starts empty with a native label and collapsed popup', () => {
      // arrange

      // act
      mount(<Combobox {...base} />);

      // assert
      expect(screen.getByRole('combobox', { name: 'Region' })).toHaveValue('');
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('opens all choices on focus', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />);

      // act
      await user.tab();

      // assert
      expect(screen.getAllByRole('option')).toHaveLength(4);
      expect(screen.getByRole('listbox', { name: 'Region' })).toHaveAttribute('id', screen.getByRole('combobox').getAttribute('aria-controls'));
    });
    it('filters visible labels case insensitively', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />);

      // act
      await user.type(screen.getByRole('combobox'), 'UNI');

      // assert
      expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['United Kingdom', 'United States']);
    });
    it('commits a pointer choice as its full label while retaining focus', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox'));

      // act
      await user.click(screen.getByRole('option', { name: 'United Kingdom' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('United Kingdom');
      expect(screen.getByRole('combobox')).toHaveFocus();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('submits the selected identity instead of the visible label', () => {
      // arrange
      mount(<form aria-label="Regions"><Combobox {...base} name="region" defaultValue="gb" /></form>);

      // act
      const result = new FormData(screen.getByRole('form') as HTMLFormElement).get('region');

      // assert
      expect(result).toBe('gb');
    });
    it('removes the successful form entry immediately when editing', async () => {
      // arrange
      const user = userEvent.setup(); mount(<form aria-label="Regions"><Combobox {...base} name="region" defaultValue="gb" /></form>);

      // act
      await user.type(screen.getByRole('combobox'), 'x');

      // assert
      expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('region')).toBe(false);
    });
    it('clears the selection with a localized button and restores input focus', async () => {
      // arrange
      const user = userEvent.setup(); const change = vi.fn(); mount(<Combobox {...base} defaultValue="gb" clearLabel="Effacer" onValueChange={change} />);

      // act
      await user.click(screen.getByRole('button', { name: 'Effacer' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue(''); expect(screen.getByRole('combobox')).toHaveFocus();
      expect(change).toHaveBeenCalledExactlyOnceWith('');
    });
    it('can suppress the clear action', () => {
      // arrange

      // act
      mount(<Combobox {...base} defaultValue="gb" allowClear={false} />);

      // assert
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    it('keeps the clear action in normal keyboard tab order', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} defaultValue="gb" />); await user.click(screen.getByRole('combobox'));

      // act
      await user.tab();

      // assert
      expect(screen.getByRole('button', { name: 'Clear selection' })).toHaveFocus();
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('does not commit when moving the highlight', async () => {
      // arrange
      const user = userEvent.setup(); const change = vi.fn(); mount(<Combobox {...base} value="gb" onValueChange={change} />); await user.click(screen.getByRole('combobox'));

      // act
      await user.keyboard('{ArrowDown}');

      // assert
      expect(change).not.toHaveBeenCalled(); expect(screen.getByRole('combobox')).toHaveValue('United Kingdom');
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'United States' }).id);
    });
    it.each([['{End}{Enter}', 'Canada'], ['{End}{Home}{Enter}', 'United Kingdom'], ['{ArrowDown}{Enter}', 'United States'], ['{ArrowUp}{Enter}', 'Canada']])('commits keyboard sequence %s', async (keys, label) => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox'));

      // act
      await user.keyboard(keys);

      // assert
      expect(screen.getByRole('combobox')).toHaveValue(label);
    });
    it('opens a closed popup at the last choice with ArrowUp', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox')); await user.keyboard('{Escape}');

      // act
      await user.keyboard('{ArrowUp}{Enter}');

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('Canada');
    });
    it('restores the committed label on Escape after highlighting', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} defaultValue="gb" />); await user.click(screen.getByRole('combobox')); await user.keyboard('{End}');

      // act
      await user.keyboard('{Escape}');

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('United Kingdom'); expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('discards an uncommitted query on Escape without restoring a cleared selection', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} defaultValue="gb" />); await user.type(screen.getByRole('combobox'), 'x');

      // act
      await user.keyboard('{Escape}');

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
    it('closes on Tab without preventing normal form navigation', async () => {
      // arrange
      const user = userEvent.setup(); mount(<><Combobox {...base} /><button>Next</button></>); await user.click(screen.getByRole('combobox'));

      // act
      await user.tab();

      // assert
      expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus(); expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('closes when clicking elsewhere', async () => {
      // arrange
      const user = userEvent.setup(); mount(<><Combobox {...base} /><button>Outside</button></>); await user.click(screen.getByRole('combobox'));

      // act
      await user.click(screen.getByRole('button', { name: 'Outside' }));

      // assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('refuses disabled pointer choices', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox'));

      // act
      await user.click(screen.getByRole('option', { name: 'Unavailable' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue(''); expect(screen.getByRole('option', { name: 'Unavailable' })).toHaveAttribute('aria-disabled', 'true');
    });
    it('tracks the enabled row under the pointer without committing', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox'));

      // act
      fireEvent.mouseMove(screen.getByRole('option', { name: 'Canada' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Canada' }).id); expect(screen.getByRole('combobox')).toHaveValue('');
    });
    it('does not highlight a disabled row on pointer movement', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox'));

      // act
      fireEvent.mouseMove(screen.getByRole('option', { name: 'Unavailable' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'United Kingdom' }).id);
    });
    it.each([{ loading: true }, { loading: true, loadingMessage: 'Fetching regions' }])('announces loading once without selectable rows: %j', async extra => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} {...extra} />);

      // act
      await user.click(screen.getByRole('combobox'));

      // assert
      expect(screen.getAllByRole('status')).toHaveLength(1); expect(screen.getByRole('status')).toHaveTextContent(extra.loadingMessage ?? 'Loading options…');
      expect(screen.queryByRole('option')).not.toBeInTheDocument(); expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
    });
    it.each([{}, { noResultsMessage: 'Nothing found' }])('announces no results after filtering: %j', async extra => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} {...extra} />);

      // act
      await user.type(screen.getByRole('combobox'), 'xyz{ArrowDown}{Enter}');

      // assert
      expect(screen.getByRole('status')).toHaveTextContent(extra.noResultsMessage ?? 'No matching options.'); expect(screen.getByRole('combobox')).toHaveValue('xyz');
    });
    it('supports custom filtering and ordering by option values', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} filterOptions={(items, query) => items.filter(option => option.value.startsWith(query)).reverse()} />);

      // act
      await user.type(screen.getByRole('combobox'), 'g');

      // assert
      expect(screen.getAllByRole('option').map(option => option.textContent)).toEqual(['United Kingdom']);
    });
    it('requires an explicit option choice even when the typed text matches its label', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} required />);

      // act
      await user.type(screen.getByRole('combobox'), 'United Kingdom');

      // assert
      expect(screen.getByRole('combobox')).toBeInvalid();
    });
    it('becomes valid after selecting a required option', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} required />); await user.click(screen.getByRole('combobox'));

      // act
      await user.keyboard('{Enter}');

      // assert
      expect(screen.getByRole('combobox')).toBeValid();
    });
    it('associates local descriptions and errors after external context', () => {
      // arrange

      // act
      mount(<><p id="context">Account region</p><Combobox {...base} id="region" description="Choose your region" error="Choose a region" aria-describedby="context" /></>);

      // assert
      expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Account region Choose your region Choose a region'); expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });
    it('supports invalid paint without creating a native validation message', () => {
      // arrange

      // act
      mount(<Combobox {...base} invalid />);

      // assert
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true'); expect((screen.getByRole('combobox') as HTMLInputElement).validationMessage).toBe('');
    });
    it('retains a disabled score without allowing interaction', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} defaultValue="gb" disabled />);

      // act
      await user.click(screen.getByRole('combobox'));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('United Kingdom'); expect(screen.getByRole('combobox')).toBeDisabled(); expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
    it('keeps readonly fields closed on keyboard interaction', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} defaultValue="gb" readOnly />); await user.click(screen.getByRole('combobox'));

      // act
      await user.keyboard('{ArrowDown}{Enter}');

      // assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument(); expect(screen.getByRole('combobox')).toHaveValue('United Kingdom');
    });
    it('honors a prevented consumer key event', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} onKeyDown={event => event.preventDefault()} />); await user.click(screen.getByRole('combobox'));

      // act
      await user.keyboard('{Enter}');

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
    it('does not commit during IME composition', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox'));

      // act
      fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter', isComposing: true });

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
    it('updates from a controlled parent', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Controlled />); await user.click(screen.getByRole('combobox'));

      // act
      await user.click(screen.getByRole('option', { name: 'Canada' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('Canada');
    });
    it('keeps controlled selection authoritative when a parent rejects a new choice', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} value="gb" />); await user.click(screen.getByRole('combobox'));

      // act
      await user.click(screen.getByRole('option', { name: 'Canada' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('United Kingdom');
    });
    it('removes controlled submission immediately even before the parent acknowledges editing', async () => {
      // arrange
      const user = userEvent.setup(); mount(<form aria-label="Regions"><Combobox {...base} name="region" value="gb" /></form>);

      // act
      await user.type(screen.getByRole('combobox'), 'x');

      // assert
      expect(new FormData(screen.getByRole('form') as HTMLFormElement).has('region')).toBe(false);
    });
    it('resets uncontrolled selection to its initial identity', async () => {
      // arrange
      const user = userEvent.setup(); mount(<form aria-label="Regions"><Combobox {...base} defaultValue="gb" /><button type="reset">Reset</button></form>); await user.type(screen.getByRole('combobox'), 'x');

      // act
      await user.click(screen.getByRole('button', { name: 'Reset' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('United Kingdom');
    });
    it('respects canceled form reset', async () => {
      // arrange
      const user = userEvent.setup(); mount(<form onReset={event => event.preventDefault()}><Combobox {...base} defaultValue="gb" /><button type="reset">Reset</button></form>); await user.type(screen.getByRole('combobox'), 'x');

      // act
      await user.click(screen.getByRole('button', { name: 'Reset' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('United Kingdomx');
    });
    it('associates external form values by form id', () => {
      // arrange
      mount(<><form id="regions" aria-label="Regions" /><Combobox {...base} name="region" form="regions" defaultValue="ca" /></>);

      // act
      const result = new FormData(screen.getByRole('form') as HTMLFormElement).get('region');

      // assert
      expect(result).toBe('ca');
    });
    it('forwards a native input ref', () => {
      // arrange
      const ref = createRef<HTMLInputElement>(); mount(<Combobox {...base} ref={ref} />);

      // act
      act(() => ref.current!.focus());

      // assert
      expect(screen.getByRole('combobox')).toHaveFocus();
    });
    it('uses distinct list and option ids for multiple instances', async () => {
      // arrange
      const user = userEvent.setup(); mount(<><Combobox {...base} label="First" /><Combobox {...base} label="Second" /></>); await user.click(screen.getByRole('combobox', { name: 'First' })); const first = screen.getByRole('option', { name: 'Canada' }).id;

      // act
      await user.click(screen.getByRole('combobox', { name: 'Second' }));

      // assert
      expect(screen.getByRole('option', { name: 'Canada' }).id).not.toBe(first);
    });
    it('clears controlled selection when the parent accepts an edit', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Controlled />);

      // act
      await user.type(screen.getByRole('combobox'), 'x');

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('United Kingdomx');
    });
    it('keeps controlled authority during a native form reset', async () => {
      // arrange
      const user = userEvent.setup(); mount(<form><Combobox {...base} value="ca" defaultValue="gb" /><button type="reset">Reset</button></form>); await user.type(screen.getByRole('combobox'), 'x');

      // act
      await user.click(screen.getByRole('button', { name: 'Reset' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('Canada');
    });
    it('resets an unanswered field to empty after a selection', async () => {
      // arrange
      const user = userEvent.setup(); mount(<form><Combobox {...base} /><button type="reset">Reset</button></form>); await user.click(screen.getByRole('combobox')); await user.keyboard('{Enter}');

      // act
      await user.click(screen.getByRole('button', { name: 'Reset' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
    it('keeps an all-disabled list unselected on Enter', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} options={[{ value: 'closed', label: 'Unavailable', disabled: true }]} />); await user.click(screen.getByRole('combobox'));

      // act
      await user.keyboard('{ArrowDown}{Enter}');

      // assert
      expect(screen.getByRole('combobox')).toHaveValue(''); expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
    });
    it('does not allow a custom filter to replace disabled canonical data', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} filterOptions={() => [{ value: 'closed', label: 'Changed' }]} />); await user.click(screen.getByRole('combobox'));

      // act
      await user.click(screen.getByRole('option', { name: 'Unavailable' }));

      // assert
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
    it('notifies a consumer when the native search input receives focus', async () => {
      // arrange
      const user = userEvent.setup(); const focus = vi.fn(); mount(<Combobox {...base} onFocus={focus} />);

      // act
      await user.tab();

      // assert
      expect(focus).toHaveBeenCalledOnce();
    });
    it('scrolls a keyboard target into the popup viewport when scrolling is supported', async () => {
      // arrange
      const user = userEvent.setup(); mount(<Combobox {...base} />); await user.click(screen.getByRole('combobox'));
      const scroll = vi.fn(); screen.getByRole('option', { name: 'Canada' }).scrollIntoView = scroll;

      // act
      await user.keyboard('{End}');

      // assert
      expect(scroll).toHaveBeenCalledExactlyOnceWith({ block: 'nearest' });
    });
    it.each([{ options: [{ value: '', label: 'Empty' }] }, { options: [{ value: 'a', label: ' ' }] }, { options: [options[0]!, options[0]!] }, { value: 'missing' }, { filterOptions: () => [{ value: 'missing', label: 'Missing' }] }, { filterOptions: () => [options[0]!, options[0]!] }])('rejects ambiguous option data: %j', extra => {
      // arrange
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});

      // act
      const result = () => mount(<Combobox {...base} {...extra} />);

      // assert
      expect(result).toThrow(); error.mockRestore();
    });
  });
}

/**
 * Model the parent accepting both new choices and the empty cleared sentinel.
 **/
function Controlled() {
  const [value, setValue] = useState('gb');
  return <Combobox {...base} value={value} onValueChange={setValue} />;
}
