import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement, version } from 'react';
import { renderToString } from 'react-dom/server';
import { Button, Checkbox, Field, FieldDescription, FieldError, FieldLabel, FormGroup, Icon, MoonIcon, Select, TextInput, Textarea } from 'fletchstack-ui';
import * as library from 'fletchstack-ui';

assert.deepEqual(Object.keys(library).sort(), ['ArrowRightIcon', 'Button', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'CloseIcon', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Icon', 'MoonIcon', 'PlusIcon', 'Select', 'SunIcon', 'TextInput', 'Textarea']);
const element = createElement(Button, { variant: 'secondary', size: 'small', 'aria-label': 'Save settings' }, 'Save');
const html = renderToString(element);
assert.match(html, /type="button"/);
assert.match(html, /aria-label="Save settings"/);
assert.equal(renderToString(element), html);
for (const path of ['styles.css', 'tokens.css', 'button.css', 'icon.css', 'card.css', 'select.css', 'text-input.css', 'checkbox.css', 'form-group.css', 'field.css', 'textarea.css']) {
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

const selectMarkup = renderToString(createElement(Select, { label: 'Workspace', helperText: 'Choose a workspace.' }, createElement('option', { value: 'personal' }, 'Personal')));
assert.match(selectMarkup, /<label[^>]*>Workspace<\/label>/);
assert.match(selectMarkup, /<select[^>]*aria-describedby=/);
assert.match(selectMarkup, /Choose a workspace\./);

const inputMarkup = renderToString(createElement(TextInput, { label: 'Project name', helperText: 'Use a short name.', defaultValue: 'Website refresh' }));
assert.match(inputMarkup, /<label[^>]*>Project name<\/label>/);
assert.match(inputMarkup, /<input[^>]*aria-describedby=/);
assert.match(inputMarkup, /value="Website refresh"/);

const checkboxMarkup = renderToString(createElement(Checkbox, { label: 'Email updates', description: 'Receive product news.', defaultChecked: true }));
assert.match(checkboxMarkup, /type="checkbox"/);
assert.match(checkboxMarkup, /checked=""/);
assert.match(checkboxMarkup, /Receive product news\./);

const groupMarkup = renderToString(createElement(FormGroup, { legend: "Notifications", disabled: true }, createElement(Checkbox, { label: "Email" })));
assert.match(groupMarkup, /<fieldset[^>]*disabled/);
assert.match(groupMarkup, /<legend[^>]*>Notifications<\/legend>/);

const fieldMarkup = renderToString(createElement(Field, { label: 'Notes', helperText: 'Keep it short.', children: control => createElement('textarea', control) }));
assert.match(fieldMarkup, /<label[^>]*for=/);
assert.match(fieldMarkup, /<textarea[^>]*aria-describedby=/);
assert.match(renderToString(createElement(FieldLabel, { htmlFor: 'name' }, 'Name')), /for="name"/);
assert.match(renderToString(createElement(FieldDescription, { as: 'span' }, 'Hint')), /<span/);
assert.match(renderToString(createElement(FieldError, {}, 'Error')), /fs-field-error/);

const textareaMarkup = renderToString(createElement(Textarea, { label: 'Description', defaultValue: 'First\nSecond', showCount: true, maxLength: 200 }));
assert.match(textareaMarkup, /<textarea[^>]*rows="4"/);
assert.match(textareaMarkup, /First\nSecond/);
assert.match(textareaMarkup, /12<!-- --> \/ 200/);
