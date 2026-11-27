import type { BounceCardsImage, BounceCardsPosition, BounceCardsProps } from './types.js';

const defaults = {
  containerWidth: 900,
  containerHeight: 400,
  cardSize: 200,
  spread: 85,
  rotation: 10,
  arc: 0,
  pushDistance: 160,
  hoverScale: 1.06,
  bounciness: 0.6,
  animationDelay: 0.5,
  animationStagger: 0.06,
};
export type FanSettings = typeof defaults;
export type FanImage = BounceCardsImage & { id: string; alt: string };
export type FanSlot = Required<BounceCardsPosition>;
const pattern = [1, 0.5, -0.3, -1, 0.2, 0.75, -0.6, 0.35, -0.85, 0.1];

/**
 * Apply documented geometry defaults while rejecting dimensions that cannot be laid out.
 **/
export function fanSettings(props: BounceCardsProps): FanSettings {
  const settings = Object.fromEntries(
    Object.entries(defaults).map(([key, value]) => [key, props[key as keyof FanSettings] ?? value]),
  ) as FanSettings;
  if (Object.values(settings).some((value) => !Number.isFinite(value))) {
    throw new Error('BounceCards geometry must be finite.');
  }
  if (settings.cardSize < 44 || settings.containerWidth <= 0 || settings.containerHeight <= 0) {
    throw new Error('BounceCards requires positive containers and cards at least 44px.');
  }
  if (
    settings.spread < 0 ||
    settings.pushDistance < 0 ||
    settings.animationDelay < 0 ||
    settings.animationStagger < 0
  ) {
    throw new Error('BounceCards spacing and delays must not be negative.');
  }
  if (
    settings.bounciness < 0 ||
    settings.bounciness > 1 ||
    settings.hoverScale < 1 ||
    settings.hoverScale > 2
  ) {
    throw new Error('BounceCards bounciness is 0–1 and hoverScale is 1–2.');
  }
  return settings;
}

/**
 * Keep photo identity stable across reordering; string sources are decorative by default.
 **/
export function fanImages(images: BounceCardsProps['images']): FanImage[] {
  const cards = images.map((image) =>
    typeof image === 'string'
      ? { src: image, id: image, alt: '' }
      : { ...image, id: image.id ?? image.src, alt: image.alt ?? '' },
  );
  if (
    cards.some((image) => !image.id.trim() || !image.src.trim()) ||
    new Set(cards.map((image) => image.id)).size !== cards.length
  ) {
    throw new Error('BounceCards needs non-empty sources and unique image IDs.');
  }
  return cards;
}

/**
 * Position cards around the center with the reference's deliberately irregular tilts.
 **/
export function fanSlots(
  settings: FanSettings,
  count: number,
  positions?: readonly BounceCardsPosition[],
): FanSlot[] {
  const middle = (count - 1) / 2;
  return Array.from({ length: count }, (_, index) => {
    const offset = index - middle,
      custom = positions?.[index];
    const slot = custom
      ? { ...custom, rotation: custom.rotation ?? 0 }
      : {
          x: offset * settings.spread,
          y: settings.arc * (offset / Math.max(1, middle)) ** 2,
          rotation: settings.rotation * pattern[index % pattern.length]!,
        };
    if (Object.values(slot).some((value) => !Number.isFinite(value))) {
      throw new Error('BounceCards positions must be finite.');
    }
    return slot;
  });
}

/**
 * Reserve all rotated corners, scaled cards, pushed neighbors and focus outlines.
 **/
export function fanBounds(
  settings: FanSettings,
  slots: readonly FanSlot[],
): { width: number; height: number } {
  const radius = (settings.cardSize * Math.SQRT2 * settings.hoverScale) / 2 + 8;
  const x = Math.max(0, ...slots.map((slot) => Math.abs(slot.x))) + radius + settings.pushDistance;
  const y = Math.max(0, ...slots.map((slot) => Math.abs(slot.y))) + radius;
  return { width: x * 2, height: y * 2 };
}

/**
 * Select from fixed source positions so moving neighbors do not cause hover oscillation.
 **/
export function nearestCard(
  point: { x: number; y: number },
  slots: readonly FanSlot[],
  size: number,
): number {
  let nearest = -1,
    distance = Infinity;
  slots.forEach((slot, index) => {
    const gap = Math.abs(point.x - slot.x);
    if (gap < distance && Math.abs(point.y - slot.y) <= size / 2) {
      nearest = index;
      distance = gap;
    }
  });
  return distance <= size / 2 ? nearest : -1;
}
