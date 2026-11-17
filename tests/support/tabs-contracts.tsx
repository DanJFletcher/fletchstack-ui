import { createRef, useState, type ReactElement } from 'react';
import { act, fireEvent, screen, within, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Tabs } from '../../src/components/tabs/Tabs';
import type { TabsItem } from '../../src/components/tabs/types';

export const tabItems: TabsItem[] = [
  { id: 'overview', label: 'Overview', content: <><h2>Workspace overview</h2><input aria-label="Draft" defaultValue="Initial" /></> },
  { id: 'activity', label: 'Activity', content: <a href="#activity">Read activity</a> },
  { id: 'settings', label: 'Settings', content: 'Settings panel', disabled: true },
];

/**
 * Read the current tab by the same accessible selected-state contract users encounter.
 **/
function currentTab(): HTMLElement {
  return screen.getByRole('tab', { selected: true });
}

/**
 * Exercise shared public behavior through client rendering or hydrated server markup.
 **/
export function tabsContracts(render: (element: ReactElement) => RenderResult) {
  it('forwards native root attributes, ref and scoped styles', () => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    render(<Tabs ref={ref} label="Workspace" items={tabItems} id="workspace" className="custom" data-testid="root" style={{ '--fs-tabs-gap': '12px' }} />);

    // assert
    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current).toHaveAttribute('id', 'workspace');
    expect(ref.current).toHaveClass('custom');
    expect(ref.current?.style.getPropertyValue('--fs-tabs-gap')).toBe('12px');
  });

  it('names a tablist with Overview initially selected', () => {
    // arrange
    const given = <Tabs label="Workspace" items={tabItems} />;

    // act
    render(given);

    // assert
    expect(within(screen.getByRole('tablist', { name: 'Workspace' })).getAllByRole('tab')).toHaveLength(3);
    expect(currentTab()).toHaveTextContent('Overview');
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeDisabled();
  });

  it.each([{ defaultValue: 'activity', expected: 'Activity' }, { defaultValue: 'unavailable', expected: 'Overview' }, { defaultValue: 'settings', expected: 'Overview' }])('resolves default selection $defaultValue', ({ defaultValue, expected }) => {
    // arrange


    // act
    render(<Tabs label="Workspace" items={tabItems} defaultValue={defaultValue} />);

    // assert
    expect(currentTab()).toHaveTextContent(expected);
  });

  it('requests one change from a controlled pointer activation', async () => {
    // arrange
    const user = userEvent.setup(), onValueChange = vi.fn();
    render(<Tabs label="Workspace" items={tabItems} value="overview" onValueChange={onValueChange} />);

    // act
    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    // assert
    expect(onValueChange.mock.calls).toEqual([['activity']]);
    expect(currentTab()).toHaveTextContent('Overview');
  });

  it('updates uncontrolled selection through a native click', async () => {
    // arrange
    const user = userEvent.setup();
    render(<Tabs label="Workspace" items={tabItems} />);

    // act
    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    // assert
    expect(currentTab()).toHaveTextContent('Activity');
    expect(screen.getByRole('tabpanel', { name: 'Activity' })).toBeVisible();
  });

  it('ignores disabled and already-selected pointer activation', async () => {
    // arrange
    const user = userEvent.setup(), onValueChange = vi.fn();
    render(<Tabs label="Workspace" items={tabItems} onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Overview' }));

    // act
    await user.click(screen.getByRole('tab', { name: 'Settings' }));

    // assert
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not select a disabled tab from a synthetic focus event', () => {
    // arrange
    const onValueChange = vi.fn();
    render(<Tabs label="Workspace" items={tabItems} onValueChange={onValueChange} />);

    // act
    fireEvent.focus(screen.getByRole('tab', { name: 'Settings' }));

    // assert
    expect(currentTab()).toHaveTextContent('Overview');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps manual arrow focus separate from selection', async () => {
    // arrange
    const user = userEvent.setup(), onValueChange = vi.fn();
    render(<Tabs label="Workspace" items={tabItems} activationMode="manual" onValueChange={onValueChange} />);
    await user.tab();

    // act
    await user.keyboard('{ArrowRight}');

    // assert
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(currentTab()).toHaveTextContent('Overview');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each(['{Enter}', ' '])('commits manual keyboard activation with %s once', async key => {
    // arrange
    const user = userEvent.setup(), onValueChange = vi.fn();
    render(<Tabs label="Workspace" items={tabItems} value="overview" activationMode="manual" onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard('{ArrowRight}');

    // act
    await user.keyboard(key);

    // assert
    expect(onValueChange.mock.calls).toEqual([['activity']]);
  });

  it('preserves edited state across switching and reordered items', async () => {
    // arrange
    const user = userEvent.setup();
    const view = render(<Tabs label="Workspace" items={tabItems} />);
    await user.clear(screen.getByRole('textbox', { name: 'Draft' }));
    await user.type(screen.getByRole('textbox', { name: 'Draft' }), 'Kept draft');
    await user.click(screen.getByRole('tab', { name: 'Activity' }));
    view.rerender(<Tabs label="Workspace" items={[...tabItems].reverse()} />);

    // act
    await user.click(screen.getByRole('tab', { name: 'Overview' }));

    // assert
    expect(screen.getByRole('textbox', { name: 'Draft' })).toHaveValue('Kept draft');
  });

  it('hides mounted inactive controls from accessible queries', async () => {
    // arrange
    const user = userEvent.setup();
    render(<Tabs label="Workspace" items={tabItems} />);

    // act
    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    // assert
    expect(screen.queryByRole('textbox', { name: 'Draft' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Draft')).not.toBeVisible();
  });

  it('settles uncontrolled fallback without reviving a reintroduced ID', () => {
    // arrange
    const onValueChange = vi.fn();
    const view = render(<Tabs label="Workspace" items={tabItems} defaultValue="activity" onValueChange={onValueChange} />);
    view.rerender(<Tabs label="Workspace" items={tabItems.filter(item => item.id !== 'activity')} onValueChange={onValueChange} />);

    // act
    view.rerender(<Tabs label="Workspace" items={tabItems} onValueChange={onValueChange} />);

    // assert
    expect(currentTab()).toHaveTextContent('Overview');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('restores controlled authority when a disabled selected ID becomes enabled', () => {
    // arrange
    const onValueChange = vi.fn();
    const view = render(<Tabs label="Workspace" items={tabItems} value="settings" onValueChange={onValueChange} />);

    // act
    view.rerender(<Tabs label="Workspace" items={tabItems.map(item => ({ ...item, disabled: false }))} value="settings" onValueChange={onValueChange} />);

    // assert
    expect(currentTab()).toHaveTextContent('Settings');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([{ items: [] }, { items: tabItems.map(item => ({ ...item, disabled: true })) }])('shows no selected panel without enabled items', ({ items }) => {
    // arrange
    const given = <Tabs label="Workspace" items={items} />;

    // act
    render(given);

    // assert
    expect(screen.queryByRole('tab', { selected: true })).not.toBeInTheDocument();
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });

  it('keeps generated relationships separate across instances', () => {
    // arrange
    const given = <><Tabs label="First" items={tabItems} /><Tabs label="Second" items={tabItems} /></>;

    // act
    render(given);

    // assert
    const tabs = screen.getAllByRole('tab', { name: 'Overview' });
    expect(tabs[0]?.id).not.toBe(tabs[1]?.id);
    expect(document.getElementById(tabs[0]!.getAttribute('aria-controls')!)).toHaveAttribute('aria-labelledby', tabs[0]!.id);
  });

  it('preserves a consumer root handler', async () => {
    // arrange
    const user = userEvent.setup(), onClick = vi.fn();
    render(<Tabs label="Workspace" items={tabItems} onClick={onClick} />);

    // act
    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    // assert
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('accepts controlled selection updates', async () => {
    // arrange
    const user = userEvent.setup();
    /**
     * Accept selection through the public controlled contract.
     **/
    function Controlled() {
      const [value, setValue] = useState('overview');
      return <Tabs label="Workspace" items={tabItems} value={value} onValueChange={setValue} />;
    }
    render(<Controlled />);

    // act
    await user.click(screen.getByRole('tab', { name: 'Activity' }));

    // assert
    expect(currentTab()).toHaveTextContent('Activity');
  });

  it('selects on automatic keyboard focus', async () => {
    // arrange
    const user = userEvent.setup();
    render(<Tabs label="Workspace" items={tabItems} />);
    await user.tab();

    // act
    await user.keyboard('{ArrowRight}');

    // assert
    expect(currentTab()).toHaveTextContent('Activity');
  });

  it('leaves focus in an unrelated control after a background fallback', () => {
    // arrange
    const view = render(<><input aria-label="Elsewhere" /><Tabs label="Workspace" items={tabItems} defaultValue="activity" /></>);
    act(() => screen.getByRole('textbox', { name: 'Elsewhere' }).focus());

    // act
    view.rerender(<><input aria-label="Elsewhere" /><Tabs label="Workspace" items={tabItems.filter(item => item.id !== 'activity')} /></>);

    // assert
    expect(screen.getByRole('textbox', { name: 'Elsewhere' })).toHaveFocus();
  });
}
