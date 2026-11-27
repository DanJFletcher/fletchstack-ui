import type { TabsItem } from './types.js';

/**
 * Reject ambiguous identities and an unnamed tab list before generating relationships.
 **/
export function validateTabs(items: readonly TabsItem[], label: string): void {
  if (!label.trim()) {
    throw new Error('Tabs requires a nonempty label.');
  }
  const ids = items.map((item) => item.id);
  if (ids.some((id) => !id.trim()) || new Set(ids).size !== ids.length) {
    throw new Error('Tabs items need unique nonempty IDs.');
  }
}

/**
 * Resolve an unavailable selection to the first enabled item without emitting an interaction.
 **/
export function selectedTab(
  enabled: readonly string[],
  requested: string | undefined,
): string | undefined {
  return requested !== undefined && enabled.includes(requested) ? requested : enabled[0];
}

/**
 * Translate orientation and inherited direction into movement, leaving other keys native.
 **/
export function tabMovement(
  key: string,
  orientation: 'horizontal' | 'vertical',
  direction: string,
): number | 'first' | 'last' | undefined {
  if (key === 'Home') {
    return 'first';
  }
  if (key === 'End') {
    return 'last';
  }
  if (orientation === 'vertical') {
    if (key === 'ArrowDown') {
      return 1;
    }
    if (key === 'ArrowUp') {
      return -1;
    }
    return undefined;
  }
  const sign = direction === 'rtl' ? -1 : 1;
  if (key === 'ArrowRight') {
    return sign;
  }
  if (key === 'ArrowLeft') {
    return -sign;
  }
  return undefined;
}

/**
 * Find an enabled destination with boundary keys and wrapping relative movement.
 **/
export function tabDestination(
  ids: readonly string[],
  current: string | undefined,
  movement: number | 'first' | 'last',
): string | undefined {
  if (movement === 'first') {
    return ids[0];
  }
  if (movement === 'last') {
    return ids[ids.length - 1];
  }
  const index = ids.indexOf(current!);

  return ids[(index + movement + ids.length) % ids.length];
}
