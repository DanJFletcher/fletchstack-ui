import { createRef, StrictMode, type ReactElement } from 'react';
import { act, fireEvent, type RenderResult } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toast } from '../../src/components/toast/Toast';
import { ToastViewport } from '../../src/components/toast/ToastViewport';

/**
 * Exercise the notification contract independently through client rendering and hydration.
 **/
export function toastContracts(render: (element: ReactElement) => RenderResult) {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  it('preserves local action state when the position changes', () => {
    // arrange
    const result = render(
      <Toast position="top" action={<input aria-label="Note" defaultValue="Initial" />}>
        Saved
      </Toast>,
    );
    fireEvent.change(result.getByRole('textbox'), { target: { value: 'Keep this note' } });

    // act
    result.rerender(
      <Toast position="bottom-left" action={<input aria-label="Note" defaultValue="Initial" />}>
        Saved
      </Toast>,
    );

    // assert
    expect(result.getByRole('textbox')).toHaveValue('Keep this note');
    expect(result.getByRole('textbox').closest('.fs-toast')).not.toHaveAttribute('position');
  });
  it('announces only the title and message politely by default', () => {
    // arrange
    // act
    const result = render(
      <Toast title="Saved" icon={<span>Decorative</span>} action={<button>Undo</button>}>
        Project updated.
      </Toast>,
    );

    // assert
    expect(result.getByRole('status')).toHaveTextContent('Saved Project updated.');
    expect(result.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(result.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
  });
  for (const tone of ['info', 'success', 'warning', 'error', 'neutral'] as const) {
    it(`keeps ${tone} urgency polite independently of tone`, () => {
      // arrange
      // act
      const result = render(<Toast tone={tone}>Message</Toast>);

      // assert
      expect(result.getByRole('status')).toHaveAttribute('aria-live', 'polite');
      expect(result.queryByRole('alert')).toBeNull();
    });
  }
  it('supports explicitly urgent announcements', () => {
    // arrange
    // act
    const result = render(<Toast announcement="assertive">Connection lost.</Toast>);

    // assert
    expect(result.getByRole('alert')).toHaveTextContent('Connection lost.');
  });
  it('can turn announcements off for static previews', () => {
    // arrange
    // act
    const result = render(<Toast announcement="off">Preview</Toast>);

    // assert
    expect(result.getByRole('status')).toHaveAttribute('aria-live', 'off');
  });
  it('updates announcement text when the message changes', () => {
    // arrange
    const result = render(<Toast title="Export">Preparing</Toast>);

    // act
    result.rerender(<Toast title="Export">Ready</Toast>);

    // assert
    expect(result.getByRole('status')).toHaveTextContent('Export Ready');
  });
  it('preserves meaningful zero-valued slots', () => {
    // arrange
    // act
    const result = render(
      <Toast title={0} action={0} icon={0}>
        {0}
      </Toast>,
    );

    // assert
    expect(result.getByRole('status')).toHaveTextContent('0 0');
  });
  for (const empty of [undefined, null, false, true, '']) {
    it(`omits empty ${String(empty)} slots`, () => {
      // arrange
      // act
      const result = render(
        <Toast title={empty} icon={empty} action={empty}>
          {empty}
        </Toast>,
      );

      // assert
      expect(result.getByRole('status')).toBeEmptyDOMElement();
      expect(result.container.querySelector('.fs-toast__action')).toBeNull();
      expect(result.container.querySelector('.fs-toast__icon')).toBeNull();
    });
  }
  it('forwards native props, ref and scoped overrides', () => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    const result = render(
      <Toast
        ref={ref}
        id="notice"
        data-notice="saved"
        className="custom"
        dir="rtl"
        style={{ '--fs-toast-radius': '0px' }}
      >
        Saved
      </Toast>,
    );

    // assert
    expect(ref.current).toBe(result.container.querySelector('#notice'));
    expect(ref.current).toHaveClass('fs-toast', 'custom');
    expect(ref.current).toHaveAttribute('data-notice', 'saved');
    expect(ref.current).toHaveAttribute('dir', 'rtl');
    expect(ref.current!.style.getPropertyValue('--fs-toast-radius')).toBe('0px');
  });
  it('dismisses through the labeled native close button', () => {
    // arrange
    const onOpenChange = vi.fn();
    const result = render(
      <Toast onOpenChange={onOpenChange} dismissLabel="Dismiss saved message">
        Saved
      </Toast>,
    );

    // act
    fireEvent.click(result.getByRole('button', { name: 'Dismiss saved message' }));

    // assert
    expect(result.queryByRole('status')).toBeNull();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it('keeps a controlled notification visible until its parent accepts dismissal', () => {
    // arrange
    const onOpenChange = vi.fn();
    const result = render(
      <Toast open onOpenChange={onOpenChange}>
        Saved
      </Toast>,
    );

    // act
    fireEvent.click(result.getByRole('button'));

    // assert
    expect(result.getByRole('status')).toBeVisible();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
  it('honors controlled closure immediately', () => {
    // arrange
    const result = render(<Toast open>Saved</Toast>);

    // act
    result.rerender(<Toast open={false}>Saved</Toast>);

    // assert
    expect(result.queryByRole('button')).toBeNull();
    expect(result.queryByRole('status')).toBeNull();
  });
  it('starts closed when requested', () => {
    // arrange
    // act
    const result = render(<Toast defaultOpen={false}>Saved</Toast>);

    // assert
    expect(result.queryByRole('button')).toBeNull();
  });
  it('keeps a natively hidden toast out of the accessibility tree', () => {
    // arrange
    // act
    const result = render(<Toast hidden>Saved</Toast>);

    // assert
    expect(result.queryByRole('status')).toBeNull();
  });
  it('preserves consumer actions without dismissing', () => {
    // arrange
    const select = vi.fn();
    const result = render(<Toast action={<button onClick={select}>Review</button>}>Saved</Toast>);

    // act
    fireEvent.click(result.getByRole('button', { name: 'Review' }));

    // assert
    expect(select).toHaveBeenCalledTimes(1);
    expect(result.getByRole('status')).toBeVisible();
  });
  it('returns focus to the outside trigger after keyboard dismissal', () => {
    // arrange
    const result = render(
      <>
        <button>Save</button>
        <Toast defaultOpen={false}>Saved</Toast>
      </>,
    );
    result.getByRole('button', { name: 'Save' }).focus();
    result.rerender(
      <>
        <button>Save</button>
        <Toast open>Saved</Toast>
      </>,
    );
    act(() => result.getByRole('button', { name: 'Dismiss notification' }).focus());

    // act
    result.rerender(
      <>
        <button>Save</button>
        <Toast open={false}>Saved</Toast>
      </>,
    );

    // assert
    expect(result.getByRole('button', { name: 'Save' })).toHaveFocus();
  });
  it('closes on Escape inside the toast', () => {
    // arrange
    const result = render(<Toast>Saved</Toast>);

    // act
    fireEvent.keyDown(result.getByRole('button'), { key: 'Escape' });

    // assert
    expect(result.queryByRole('button')).toBeNull();
  });
  it('lets a consumer prevent Escape dismissal', () => {
    // arrange
    const result = render(<Toast onKeyDown={(event) => event.preventDefault()}>Saved</Toast>);

    // act
    fireEvent.keyDown(result.getByRole('button'), { key: 'Escape' });

    // assert
    expect(result.getByRole('button')).toBeVisible();
  });
  it('preserves unrelated keyboard events', () => {
    // arrange
    const onKeyDown = vi.fn();
    const result = render(<Toast onKeyDown={onKeyDown}>Saved</Toast>);

    // act
    fireEvent.keyDown(result.getByRole('button'), { key: 'ArrowDown' });

    // assert
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    expect(result.getByRole('button')).toBeVisible();
  });
  it('does not steal focus on opening', () => {
    // arrange
    const result = render(
      <>
        <button>Continue editing</button>
        <Toast open={false}>Saved</Toast>
      </>,
    );
    result.getByRole('button').focus();

    // act
    result.rerender(
      <>
        <button>Continue editing</button>
        <Toast open>Saved</Toast>
      </>,
    );

    // assert
    expect(result.getByRole('button', { name: 'Continue editing' })).toHaveFocus();
  });
  it('does not restore focus after the user has already left the toast', () => {
    // arrange
    const result = render(
      <>
        <button>Next</button>
        <Toast open>Saved</Toast>
      </>,
    );
    act(() => result.getByRole('button', { name: 'Dismiss notification' }).focus());
    act(() => result.getByRole('button', { name: 'Next' }).focus());

    // act
    result.rerender(
      <>
        <button>Next</button>
        <Toast open={false}>Saved</Toast>
      </>,
    );

    // assert
    expect(result.getByRole('button', { name: 'Next' })).toHaveFocus();
  });
  it('does not focus a disconnected return target', () => {
    // arrange
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    const restore = vi.spyOn(outside, 'focus');
    const result = render(<Toast open>Saved</Toast>);
    act(() => result.getByRole('button', { name: 'Dismiss notification' }).focus());
    outside.remove();

    // act
    result.rerender(<Toast open={false}>Saved</Toast>);

    // assert
    expect(restore).not.toHaveBeenCalled();
  });
  it('keeps the body mounted across visibility changes', () => {
    // arrange
    const result = render(
      <Toast open action={<input aria-label="Note" defaultValue="Initial" />}>
        Saved
      </Toast>,
    );
    fireEvent.change(result.getByRole('textbox'), { target: { value: 'Edited' } });
    result.rerender(
      <Toast open={false} action={<input aria-label="Note" defaultValue="Initial" />}>
        Saved
      </Toast>,
    );

    // act
    result.rerender(
      <Toast open action={<input aria-label="Note" defaultValue="Initial" />}>
        Saved
      </Toast>,
    );

    // assert
    expect(result.getByRole('textbox')).toHaveValue('Edited');
  });
  it('provides a named viewport with a native ref', () => {
    // arrange
    const ref = createRef<HTMLDivElement>();

    // act
    const result = render(
      <ToastViewport
        ref={ref}
        id="notifications"
        className="custom"
        inline
        position="top-start"
        style={{ '--fs-toast-viewport-gap': '20px' }}
      >
        <Toast>Saved</Toast>
      </ToastViewport>,
    );

    // assert
    expect(ref.current).toBe(result.getByRole('region', { name: 'Notifications' }));
    expect(ref.current).toHaveAttribute('id', 'notifications');
    expect(ref.current).toHaveClass(
      'custom',
      'fs-toast-viewport--inline',
      'fs-toast-viewport--top-start',
    );
  });
  it('allows a localized viewport name', () => {
    // arrange
    // act
    const result = render(<ToastViewport aria-label="Updates" />);

    // assert
    expect(result.getByRole('region', { name: 'Updates' })).toHaveClass(
      'fs-toast-viewport--bottom-end',
    );
  });
  describe('timing', () => {
    for (const duration of [undefined, 0, -1, NaN, Infinity]) {
      it(`keeps ${String(duration)} duration persistent`, () => {
        // arrange
        vi.useFakeTimers();
        const result = render(
          <Toast {...(duration === undefined ? {} : { duration })}>Saved</Toast>,
        );

        // act
        act(() => vi.advanceTimersByTime(60000));

        // assert
        expect(result.getByRole('button')).toBeVisible();
      });
    }
    it('dismisses when the opted-in lifetime expires', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(<Toast duration={1000}>Saved</Toast>);

      // act
      act(() => vi.advanceTimersByTime(1000));

      // assert
      expect(result.queryByRole('button')).toBeNull();
    });
    it('requests controlled timeout dismissal only once', () => {
      // arrange
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      const result = render(
        <Toast open duration={1000} onOpenChange={onOpenChange}>
          Saved
        </Toast>,
      );
      act(() => vi.advanceTimersByTime(1000));
      fireEvent.pointerLeave(result.getByRole('button').closest('.fs-toast')!);

      // act
      act(() => vi.advanceTimersByTime(10000));

      // assert
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });
    it('pauses the remaining lifetime while hovered', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(<Toast duration={1000}>Saved</Toast>);
      act(() => vi.advanceTimersByTime(400));
      fireEvent.pointerEnter(result.getByRole('button').closest('.fs-toast')!);

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(result.getByRole('button')).toBeVisible();
    });
    it('resumes with only the remaining time after hover', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(<Toast duration={1000}>Saved</Toast>);
      act(() => vi.advanceTimersByTime(400));
      const card = result.getByRole('button').closest('.fs-toast')!;
      fireEvent.pointerEnter(card);
      act(() => vi.advanceTimersByTime(5000));
      fireEvent.pointerLeave(card);

      // act
      act(() => vi.advanceTimersByTime(600));

      // assert
      expect(result.queryByRole('button')).toBeNull();
    });
    it('keeps a focused action available when the pointer leaves', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(
        <Toast duration={1000} action={<button>Undo</button>}>
          Saved
        </Toast>,
      );
      const button = result.getByRole('button', { name: 'Undo' });
      fireEvent.pointerEnter(button.closest('.fs-toast')!);
      act(() => button.focus());
      fireEvent.pointerLeave(button.closest('.fs-toast')!);

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(button).toHaveFocus();
      expect(button).toBeVisible();
    });
    it('keeps the timer paused while moving focus between internal controls', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(
        <Toast duration={1000} action={<button>Undo</button>}>
          Saved
        </Toast>,
      );
      act(() => result.getByRole('button', { name: 'Undo' }).focus());
      act(() => result.getByRole('button', { name: 'Dismiss notification' }).focus());

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(result.getByRole('button', { name: 'Dismiss notification' })).toBeVisible();
    });
    it('resumes when focus moves outside', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(
        <>
          <button>Outside</button>
          <Toast duration={1000}>Saved</Toast>
        </>,
      );
      act(() => result.getByRole('button', { name: 'Dismiss notification' }).focus());
      act(() => result.getByRole('button', { name: 'Outside' }).focus());

      // act
      act(() => vi.advanceTimersByTime(1000));

      // assert
      expect(result.queryByRole('status')).toBeNull();
    });
    it('pauses in a background tab', () => {
      // arrange
      vi.useFakeTimers();
      const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      const result = render(<Toast duration={1000}>Saved</Toast>);
      hidden.mockReturnValue(true);
      fireEvent(document, new Event('visibilitychange'));

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(result.getByRole('button')).toBeVisible();
    });
    it('starts paused when mounted into a background tab', () => {
      // arrange
      vi.useFakeTimers();
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
      const result = render(<Toast duration={1000}>Saved</Toast>);

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(result.getByRole('button')).toBeVisible();
    });
    it('resumes the remaining lifetime after returning to the tab', () => {
      // arrange
      vi.useFakeTimers();
      const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
      const result = render(<Toast duration={1000}>Saved</Toast>);
      act(() => vi.advanceTimersByTime(400));
      hidden.mockReturnValue(true);
      fireEvent(document, new Event('visibilitychange'));
      act(() => vi.advanceTimersByTime(5000));
      hidden.mockReturnValue(false);
      fireEvent(document, new Event('visibilitychange'));

      // act
      act(() => vi.advanceTimersByTime(600));

      // assert
      expect(result.queryByRole('button')).toBeNull();
    });
    it('does not reset the lifetime when a callback changes', () => {
      // arrange
      vi.useFakeTimers();
      const first = vi.fn();
      const latest = vi.fn();
      const result = render(
        <Toast duration={1000} onOpenChange={first}>
          Saved
        </Toast>,
      );
      act(() => vi.advanceTimersByTime(600));
      result.rerender(
        <Toast duration={1000} onOpenChange={latest}>
          Saved
        </Toast>,
      );

      // act
      act(() => vi.advanceTimersByTime(400));

      // assert
      expect(latest).toHaveBeenCalledWith(false);
      expect(first).not.toHaveBeenCalled();
    });
    it('resets the lifetime when duration changes', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(<Toast duration={1000}>Saved</Toast>);
      act(() => vi.advanceTimersByTime(600));
      result.rerender(<Toast duration={2000}>Saved</Toast>);

      // act
      act(() => vi.advanceTimersByTime(1000));

      // assert
      expect(result.getByRole('button')).toBeVisible();
    });
    it('starts paused when timing is enabled on an already focused toast', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(<Toast duration={0}>Saved</Toast>);
      act(() => result.getByRole('button').focus());
      result.rerender(<Toast duration={1000}>Saved</Toast>);

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(result.getByRole('button')).toBeVisible();
    });
    it('starts paused when timing is enabled under a stationary pointer', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(<Toast duration={0}>Saved</Toast>);
      const card = result.getByRole('button').closest('.fs-toast')!;
      vi.spyOn(card, 'matches').mockReturnValue(true);
      result.rerender(<Toast duration={1000}>Saved</Toast>);

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(result.getByRole('button')).toBeVisible();
    });
    it('does not restart a running clock on repeated visibility notifications', () => {
      // arrange
      vi.useFakeTimers();
      const result = render(<Toast duration={1000}>Saved</Toast>);
      act(() => vi.advanceTimersByTime(500));
      fireEvent(document, new Event('visibilitychange'));

      // act
      act(() => vi.advanceTimersByTime(500));

      // assert
      expect(result.queryByRole('button')).toBeNull();
    });
    it('cancels automatic dismissal when the component is hidden', () => {
      // arrange
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      const result = render(
        <Toast duration={1000} onOpenChange={onOpenChange}>
          Saved
        </Toast>,
      );
      result.rerender(
        <Toast hidden duration={1000} onOpenChange={onOpenChange}>
          Saved
        </Toast>,
      );

      // act
      act(() => vi.advanceTimersByTime(5000));

      // assert
      expect(onOpenChange).not.toHaveBeenCalled();
    });
    it('cleans up timers on removal', () => {
      // arrange
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      const result = render(
        <Toast duration={1000} onOpenChange={onOpenChange}>
          Saved
        </Toast>,
      );
      result.unmount();

      // act
      act(() => vi.advanceTimersByTime(1000));

      // assert
      expect(onOpenChange).not.toHaveBeenCalled();
    });
    it('survives StrictMode effect setup and cleanup', () => {
      // arrange
      vi.useFakeTimers();
      const onOpenChange = vi.fn();
      render(
        <StrictMode>
          <Toast duration={1000} onOpenChange={onOpenChange}>
            Saved
          </Toast>
        </StrictMode>,
      );

      // act
      act(() => vi.advanceTimersByTime(1000));

      // assert
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });
  });
}
