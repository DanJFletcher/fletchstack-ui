import { createRef, type ReactElement } from 'react';
import { act, fireEvent, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { BounceCards } from '../../src/components/bounce-cards/BounceCards';
import type { BounceCardsProps } from '../../src/components/bounce-cards/types';
import { resizeFan } from './bounce-platform';

const images = [
  { id: 'first', src: 'data:image/png,first', alt: 'First landscape' },
  { id: 'second', src: 'data:image/png,second', alt: 'Second landscape' },
  { id: 'third', src: 'data:image/png,third', alt: 'Third landscape' },
];

/**
 * Keep individual tests focused on caller-visible changes to a small collection.
 **/
function example(props: Partial<BounceCardsProps> = {}) {
  return <BounceCards images={images} {...props} />;
}

/**
 * Supply pointer coordinates missing from jsdom's native PointerEvent implementation.
 **/
function move(element: Element, x = 0, y = 0): void {
  const event = new Event('pointermove', { bubbles: true, cancelable: true });
  Object.defineProperties(event, { clientX: { value: x }, clientY: { value: y } });
  fireEvent(element, event);
}

/**
 * Exercise rendering and hydration through the same public actions and image semantics.
 **/
export function bounceContracts(render: (element: ReactElement) => RenderResult): void {
  it('exposes passive photographs without adding tab stops', () => {
    // arrange
    const element = example();
    // act
    const view = render(element);
    // assert
    expect(screen.getByRole('group', { name: 'Photo cards' })).toBeVisible();
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
    expect(view.container.querySelectorAll('[tabindex]')).toHaveLength(0);
  });
  it('renders source strings as decorative images', () => {
    // arrange
    const element = <BounceCards images={['data:image/png,decorative']} />;
    // act
    const view = render(element);
    // assert
    expect(view.container.querySelector('img')).toHaveAttribute('alt', '');
  });
  it('uses each source as its stable default identity', () => {
    // arrange
    const clicked = vi.fn();
    render(<BounceCards images={[{ src: 'data:image/png,first' }]} onCardClick={clicked} />);
    // act
    fireEvent.click(screen.getByRole('button', { name: 'Card 1' }));
    // assert
    expect(clicked).toHaveBeenCalledWith(0, {
      id: 'data:image/png,first',
      src: 'data:image/png,first',
      alt: '',
    });
  });
  it('forwards native wrapper properties, handlers, ref and scoped styles', () => {
    // arrange
    const ref = createRef<HTMLDivElement>(),
      clicked = vi.fn();
    render(
      <BounceCards
        images={images}
        ref={ref}
        id="gallery"
        className="instance"
        title="Photo collection"
        label="Nature"
        style={{ '--fs-bounce-cards-radius': '8px' }}
        onClick={clicked}
      />,
    );
    // act
    fireEvent.click(screen.getByRole('group', { name: 'Nature' }));
    // assert
    expect(ref.current).toHaveAttribute('id', 'gallery');
    expect(ref.current).toHaveClass('instance');
    expect(ref.current).toHaveAttribute('title', 'Photo collection');
    expect(ref.current?.style.getPropertyValue('--fs-bounce-cards-radius')).toBe('8px');
    expect(clicked).toHaveBeenCalledOnce();
  });
  it('uses a native accessible-name override', () => {
    // arrange
    const element = example({ 'aria-label': 'Project photographs' });
    // act
    render(element);
    // assert
    expect(screen.getByRole('group', { name: 'Project photographs' })).toBeVisible();
  });
  it('preserves an externally labelled group', () => {
    // arrange
    const element = (
      <>
        <h2 id="gallery-title">Nature photographs</h2>
        {example({ 'aria-labelledby': 'gallery-title' })}
      </>
    );
    // act
    render(element);
    // assert
    expect(screen.getByRole('group', { name: 'Nature photographs' })).toBeVisible();
  });
  it('activates a native card action once by pointer', async () => {
    // arrange
    const user = userEvent.setup(),
      clicked = vi.fn();
    render(example({ onCardClick: clicked }));
    // act
    await user.click(screen.getByRole('button', { name: 'Second landscape' }));
    // assert
    expect(clicked).toHaveBeenCalledExactlyOnceWith(1, images[1]);
  });
  it.each([{ key: '{Enter}' }, { key: ' ' }])(
    'activates a card once with $key',
    async ({ key }) => {
      // arrange
      const user = userEvent.setup(),
        clicked = vi.fn();
      render(example({ onCardClick: clicked }));
      await user.tab();
      // act
      await user.keyboard(key);
      // assert
      expect(clicked).toHaveBeenCalledExactlyOnceWith(0, images[0]);
    },
  );
  it('uses localized action names', () => {
    // arrange
    const element = example({
      onCardClick: vi.fn(),
      getCardLabel: (index) => `Afficher la photo ${index + 1}`,
    });
    // act
    render(element);
    // assert
    expect(screen.getByRole('button', { name: 'Afficher la photo 1' })).toHaveAttribute(
      'type',
      'button',
    );
  });
  it('keeps button activation from submitting a surrounding form', async () => {
    // arrange
    const user = userEvent.setup(),
      submitted = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted();
        }}
      >
        {example({ onCardClick: vi.fn() })}
      </form>,
    );
    // act
    await user.click(screen.getByRole('button', { name: 'First landscape' }));
    // assert
    expect(submitted).not.toHaveBeenCalled();
  });
  it('brings keyboard focus forward even when pointer inspection is disabled', async () => {
    // arrange
    const user = userEvent.setup();
    render(example({ enableHover: false, onCardClick: vi.fn() }));
    // act
    await user.tab();
    // assert
    expect(screen.getByRole('button', { name: 'First landscape' }).parentElement).toHaveAttribute(
      'data-active',
      'true',
    );
  });
  it('clears focus inspection on blur', () => {
    // arrange
    render(example({ onCardClick: vi.fn() }));
    const button = screen.getByRole('button', { name: 'First landscape' });
    fireEvent.focus(button);
    // act
    fireEvent.blur(button);
    // assert
    expect(button.parentElement).toHaveAttribute('data-active', 'false');
  });
  it('retains keyboard-owned prominence after the pointer leaves', () => {
    // arrange
    render(example({ onCardClick: vi.fn() }));
    const button = screen.getByRole('button', { name: 'First landscape' });
    fireEvent.focus(button);
    // act
    fireEvent.pointerLeave(screen.getByRole('group'));
    // assert
    expect(button.parentElement).toHaveAttribute('data-active', 'true');
  });
  it('inspects the nearest original card under the pointer', () => {
    // arrange
    const view = render(example());
    // act
    move(screen.getByRole('group'));
    // assert
    expect(view.container.querySelectorAll('[data-active="true"]')).toHaveLength(1);
    expect(view.container.querySelectorAll('li')[1]).toHaveAttribute('data-active', 'true');
  });
  it('clears pointer inspection outside the card fan', () => {
    // arrange
    const view = render(example());
    move(screen.getByRole('group'));
    // act
    move(screen.getByRole('group'), 500, 500);
    // assert
    expect(view.container.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });
  it('clears pointer inspection when leaving the wrapper', () => {
    // arrange
    const view = render(example());
    move(screen.getByRole('group'));
    // act
    fireEvent.pointerLeave(screen.getByRole('group'));
    // assert
    expect(view.container.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });
  it('forwards pointer leave to its consumer', () => {
    // arrange
    const handler = vi.fn();
    render(example({ onPointerLeave: handler }));
    // act
    fireEvent.pointerLeave(screen.getByRole('group'));
    // assert
    expect(handler).toHaveBeenCalledOnce();
  });
  it('honors canceled pointer inspection', () => {
    // arrange
    const view = render(example({ onPointerMove: (event) => event.preventDefault() }));
    // act
    move(screen.getByRole('group'));
    // assert
    expect(view.container.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });
  it('disables pointer inspection when requested', () => {
    // arrange
    const view = render(example({ enableHover: false }));
    // act
    move(screen.getByRole('group'));
    // assert
    expect(view.container.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });
  it('preserves a card node when its source order changes', () => {
    // arrange
    const view = render(example({ onCardClick: vi.fn() }));
    const first = screen.getByRole('button', { name: 'First landscape' });
    // act
    view.rerender(example({ images: [...images].reverse(), onCardClick: vi.fn() }));
    // assert
    expect(screen.getByRole('button', { name: 'First landscape' })).toBe(first);
  });
  it('removes prominence when the inspected card disappears', () => {
    // arrange
    const view = render(example({ onCardClick: vi.fn() }));
    fireEvent.focus(screen.getByRole('button', { name: 'First landscape' }));
    // act
    view.rerender(example({ images: images.slice(1), onCardClick: vi.fn() }));
    // assert
    expect(view.container.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });
  it('keeps a failed passive photo description', () => {
    // arrange
    render(example());
    // act
    fireEvent.error(screen.getByRole('img', { name: 'First landscape' }));
    // assert
    expect(screen.getByRole('img', { name: 'First landscape' })).toHaveTextContent(
      'Image unavailable',
    );
  });
  it('names a failed decorative photo fallback', () => {
    // arrange
    const view = render(<BounceCards images={['data:image/png,failed']} />);
    // act
    fireEvent.error(view.container.querySelector('img')!);
    // assert
    expect(screen.getByRole('img', { name: 'Image unavailable' })).toBeVisible();
  });
  it('keeps the native action name when its photo fails', () => {
    // arrange
    render(example({ onCardClick: vi.fn() }));
    const button = screen.getByRole('button', { name: 'First landscape' });
    // act
    fireEvent.error(button.querySelector('img')!);
    // assert
    expect(button).toHaveTextContent('Image unavailable');
    expect(button).toHaveAccessibleName('First landscape');
  });
  it('retries a failed image when the same item receives a new source', () => {
    // arrange
    const view = render(example());
    fireEvent.error(screen.getByRole('img', { name: 'First landscape' }));
    // act
    view.rerender(example({ images: [{ ...images[0]!, src: 'data:image/png,replacement' }] }));
    // assert
    expect(screen.getByRole('img', { name: 'First landscape' })).toHaveAttribute(
      'src',
      'data:image/png,replacement',
    );
  });
  it('renders a custom empty message', () => {
    // arrange
    const element = example({ images: [], emptyMessage: 'No project photos yet.' });
    // act
    render(element);
    // assert
    expect(screen.getByText('No project photos yet.')).toBeVisible();
  });
  it('renders the default empty message', () => {
    // arrange
    const element = example({ images: [] });
    // act
    render(element);
    // assert
    expect(screen.getByText('No photos to display.')).toBeVisible();
  });
  it('fits the scene after only its container width changes', () => {
    // arrange
    render(example());
    const root = screen.getByRole('group');
    // act
    act(() => resizeFan(root, 320));
    // assert
    expect(root).toHaveAttribute('data-layout', 'fan');
    expect(Number(root.style.getPropertyValue('--fan-layout-scale'))).toBeLessThan(1);
  });
  it('uses a grid when scaling would make action targets too small', () => {
    // arrange
    const view = render(example());
    const root = screen.getByRole('group');
    act(() => resizeFan(root, 60));
    // act
    move(root);
    // assert
    expect(root).toHaveAttribute('data-layout', 'grid');
    expect(view.container.querySelectorAll('[data-active="true"]')).toHaveLength(0);
  });
  it('supports caller-defined positions without changing the photo content', () => {
    // arrange
    const element = example({
      positions: [
        { x: -120, y: 20, rotation: -10 },
        { x: 0, y: -10 },
        { x: 120, y: 20, rotation: 10 },
      ],
      shadow: false,
    });
    // act
    const view = render(element);
    // assert
    expect(view.container.querySelector('li')?.style.getPropertyValue('--fan-x')).toBe('-120px');
    expect(screen.getByRole('group')).toHaveAttribute('data-shadow', 'false');
  });
}
