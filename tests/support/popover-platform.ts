import { afterAll, beforeAll } from 'vitest';

const target = HTMLElement.prototype;
const descriptors = new Map<string, PropertyDescriptor | undefined>();
let previousObserver: typeof ResizeObserver;
beforeAll(() => {
  previousObserver = globalThis.ResizeObserver;
  for (const name of ['showPopover', 'hidePopover']) {
    descriptors.set(name, Object.getOwnPropertyDescriptor(target, name));
  }
  Object.defineProperties(target, {
    showPopover: {
      configurable: true,
      value(this: HTMLElement) {
        this.style.display = 'block';
      },
    },
    hidePopover: {
      configurable: true,
      value(this: HTMLElement) {
        this.style.display = 'none';
      },
    },
  });
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterAll(() => {
  globalThis.ResizeObserver = previousObserver;
  for (const [name, descriptor] of descriptors) {
    if (descriptor) {
      Object.defineProperty(target, name, descriptor);
    } else {
      Reflect.deleteProperty(target, name);
    }
  }
});
