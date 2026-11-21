import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import { fanBounds, fanImages, fanSettings, fanSlots, nearestCard, type FanImage, type FanSettings, type FanSlot } from './geometry.js';
import type { BounceCardsStyle, BounceCardsProps } from './types.js';

export type FanStyle = BounceCardsStyle & { [property: `--fan-${string}`]: string | number | undefined };

export type FanModel = {
  root: RefObject<HTMLDivElement | null>;
  images: FanImage[];
  slots: FanSlot[];
  settings: FanSettings;
  bounds: { width: number; height: number };
  scale: number;
  grid: boolean;
  active: number;
  focus: (id: string | null) => void;
  clear: () => void;
  move: (event: PointerEvent<HTMLDivElement>) => void;
};

/**
 * Fit the complete fan to its own container, including resize without viewport changes.
 **/
function useWidth(root: RefObject<HTMLDivElement | null>, fallback: number): number {
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const element = root.current!;
    /**
     * Read layout width independently of card transforms.
     **/
    const update = () => setWidth(element.clientWidth || fallback);
    const observer = new ResizeObserver(update);
    observer.observe(element); update();
    return () => observer.disconnect();
  }, [root, fallback]);
  return width;
}

/**
 * Convert a pointer in the scaled stage to a stable source-position hit test.
 **/
function pointerCard(event: PointerEvent<HTMLDivElement>, model: Pick<FanModel, 'slots' | 'scale' | 'settings'>): number {
  const box = event.currentTarget.getBoundingClientRect();
  return nearestCard({ x: (event.clientX - box.left - box.width / 2) / model.scale, y: (event.clientY - box.top - box.height / 2) / model.scale }, model.slots, model.settings.cardSize);
}

/**
 * Preserve independent focus and hover ownership while data and container size change.
 **/
export function useFan(props: BounceCardsProps): FanModel {
  const root = useRef<HTMLDivElement>(null), [focused, focus] = useState<string | null>(null), [hovered, hover] = useState<string | null>(null);
  const images = fanImages(props.images), settings = fanSettings(props), slots = fanSlots(settings, images.length, props.positions);
  const bounds = fanBounds(settings, slots), width = useWidth(root, settings.containerWidth), scale = Math.min(1, width / bounds.width);
  const active = images.findIndex(image => image.id === (focused ?? hovered));
  return { root, images, slots, settings, bounds, scale, grid: scale * settings.cardSize < 44, active, focus, clear: () => hover(null), move: event => {
    if (event.defaultPrevented || props.enableHover === false) { return; }
    const index = pointerCard(event, { slots, scale, settings });
    hover(images[index]?.id ?? null);
  } };
}
