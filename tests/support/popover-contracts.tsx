import { createRef, type ReactElement } from 'react';
import { act, fireEvent, screen, type RenderResult } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Popover } from '../../src/components/popover/Popover';

/**
 * Assert the public React contract; native top-layer focus and geometry live in Chromium.
 **/
export function popoverContracts(render: (element: ReactElement) => RenderResult) {
  it('keeps the panel inaccessible until requested', () => {
    // arrange
    const element = <Popover triggerLabel="Details">Draft content</Popover>;

    // act
    render(element);

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('links the trigger to a named, described non-modal panel', () => {
    // arrange
    const element = <Popover triggerLabel="Details" heading="Project" description="Draft context" defaultOpen>Content</Popover>;

    // act
    render(element);

    // assert
    const panel = screen.getByRole('dialog', { name: 'Project' });
    expect(panel).toHaveAccessibleDescription('Draft context');
    expect(panel).not.toHaveAttribute('aria-modal');
    expect(screen.getByRole('button', { name: 'Details' })).toHaveAttribute('aria-controls', panel.id);
  });
  it('forwards wrapper attributes, handlers and ref', () => {
    // arrange
    const ref = createRef<HTMLDivElement>(), clicked = vi.fn();
    render(<Popover ref={ref} triggerLabel="Details" id="details" className="custom" style={{ '--fs-popover-radius': '20px' }} onClick={clicked} />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    // assert
    expect(ref.current).toHaveAttribute('id', 'details');
    expect(ref.current).toHaveClass('custom');
    expect(ref.current?.style.getPropertyValue('--fs-popover-radius')).toBe('20px');
    expect(clicked).toHaveBeenCalledOnce();
  });
  it('toggles an uncontrolled panel through its trigger', () => {
    // arrange
    const change = vi.fn();
    render(<Popover triggerLabel="Details" onOpenChange={change} />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    // assert
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeVisible();
    expect(change).toHaveBeenCalledWith(true);
  });
  it('closes an open panel through its trigger', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('keeps controlled state authoritative until the parent updates', () => {
    // arrange
    const change = vi.fn();
    const view = render(<Popover triggerLabel="Details" open={false} onOpenChange={change} />);
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(change).toHaveBeenCalledWith(true);

    // act
    view.rerender(<Popover triggerLabel="Details" open onOpenChange={change} />);

    // assert
    expect(screen.getByRole('dialog')).toBeVisible();
  });
  it('names a panel from its label when optional slots are absent', () => {
    // arrange
    const element = <Popover triggerLabel="Details" defaultOpen showCloseButton={false} />;

    // act
    render(element);

    // assert
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeEmptyDOMElement();
  });
  it('renders a description independently of a heading', () => {
    // arrange
    const element = <Popover triggerLabel="Details" description="Context" defaultOpen showCloseButton={false} />;

    // act
    render(element);

    // assert
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Context');
  });
  it('keeps IDs unique across instances', () => {
    // arrange
    const element = <><Popover triggerLabel="First" heading="First" defaultOpen /><Popover triggerLabel="Second" heading="Second" defaultOpen /></>;

    // act
    render(element);

    // assert
    expect(screen.getByRole('dialog', { name: 'First' }).id).not.toBe(screen.getByRole('dialog', { name: 'Second' }).id);
  });
  it('composes custom trigger content and panel overrides', () => {
    // arrange
    const element = <Popover triggerLabel="Details" trigger={<span>More</span>} triggerVariant="ghost" triggerSize="small" defaultOpen closeLabel="Dismiss" panelClassName="my-panel" panelStyle={{ '--fs-popover-radius': '24px' }}>Draft</Popover>;

    // act
    render(element);

    // assert
    expect(screen.getByRole('button', { name: 'Details' })).toHaveTextContent('More');
    expect(screen.getByRole('dialog')).toHaveClass('my-panel');
    expect(screen.getByRole('dialog').style.getPropertyValue('--fs-popover-radius')).toBe('24px');
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeVisible();
  });
  it('returns focus from panel content when Escape closes it', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen><button>Review</button></Popover>);
    act(() => screen.getByRole('button', { name: 'Review' }).focus());

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Review' }), { key: 'Escape' });

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Details' })).toHaveFocus();
  });
  it('closes through the explicit close action without requiring panel focus', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen />);

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Close popover' }));

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it.each([{ closeOnEscape: false }, { onKeyDown: (event: React.KeyboardEvent) => event.preventDefault() }])('allows a caller to veto Escape: %s', props => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen {...props} />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Details' }), { key: 'Escape' });

    // assert
    expect(screen.getByRole('dialog')).toBeVisible();
  });
  it('leaves unrelated keys alone', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Details' }), { key: 'Enter' });

    // assert
    expect(screen.getByRole('dialog')).toBeVisible();
  });
  it('does not request closure of an already closed panel', () => {
    // arrange
    const change = vi.fn();
    render(<Popover triggerLabel="Details" onOpenChange={change} />);

    // act
    fireEvent.keyDown(screen.getByRole('button', { name: 'Details' }), { key: 'Escape' });

    // assert
    expect(change).not.toHaveBeenCalled();
  });
  it('dismisses an outside pointer activation', () => {
    // arrange
    render(<><Popover triggerLabel="Details" defaultOpen /><button>Outside</button></>);

    // act
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('keeps inside pointer activation open', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen><button>Review</button></Popover>);

    // act
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Review' }));

    // assert
    expect(screen.getByRole('dialog')).toBeVisible();
  });
  it('allows outside click dismissal to be disabled', () => {
    // arrange
    render(<><Popover triggerLabel="Details" defaultOpen closeOnOutsideClick={false} /><button>Outside</button></>);

    // act
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));

    // assert
    expect(screen.getByRole('dialog')).toBeVisible();
  });
  it('dismisses when keyboard focus leaves the component', () => {
    // arrange
    render(<><Popover triggerLabel="Details" defaultOpen /><button>Outside</button></>);

    // act
    act(() => screen.getByRole('button', { name: 'Outside' }).focus());

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });
  it('allows focus leaving to remain open', () => {
    // arrange
    render(<><Popover triggerLabel="Details" defaultOpen closeOnFocusOutside={false} /><button>Outside</button></>);

    // act
    act(() => screen.getByRole('button', { name: 'Outside' }).focus());

    // assert
    expect(screen.getByRole('dialog')).toBeVisible();
  });
  it('dismisses focus moving outside the component to the document', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen />);

    // act
    fireEvent.focusIn(document);

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('optionally focuses the first enabled control', () => {
    // arrange
    const element = <Popover triggerLabel="Details" autoFocus defaultOpen showCloseButton={false}><button disabled>Unavailable</button><button hidden>Hidden</button><input type="hidden" /><div tabIndex={0} hidden>Hidden focusable</div><button>Review</button></Popover>;

    // act
    render(element);

    // assert
    expect(screen.getByRole('button', { name: 'Review' })).toHaveFocus();
  });
  it('focuses the panel when autofocus has no control', () => {
    // arrange
    const element = <Popover triggerLabel="Details" autoFocus defaultOpen showCloseButton={false}>Context</Popover>;

    // act
    render(element);

    // assert
    expect(screen.getByRole('dialog')).toHaveFocus();
  });
  it('leaves focus where it was when autofocus is omitted', () => {
    // arrange
    render(<><button>Before</button><Popover triggerLabel="Details" /></>);
    act(() => screen.getByRole('button', { name: 'Before' }).focus());

    // act
    fireEvent.click(screen.getByRole('button', { name: 'Details' }));

    // assert
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  });
  it('updates sizing after a viewport resize', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen panelMaxWidth={300} matchTriggerWidth offset={4} collisionPadding={10} side="right" align="end" />);

    // act
    fireEvent(window, new Event('resize'));

    // assert
    expect(screen.getByRole('dialog').style.maxWidth).toBe('300px');
    expect(screen.getByRole('dialog').style.maxHeight).toBe('748px');
    expect(screen.getByRole('dialog').style.width).toBe('calc(0px)');
  });
  it('uses visual viewport dimensions for collision constraints', () => {
    // arrange
    const visual = Object.assign(new EventTarget(), { offsetLeft: 30, offsetTop: 20, width: 320, height: 500 });
    const descriptor = Object.getOwnPropertyDescriptor(window, 'visualViewport');
    Object.defineProperty(window, 'visualViewport', { configurable: true, value: visual });
    const view = render(<Popover triggerLabel="Details" defaultOpen panelMaxWidth="20rem" collisionPadding={10} offset={4} panelStyle={{ direction: 'rtl' }} />);

    // act
    act(() => visual.dispatchEvent(new Event('resize')));

    // assert
    expect(screen.getByRole('dialog').style.maxWidth).toBe('20rem');
    expect(screen.getByRole('dialog').style.maxHeight).toBe('480px');
    view.unmount();
    if (descriptor) { Object.defineProperty(window, 'visualViewport', descriptor); }
    else { Reflect.deleteProperty(window, 'visualViewport'); }
  });
  it('ignores outside events with a non-node target', () => {
    // arrange
    render(<Popover triggerLabel="Details" defaultOpen />);
    const event = new Event('focusin');
    Object.defineProperty(event, 'target', { value: window });

    // act
    fireEvent(document, event);

    // assert
    expect(screen.getByRole('dialog')).toBeVisible();
  });
  it('requests a single dismissal for a controlled outside pointer and its focus event', () => {
    // arrange
    const change = vi.fn();
    render(<><Popover triggerLabel="Details" open onOpenChange={change} /><button>Outside</button></>);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));

    // act
    act(() => screen.getByRole('button', { name: 'Outside' }).focus());

    // assert
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('still dismisses focus leaving when only outside click dismissal is disabled', () => {
    // arrange
    render(<><Popover triggerLabel="Details" defaultOpen closeOnOutsideClick={false} /><button>Outside</button></>);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));

    // act
    act(() => screen.getByRole('button', { name: 'Outside' }).focus());

    // assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('skips an autofocus candidate whose focus handler redirects elsewhere', () => {
    // arrange
    const element = <Popover triggerLabel="Details" defaultOpen autoFocus showCloseButton={false}><button onFocus={event => event.currentTarget.blur()}>Redirected</button><button>Review</button></Popover>;

    // act
    render(element);

    // assert
    expect(screen.getByRole('button', { name: 'Review' })).toHaveFocus();
  });

  it('accepts a CSS maximum-width keyword while retaining viewport width limits', () => {
    // arrange
    const element = <Popover triggerLabel="Details" defaultOpen panelMaxWidth="none" collisionPadding={10} />;

    // act
    render(element);

    // assert
    expect(screen.getByRole('dialog').style.maxWidth).toBe('none');
    expect(screen.getByRole('dialog').style.width).toBe('min(var(--fs-popover-width), 1004px)');
  });

}
