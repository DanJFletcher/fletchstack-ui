import { expect, it } from 'vitest';
import { validateCarousel, clampIndex, nextIndex } from '../../src/components/carousel/carousel-policy';

/**
 * Reject ambiguous public configuration consistently on server and client.
 **/
export function carouselPolicyContracts(): void {
  it.each([{ label: ' ', slides: [] }, { label: 'Stories', slides: [{ id: '', content: null }] }, { label: 'Stories', slides: [{ id: 'same', content: null }, { id: 'same', content: null }] }, { label: 'Stories', slides: [], frameAspectRatio: 0 }, { label: 'Stories', slides: [], frameAspectRatio: Infinity }])('rejects invalid configuration %#', props => {
    // arrange
    const given = props;
    // act
    const act = () => validateCarousel(given);
    // assert
    expect(act).toThrow(Error);
  });
  it('accepts an empty set with a valid reserved frame', () => {
    // arrange
    const given = { label: 'Stories', slides: [], frameAspectRatio: 16 / 9 };
    // act
    const result = validateCarousel(given);
    // assert
    expect(result).toBeUndefined();
  });
  it('resolves an empty non-looping selection to zero', () => {
    // arrange
    const given = -2;
    // act
    const result = nextIndex(given, 0, true);
    // assert
    expect(result).toBe(0);
  });
  it('clamps an oversized index to the final slide', () => {
    // arrange
    const given = 100;
    // act
    const result = clampIndex(given, 3);
    // assert
    expect(result).toBe(2);
  });
}
