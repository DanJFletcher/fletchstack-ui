import { beforeEach, afterEach, vi } from 'vitest';
let media: MediaQueryList;

/**
 * Model the browser's live preference boundary without replacing carousel logic.
 **/
export function setReducedMotion(matches: boolean): void {
  Object.defineProperty(media, 'matches', { value: matches, configurable: true });
  media.dispatchEvent(new Event('change'));
}
beforeEach(() => {
  media = Object.assign(new EventTarget(), { matches: false, media: '(prefers-reduced-motion: reduce)', onchange: null, addListener: vi.fn(), removeListener: vi.fn() }) as MediaQueryList;
  vi.stubGlobal('matchMedia', () => media);
  vi.stubGlobal('ResizeObserver', class { observe = vi.fn(); disconnect = vi.fn(); });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
