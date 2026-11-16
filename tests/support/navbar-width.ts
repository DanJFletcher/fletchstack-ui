import { act } from '@testing-library/react';
import { vi } from 'vitest';

/**
 * Replace only container-size observation while retaining real rendering and native interaction.
 **/
export function navbarWidth(initial = 1000) {
  const observers = new Map<Element, (entries: ResizeObserverEntry[]) => void>();
  const entry = (width: number) => [{ contentRect: { width } } as ResizeObserverEntry];
  vi.stubGlobal('ResizeObserver', class {
    callback: (entries: ResizeObserverEntry[]) => void;
    constructor(callback: (entries: ResizeObserverEntry[]) => void) { this.callback = callback; }
    observe(element: HTMLElement) {
      element.style.setProperty('--fs-navbar-collapse-width', element.style.getPropertyValue('--fs-navbar-collapse-width') || '720px');
      observers.set(element, this.callback); this.callback(entry(initial));
    }
    disconnect() { observers.clear(); }
  });

  return { resize: (width: number) => act(() => observers.forEach(callback => callback(entry(width)))) };
}
