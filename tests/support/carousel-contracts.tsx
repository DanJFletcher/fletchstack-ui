import { createRef, type ReactElement } from 'react';
import { act, fireEvent, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Carousel } from '../../src/components/carousel/Carousel';
import type { CarouselProps } from '../../src/components/carousel/types';
import { setReducedMotion } from './carousel-platform';

const slides = [{ id: 'first', label: 'First', content: <><a href="#first">First link</a><input aria-label="Note" defaultValue="Original" /></> }, { id: 'second', content: <a href="#second">Second link</a> }, { id: 'third', content: <p>Third story</p> }];

/**
 * Supply a small caller-owned data set with interactive content.
 **/
function example(props: Partial<CarouselProps> = {}) {
  return <Carousel label="Stories" slides={slides} {...props} />;
}

/**
 * Dispatch unsupported pointer metadata at the DOM platform boundary.
 **/
function pointer(target: Element, type: string, x: number, y = 0, pointerType = 'touch'): void {
  const event = new Event(type, { bubbles: true });
  Object.defineProperties(event, { clientX: { value: x }, clientY: { value: y }, pointerType: { value: pointerType } });
  fireEvent(target, event);
}

/**
 * Exercise the same public behavior in independently rendered and hydrated DOM trees.
 **/
export function carouselContracts(render: (element: ReactElement) => RenderResult): void {
  it('names the region and active slide while hiding inactive content', () => {
    // arrange
    const element = example();
    // act
    render(element);
    // assert
    expect(screen.getByRole('region', { name: 'Stories' })).toHaveAttribute('aria-roledescription', 'carousel');
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toHaveAttribute('aria-hidden', 'false');
    expect(screen.queryByRole('link', { name: 'Second link' })).toBeNull();
  });
  it('forwards root refs and native attributes with scoped styling', () => {
    // arrange
    const ref = createRef<HTMLElement>();
    // act
    render(<Carousel label="Stories" slides={slides} ref={ref} id="gallery" className="instance" style={{ '--fs-carousel-radius': '32px' }} />);
    // assert
    expect(ref.current).toHaveAttribute('id', 'gallery');
    expect(ref.current).toHaveClass('instance');
    expect(ref.current?.style.getPropertyValue('--fs-carousel-radius')).toBe('32px');
  });
  it.each(['onFocus', 'onPointerEnter', 'onPointerLeave'] as const)('forwards %s to the native section', handlerName => {
    // arrange
    const handler = vi.fn(); render(example({ [handlerName]: handler }));
    const event = { onFocus: fireEvent.focus, onPointerEnter: fireEvent.pointerEnter, onPointerLeave: fireEvent.pointerLeave }[handlerName];
    // act
    event(screen.getByRole('region'));
    // assert
    expect(handler).toHaveBeenCalledOnce();
  });
  it('exposes the configured treatment without changing slide content', () => {
    // arrange
    const view = render(example({ variant: 'accent', size: 'lg', tabIndex: -1, controlsPosition: 'overlay', overlaySafeArea: false, frameAspectRatio: 2, indicatorTargetSize: 'compact' }));
    // act
    const region = screen.getByRole('region');
    // assert
    expect(region).toHaveAttribute('data-variant', 'accent');
    expect(region).toHaveAttribute('data-size', 'lg');
    expect(region).toHaveAttribute('tabindex', '-1');
    expect(view.container.querySelector('.fs-carousel__viewport')).toHaveStyle({ aspectRatio: '2' });
  });
  it('advances an uncontrolled selection on a named next action', async () => {
    // arrange
    const user = userEvent.setup(); render(example());
    // act
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it('requests a controlled change without replacing the supplied selection', async () => {
    // arrange
    const user = userEvent.setup(), changed = vi.fn(); render(example({ index: 0, onIndexChange: changed }));
    // act
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    // assert
    expect(changed).toHaveBeenCalledWith(1);
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('reflects a new controlled index', () => {
    // arrange
    const view = render(example({ index: 0 }));
    // act
    view.rerender(example({ index: 2 }));
    // assert
    expect(screen.getByRole('group', { name: '3 of 3' })).toBeVisible();
  });
  it('retains local input state across slide changes', async () => {
    // arrange
    const user = userEvent.setup(); render(example());
    await user.clear(screen.getByRole('textbox')); await user.type(screen.getByRole('textbox'), 'My note');
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    // act
    await user.click(screen.getByRole('button', { name: 'Previous slide' }));
    // assert
    expect(screen.getByRole('textbox')).toHaveValue('My note');
  });
  it.each([{ key: 'ArrowRight', expected: '2 of 3' }, { key: 'End', expected: '3 of 3' }, { key: 'Home', expected: 'First, 1 of 3' }, { key: 'ArrowLeft', expected: 'First, 1 of 3' }])('navigates using $key', ({ key, expected }) => {
    // arrange
    render(example());
    // act
    fireEvent.keyDown(screen.getByRole('region'), { key });
    // assert
    expect(screen.getByRole('group', { name: expected })).toBeVisible();
  });
  it.each(['ArrowLeft', 'ArrowRight'])('mirrors %s in RTL', key => {
    // arrange
    const changed = vi.fn(); render(example({ index: 1, style: { direction: 'rtl' }, onIndexChange: changed }));
    const changedIndex = key === 'ArrowLeft' ? 2 : 0;
    // act
    fireEvent.keyDown(screen.getByRole('region'), { key });
    // assert
    expect(changed).toHaveBeenCalledWith(changedIndex);
  });
  it.each([{ key: 'Tab' }, { key: 'ArrowRight', altKey: true }, { key: 'ArrowRight', ctrlKey: true }, { key: 'ArrowRight', metaKey: true }])('preserves native key behavior for $key', event => {
    // arrange
    render(example());
    // act
    fireEvent.keyDown(screen.getByRole('region'), event);
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('leaves embedded controls in charge of their arrow keys', () => {
    // arrange
    render(example());
    // act
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'ArrowRight' });
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('honors a consumer-canceled key event', () => {
    // arrange
    render(example({ onKeyDown: event => event.preventDefault() }));
    // act
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' });
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('wraps backwards when looping', async () => {
    // arrange
    const user = userEvent.setup(); render(example({ loop: true }));
    // act
    await user.click(screen.getByRole('button', { name: 'Previous slide' }));
    // assert
    expect(screen.getByRole('group', { name: '3 of 3' })).toBeVisible();
  });
  it('disables the final boundary when looping is off', () => {
    // arrange
    render(example({ defaultIndex: 2 }));
    // act
    const result = screen.getByRole('button', { name: 'Next slide' });
    // assert
    expect(result).toBeDisabled();
  });
  it('selects the slide requested by a dot', async () => {
    // arrange
    const user = userEvent.setup(); render(example());
    // act
    await user.click(screen.getByRole('button', { name: 'Go to slide 3' }));
    // assert
    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true');
  });
  it('uses caller-provided labels for localization', () => {
    // arrange
    const element = example({ previousLabel: 'Avant', nextLabel: 'Après', getSlideLabel: (index, count) => `Histoire ${index + 1}/${count}`, getIndicatorLabel: index => `Aller ${index + 1}` });
    // act
    render(element);
    // assert
    expect(screen.getByRole('group', { name: 'Histoire 1/3' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Aller 1' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('button', { name: 'Avant' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Après' })).toBeEnabled();
  });
  it('shows fractional position without dot buttons', () => {
    // arrange
    render(example({ defaultIndex: 1, indicators: 'fraction' }));
    // act
    const result = screen.getByText('2 / 3');
    // assert
    expect(result).toBeVisible();
    expect(screen.queryByRole('button', { name: 'Go to slide 1' })).toBeNull();
  });
  it('supports hiding all navigation controls', () => {
    // arrange
    render(example({ showControls: false, indicators: 'none' }));
    // act
    const result = screen.queryAllByRole('button');
    // assert
    expect(result).toHaveLength(0);
  });
  it.each([{ slides: [], expected: 'No slides to display.' }, { slides: [], emptyMessage: 'No stories yet', expected: 'No stories yet' }])('renders empty content: $expected', ({ expected, ...props }) => {
    // arrange
    const element = example(props);
    // act
    render(element);
    // assert
    expect(screen.getByText(expected)).toBeVisible();
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
  it.each([{ defaultIndex: -2 }, { defaultIndex: NaN }, { defaultIndex: 0.9 }])('clamps invalid initial index $defaultIndex', props => {
    // arrange
    const element = example(props);
    // act
    render(element);
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('clamps selection when the data set shrinks', () => {
    // arrange
    const view = render(example({ defaultIndex: 2 }));
    // act
    view.rerender(example({ slides: slides.slice(0, 1) }));
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 1' })).toBeVisible();
  });
  it('advances automatic rotation using the requested interval', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true, autoPlayInterval: 1200 }));
    // act
    act(() => vi.advanceTimersByTime(1200));
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it.each([undefined, NaN, Infinity])('defaults the automatic interval for %s', autoPlayInterval => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true, ...autoPlayInterval === undefined ? {} : { autoPlayInterval } }));
    act(() => vi.advanceTimersByTime(4999));
    // act
    act(() => vi.advanceTimersByTime(1));
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it('clamps short intervals to one second', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true, autoPlayInterval: 10 }));
    act(() => vi.advanceTimersByTime(999));
    // act
    act(() => vi.advanceTimersByTime(1));
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it('stops when keyboard focus reaches the carousel', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true }));
    fireEvent.focus(screen.getByRole('region'));
    // act
    act(() => vi.advanceTimersByTime(10000));
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('keeps the pause action named while hover temporarily pauses movement', () => {
    // arrange
    render(example({ autoPlay: true }));
    // act
    fireEvent.pointerEnter(screen.getByRole('region'));
    // assert
    expect(screen.getByRole('button', { name: 'Pause slide rotation' })).toBeEnabled();
  });
  it('pauses while hovered and resumes on leaving', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true }));
    fireEvent.pointerEnter(screen.getByRole('region')); act(() => vi.advanceTimersByTime(5000));
    fireEvent.pointerLeave(screen.getByRole('region'));
    // act
    act(() => vi.advanceTimersByTime(5000));
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it('stops autoplay after manual navigation', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true }));
    fireEvent.click(screen.getByRole('button', { name: 'Next slide' }));
    // act
    act(() => vi.advanceTimersByTime(10000));
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it('keeps a pause action paused when pointer focus arrives before click', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true }));
    const button = screen.getByRole('button', { name: 'Pause slide rotation' });
    fireEvent.pointerDown(button); fireEvent.focus(button); fireEvent.click(button);
    // act
    act(() => vi.advanceTimersByTime(10000));
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('allows explicit keyboard restart after focus stops rotation', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true, startLabel: 'Start', pauseLabel: 'Pause' }));
    fireEvent.focus(screen.getByRole('region')); fireEvent.click(screen.getByRole('button', { name: 'Start' }));
    // act
    act(() => vi.advanceTimersByTime(5000));
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it('turns off announcements while rotating', () => {
    // arrange
    const view = render(example({ autoPlay: true }));
    // act
    const track = view.container.querySelector('[aria-live]');
    // assert
    expect(track).toHaveAttribute('aria-live', 'off');
  });
  it('stops rotation immediately when reduced motion is requested live', () => {
    // arrange
    vi.useFakeTimers(); render(example({ autoPlay: true }));
    act(() => setReducedMotion(true));
    // act
    act(() => vi.advanceTimersByTime(10000));
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Start slide rotation' })).toBeDisabled();
  });
  it('cleans up a pending automatic advance on unmount', () => {
    // arrange
    vi.useFakeTimers(); const view = render(example({ autoPlay: true }));
    // act
    view.unmount();
    // assert
    expect(vi.getTimerCount()).toBe(0);
  });
  it.each([{ x: 130, y: 0, expected: 'First, 1 of 3' }, { x: 170, y: 0, expected: 'First, 1 of 3' }, { x: 40, y: 180, expected: 'First, 1 of 3' }, { x: 20, y: 0, expected: '2 of 3' }])('interprets swipe ending at $x,$y', ({ x, y, expected }) => {
    // arrange
    const view = render(example()); const viewport = view.container.querySelector('.fs-carousel__viewport')!;
    pointer(viewport, 'pointerdown', 150);
    // act
    pointer(viewport, 'pointerup', x, y);
    // assert
    expect(screen.getByRole('group', { name: expected })).toBeVisible();
  });
  it('wraps to the final slide on a backwards touch swipe', () => {
    // arrange
    const view = render(example({ loop: true })); const viewport = view.container.querySelector('.fs-carousel__viewport')!;
    pointer(viewport, 'pointerdown', 20);
    // act
    pointer(viewport, 'pointerup', 200);
    // assert
    expect(screen.getByRole('group', { name: '3 of 3' })).toBeVisible();
  });
  it('mirrors touch swipes in RTL', () => {
    // arrange
    const view = render(example({ style: { direction: 'rtl' } })); const viewport = view.container.querySelector('.fs-carousel__viewport')!;
    pointer(viewport, 'pointerdown', 20);
    // act
    pointer(viewport, 'pointerup', 150);
    // assert
    expect(screen.getByRole('group', { name: '2 of 3' })).toBeVisible();
  });
  it.each(['mouse', 'touch'])('ignores %s gestures starting on embedded controls', pointerType => {
    // arrange
    render(example()); const input = screen.getByRole('textbox');
    pointer(input, 'pointerdown', 150, 0, pointerType);
    // act
    pointer(input, 'pointerup', 20, 0, pointerType);
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
  it('cancels an abandoned touch gesture', () => {
    // arrange
    const view = render(example()); const viewport = view.container.querySelector('.fs-carousel__viewport')!;
    pointer(viewport, 'pointerdown', 150); pointer(viewport, 'pointercancel', 150);
    // act
    pointer(viewport, 'pointerup', 20);
    // assert
    expect(screen.getByRole('group', { name: 'First, 1 of 3' })).toBeVisible();
  });
}
