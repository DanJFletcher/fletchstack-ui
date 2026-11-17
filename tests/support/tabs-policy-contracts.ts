import { expect, it } from 'vitest';
import { selectedTab, tabDestination, tabMovement, validateTabs } from '../../src/components/tabs/tabs-policy';

/**
 * Verify deterministic state and directional policies independently of browser layout.
 **/
export function tabsPolicyContracts() {
  it.each([
    { items: [{ id: '', label: 'Empty', content: null }], label: 'Workspace', expected: 'unique nonempty IDs' },
    { items: [{ id: 'a', label: 'First', content: null }, { id: 'a', label: 'Second', content: null }], label: 'Workspace', expected: 'unique nonempty IDs' },
    { items: [], label: ' ', expected: 'nonempty label' },
  ])('rejects an invalid configuration: $expected', ({ items, label, expected }) => {
    // arrange

    // act
    const result = () => validateTabs(items, label);

    // assert
    expect(result).toThrow(expected);
  });
  it.each([
    { key: 'Home', orientation: 'horizontal' as const, direction: 'ltr', expected: 'first' },
    { key: 'End', orientation: 'horizontal' as const, direction: 'ltr', expected: 'last' },
    { key: 'ArrowLeft', orientation: 'horizontal' as const, direction: 'ltr', expected: -1 },
    { key: 'ArrowRight', orientation: 'horizontal' as const, direction: 'ltr', expected: 1 },
    { key: 'ArrowLeft', orientation: 'horizontal' as const, direction: 'rtl', expected: 1 },
    { key: 'ArrowRight', orientation: 'horizontal' as const, direction: 'rtl', expected: -1 },
    { key: 'ArrowDown', orientation: 'horizontal' as const, direction: 'ltr', expected: undefined },
    { key: 'ArrowUp', orientation: 'horizontal' as const, direction: 'ltr', expected: undefined },
    { key: 'ArrowDown', orientation: 'vertical' as const, direction: 'ltr', expected: 1 },
    { key: 'ArrowUp', orientation: 'vertical' as const, direction: 'rtl', expected: -1 },
    { key: 'ArrowLeft', orientation: 'vertical' as const, direction: 'ltr', expected: undefined },
  ])('maps $orientation $direction $key to $expected', ({ key, orientation, direction, expected }) => {
    // arrange

    // act
    const result = tabMovement(key, orientation, direction);

    // assert
    expect(result).toBe(expected);
  });
  it.each([
    { movement: 'first' as const, current: 'b', expected: 'a' },
    { movement: 'last' as const, current: 'a', expected: 'b' },
    { movement: 1, current: 'b', expected: 'a' },
    { movement: -1, current: 'a', expected: 'b' },
  ])('resolves enabled movement $movement from $current', ({ movement, current, expected }) => {
    // arrange
    const given = ['a', 'b'];

    // act
    const result = tabDestination(given, current, movement);

    // assert
    expect(result).toBe(expected);
  });
  it('resolves no selection from an empty set', () => {
    // arrange
    const given: string[] = [];

    // act
    const result = selectedTab(given, undefined);

    // assert
    expect(result).toBeUndefined();
  });
}
