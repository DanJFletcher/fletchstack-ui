import { createRef, useState, type ReactElement } from 'react';
import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Menu } from '../../src/components/menu/Menu';
import type { MenuItem } from '../../src/components/menu/types';

/**
 * Build a synthetic recursive action configuration with repeated IDs in different sibling sets.
 **/
function items(selected = vi.fn()): MenuItem[] {
  return [{ type: 'item', id: 'rename', label: 'Rename', onSelect: selected },
    { type: 'submenu', id: 'export', label: 'Export', items: [
      { type: 'item', id: 'pdf', label: 'Download PDF', onSelect: selected },
      { type: 'item', id: 'csv', label: 'Download CSV', onSelect: selected }] },
    { type: 'divider', id: 'divider' },
    { type: 'item', id: 'disabled', label: 'Delete', disabled: true, onSelect: selected },
    { type: 'item', id: 'link', label: 'Guide', href: '#guide', icon: <svg role="img" aria-label="Guide icon" /> },
    { type: 'submenu', id: 'share', label: 'Share', items: [
      { type: 'submenu', id: 'team', label: 'Team', items: [{ type: 'item', id: 'pdf', label: 'Copy team link', onSelect: selected }] },
      { type: 'submenu', id: 'public', label: 'Public', items: [{ type: 'item', id: 'pdf', label: 'Copy public link', onSelect: selected }] }] }];
}

/**
 * Expose parent-controlled expansion without overriding the component's public event contract.
 **/
function Controlled() {
  const [open, setOpen] = useState(false);
  return <Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} open={open} onOpenChange={setOpen} />;
}

/**
 * Run the same observable menu contracts under client rendering and server hydration.
 **/
