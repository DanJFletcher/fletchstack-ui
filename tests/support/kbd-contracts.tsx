import { createRef, type ReactElement } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Kbd } from '../../src/components/kbd/Kbd';
import { KbdGroup } from '../../src/components/kbd/KbdGroup';

/**
 * Exercise native key and shortcut markup through both client rendering and server hydration.
 **/
export function kbdContracts(mount: (element: ReactElement) => unknown) {
  it('renders input text in a native keyboard element', () => {
    // arrange
    // act
    mount(<Kbd>Enter</Kbd>);
    // assert
    expect(screen.getByText('Enter').tagName).toBe('KBD');
  });
  it('accepts numeric keyboard input', () => {
    // arrange
    // act
    mount(<Kbd>{0}</Kbd>);
    // assert
    expect(screen.getByText('0').tagName).toBe('KBD');
  });
  it('keeps explicit separators and key order in an outer native keyboard group', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    // act
    mount(
      <KbdGroup ref={ref}>
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </KbdGroup>,
    );
    // assert
    expect(ref.current?.tagName).toBe('KBD');
    expect(ref.current).toHaveTextContent('Ctrl + K');
    expect(ref.current?.querySelectorAll('kbd')).toHaveLength(2);
  });
  it('forwards the keycap ref and native descriptive attributes', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    // act
    mount(
      <Kbd ref={ref} id="enter-key" title="Confirm" lang="en" dir="ltr" data-owner="consumer">
        Enter
      </Kbd>,
    );
    // assert
    expect(ref.current).toBe(screen.getByText('Enter'));
    expect(ref.current).toHaveAttribute('id', 'enter-key');
    expect(ref.current).toHaveAttribute('title', 'Confirm');
    expect(ref.current).toHaveAttribute('lang', 'en');
    expect(ref.current).toHaveAttribute('dir', 'ltr');
    expect(ref.current).toHaveAttribute('data-owner', 'consumer');
  });
  it('forwards the group ref and native directional attributes', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    // act
    mount(
      <KbdGroup ref={ref} id="shortcut" dir="ltr" title="Open palette">
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    // assert
    expect(ref.current).toHaveAttribute('id', 'shortcut');
    expect(ref.current).toHaveAttribute('dir', 'ltr');
    expect(ref.current).toHaveAttribute('title', 'Open palette');
  });
  it('retains keycap classes alongside scoped styles', () => {
    // arrange
    // act
    mount(
      <Kbd className="custom-key" style={{ '--fs-kbd-radius': '0px', color: 'purple' }}>
        Esc
      </Kbd>,
    );
    // assert
    expect(screen.getByText('Esc')).toHaveClass('fs-kbd', 'custom-key');
    expect(screen.getByText('Esc').style.getPropertyValue('--fs-kbd-radius')).toBe('0px');
    expect(screen.getByText('Esc')).toHaveStyle({ color: 'rgb(128, 0, 128)' });
  });
  it('retains group classes alongside scoped spacing', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    // act
    mount(
      <KbdGroup ref={ref} className="custom-shortcut" style={{ '--fs-kbd-group-gap': '12px' }}>
        <Kbd>Ctrl</Kbd>
        <Kbd>S</Kbd>
      </KbdGroup>,
    );
    // assert
    expect(ref.current).toHaveClass('fs-kbd-group', 'custom-shortcut');
    expect(ref.current?.style.getPropertyValue('--fs-kbd-group-gap')).toBe('12px');
  });
  it('allows decorative glyphs to be paired with readable text children', () => {
    // arrange
    // act
    mount(
      <Kbd>
        <span aria-hidden="true">⌘</span>
        <span>Command</span>
      </Kbd>,
    );
    // assert
    expect(screen.getByText('⌘')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('Command').closest('kbd')).toHaveTextContent('⌘Command');
  });
  it('preserves the native hidden attribute on a keycap', () => {
    // arrange
    // act
    mount(<Kbd hidden>Esc</Kbd>);
    // assert
    expect(screen.getByText('Esc')).not.toBeVisible();
  });
  it('preserves the native hidden attribute on a group', () => {
    // arrange
    // act
    mount(
      <KbdGroup hidden>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    // assert
    expect(screen.getByText('Ctrl')).not.toBeVisible();
  });
  it('introduces no tab stop between native links', async () => {
    // arrange
    const user = userEvent.setup();
    mount(
      <>
        <a href="#before">Before</a>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <a href="#after">After</a>
      </>,
    );
    await user.tab();
    // act
    await user.tab();
    // assert
    expect(screen.getByRole('link', { name: 'After' })).toHaveFocus();
  });
  it('keeps the surrounding button as the sole action target', async () => {
    // arrange
    const user = userEvent.setup();
    const accepted = vi.fn();
    mount(
      <button onClick={accepted}>
        Accept <Kbd>Enter</Kbd>
      </button>,
    );
    await user.tab();
    // act
    await user.keyboard('{Enter}');
    // assert
    expect(accepted).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Accept Enter' })).toHaveFocus();
  });
  it('forwards consumer keycap handlers without installing its own activation behavior', async () => {
    // arrange
    const user = userEvent.setup();
    const clicked = vi.fn();
    mount(<Kbd onClick={clicked}>Enter</Kbd>);
    // act
    await user.click(screen.getByText('Enter'));
    // assert
    expect(clicked).toHaveBeenCalledTimes(1);
  });
  it('forwards consumer group handlers', async () => {
    // arrange
    const user = userEvent.setup();
    const clicked = vi.fn();
    mount(
      <KbdGroup onClick={clicked}>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    // act
    await user.click(screen.getByText('Ctrl'));
    // assert
    expect(clicked).toHaveBeenCalledTimes(1);
  });
  it('adds no implicit interactive or live-region role', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    // act
    mount(
      <KbdGroup ref={ref}>
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>,
    );
    // assert
    expect(ref.current).not.toHaveAttribute('role');
    expect(ref.current).not.toHaveAttribute('aria-live');
    expect(screen.getByText('Ctrl')).not.toHaveAttribute('tabindex');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
}
