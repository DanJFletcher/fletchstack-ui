import { useState } from 'react';
import { Carousel } from '../Carousel';
import type { CarouselProps, CarouselSlide } from '../types';

export const featuredSlides: readonly CarouselSlide[] = [
  {
    id: 'focus',
    label: 'Find your focus',
    content: (
      <article className="carousel-demo__slide">
        <p>STORY 01</p>
        <h3>Find your focus</h3>
        <p>A clear view of the work that matters most.</p>
        <a href="#focus">Explore focus</a>
        <label>
          Personal note
          <input aria-label="Personal note" defaultValue="First note" />
        </label>
      </article>
    ),
  },
  {
    id: 'flow',
    label: 'Build your flow',
    content: (
      <article className="carousel-demo__slide">
        <p>STORY 02</p>
        <h3>Build your flow</h3>
        <p>Bring projects and people together in one calm space.</p>
        <a href="#flow">Explore flow</a>
      </article>
    ),
  },
  {
    id: 'forward',
    label: 'Move forward',
    content: (
      <article className="carousel-demo__slide">
        <p>STORY 03</p>
        <h3>Move forward</h3>
        <p>Turn team momentum into meaningful progress.</p>
        <a href="#forward">Explore momentum</a>
      </article>
    ),
  },
];

/**
 * Share caller-owned content between Storybook and the isolated browser harness.
 **/
export function CarouselDemo(props: Partial<CarouselProps>) {
  return <Carousel label="Featured stories" slides={featuredSlides} {...props} />;
}

/**
 * Demonstrate one configuration inheriting both library themes.
 **/
export function CarouselExample() {
  return (
    <div className="carousel-demo">
      <h1>Carousel</h1>
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="carousel-demo__theme">
          <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
          <CarouselDemo />
        </section>
      ))}
    </div>
  );
}

/**
 * Keep the parent as the source of truth for selection.
 **/
export function ControlledCarousel() {
  const [index, setIndex] = useState(1);
  return (
    <>
      <CarouselDemo index={index} onIndexChange={setIndex} indicators="fraction" />
      <output aria-label="Selected slide">{index + 1}</output>
      <button onClick={() => setIndex(0)}>Reset selection</button>
    </>
  );
}

/**
 * Exercise wrapping targets with a larger caller-defined set.
 **/
export function ManySlides(props: Partial<CarouselProps> = {}) {
  return (
    <Carousel
      label="Gallery"
      {...props}
      slides={Array.from({ length: 12 }, (_, index) => ({
        id: `gallery-${index}`,
        label: `Gallery item ${index + 1}`,
        content: (
          <div className="carousel-demo__slide">
            <h3>Gallery item {index + 1}</h3>
            <p>Browse a larger set of featured stories.</p>
          </div>
        ),
      }))}
    />
  );
}

/**
 * Show a reserved frame containing long scrollable content.
 **/
export function ReservedCarousel() {
  return (
    <Carousel
      label="Long stories"
      frameAspectRatio={16 / 9}
      indicators="fraction"
      slides={[
        {
          id: 'long',
          content: (
            <article className="carousel-demo__slide">
              <h3>Make room for a longer story</h3>
              {Array.from({ length: 8 }, (_, index) => (
                <p key={index}>
                  A reserved frame keeps the page steady. Longer text remains available by scrolling
                  within the slide.
                </p>
              ))}
              <a href="#long">Read the story</a>
            </article>
          ),
        },
        { id: 'short', content: <h3>A shorter story</h3> },
      ]}
    />
  );
}

/**
 * Isolate per-instance semantic overrides from a neighboring default carousel.
 **/
export function CarouselOverrides() {
  return (
    <>
      <CarouselDemo
        label="Custom gallery"
        style={{ '--fs-carousel-radius': '32px', '--fs-carousel-padding': '24px' }}
      />
      <CarouselDemo label="Default gallery" />
    </>
  );
}
