import { beforeEach, afterEach, vi } from 'vitest';
const updates = new Map<Element, () => void>();

/**
 * Deliver a deterministic ResizeObserver boundary notification after a width-only resize.
 **/
export function resizeFan(element: Element, width: number): void {
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: width });
  updates.get(element)!();
}
beforeEach(() => {
  updates.clear();
  vi.stubGlobal('ResizeObserver', class {
    private element?: Element;
    private update: () => void;
    /**
     * Retain the observer notification supplied by the component.
     **/
    constructor(update: () => void) { this.update = update; }
    observe = (element: Element) => { this.element = element; updates.set(element, this.update); };
    disconnect = () => { if (this.element) { updates.delete(this.element); } };
  });
});
afterEach(() => vi.unstubAllGlobals());
