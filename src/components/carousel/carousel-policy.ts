import type { CarouselProps, CarouselSlide } from './types.js';

/**
 * Reject ambiguous slide identity, unnamed regions and invalid reserved frames.
 **/
export function validateCarousel({ slides, label, frameAspectRatio }: CarouselProps): void {
  if (!label.trim()) { throw new Error('Carousel requires a concise label.'); }
  const ids = slides.map(slide => slide.id);
  if (ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) { throw new Error('Carousel slide IDs must be unique and non-empty.'); }
  if (frameAspectRatio !== undefined && (!Number.isFinite(frameAspectRatio) || frameAspectRatio <= 0)) { throw new Error('Carousel frameAspectRatio must be positive and finite.'); }
}

/**
 * Resolve invalid or out-of-range selections to the nearest available slide.
 **/
export function clampIndex(index: number, count: number): number {
  return Number.isFinite(index) ? Math.max(0, Math.min(Math.trunc(index), Math.max(0, count - 1))) : 0;
}

/**
 * Wrap navigation only when the caller opts into looping.
 **/
export function nextIndex(index: number, count: number, loop: boolean): number {
  return loop && count > 0 ? ((index % count) + count) % count : clampIndex(index, count);
}

/**
 * Supply a concise named slide with its position in the set.
 **/
export function slideLabel(index: number, total: number, slide: CarouselSlide): string {
  const prefix = slide.label ? slide.label + ', ' : '';
  return `${prefix}${index + 1} of ${total}`;
}
