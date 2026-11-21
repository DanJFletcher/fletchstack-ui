import { useState, type ReactElement } from 'react';
import type { BounceCardsProps } from './types.js';
import type { FanImage } from './geometry.js';
import type { FanModel, FanStyle } from './useFan.js';

/**
 * Keep a failed resource's footprint and accessible image description available.
 **/
function Photo({ image, interactive }: { image: FanImage; interactive: boolean }): ReactElement {
  const [failed, fail] = useState(false);
  return failed ? <span className="fs-bounce-cards__fallback" role={interactive ? undefined : 'img'} aria-label={interactive ? undefined : image.alt || 'Image unavailable'}>Image unavailable</span> : <img src={image.src} alt={interactive ? '' : image.alt} draggable={false} decoding="async" onError={() => fail(true)} />;
}

/**
 * Resolve geometry independently from the entrance animation so inspection never replays it.
 **/
function cardStyle(model: FanModel, index: number): FanStyle {
  const slot = model.slots[index]!, active = model.active === index, { settings } = model;
  const push = model.active >= 0 && !active ? Math.sign(index - model.active) * settings.pushDistance : 0;
  return { '--fan-x': `${slot.x + push}px`, '--fan-y': `${slot.y - (active ? settings.cardSize * 0.04 : 0)}px`, '--fan-rotation': `${active ? 0 : slot.rotation}deg`, '--fan-scale': active ? settings.hoverScale : 1, '--fan-delay': `${settings.animationDelay + index * settings.animationStagger}s`, zIndex: active ? model.images.length + 1 : index + 1 };
}

/**
 * Use native buttons for consumer actions and passive images for decorative galleries.
 **/
export function FanCard({ image, index, model, props }: { image: FanImage; index: number; model: FanModel; props: BounceCardsProps }): ReactElement {
  const active = model.active === index, [inspected, inspect] = useState(false);
  const photo = <Photo key={image.src} image={image} interactive={Boolean(props.onCardClick)} />;
  return <li className="fs-bounce-cards__item" data-active={active} data-inspected={inspected} style={cardStyle(model, index)}>
    {props.onCardClick ? <button type="button" className="fs-bounce-cards__card" aria-label={props.getCardLabel?.(index, image) ?? (image.alt || `Card ${index + 1}`)} onFocus={() => { inspect(true); model.focus(image.id); }} onBlur={() => model.focus(null)} onClick={() => props.onCardClick!(index, image)}>{photo}</button> : <div className="fs-bounce-cards__card">{photo}</div>}
  </li>;
}