export function menuContracts(mount: (element: ReactElement) => unknown) {
  it('starts collapsed behind a named native menu button', () => {
    // arrange
    // act
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} />);

    // assert
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('renders an initial menu with its own accessible name', () => {
    // arrange
    // act
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);

    // assert
    expect(screen.getByRole('menu', { name: 'Project menu' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute('aria-controls', screen.getByRole('menu').id);
  });
  it.each(['{Enter}', ' '])('%s opens the root and focuses its first enabled item', async key => {
    // arrange
    const user = userEvent.setup();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} />);
    screen.getByRole('button', { name: 'Actions' }).focus();

    // act
    await user.keyboard(key);

    // assert
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
  });
  it.each(['{Enter}', ' ', '{ArrowRight}'])('%s enters the focused submenu', async key => {
    // arrange
    const user = userEvent.setup();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    screen.getByRole('menuitem', { name: 'Export' }).focus();

    // act
    await user.keyboard(key);

    // assert
    expect(screen.getByRole('menuitem', { name: 'Download PDF' })).toHaveFocus();
    expect(screen.getByRole('menu', { name: 'Export' })).toBeVisible();
  });
  it.each(['Escape', 'ArrowLeft'])('%s returns one level to its parent trigger', key => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

    // act
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Download PDF' }), { key });

    // assert
    expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus();
    expect(screen.queryByRole('menu', { name: 'Export' })).not.toBeInTheDocument();
  });
  it('Escape at the root restores the root trigger', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Rename' }), { key: 'Escape' });

    // assert
    expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it.each([{ key: 'ArrowDown', from: 'Export', expected: 'Guide' }, { key: 'ArrowUp', from: 'Guide', expected: 'Export' }, { key: 'Home', from: 'Share', expected: 'Rename' }, { key: 'End', from: 'Rename', expected: 'Share' }, { key: 'ArrowUp', from: 'Rename', expected: 'Share' }, { key: 'ArrowDown', from: 'Share', expected: 'Rename' }])('$key moves from $from to $expected within one level', ({ key, from, expected }) => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    screen.getByRole('menuitem', { name: from }).focus();

    // act
    fireEvent.keyDown(screen.getByRole('menuitem', { name: from }), { key });

    // assert
    expect(screen.getByRole('menuitem', { name: expected })).toHaveFocus();
  });
  it('typeahead focuses a case-insensitive label match', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    screen.getByRole('menuitem', { name: 'Rename' }).focus();

    // act
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Rename' }), { key: 'g' });

    // assert
    expect(screen.getByRole('menuitem', { name: 'Guide' })).toHaveFocus();
  });
  it('unmatched typeahead preserves focus', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    screen.getByRole('menuitem', { name: 'Rename' }).focus();

    // act
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Rename' }), { key: 'z' });

    // assert
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
  });
  it('opening a sibling submenu removes the previous branch', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

    // act
    fireEvent.click(screen.getByRole('menuitem', { name: 'Share' }));

    // assert
    expect(screen.queryByRole('menu', { name: 'Export' })).not.toBeInTheDocument();
    expect(screen.getByRole('menu', { name: 'Share' })).toBeVisible();
  });
  it('opening a deeper sibling removes only the deeper branch', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Share' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Team' }));

    // act
    fireEvent.click(screen.getByRole('menuitem', { name: 'Public' }));

    // assert
    expect(screen.queryByRole('menuitem', { name: 'Copy team link' })).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Copy public link' })).toHaveFocus();
  });
  it('clicking an expanded parent closes its children', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

    // act
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

    // assert
    expect(screen.queryByRole('menu', { name: 'Export' })).not.toBeInTheDocument();
  });
  it.each(['{Enter}', ' '])('%s activates a leaf exactly once', async key => {
    // arrange
    const user = userEvent.setup(), selected = vi.fn();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items(selected)} defaultOpen />);
    screen.getByRole('menuitem', { name: 'Rename' }).focus();

    // act
    await user.keyboard(key);

    // assert
    expect(selected).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('closeOnSelect=false keeps the selected menu open', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen closeOnSelect={false} />);

    // act
    fireEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));

    // assert
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('a selection handler can prevent dismissal', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'item', id: 'save', label: 'Save', onSelect: event => event.preventDefault() }]} defaultOpen />);

    // act
    fireEvent.click(screen.getByRole('menuitem', { name: 'Save' }));

    // assert
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('native links keep their href and close on activation', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    const link = screen.getByRole('menuitem', { name: 'Guide' });

    // act
    fireEvent.click(link);

    // assert
    expect(link).toHaveAttribute('href', '#guide');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('disabled native links cannot activate or dismiss', () => {
    // arrange
    const selected = vi.fn();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'item', id: 'guide', label: 'Guide', href: '#guide', disabled: true, onSelect: selected }]} defaultOpen />);

    // act
    fireEvent.click(screen.getByRole('menuitem', { name: 'Guide' }));

    // assert
    expect(selected).not.toHaveBeenCalled();
    expect(screen.getByRole('menuitem')).not.toHaveAttribute('href');
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('outside pointer activation dismisses the whole tree', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

    // act
    fireEvent.pointerDown(document.body);

    // assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('pointer activation inside the menu preserves its opening', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);

    // act
    fireEvent.pointerDown(screen.getByRole('menuitem', { name: 'Export' }));

    // assert
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('controlled opening reports changes without overriding its parent', () => {
    // arrange
    const changed = vi.fn();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} open={false} onOpenChange={changed} />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // assert
    expect(changed).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('a controlled parent can accept opening changes', () => {
    // arrange
    mount(<Controlled />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // assert
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
  });
  it('empty menus keep an accessible named container and feedback', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[]} defaultOpen emptyMessage="Nothing to do" />);

    // act
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });

    // assert
    expect(within(screen.getByRole('menu')).getByText('Nothing to do')).toBeVisible();
  });
  it('empty menus can be opened and focused', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[]} />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // assert
    expect(screen.getByRole('menu')).toHaveFocus();
    expect(screen.getByText('No actions available.')).toBeVisible();
  });
  it('decorative icons do not create extra accessible names', () => {
    // arrange
    // act
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={items()} defaultOpen />);

    // assert
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Guide' })).toBeVisible();
  });
  it('forwards root ref, class and scoped style', () => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    mount(<Menu ref={ref} className="project-menu" style={{ '--fs-menu-radius': '0px' }} triggerLabel="Actions" menuLabel="Project menu" items={items()} />);

    // assert
    expect(ref.current).toHaveClass('project-menu');
    expect(ref.current!.style.getPropertyValue('--fs-menu-radius')).toBe('0px');
  });
  it('uses different instance IDs for equal item configurations', () => {
    // arrange
    // act
    mount(<><Menu triggerLabel="First" menuLabel="First actions" items={items()} defaultOpen /><Menu triggerLabel="Second" menuLabel="Second actions" items={items()} defaultOpen /></>);

    // assert
    expect(screen.getByRole('button', { name: 'First' }).getAttribute('aria-controls')).not.toBe(screen.getByRole('button', { name: 'Second' }).getAttribute('aria-controls'));
  });
  it.each([{ type: 'divider', id: '' }, { type: 'item', id: 'blank', label: ' ', onSelect: () => {} }] as MenuItem[])('rejects invalid identities or labels: $id', item => {
    // arrange
    const act = () => mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[item]} />);

    // act
    // assert
    expect(act).toThrow(/Menu/);
  });
  it('rejects duplicate IDs within a sibling set', () => {
    // arrange
    const act = () => mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'divider', id: 'same' }, { type: 'divider', id: 'same' }]} />);

    // act
    // assert
    expect(act).toThrow(/unique among siblings/);
  });
}
