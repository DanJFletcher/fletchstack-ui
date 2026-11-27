import './popover-platform';
import { afterAll, beforeAll } from 'vitest';

const style = document.createElement('style');
beforeAll(() => {
  // jsdom does not load the theme stylesheet; supply the geometry token boundary.
  style.textContent =
    '.fs-tooltip__content { --fs-tooltip-viewport-inset:8px; --fs-tooltip-offset:8px; --fs-tooltip-max-width:288px; }';
  document.head.appendChild(style);
});
afterAll(() => style.remove());
