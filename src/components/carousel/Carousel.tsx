import { forwardRef, useId, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { CarouselControls } from './CarouselControls.js';
import { validateCarousel, slideLabel } from './carousel-policy.js';
import { useCarousel, type CarouselModel } from './useCarousel.js';
import { carouselKey, useCarouselSwipe } from './interaction.js';
import type { CarouselProps } from './types.js';
export type { CarouselProps, CarouselStyle, CarouselSlide } from './types.js';

/**
 * Keep slide-local state mounted while making inactive content unavailable immediately.
 **/
function Slides({ props, model, viewport }: { props: CarouselProps; model: CarouselModel; viewport: string }) {
  const swipe = useCarouselSwipe(model);
  return <div {...swipe} id={viewport} className="fs-carousel__viewport" style={{ aspectRatio: props.frameAspectRatio }}>
    <div className="fs-carousel__track" aria-live={model.rotating ? 'off' : 'polite'} aria-atomic="false">{props.slides.map((slide, index) => <div key={slide.id} role="group" aria-roledescription="slide" aria-label={(props.getSlideLabel ?? slideLabel)(index, props.slides.length, slide)} aria-hidden={index !== model.index}
      ref={node => { if (node) { node.inert = index !== model.index; } }} className="fs-carousel__slide" data-active={index === model.index} style={{ transform: `translateX(${(index - model.index) * 100}%)` }}>{slide.content}</div>)}</div>
  </div>;
}

/**
 * Remove component configuration before forwarding section attributes and event handlers.
 **/
function nativeProps(props: CarouselProps) {
  const native = { ...props };
  for (const key of ['label', 'slides', 'index', 'defaultIndex', 'onIndexChange', 'loop', 'showControls', 'indicators', 'indicatorTargetSize', 'controlsPosition', 'overlaySafeArea', 'frameAspectRatio', 'variant', 'size', 'autoPlay', 'autoPlayInterval', 'previousLabel', 'nextLabel', 'pauseLabel', 'startLabel', 'getSlideLabel', 'getIndicatorLabel', 'emptyMessage']) { Reflect.deleteProperty(native, key); }
  return native;
}

/**
 * Present caller-owned slides with accessible manual navigation and optional safe rotation.
 **/
export const Carousel: ForwardRefExoticComponent<CarouselProps & RefAttributes<HTMLElement>> = /* @__PURE__ */ forwardRef<HTMLElement, CarouselProps>(function Carousel(props, ref) {
  validateCarousel(props);
  const model = useCarousel(props), viewport = `carousel-${useId()}`;
  return <section {...nativeProps(props)} ref={ref} className={['fs-carousel', props.className].filter(Boolean).join(' ')} aria-label={props.label} aria-roledescription="carousel" tabIndex={props.tabIndex ?? 0} data-variant={props.variant ?? 'surface'} data-size={props.size ?? 'md'}
    onFocus={event => { props.onFocus?.(event); model.stop(true); }} onPointerEnter={event => { props.onPointerEnter?.(event); model.hover(true); }} onPointerLeave={event => { props.onPointerLeave?.(event); model.hover(false); }}
    onKeyDown={event => { props.onKeyDown?.(event); carouselKey(event, model, props.slides.length); }}>
    {props.slides.length === 0 ? <p className="fs-carousel__empty">{props.emptyMessage ?? 'No slides to display.'}</p> : <div className="fs-carousel__frame" data-position={props.controlsPosition ?? 'below'} data-safe-area={props.overlaySafeArea !== false} data-reserved={props.frameAspectRatio !== undefined}>
      <Slides props={props} model={model} viewport={viewport} /><CarouselControls props={props} model={model} viewport={viewport} />
    </div>}
  </section>;
});
