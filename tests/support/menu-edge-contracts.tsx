import { useState, type ReactElement } from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Menu } from '../../src/components/menu/Menu';
import type { MenuItem } from '../../src/components/menu/types';

const branches: MenuItem[] = [{ type: 'submenu', id: 'export', label: 'Export', items: [{ type: 'item', id: 'pdf', label: 'PDF', href: '#pdf' }] }];

/**
 * Simulate an external controller closing and reopening an already expanded branch.
 **/
function ExternalMenu() {
  const [open, setOpen] = useState(true);
  return <><button type="button" onClick={() => setOpen(!open)}>External toggle</button><Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} open={open} onOpenChange={setOpen} /></>;
}

/**
 * Accept an expansion request on a later render, as an asynchronously controlled consumer can do.
 **/
function DeferredMenu() {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  return <><Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} open={open} onOpenChange={setRequested} /><button type="button" onClick={() => setOpen(requested)}>Accept request</button></>;
}

/**
 * Cover empty, controlled, cancelled and browser-layout boundaries through the public component.
 **/
export function menuEdgeContracts(mount: (element: ReactElement) => unknown) {
  afterEach(() => vi.restoreAllMocks());
  it('controlled external reopening starts without stale branches', () => {
    // arrange
    mount(<ExternalMenu />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));
    fireEvent.click(screen.getByRole('button', { name: 'External toggle' }));

    // act
    fireEvent.click(screen.getByRole('button', { name: 'External toggle' }));

    // assert
    expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveAttribute('aria-expanded', 'false');
  });
  it('focuses the first item when a delayed controlled opening is accepted', () => {
    // arrange
    mount(<DeferredMenu />);
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Accept request' }));

    // assert
    expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveFocus();
  });
  it('Right Arrow on an open parent reenters the first child', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));
    screen.getByRole('menuitem', { name: 'Export' }).focus();

    // act
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'Export' }), { key: 'ArrowRight' });

    // assert
    expect(screen.getByRole('menuitem', { name: 'PDF' })).toHaveFocus();
  });
  it('Right Arrow does not activate a leaf', () => {
    // arrange
    const selected = vi.fn();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'item', id: 'leaf', label: 'Rename', onSelect: selected }]} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'ArrowRight' });

    // assert
    expect(selected).not.toHaveBeenCalled();
  });
  it('Right Arrow cannot enter disabled submenus', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'submenu', id: 'off', label: 'Unavailable', disabled: true, items: [] }]} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'ArrowRight' });

    // assert
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });
  it('Right Arrow on an empty menu is harmless', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[]} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowRight' });

    // assert
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('Left Arrow at the root keeps the root open', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'ArrowLeft' });

    // assert
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('unhandled keys preserve focus and expansion', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);
    screen.getByRole('menuitem').focus();

    // act
    fireEvent.keyDown(screen.getByRole('menuitem'), { key: 'F2' });

    // assert
    expect(screen.getByRole('menuitem')).toHaveFocus();
  });
  it.each(['ctrlKey', 'metaKey', 'altKey'])('modified typeahead preserves focus for %s', modifier => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);
    screen.getByRole('menu').focus();

    // act
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'e', [modifier]: true });

    // assert
    expect(screen.getByRole('menu')).toHaveFocus();
  });
  it('a consumer can cancel a navigation key in the capture phase', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen onKeyDownCapture={event => event.preventDefault()} />);
    screen.getByRole('menu').focus();

    // act
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowDown' });

    // assert
    expect(screen.getByRole('menu')).toHaveFocus();
  });
  it('key activation on an empty menu does not create an item', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[]} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Enter' });

    // assert
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-disabled', 'true');
  });
  it('reopening starts a fresh typeahead buffer', async () => {
    // arrange
    const user = userEvent.setup();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'item', id: 'rename', label: 'Rename', href: '#rename' }, ...branches]} />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.keyboard('re{Escape}');
    await user.click(screen.getByRole('button', { name: 'Actions' }));

    // act
    await user.keyboard('re');

    // assert
    expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus();
  });
  it('root ArrowDown opens and focuses the first item', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), { key: 'ArrowDown' });

    // assert
    expect(screen.getByRole('menuitem')).toHaveFocus();
  });
  it('root Tab dismisses a default-open panel', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), { key: 'Tab' });

    // assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('Tab from a child closes the whole tree', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

    // act
    fireEvent.keyDown(screen.getByRole('menuitem', { name: 'PDF' }), { key: 'Tab' });

    // assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('typeahead buffers a multi-letter prefix', async () => {
    // arrange
    const user = userEvent.setup();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'item', id: 'r', label: 'Rename', href: '#rename' }, { type: 'item', id: 's', label: 'Share', href: '#share' }, { type: 'item', id: 'p', label: 'Settings', href: '#settings' }]} defaultOpen />);
    screen.getByRole('menuitem', { name: 'Rename' }).focus();

    // act
    await user.keyboard('se');

    // assert
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveFocus();
  });
  it('typeahead cycles repeated initials', async () => {
    // arrange
    const user = userEvent.setup();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[{ type: 'item', id: 'r', label: 'Rename', href: '#rename' }, { type: 'item', id: 's', label: 'Share', href: '#share' }, { type: 'item', id: 'p', label: 'Settings', href: '#settings' }]} defaultOpen />);
    screen.getByRole('menuitem', { name: 'Rename' }).focus();

    // act
    await user.keyboard('ss');

    // assert
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveFocus();
  });
  it('Up from an empty level remains safe', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[]} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'ArrowUp' });

    // assert
    expect(screen.getByRole('menu')).toBeVisible();
  });
  it('clicking the root trigger closes an open tree', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Actions' }));

    // assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('positions and flips panels inside measured viewport edges', () => {
    // arrange
    const style = document.createElement('style');
    style.textContent = '.fs-menu__panel {position:fixed}';
    document.head.appendChild(style);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 950, right: 1000, top: 700, bottom: 740, width: 50, height: 40, x: 950, y: 700, toJSON: () => ({}) });
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(120);
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);

    // act
    fireEvent.click(screen.getByRole('menuitem', { name: 'Export' }));

    // assert
    expect(screen.getByRole('menu', { name: 'Project menu' })).toHaveStyle({ left: '824px', top: '580px' });
    expect(screen.getByRole('menu', { name: 'Export' })).toHaveStyle({ left: '750px', top: '648px' });
    style.remove();
  });
  it('repositions using semantic insets after a resize or scroll', () => {
    // arrange
    const style = document.createElement('style');
    style.textContent = '.fs-menu__panel {position:fixed;--fs-menu-viewport-inset:8px;--fs-menu-panel-gap:4px;}';
    document.head.appendChild(style);
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[]} defaultOpen />);

    // act
    act(() => { window.dispatchEvent(new Event('resize')); window.dispatchEvent(new Event('scroll')); });

    // assert
    expect(screen.getByRole('menu')).toHaveStyle({ left: '8px', top: '8px' });
    style.remove();
  });
  it('inline panels leave their geometry to CSS', () => {
    // arrange
    const original = window.getComputedStyle;
    vi.spyOn(window, 'getComputedStyle').mockImplementation(element => { const result = original(element); Object.defineProperty(result, 'position', { value: 'static' }); return result; });

    // act
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[]} defaultOpen />);

    // assert
    expect(screen.getByRole('menu').style.left).toBe('');
  });
}

/**
 * Verify optional menu-button boundary keys and native tab entry without introducing focus traps.
 **/
export function menuTriggerContracts(mount: (element: ReactElement) => unknown) {
  it('ArrowUp opens at the last enabled item', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={[...branches, { type: 'item', id: 'last', label: 'Last action', href: '#last' }]} />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), { key: 'ArrowUp' });

    // assert
    expect(screen.getByRole('menuitem', { name: 'Last action' })).toHaveFocus();
  });
  it('Escape from an expanded root trigger dismisses the tree', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), { key: 'Escape' });

    // assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('a capture handler can cancel a root boundary key', () => {
    // arrange
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} onKeyDownCapture={event => event.preventDefault()} />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Actions' }), { key: 'ArrowDown' });

    // assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
  it('Escape and Tab on a collapsed trigger preserve its collapsed state', async () => {
    // arrange
    const user = userEvent.setup();
    mount(<Menu triggerLabel="Actions" menuLabel="Project menu" items={branches} />);
    screen.getByRole('button', { name: 'Actions' }).focus();

    // act
    await user.keyboard('{Escape}{Tab}');

    // assert
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
}
