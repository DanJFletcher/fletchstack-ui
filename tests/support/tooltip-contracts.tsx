import { createRef, type ReactElement } from 'react';
import { act, fireEvent, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { Tooltip } from '../../src/components/tooltip/Tooltip';

/**
 * Dispatch pointer metadata at jsdom's unsupported native PointerEvent boundary.
 **/
function pointer(target: Element | Document, type: string, pointerType = 'mouse') {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerType: { value: pointerType },
    relatedTarget: { value: document.body },
  });
  fireEvent(target, event);
}

afterEach(() => vi.useRealTimers());

/**
 * Preserve the public trigger contract independently in DOM and hydrated renderers.
 **/
export function tooltipContracts(render: (element: ReactElement) => RenderResult) {
  it('starts hidden without adding an extra tab stop', () => {
    // arrange
    const element = (
      <Tooltip content="Supplementary help">
        <button>Project help</button>
      </Tooltip>
    );

    // act
    const view = render(element);

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(view.container.querySelectorAll('[tabindex]')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'Project help' })).toHaveAccessibleDescription(
      'Supplementary help',
    );
  });
  it('opens immediately on keyboard focus', async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <Tooltip content="Supplementary help">
        <button>Project help</button>
      </Tooltip>,
    );

    // act
    await user.tab();

    // assert
    expect(screen.getByRole('tooltip')).toHaveTextContent('Supplementary help');
    expect(screen.getByRole('button')).toHaveFocus();
  });
  it('appends its unique description to existing hints', () => {
    // arrange
    const element = (
      <>
        <p id="existing">Existing hint.</p>
        <Tooltip content="Additional help.">
          <button aria-describedby="existing">Project help</button>
        </Tooltip>
      </>
    );

    // act
    render(element);

    // assert
    expect(screen.getByRole('button')).toHaveAccessibleDescription(
      'Existing hint. Additional help.',
    );
  });
  it('uses independent description IDs for sibling instances', () => {
    // arrange
    const element = (
      <>
        <Tooltip content="First hint">
          <button>First</button>
        </Tooltip>
        <Tooltip content="Second hint">
          <button>Second</button>
        </Tooltip>
      </>
    );

    // act
    render(element);

    // assert
    expect(screen.getByRole('button', { name: 'First' }).getAttribute('aria-describedby')).not.toBe(
      screen.getByRole('button', { name: 'Second' }).getAttribute('aria-describedby'),
    );
  });
  it('forwards the wrapper ref, native attributes and scoped styles', () => {
    // arrange
    const ref = createRef<HTMLSpanElement>();

    // act
    render(
      <Tooltip
        ref={ref}
        content="Help"
        id="project-help"
        className="instance"
        title="Context"
        style={{ '--fs-tooltip-radius': '20px' }}
      >
        <button>Help</button>
      </Tooltip>,
    );

    // assert
    expect(ref.current).toHaveAttribute('id', 'project-help');
    expect(ref.current).toHaveClass('instance');
    expect(ref.current).toHaveAttribute('title', 'Context');
    expect(ref.current?.style.getPropertyValue('--fs-tooltip-radius')).toBe('20px');
  });
  it('preserves the trigger ref and its click handler', async () => {
    // arrange
    const user = userEvent.setup(),
      ref = createRef<HTMLButtonElement>(),
      clicked = vi.fn();
    render(
      <Tooltip content="Help">
        <button ref={ref} onClick={clicked}>
          Project help
        </button>
      </Tooltip>,
    );

    // act
    await user.click(screen.getByRole('button'));

    // assert
    expect(ref.current).toBe(screen.getByRole('button'));
    expect(clicked).toHaveBeenCalledOnce();
  });
  it('preserves native link navigation attributes', () => {
    // arrange
    const element = (
      <Tooltip content="Documentation">
        <a href="/docs" target="_blank" rel="noreferrer">
          Docs
        </a>
      </Tooltip>
    );

    // act
    render(element);

    // assert
    expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('href', '/docs');
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noreferrer');
  });
  it('leaves a non-focusable child non-focusable', () => {
    // arrange
    const element = (
      <Tooltip content="Help">
        <span>Supplementary text</span>
      </Tooltip>
    );

    // act
    const view = render(element);

    // assert
    expect(view.getByText('Supplementary text')).not.toHaveAttribute('tabindex');
  });
  it('opens for mouse hover', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );

    // act
    pointer(screen.getByRole('button'), 'pointerover');

    // assert
    expect(screen.getByRole('tooltip')).toHaveTextContent('Help');
  });
  it('closes after pointer-transfer grace when no focus owns the tooltip', () => {
    // arrange
    vi.useFakeTimers();
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');
    pointer(screen.getByRole('button'), 'pointerout');
    expect(screen.getByRole('tooltip')).toBeVisible();

    // act
    act(() => vi.advanceTimersByTime(100));

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('cancels a pending close when the pointer reaches tooltip content', () => {
    // arrange
    vi.useFakeTimers();
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');
    pointer(screen.getByRole('button'), 'pointerout');
    pointer(screen.getByRole('tooltip'), 'pointerover');

    // act
    act(() => vi.advanceTimersByTime(100));

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('retains keyboard-owned help after the pointer leaves', () => {
    // arrange
    vi.useFakeTimers();
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    pointer(screen.getByRole('button'), 'pointerover');
    pointer(screen.getByRole('button'), 'pointerout');

    // act
    act(() => vi.advanceTimersByTime(100));

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('closes when keyboard focus leaves', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));

    // act
    fireEvent.blur(screen.getByRole('button'), { relatedTarget: document.body });

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('keeps pointer-owned help visible after blur', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');
    fireEvent.focus(screen.getByRole('button'));

    // act
    fireEvent.blur(screen.getByRole('button'), { relatedTarget: document.body });

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('keeps help visible when focus stays within the wrapper', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>
          <span>Project help</span>
        </button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));

    // act
    fireEvent.blur(screen.getByRole('button'), { relatedTarget: screen.getByText('Project help') });

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('dismisses Escape without changing focus', async () => {
    // arrange
    const user = userEvent.setup();
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    await user.tab();

    // act
    await user.keyboard('{Escape}');

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.getByRole('button')).toHaveFocus();
  });
  it('does not reopen a dismissed tooltip on unrelated key presses', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });

    // act
    fireEvent.keyDown(screen.getByRole('button'), { key: 'ArrowRight' });

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('allows a fresh focus interaction to reopen after Escape', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });
    fireEvent.blur(screen.getByRole('button'));

    // act
    fireEvent.focus(screen.getByRole('button'));

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('dismisses hover help with Escape while focus is outside the wrapper', () => {
    // arrange
    render(
      <>
        <Tooltip content="Help">
          <button>Project help</button>
        </Tooltip>
        <button>Outside</button>
      </>,
    );
    pointer(screen.getByRole('button', { name: 'Project help' }), 'pointerover');

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Outside' }), { key: 'Escape' });

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('ignores non-Escape keys outside the wrapper', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');

    // act
    fireEvent.keyDown(document, { key: 'ArrowRight' });

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('honors cancellation of an outside Escape event', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    event.preventDefault();

    // act
    fireEvent(document, event);

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('does not consume Escape after the tooltip is already dismissed', () => {
    // arrange
    const key = vi.fn();
    render(
      <div onKeyDown={key}>
        <Tooltip content="Help">
          <button>Project help</button>
        </Tooltip>
      </div>,
    );

    // act
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });

    // assert
    expect(key).toHaveBeenCalledOnce();
  });
  it('opens on the first touch tap', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover', 'touch');

    // act
    pointer(screen.getByRole('button'), 'pointerdown', 'touch');

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('closes on a repeated touch tap', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerdown', 'touch');
    fireEvent.focus(screen.getByRole('button'));

    // act
    pointer(screen.getByRole('button'), 'pointerdown', 'touch');

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('does not reopen a touch dismissal from the native focus that follows it', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');
    pointer(screen.getByRole('button'), 'pointerdown', 'touch');

    // act
    fireEvent.focus(screen.getByRole('button'));

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('ignores touch pointer leave while tap-open help remains active', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerdown', 'touch');

    // act
    pointer(screen.getByRole('button'), 'pointerout', 'touch');

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('leaves mouse activation to the child instead of toggling help', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );

    // act
    pointer(screen.getByRole('button'), 'pointerdown');

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('dismisses an outside touch tap', () => {
    // arrange
    render(
      <>
        <Tooltip content="Help">
          <button>Project help</button>
        </Tooltip>
        <button>Outside</button>
      </>,
    );
    pointer(screen.getByRole('button', { name: 'Project help' }), 'pointerdown', 'touch');

    // act
    pointer(screen.getByRole('button', { name: 'Outside' }), 'pointerdown', 'touch');

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('ignores pointer activity inside the visible tooltip', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');

    // act
    pointer(screen.getByRole('tooltip'), 'pointerdown');

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('ignores outside pointer events whose target is not a DOM node', () => {
    // arrange
    render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));
    const event = new Event('pointerdown');
    Object.defineProperty(event, 'target', { value: window });

    // act
    fireEvent(document, event);

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('forwards and respects a canceled focus event', () => {
    // arrange
    render(
      <Tooltip content="Help" onFocus={(event) => event.preventDefault()}>
        <button>Project help</button>
      </Tooltip>,
    );

    // act
    fireEvent.focus(screen.getByRole('button'));

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('forwards and respects a canceled pointer enter', () => {
    // arrange
    render(
      <Tooltip content="Help" onPointerEnter={(event) => event.preventDefault()}>
        <button>Project help</button>
      </Tooltip>,
    );

    // act
    pointer(screen.getByRole('button'), 'pointerover');

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('forwards and respects a canceled blur event', () => {
    // arrange
    render(
      <Tooltip content="Help" onBlur={(event) => event.preventDefault()}>
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));

    // act
    fireEvent.blur(screen.getByRole('button'));

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('forwards and respects a canceled pointer leave', () => {
    // arrange
    vi.useFakeTimers();
    render(
      <Tooltip content="Help" onPointerLeave={(event) => event.preventDefault()}>
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');
    pointer(screen.getByRole('button'), 'pointerout');

    // act
    act(() => vi.advanceTimersByTime(100));

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('forwards and respects canceled touch activation', () => {
    // arrange
    render(
      <Tooltip content="Help" onPointerDown={(event) => event.preventDefault()}>
        <button>Project help</button>
      </Tooltip>,
    );

    // act
    pointer(screen.getByRole('button'), 'pointerdown', 'touch');

    // assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
  it('forwards and respects canceled Escape', () => {
    // arrange
    render(
      <Tooltip content="Help" onKeyDown={(event) => event.preventDefault()}>
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));

    // act
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Escape' });

    // assert
    expect(screen.getByRole('tooltip')).toBeVisible();
  });
  it('cancels pending pointer grace when unmounted', () => {
    // arrange
    vi.useFakeTimers();
    const view = render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    pointer(screen.getByRole('button'), 'pointerover');
    pointer(screen.getByRole('button'), 'pointerout');

    // act
    view.unmount();

    // assert
    expect(vi.getTimerCount()).toBe(0);
  });
  it('repositions after window scrolling with the requested edge', () => {
    // arrange
    render(
      <Tooltip content="Help" placement="right">
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));

    // act
    fireEvent.scroll(window);

    // assert
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-side', 'right');
    expect(screen.getByRole('tooltip').style.maxHeight).toBe('752px');
  });
  it('tracks a visual viewport with a reduced available size', () => {
    // arrange
    const original = Object.getOwnPropertyDescriptor(window, 'visualViewport');
    const visual = Object.assign(new EventTarget(), {
      offsetLeft: 20,
      offsetTop: 10,
      width: 320,
      height: 500,
    });
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: visual });
    const view = render(
      <Tooltip content="Help">
        <button>Project help</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button'));

    // act
    act(() => visual.dispatchEvent(new Event('resize')));

    // assert
    expect(screen.getByRole('tooltip').style.maxHeight).toBe('484px');
    view.unmount();
    Object.defineProperty(
      window,
      'visualViewport',
      original ?? { configurable: true, value: undefined },
    );
  });
}
