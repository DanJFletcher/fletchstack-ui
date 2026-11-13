import { act } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Replace only viewport observation while keeping React, native links and disclosure events real.
 **/
export function breadcrumbViewport(initial: boolean | ((query: string) => boolean)) {
  let matches = initial;
  const listeners = new Set<() => void>();
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() { return typeof matches === 'function' ? matches(query) : matches; },
    addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
  }));

  return { change: (next: boolean) => act(() => { matches = next; [...listeners].forEach(listener => listener()); }) };
}
