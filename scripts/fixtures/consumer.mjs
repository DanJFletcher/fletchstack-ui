import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement, version } from 'react';
import { renderToString } from 'react-dom/server';
import { Button } from 'fletchstack-ui';
import * as library from 'fletchstack-ui';

assert.deepEqual(Object.keys(library), ['Button']);
const element = createElement(Button, { variant: 'secondary', size: 'small', 'aria-label': 'Save settings' }, 'Save');
const html = renderToString(element);
assert.match(html, /type="button"/);
assert.match(html, /aria-label="Save settings"/);
assert.equal(renderToString(element), html);
for (const path of ['styles.css', 'tokens.css', 'button.css']) {
  const content = readFileSync(new URL(import.meta.resolve(`fletchstack-ui/${path}`)), 'utf8');
  assert.ok(content.length > 0);
}
console.log(`React ${version}: deterministic SSR and all stylesheet exports passed.`);
