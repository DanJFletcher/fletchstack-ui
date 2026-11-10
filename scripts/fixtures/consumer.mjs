import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement, version } from 'react';
import { renderToString } from 'react-dom/server';
import { Section, AspectRatio, Badge, Button, SimpleGrid, Cluster, Container, Stack, Separator, Checkbox, Field, FieldDescription, FieldError, FieldLabel, FormGroup, Icon, Link, MoonIcon, Radio, Select, Spinner, Switch, TextInput, Textarea } from 'fletchstack-ui';
import * as library from 'fletchstack-ui';

assert.deepEqual(Object.keys(library).sort(), ['ArrowRightIcon', 'AspectRatio', 'Badge', 'Button', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'CloseIcon', 'Cluster', 'Container', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Icon', 'Link', 'MoonIcon', 'PlusIcon', 'Radio', 'Section', 'Select', 'Separator', 'SimpleGrid', 'Spinner', 'Stack', 'SunIcon', 'Switch', 'TextInput', 'Textarea']);
const element = createElement(Button, { variant: 'secondary', size: 'small', 'aria-label': 'Save settings' }, 'Save');
const html = renderToString(element);
assert.match(html, /type="button"/);
assert.match(html, /aria-label="Save settings"/);
assert.equal(renderToString(element), html);
for (const path of ['styles.css', 'tokens.css', 'button.css', 'icon.css', 'card.css', 'select.css', 'text-input.css', 'checkbox.css', 'form-group.css', 'field.css', 'textarea.css', 'radio.css', 'link.css', 'switch.css', 'spinner.css', 'badge.css', 'separator.css', 'container.css', 'stack.css', 'cluster.css', 'simple-grid.css', 'aspect-ratio.css', 'section.css']) {
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

const radioMarkup = renderToString(createElement(Radio, { label: 'Standard', name: 'delivery', value: 'standard', defaultChecked: true }));
assert.match(radioMarkup, /type="radio"/);
assert.match(radioMarkup, /checked=""/);
assert.match(radioMarkup, /name="delivery"/);

const linkMarkup = renderToString(createElement(Link, { href: 'https://example.com/docs', target: '_blank' }, 'Documentation'));
assert.match(linkMarkup, /href="https:\/\/example.com\/docs"/);
assert.match(linkMarkup, /rel="noopener"/);
assert.match(linkMarkup, /Opens in a new tab\./);

const switchMarkup = renderToString(createElement(Switch, { label: 'Notifications', name: 'notifications', value: 'email', defaultChecked: true }));
assert.match(switchMarkup, /type="checkbox" role="switch"/);
assert.match(switchMarkup, /checked=""/);

const spinnerMarkup = renderToString(createElement(Spinner, { label: 'Loading projects…' }));
assert.match(spinnerMarkup, /role="status"/);
assert.match(spinnerMarkup, /Loading projects…/);
assert.doesNotMatch(renderToString(createElement(Spinner, { decorative: true })), /role="status"/);

const badgeMarkup = renderToString(createElement(Badge, { tone: 'success' }, 'Published'));
assert.match(badgeMarkup, /fs-badge--success/);
assert.doesNotMatch(badgeMarkup, /role=|tabindex=|aria-live=/);
assert.match(renderToString(createElement(Badge, {}, 0)), />0</);

const separatorMarkup = renderToString(createElement(Separator, { decorative: false, orientation: 'vertical' }));
assert.match(separatorMarkup, /role="separator"/);
assert.match(separatorMarkup, /aria-orientation="vertical"/);
assert.doesNotMatch(separatorMarkup, /tabindex=|aria-valuenow=/);
assert.match(renderToString(createElement(Separator)), /aria-hidden="true"/);

const containerElement = createElement(Container, { size: 'reading', gutters: false, id: 'article' }, 'Article content');
const containerMarkup = renderToString(containerElement);
assert.equal(renderToString(containerElement), containerMarkup);
assert.match(containerMarkup, /id="article"/);
assert.match(containerMarkup, /fs-container--reading/);
assert.match(containerMarkup, /Article content/);
assert.doesNotMatch(containerMarkup, /fs-container--gutters|tabindex=|role=/);

const stackElement = createElement(Stack, { gap: 'group', align: 'start', id: 'settings' }, createElement('p', {}, 'First'), createElement('p', {}, 'Second'));
const stackMarkup = renderToString(stackElement);
assert.equal(renderToString(stackElement), stackMarkup);
assert.match(stackMarkup, /id="settings"/);
assert.match(stackMarkup, /fs-stack--gap-group fs-stack--align-start/);
assert.match(stackMarkup, /First<\/p><p>Second/);
assert.doesNotMatch(stackMarkup, /tabindex=|role=/);

const clusterElement = createElement(Cluster, { gap: 'related', align: 'baseline', justify: 'end', id: 'actions' }, createElement('button', {}, 'Save'), createElement('button', {}, 'Preview'));
const clusterMarkup = renderToString(clusterElement);
assert.equal(renderToString(clusterElement), clusterMarkup);
assert.match(clusterMarkup, /id="actions"/);
assert.match(clusterMarkup, /fs-cluster--gap-related fs-cluster--align-baseline fs-cluster--justify-end/);
assert.match(clusterMarkup, /Save<\/button><button>Preview/);
assert.doesNotMatch(clusterMarkup, /tabindex=|role=/);

const simpleGridElement = createElement(SimpleGrid, { gap: 'group', id: 'projects', style: { '--fs-simple-grid-min-item-width': '180px' } }, createElement('button', {}, 'First'), createElement('button', {}, 'Second'));
const simpleGridMarkup = renderToString(simpleGridElement);
assert.equal(renderToString(simpleGridElement), simpleGridMarkup);
assert.match(simpleGridMarkup, /id="projects"/);
assert.match(simpleGridMarkup, /fs-simple-grid--gap-group/);
assert.match(simpleGridMarkup, /--fs-simple-grid-min-item-width:180px/);
assert.match(simpleGridMarkup, /First<\/button><button>Second/);
assert.doesNotMatch(simpleGridMarkup, /tabindex=|role=/);

const aspectRatioElement = createElement(AspectRatio, { ratio: 1, id: 'project-media', 'aria-describedby': 'caption' }, createElement('img', { alt: 'Project artwork' }));
const aspectRatioMarkup = renderToString(aspectRatioElement);
assert.equal(renderToString(aspectRatioElement), aspectRatioMarkup);
assert.match(aspectRatioMarkup, /id="project-media"/);
assert.match(aspectRatioMarkup, /aspect-ratio:1/);
assert.match(aspectRatioMarkup, /alt="Project artwork"/);
assert.doesNotMatch(aspectRatioMarkup, /tabindex=|role=/);
assert.match(renderToString(createElement(AspectRatio, { ratio: 0 })), /aspect-ratio:1.7777777777777777/);

const sectionElement = createElement(Section, { spacing: 'compact', id: 'projects', 'aria-labelledby': 'topic' }, createElement('h2', { id: 'topic' }, 'Projects'));
const sectionMarkup = renderToString(sectionElement);
assert.equal(renderToString(sectionElement), sectionMarkup);
assert.match(sectionMarkup, /^<section/);
assert.match(sectionMarkup, /fs-section--spacing-compact/);
assert.match(sectionMarkup, /aria-labelledby="topic"/);
assert.doesNotMatch(sectionMarkup, /tabindex=|role=|spacing=/);
assert.match(renderToString(createElement(Section, { as: 'div' }, 'Visual grouping')), /^<div/);
assert.match(renderToString(createElement(Section)), /fs-section--spacing-default/);
