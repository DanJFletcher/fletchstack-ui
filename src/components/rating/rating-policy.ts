import type { RatingProps, RatingSymbol } from './types.js';

/**
 * Reject unsupported scales and ambiguous input selections instead of submitting a different score.
 **/
export function validateRating(props: RatingProps, value: number): void {
  const max = props.max ?? 5;
  const step = props.step ?? 1;
  if (!Number.isInteger(max) || max < 1 || max > 10) { throw new Error('Rating max must be an integer from 1 to 10.'); }
  if (step !== 1 && step !== 0.5) { throw new Error('Rating step must be 1 or 0.5.'); }
  if (!Number.isFinite(value) || value < 0 || value > max) { throw new Error('Rating value must be finite and between 0 and max.'); }
  if (props.mode === 'input' && !props.label?.trim()) { throw new Error('Input Rating needs a visible label.'); }
  if (props.mode === 'input' && value % step !== 0) { throw new Error('Input Rating value must match step.'); }
}

/**
 * Describe the numeric score and selected symbol without relying on visual fill.
 **/
export function ratingLabel(value: number, max: number, symbol: RatingSymbol): string {
  const names = { star: 'stars', heart: 'hearts', thumbs: 'thumbs up' };
  return `${value} out of ${max} ${names[symbol]}`;
}
