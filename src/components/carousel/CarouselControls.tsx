import { useEffect, useRef, type ReactElement, type RefObject } from 'react';
import { ChevronDownIcon } from '../icon/named/ChevronDownIcon.js';
import type { CarouselProps } from './types.js';
import type { CarouselModel } from './useCarousel.js';

type Props = { props: CarouselProps; model: CarouselModel; viewport: string };

/**
 * Reserve the actual wrapping controls height for safe-area overlays.
 **/
function useControlHeight(): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controls = ref.current!;
    const frame = controls.parentElement!;
    /**
     * Refresh geometry after content, fonts or container width change.
     **/
    const update = () => frame.style.setProperty('--fs-carousel-controls-height', `${controls.getBoundingClientRect().height}px`);
    const observer = new ResizeObserver(update);
    observer.observe(controls);
    update();
    return () => observer.disconnect();
  }, []);
  return ref;
}

/**
 * Offer individually named dot targets or a readable fractional position.
 **/
function Indicators({ props, model, viewport }: Props) {
  if (props.indicators === 'none') { return null; }
  if (props.indicators === 'fraction') { return <span className="fs-carousel__fraction">{model.index + 1} / {props.slides.length}</span>; }

  return <div className="fs-carousel__indicators" role="group" aria-label={`${props.label} slide indicators`} data-target-size={props.indicatorTargetSize ?? 'comfortable'}>
    {props.slides.map((slide, index) => <button key={slide.id} type="button" className="fs-carousel__indicator" aria-label={props.getIndicatorLabel?.(index, props.slides.length) ?? `Go to slide ${index + 1}`} aria-current={index === model.index ? 'true' : undefined} aria-controls={viewport} onClick={() => model.select(index)} />)}
  </div>;
}

/**
 * Keep the explicit rotation control available while stopped by focus or reduced motion.
 **/
function Rotation({ props, model }: Omit<Props, 'viewport'>) {
  if (!props.autoPlay) { return null; }
  return <button type="button" className="fs-carousel__rotation" data-rotation="true" disabled={model.reduced || props.slides.length < 2} onPointerDown={() => { model.pointerStop.current = model.playing; }} onClick={model.toggle}>
    {model.playing ? (props.pauseLabel ?? 'Pause slide rotation') : (props.startLabel ?? 'Start slide rotation')}
  </button>;
}

/**
 * Provide boundary-aware native navigation and controls without covering content by default.
 **/
export function CarouselControls({ props, model, viewport }: Props): ReactElement {
  const arrows = props.showControls !== false, controls = useControlHeight();
  return <div ref={controls} className="fs-carousel__controls">
    {arrows && <button type="button" className="fs-carousel__arrow fs-carousel__arrow--previous" aria-label={props.previousLabel ?? 'Previous slide'} aria-controls={viewport} disabled={!props.loop && model.index === 0} onClick={() => model.select(model.index - 1)}><ChevronDownIcon /></button>}
    <Indicators props={props} model={model} viewport={viewport} />
    {arrows && <button type="button" className="fs-carousel__arrow fs-carousel__arrow--next" aria-label={props.nextLabel ?? 'Next slide'} aria-controls={viewport} disabled={!props.loop && model.index === props.slides.length - 1} onClick={() => model.select(model.index + 1)}><ChevronDownIcon /></button>}
    <Rotation props={props} model={model} />
  </div>;
}
