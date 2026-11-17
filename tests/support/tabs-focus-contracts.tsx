import { act, fireEvent, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import type { ReactElement } from 'react';
import { Tabs } from '../../src/components/tabs/Tabs';
import type { TabsItem } from '../../src/components/tabs/types';

const items: TabsItem[] = [{ id: 'a', label: 'Alpha', content: 'Alpha text' }, { id: 'b', label: 'Beta', content: 'Beta text' }];

/**
 * Exercise focus ownership and browser-boundary geometry through observable DOM behavior.
 **/
export function tabsFocusContracts(render: (element: ReactElement) => RenderResult) {
  it('exposes vertical pills with full-width presentation', () => {
    // arrange
    const props = { label: 'Workspace', items, variant: 'pills' as const, orientation: 'vertical' as const, fullWidth: true };

    // act
    const view = render(<Tabs {...props} />);

    // assert
    expect(view.container.firstChild).toHaveClass('fs-tabs--pills', 'fs-tabs--vertical', 'fs-tabs--full-width');
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });
  it('moves focus from the programmatic list target to the first enabled tab', () => {
    // arrange
    render(<Tabs label="Workspace" items={items} />);

    // act
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'Home' });

    // assert
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  afterEach(() => vi.restoreAllMocks());
  it.each(['remove', 'disable'])('repairs focused tab after %s', operation => {
    // arrange
    const view = render(<Tabs label="Workspace" items={items} />);
    act(() => screen.getByRole('tab', { name: 'Beta' }).focus());
    const next = operation === 'remove' ? [items[0]!] : [items[0]!, { ...items[1]!, disabled: true }];

    // act
    view.rerender(<Tabs label="Workspace" items={next} />);

    // assert
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  it('retains a programmatic list target when its final enabled tab disappears', () => {
    // arrange
    const view = render(<Tabs label="Workspace" items={items} />);
    act(() => screen.getByRole('tab', { name: 'Alpha' }).focus());

    // act
    view.rerender(<Tabs label="Workspace" items={[]} />);

    // assert
    expect(screen.getByRole('tablist', { name: 'Workspace' })).toHaveFocus();
    expect(screen.getByRole('tablist')).toHaveAttribute('tabindex', '-1');
  });
  it('restores selected-tab entry after leaving a manually focused tab', async () => {
    // arrange
    const user = userEvent.setup();
    render(<Tabs label="Workspace" items={items} activationMode="manual" />);
    await user.tab(); await user.keyboard('{ArrowRight}'); await user.tab();

    // act
    await user.tab({ shift: true });

    // assert
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  it.each([{ x: 50, expected: -50 }, { x: 220, expected: 60 }, { x: 120, expected: 0 }])('reveals the clipped tab edge at $x within the list', ({ x, expected }) => {
    // arrange
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect(this: Element) {
      return this.getAttribute('role') === 'tablist' ? new DOMRect(100, 0, 100, 20) : new DOMRect(x, 0, 40, 20);
    });
    render(<Tabs label="Workspace" items={items} />);

    // act
    act(() => screen.getByRole('tab', { name: 'Beta' }).focus());

    // assert
    expect(screen.getByRole('tablist').scrollLeft).toBe(expected);
  });
  it.each([{ ctrlKey: true }, { altKey: true }, { metaKey: true }])('leaves modified navigation to the browser: %j', modifier => {
    // arrange
    render(<Tabs label="Workspace" items={items} />);
    act(() => screen.getByRole('tab', { name: 'Alpha' }).focus());

    // act
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Alpha' }), { key: 'ArrowRight', ...modifier });

    // assert
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  it('respects consumer capture cancellation of keyboard movement', () => {
    // arrange
    render(<Tabs label="Workspace" items={items} onKeyDownCapture={event => event.preventDefault()} />);
    act(() => screen.getByRole('tab', { name: 'Alpha' }).focus());

    // act
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Alpha' }), { key: 'ArrowRight' });

    // assert
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  it('does not intercept arrow movement in an empty list', () => {
    // arrange
    render(<Tabs label="Workspace" items={[]} />);

    // act
    const result = fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowRight' });

    // assert
    expect(result).toBe(true);
  });
  it('allows automatic selection after a cancelled pointer gesture', () => {
    // arrange
    render(<Tabs label="Workspace" items={items} />);
    fireEvent.pointerDown(screen.getByRole('tablist'));
    fireEvent.pointerCancel(screen.getByRole('tablist'));

    // act
    act(() => screen.getByRole('tab', { name: 'Beta' }).focus());

    // assert
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
  });
  it('keeps vertical navigation independent from horizontal reveal', async () => {
    // arrange
    const user = userEvent.setup();
    render(<Tabs label="Workspace" items={items} orientation="vertical" />);
    await user.tab();

    // act
    await user.keyboard('{ArrowDown}');

    // assert
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveFocus();
  });
}
