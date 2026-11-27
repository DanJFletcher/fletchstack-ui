import { useState } from 'react';
import { BounceCards } from '../BounceCards';
import type { BounceCardsImage, BounceCardsProps } from '../types';

export const naturePhotos: readonly BounceCardsImage[] = [
  {
    id: 'lilies',
    src: new URL('./assets/photo-1.jpg', import.meta.url).href,
    alt: 'White lilies with red stamens',
  },
  {
    id: 'woodland',
    src: new URL('./assets/photo-2.jpg', import.meta.url).href,
    alt: 'Golden woodland seen through rain',
  },
  {
    id: 'mountains',
    src: new URL('./assets/photo-3.jpg', import.meta.url).href,
    alt: 'Pink clouds above misty blue mountains',
  },
  {
    id: 'flowers',
    src: new URL('./assets/photo-4.jpg', import.meta.url).href,
    alt: 'Blue flowers among green grasses',
  },
  {
    id: 'sunset',
    src: new URL('./assets/photo-5.jpg', import.meta.url).href,
    alt: 'Orange sunset reflected through dark branches',
  },
];

/**
 * Show the reference photo fan as an ordinary consumer with a real native button action.
 **/
export function BounceCardsDemo(props: Partial<BounceCardsProps>) {
  const [selected, setSelected] = useState('None');
  return (
    <div className="bounce-demo__gallery">
      <BounceCards
        images={naturePhotos}
        onCardClick={(_index, image) => setSelected(image.alt ?? 'Photo')}
        {...props}
      />
      <output aria-label="Selected photograph">{selected}</output>
    </div>
  );
}

/**
 * Inherit the same photographic composition from Corporate and Luna tokens.
 **/
export function BounceCardsExample() {
  return (
    <div className="bounce-demo">
      <h1>BounceCards</h1>
      <p>A playful photo fan. Hover a photograph or use Tab to inspect it.</p>
      {(['corporate', 'luna'] as const).map((theme) => (
        <section key={theme} data-theme={theme} className="bounce-demo__theme">
          <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2>
          <BounceCardsDemo />
        </section>
      ))}
    </div>
  );
}

/**
 * Replay a purely visual entrance by explicitly remounting the example.
 **/
export function ReplayBounceCards() {
  const [replay, setReplay] = useState(0);
  return (
    <>
      <button type="button" onClick={() => setReplay((value) => value + 1)}>
        Replay entrance
      </button>
      <BounceCardsDemo key={replay} />
    </>
  );
}

/**
 * Preserve identity and order when the caller rearranges photo data.
 **/
export function ReorderedBounceCards() {
  const [reversed, reverse] = useState(false);
  return (
    <>
      <button type="button" onClick={() => reverse((value) => !value)}>
        Reverse photographs
      </button>
      <BounceCardsDemo images={reversed ? [...naturePhotos].reverse() : naturePhotos} />
    </>
  );
}

/**
 * Customize only one instance while nested themes reset semantic frame values.
 **/
export function BounceCardsOverrides() {
  return (
    <>
      <BounceCardsDemo
        label="Custom photo fan"
        style={{ '--fs-bounce-cards-radius': '4px', '--fs-bounce-cards-border-width': '8px' }}
      />
      <BounceCardsDemo label="Default photo fan" />
    </>
  );
}

/**
 * Let actions remain usable when a dense data set requires a wrapping grid.
 **/
export function DenseBounceCards() {
  const images = Array.from({ length: 24 }, (_, index) => ({
    ...naturePhotos[index % naturePhotos.length]!,
    id: `photo-${index}`,
  }));
  return (
    <div className="bounce-demo__narrow">
      <BounceCardsDemo images={images} />
    </div>
  );
}
