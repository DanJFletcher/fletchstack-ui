import { expect, it } from 'vitest';
import { fanBounds, fanImages, fanSettings, fanSlots, nearestCard } from '../../src/components/bounce-cards/geometry';
import type { BounceCardsProps } from '../../src/components/bounce-cards/types';

/**
 * Check public geometry boundaries separately from native DOM interactions.
 **/
export function bounceGeometryContracts(): void {
  it.each([{ containerWidth: 0 }, { containerHeight: -1 }, { cardSize: 20 }, { cardSize: NaN }, { spread: -1 }, { pushDistance: -1 }, { animationDelay: -1 }, { animationStagger: -1 }, { bounciness: -1 }, { bounciness: 2 }, { hoverScale: 0 }, { hoverScale: 3 }])('rejects invalid geometry %#', props => {
    // arrange
    const given: BounceCardsProps = { images: [], ...props };
    // act
    const act = () => fanSettings(given);
    // assert
    expect(act).toThrow('BounceCards');
  });
  it.each([{ images: [''] }, { images: [{ src: '' }] }, { images: [{ id: '', src: 'first' }] }, { images: ['same', 'same'] }])('rejects ambiguous or empty image data %#', ({ images }) => {
    // arrange
    const given = images;
    // act
    const act = () => fanImages(given);
    // assert
    expect(act).toThrow('BounceCards');
  });
  it('accepts duplicate sources with explicit unique IDs', () => {
    // arrange
    const given = [{ id: 'one', src: 'same' }, { id: 'two', src: 'same' }];
    // act
    const result = fanImages(given);
    // assert
    expect(result.map(image => image.id)).toEqual(['one', 'two']);
  });
  it('generates symmetric fan centers with a curved outer position', () => {
    // arrange
    const settings = fanSettings({ images: [], spread: 80, rotation: 10, arc: 20 });
    // act
    const result = fanSlots(settings, 3);
    // assert
    expect(result).toEqual([{ x: -80, y: 20, rotation: 10 }, { x: 0, y: 0, rotation: 5 }, { x: 80, y: 20, rotation: -3 }]);
  });
  it('rejects non-finite custom positions', () => {
    // arrange
    const settings = fanSettings({ images: [] });
    // act
    const act = () => fanSlots(settings, 1, [{ x: Infinity, y: 0 }]);
    // assert
    expect(act).toThrow('BounceCards positions must be finite.');
  });
  it('keeps a single photo centered without dividing by zero', () => {
    // arrange
    const settings = fanSettings({ images: [] });
    // act
    const result = fanSlots(settings, 1);
    // assert
    expect(result).toEqual([{ x: 0, y: 0, rotation: 10 }]);
  });
  it('reserves a finite empty scene', () => {
    // arrange
    const settings = fanSettings({ images: [] });
    // act
    const result = fanBounds(settings, []);
    // assert
    expect(result.width).toBeGreaterThan(320);
    expect(result.height).toBeGreaterThan(0);
  });
  it.each([{ point: { x: 500, y: 0 }, slots: [{ x: 0, y: 0, rotation: 0 }] }, { point: { x: 0, y: 500 }, slots: [{ x: 0, y: 0, rotation: 0 }] }, { point: { x: 0, y: 0 }, slots: [] }])('ignores a pointer outside the photo set %#', ({ point, slots }) => {
    // arrange
    const size = 200;
    // act
    const result = nearestCard(point, slots, size);
    // assert
    expect(result).toBe(-1);
  });
}
