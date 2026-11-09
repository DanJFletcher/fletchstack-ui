import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement, version } from 'react';
import { renderToString } from 'react-dom/server';
import { Button, Icon, MoonIcon } from 'fletchstack-ui';
import * as library from 'fletchstack-ui';

assert.deepEqual(Object.keys(library).sort(), ['ArrowRightIcon', 'Button', 'CheckIcon', 'ChevronDownIcon', 'CloseIcon', 'ExternalLinkIcon', 'Icon', 'MoonIcon', 'PlusIcon', 'SunIcon']);
const element = createElement(Button, { variant: 'secondary', size: 'small', 'aria-label': 'Save settings' }, 'Save');
const html = renderToString(element);
assert.match(html, /type="button"/);
assert.match(html, /aria-label="Save settings"/);
assert.equal(renderToString(element), html);
for (const path of ['styles.css', 'tokens.css', 'button.css', 'icon.css']) {
  const content = readFileSync(new URL(import.meta.resolve(`fletchstack-ui/${path}`)), 'utf8');
  assert.ok(content.length > 0);
  if (['styles.css', 'tokens.css'].includes(path)) {
    assert.match(content, /--fs-space-gap-actions: 12px/);
    assert.match(content, /--fs-layout-section-gap: 64px/);
  }
}
console.log(`React ${version}: deterministic SSR and all stylesheet exports passed.`);

const icon = createElement(Icon, { label: ' Night mode ', viewBox: '0 0 32 32' }, createElement('path', { d: 'M4 4h24v24H4Z' }));
const iconMarkup = renderToString(icon);
assert.equal(renderToString(icon), iconMarkup);
assert.match(iconMarkup, /role="img" aria-label="Night mode"/);
assert.match(iconMarkup, /viewBox="0 0 32 32"/);
const namedMarkup = renderToString(createElement(MoonIcon));
assert.match(namedMarkup, /aria-hidden="true"/);
assert.match(namedMarkup, /viewBox="0 0 24 24"/);
