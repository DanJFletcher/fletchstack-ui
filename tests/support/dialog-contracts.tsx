import { createRef, type ReactElement } from 'react';
import { act, fireEvent, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Dialog } from '../../src/components/dialog/Dialog';

/**
 * Exercise React's native modal boundary; Chromium owns focus and top-layer integration.
 **/
export function dialogContracts(render: (element: ReactElement) => RenderResult) {
  it('keeps a closed dialog out of accessible queries', () => {
    // arrange
    const props = { open: false, onOpenChange: vi.fn(), heading: 'Review' };

    // act
    render(<Dialog {...props}>Draft</Dialog>);

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('forwards the native ref and scoped attributes', () => {
    // arrange
    const ref = createRef<HTMLDialogElement>();

    // act
    render(<Dialog ref={ref} open onOpenChange={vi.fn()} heading="Review" id="review" className="instance" style={{ '--fs-dialog-radius': '20px' }} />);

    // assert
    expect(ref.current).toBe(screen.getByRole('dialog', { name: 'Review' }));
    expect(ref.current).toHaveClass('instance');
    expect(ref.current).toHaveAttribute('id', 'review');
    expect(ref.current?.style.getPropertyValue('--fs-dialog-radius')).toBe('20px');
  });
  it('associates heading and composed description with unique IDs', () => {
    // arrange
    const props = { open: true, onOpenChange: vi.fn(), heading: 'Review', description: 'Check the draft', headingLevel: 3 as const };

    // act
    render(<><p id="hint">Additional context</p><Dialog {...props} aria-describedby="hint" /><Dialog {...props} /></>);

    // assert
    const dialogs = screen.getAllByRole('dialog');
    expect(dialogs[0]).toHaveAccessibleDescription('Additional context Check the draft');
    expect(dialogs[0]?.getAttribute('aria-labelledby')).not.toBe(dialogs[1]?.getAttribute('aria-labelledby'));
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });
  it('honors an explicit accessible name without generating a heading reference', () => {
    // arrange
    const props = { open: true, onOpenChange: vi.fn(), heading: 'Visible heading', 'aria-label': 'Custom name' };

    // act
    render(<Dialog {...props} />);

    // assert
    expect(screen.getByRole('dialog', { name: 'Custom name' })).not.toHaveAttribute('aria-labelledby');
  });
  it('preserves an explicit labelledby reference', () => {
    // arrange
    const props = { open: true, onOpenChange: vi.fn(), heading: 'Visible heading' };

    // act
    render(<><h1 id="external">External name</h1><Dialog {...props} aria-labelledby="external" /></>);

    // assert
    expect(screen.getByRole('dialog', { name: 'External name' })).toHaveAttribute('aria-labelledby', 'external');
  });
  it('omits absent slots', () => {
    // arrange
    const props = { open: true, onOpenChange: vi.fn(), showCloseButton: false, 'aria-label': 'Empty' };

    // act
    render(<Dialog {...props} />);

    // assert
    expect(screen.getByRole('dialog', { name: 'Empty' })).toBeEmptyDOMElement();
  });
  it('associates a description without a heading', () => {
    // arrange
    const props = { open: true, onOpenChange: vi.fn(), description: 'Supporting context', 'aria-label': 'Review', showCloseButton: false };

    // act
    render(<Dialog {...props}>Draft content</Dialog>);

    // assert
    expect(screen.getByRole('dialog', { name: 'Review' })).toHaveAccessibleDescription('Supporting context');
  });
  it('renders rich footer content', () => {
    // arrange
    const props = { open: true, onOpenChange: vi.fn(), heading: 'Review', footer: <a href="#confirm">Confirm changes</a> };

    // act
    render(<Dialog {...props}><p>Draft content</p></Dialog>);

    // assert
    expect(screen.getByRole('link', { name: 'Confirm changes' })).toHaveAttribute('href', '#confirm');
  });
  it('requests dismissal without closing a controlled dialog prematurely', async () => {
    // arrange
    const onOpenChange = vi.fn(), user = userEvent.setup();
    render(<Dialog open heading="Review" onOpenChange={onOpenChange} closeLabel="Dismiss review" />);

    // act
    await user.click(screen.getByRole('button', { name: 'Dismiss review' }));

    // assert
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
  });
  it.each([{ blocked: false, veto: false, requests: 1 }, { blocked: true, veto: false, requests: 0 }, { blocked: false, veto: true, requests: 0 }])('coordinates native Escape cancellation: %j', ({ blocked, veto, requests }) => {
    // arrange
    const onOpenChange = vi.fn(), onCancel = vi.fn(event => { if (veto) { event.preventDefault(); } });
    render(<Dialog open heading="Review" onOpenChange={onOpenChange} closeOnEscape={!blocked} onCancel={onCancel} />);

    // act
    const nativeAllowed = fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));

    // assert
    expect(nativeAllowed).toBe(false);
    expect(onOpenChange).toHaveBeenCalledTimes(requests);
    expect(onCancel).toHaveBeenCalledOnce();
  });
  it('requests Escape dismissal with default options and no consumer cancel handler', () => {
    // arrange
    const onOpenChange = vi.fn();
    render(<Dialog open heading="Review" onOpenChange={onOpenChange} />);

    // act
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));

    // assert
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });
  it('requests dismissal for a backdrop click by default', () => {
    // arrange
    const onOpenChange = vi.fn();
    render(<Dialog open heading="Review" onOpenChange={onOpenChange} />);
    const dialog = screen.getByRole('dialog');
    dialog.getBoundingClientRect = () => new DOMRect(0, 0, 100, 100);
    fireEvent.pointerDown(dialog, { clientX: -1, clientY: 10 });

    // act
    fireEvent.click(dialog, { clientX: -1, clientY: 10 });

    // assert
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });
  it.each([{ x: 101, y: 10 }, { x: 10, y: -1 }, { x: 10, y: 101 }])('recognizes each backdrop boundary: %j', ({ x, y }) => {
    // arrange
    const onOpenChange = vi.fn();
    render(<Dialog open heading="Review" onOpenChange={onOpenChange} closeOnBackdropClick />);
    const dialog = screen.getByRole('dialog');
    dialog.getBoundingClientRect = () => new DOMRect(0, 0, 100, 100);
    fireEvent.pointerDown(dialog, { clientX: x, clientY: y });

    // act
    fireEvent.click(dialog, { clientX: x, clientY: y });

    // assert
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });
  it('reports an imperative native close once', () => {
    // arrange
    const ref = createRef<HTMLDialogElement>(), onOpenChange = vi.fn(), onClose = vi.fn();
    render(<Dialog ref={ref} open onOpenChange={onOpenChange} onClose={onClose} heading="Review" />);

    // act
    act(() => ref.current!.close());

    // assert
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onClose).toHaveBeenCalledOnce();
  });
  it('closes immediately after parent acceptance without duplicating requests', () => {
    // arrange
    const onOpenChange = vi.fn();
    const view = render(<Dialog open heading="Review" onOpenChange={onOpenChange} />);

    // act
    view.rerender(<Dialog open={false} heading="Review" onOpenChange={onOpenChange} />);

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
  });
  it.each([
    { enabled: true, cancel: false, start: -1, end: -1, requests: 1 },
    { enabled: false, cancel: false, start: -1, end: -1, requests: 0 },
    { enabled: true, cancel: true, start: -1, end: -1, requests: 0 },
    { enabled: true, cancel: false, start: 10, end: -1, requests: 0 },
    { enabled: true, cancel: false, start: 10, end: 10, requests: 0 },
  ])('dismisses only an uncancelled gesture entirely on the enabled backdrop: %j', ({ enabled, cancel, start, end, requests }) => {
    // arrange
    const onOpenChange = vi.fn(), onClick = vi.fn(event => { if (cancel) { event.preventDefault(); } }), onPointerDown = vi.fn();
    render(<Dialog open heading="Review" onOpenChange={onOpenChange} closeOnBackdropClick={enabled} onClick={onClick} onPointerDown={onPointerDown} />);
    const dialog = screen.getByRole('dialog');
    dialog.getBoundingClientRect = () => new DOMRect(0, 0, 100, 100);
    fireEvent.pointerDown(dialog, { clientX: start, clientY: 10 });

    // act
    fireEvent.click(dialog, { clientX: end, clientY: 10 });

    // assert
    expect(onOpenChange).toHaveBeenCalledTimes(requests);
    expect(onClick).toHaveBeenCalledOnce();
    expect(onPointerDown).toHaveBeenCalledOnce();
  });
  it('ignores clicks on content descendants', async () => {
    // arrange
    const onOpenChange = vi.fn(), user = userEvent.setup();
    render(<Dialog open heading="Review" onOpenChange={onOpenChange} closeOnBackdropClick><button>Action</button></Dialog>);

    // act
    await user.click(screen.getByRole('button', { name: 'Action' }));

    // assert
    expect(onOpenChange).not.toHaveBeenCalled();
  });
  it('waits for the modal exit before native close', async () => {
    // arrange
    let finish!: () => void;
    const finished = new Promise<void>(resolve => { finish = resolve; });
    const props = { heading: 'Review', onOpenChange: vi.fn() };
    const view = render(<Dialog {...props} open />);
    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    dialog.getAnimations = () => [{ finished }] as unknown as Animation[];
    view.rerender(<Dialog {...props} open={false} />);
    expect(dialog.open).toBe(true);

    // act
    await act(async () => { finish(); await finished; });

    // assert
    expect(dialog.open).toBe(false);
  });
  it('cancels a pending exit when the parent reopens', async () => {
    // arrange
    let finish!: () => void;
    const finished = new Promise<void>(resolve => { finish = resolve; });
    const props = { heading: 'Review', onOpenChange: vi.fn(), motion: 'slide' as const };
    const view = render(<Dialog {...props} open />);
    const dialog = screen.getByRole('dialog') as HTMLDialogElement;
    dialog.getAnimations = () => [{ finished }] as unknown as Animation[];
    view.rerender(<Dialog {...props} open={false} />);
    view.rerender(<Dialog {...props} open />);

    // act
    await act(async () => { finish(); await finished; });

    // assert
    expect(dialog.open).toBe(true);
    expect(dialog).toHaveAttribute('data-state', 'open');
  });
}
