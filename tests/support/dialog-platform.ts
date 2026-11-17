import { afterAll, beforeAll } from 'vitest';

const target = HTMLDialogElement.prototype;
const previous = new Map<string, PropertyDescriptor | undefined>();

beforeAll(() => {
  for (const key of ['showModal', 'close', 'getAnimations']) { previous.set(key, Object.getOwnPropertyDescriptor(target, key)); }
  Object.defineProperties(target, {
    showModal: { configurable: true, writable: true, value(this: HTMLDialogElement) { this.setAttribute('open', ''); } },
    close: { configurable: true, writable: true, value(this: HTMLDialogElement) { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); } },
    getAnimations: { configurable: true, writable: true, value() { return []; } },
  });
});
afterAll(() => {
  for (const [key, descriptor] of previous) {
    if (descriptor) { Object.defineProperty(target, key, descriptor); }
    else { Reflect.deleteProperty(target, key); }
  }
});
