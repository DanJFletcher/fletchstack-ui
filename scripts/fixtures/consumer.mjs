import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement, version } from 'react';
import { renderToString } from 'react-dom/server';
import { Breadcrumbs, Menu, Callout, Table, createTableColumn, Combobox, Rating, Accordion, Chip, MultiSelect, AvatarGroup, Avatar, CodeBlock, ButtonGroup, Heading, Text, Section, AspectRatio, Badge, Button, SimpleGrid, Cluster, Container, Stack, Separator, Checkbox, Field, FieldDescription, FieldError, FieldLabel, FormGroup, Icon, Link, MoonIcon, Radio, Select, Spinner, Switch, TextInput, Textarea } from 'fletchstack-ui';
import * as library from 'fletchstack-ui';

assert.deepEqual(Object.keys(library).sort(), ['Accordion', 'AppContent', 'AppShell', 'ArrowRightIcon', 'AspectRatio', 'Avatar', 'AvatarGroup', 'Badge', 'BottomNavigation', 'Breadcrumbs', 'Button', 'ButtonGroup', 'Callout', 'Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardMedia', 'CardTitle', 'CheckIcon', 'Checkbox', 'ChevronDownIcon', 'Chip', 'CloseIcon', 'Cluster', 'CodeBlock', 'Combobox', 'Container', 'Dialog', 'ExternalLinkIcon', 'Field', 'FieldDescription', 'FieldError', 'FieldLabel', 'FormGroup', 'Heading', 'HelpIcon', 'HomeIcon', 'Icon', 'InboxIcon', 'Link', 'Menu', 'MoonIcon', 'MultiSelect', 'Navbar', 'PlusIcon', 'Popover', 'Radio', 'Rating', 'Section', 'Select', 'Separator', 'SimpleGrid', 'Spinner', 'Stack', 'SunIcon', 'Switch', 'Table', 'Tabs', 'Text', 'TextInput', 'Textarea', 'createTableColumn']);
const element = createElement(Button, { variant: 'secondary', size: 'small', 'aria-label': 'Save settings' }, 'Save');
const contentElement = createElement('div', null, createElement(Heading, { as: 'h1', size: 'page' }, 'Project'), createElement(Text, { tone: 'muted' }, 'Updated yesterday'), createElement(Text, { as: 'span', size: 'small' }, 'Inline'));
const contentMarkup = renderToString(contentElement);
assert.equal(renderToString(contentElement), contentMarkup);
assert.match(contentMarkup, /<h1 class="fs-heading fs-heading--page">Project<\/h1>/);
assert.match(contentMarkup, /fs-text fs-text--body fs-text--muted/);
assert.match(contentMarkup, /<span/);
const html = renderToString(element);
assert.match(html, /type="button"/);
assert.match(html, /aria-label="Save settings"/);
assert.equal(renderToString(element), html);
for (const path of ['accordion.css', 'chip.css', 'multi-select.css', 'avatar-group.css', 'avatar.css', 'styles.css', 'tokens.css', 'button.css', 'icon.css', 'card.css', 'select.css', 'text-input.css', 'checkbox.css', 'form-group.css', 'field.css', 'textarea.css', 'radio.css', 'link.css', 'switch.css', 'spinner.css', 'badge.css', 'separator.css', 'container.css', 'stack.css', 'cluster.css', 'simple-grid.css', 'aspect-ratio.css', 'section.css', 'typography.css', 'button-group.css', 'code-block.css']) {
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

const actionGroup = createElement(ButtonGroup, { 'aria-label': 'Page actions', disabled: true, variant: 'secondary' }, createElement(Button, { disabled: false, type: 'submit', form: 'editor' }, 'Publish'));
const actionMarkup = renderToString(actionGroup);
assert.equal(renderToString(actionGroup), actionMarkup);
assert.match(actionMarkup, /role="group"/);
assert.match(actionMarkup, /disabled=""/);
assert.match(actionMarkup, /fs-button--secondary/);
assert.match(actionMarkup, /form="editor"/);

const sourceExample = createElement(CodeBlock, { filename: 'settings.ts', language: 'TypeScript', highlight: false, children: '\n\t<div>literal</div>\n' });
const sourceMarkup = renderToString(sourceExample);
assert.equal(renderToString(sourceExample), sourceMarkup);
assert.match(sourceMarkup, /&lt;div&gt;literal&lt;\/div&gt;/);
assert.match(sourceMarkup, /aria-label="Copy settings.ts"/);
assert.match(sourceMarkup, /role="region"/);
assert.match(sourceMarkup, /role="status"/);

const highlightedMarkup = renderToString(createElement(CodeBlock, { language: 'TypeScript', children: 'const ready = true;' }));
assert.match(highlightedMarkup, /class="token keyword">const<\/span>/);
assert.equal(highlightedMarkup, renderToString(createElement(CodeBlock, { language: 'TypeScript', children: 'const ready = true;' })));

const avatarMarkup = renderToString(createElement(Avatar, { name: 'Maya Chen', shape: 'rounded', size: 'large' }));
assert.match(avatarMarkup, /aria-label="Maya Chen"/);
assert.match(avatarMarkup, />MC</);
assert.equal(avatarMarkup, renderToString(createElement(Avatar, { name: 'Maya Chen', shape: 'rounded', size: 'large' })));

const avatarGroupMarkup = renderToString(createElement(AvatarGroup, { label: 'Editors', members: [{ id: 'editor-1', name: 'Alex Example' }], maxVisible: 0 }));
assert.match(avatarGroupMarkup, /<details/);
assert.match(avatarGroupMarkup, /aria-label="Show 1 more member"/);
assert.match(avatarGroupMarkup, /Alex Example/);

const multiSelectMarkup = renderToString(createElement(MultiSelect, { label: 'Topics', name: 'topics', options: [{ value: 'react', label: 'React' }], defaultValue: ['react'] }));
assert.match(multiSelectMarkup, /role="combobox"/);
assert.match(multiSelectMarkup, /type="hidden" name="topics"/);
assert.match(multiSelectMarkup, /Remove React/);

const chipElement = createElement(Chip, { selected: true, onSelect() {}, onRemove() {}, removeLabel: 'Remove topic' }, 'Design');
const chipMarkup = renderToString(chipElement);
assert.match(chipMarkup, /aria-pressed="true"/);
assert.match(chipMarkup, /aria-label="Remove topic"/);
assert.equal(chipMarkup, renderToString(chipElement));
assert.doesNotMatch(renderToString(createElement(Chip, {}, 'Static topic')), /<button|tabindex=|aria-pressed=/);

const accordionElement = createElement(Accordion, { label: 'FAQ', items: [{ id: 'invite', title: 'Invite members', content: 'Open settings.' }], defaultOpenItems: ['invite'] });
const accordionMarkup = renderToString(accordionElement);
assert.match(accordionMarkup, /aria-expanded="true"/);
assert.match(accordionMarkup, /aria-controls="[^"]+-invite-panel"/);
assert.match(accordionMarkup, /role="region"/);
assert.equal(accordionMarkup, renderToString(accordionElement));

const ratingElement = createElement(Rating, { mode: 'input', label: 'Service rating', name: 'rating', defaultValue: 3.5, step: 0.5 });
const ratingMarkup = renderToString(ratingElement);
assert.match(ratingMarkup, /type="radio"/);
assert.match(ratingMarkup, /<input\b(?=[^>]*\bvalue="3\.5")(?=[^>]*\bchecked="")[^>]*>/);
assert.equal(ratingMarkup, renderToString(ratingElement));
assert.match(renderToString(createElement(Rating, { value: 4.5 })), /aria-label="4.5 out of 5 stars"/);

const comboboxMarkup = renderToString(createElement(Combobox, { label: "Region", options: [{ value: "gb", label: "United Kingdom" }], name: "region", defaultValue: "gb" }));
assert.match(comboboxMarkup, /role="combobox"/);
assert.match(comboboxMarkup, /<input\b(?=[^>]*type="hidden")(?=[^>]*name="region")(?=[^>]*value="gb")[^>]*>/);

const usageColumn = createTableColumn();
const usageRows = [{ id: 'a', seats: 2 }, { id: 'b', seats: 10 }];
const tableMarkup = renderToString(createElement(Table, { rows: usageRows, columns: [usageColumn({ id: 'seats', header: 'Seats', accessor: 'seats', sortable: true })], getRowKey: row => row.id, caption: 'Usage', defaultSort: { columnId: 'seats', direction: 'desc' } }));
assert.match(tableMarkup, /<table/);
assert.match(tableMarkup, /<caption[^>]*>Usage<\/caption>/);
assert.match(tableMarkup, /aria-sort="descending"/);
assert.ok(tableMarkup.indexOf('>10</td>') < tableMarkup.indexOf('>2</td>'));

const calloutMarkup = renderToString(createElement(Callout, { tone: 'warning', title: 'Review before publishing', action: createElement(Button, null, 'Review pages') }, 'Two pages still need approval.'));
assert.match(calloutMarkup, /fs-callout--warning/);
assert.match(calloutMarkup, /Review pages/);
assert.doesNotMatch(calloutMarkup, /role=|aria-live=/);
assert.ok(readFileSync(new URL(import.meta.resolve('fletchstack-ui/callout.css')), 'utf8').includes('--fs-callout-warning-surface'));

const menuMarkup = renderToString(createElement(Menu, { triggerLabel: 'Project actions', menuLabel: 'Project menu', defaultOpen: true, items: [{ type: 'item', id: 'guide', label: 'Guide', href: '#guide' }] }));
assert.match(menuMarkup, /aria-haspopup="menu"/);
assert.match(menuMarkup, /role="menu" aria-label="Project menu"/);
assert.match(menuMarkup, /href="#guide"/);
assert.ok(readFileSync(new URL(import.meta.resolve('fletchstack-ui/menu.css')), 'utf8').includes('--fs-menu-surface'));

const breadcrumbsMarkup = renderToString(createElement(Breadcrumbs, { items: [{ label: 'Home', href: '/home' }, { label: 'Settings', current: true }] }));
assert.match(breadcrumbsMarkup, /<nav[^>]*aria-label="Breadcrumb"/);
assert.match(breadcrumbsMarkup, /<ol/);
assert.match(breadcrumbsMarkup, /href="\/home"/);
assert.match(breadcrumbsMarkup, /aria-current="page">Settings/);
assert.ok(readFileSync(new URL(import.meta.resolve('fletchstack-ui/breadcrumbs.css')), 'utf8').includes('--fs-breadcrumbs-gap'));

const { Navbar } = library;
const navbarMarkup = renderToString(createElement(Navbar, { 'aria-label': 'Primary' }, createElement(Navbar.Brand, null, createElement('a', { href: '/' }, 'Home')), createElement(Navbar.Item, null, createElement('a', { href: '/docs' }, 'Docs')), createElement(Navbar.Item, { mobilePlacement: 'bar' }, createElement('a', { href: '/contact' }, 'Contact'))));
assert.match(navbarMarkup, /<nav[^>]*aria-label="Primary"/);
assert.match(navbarMarkup, /href="\/docs"/);
assert.match(navbarMarkup, /href="\/contact"/);
assert.match(navbarMarkup, /aria-controls="[^"]+-navbar-panel"/);
assert.ok(readFileSync(new URL(import.meta.resolve('fletchstack-ui/navbar.css')), 'utf8').includes('--fs-navbar-surface'));

const { BottomNavigation, AppShell, AppContent, HomeIcon, InboxIcon, HelpIcon } = library;
const bottomMarkup = renderToString(createElement(AppShell, { height: 'parent' }, createElement(AppContent, null, 'Page'), createElement(BottomNavigation, { 'aria-label': 'Primary' }, createElement(BottomNavigation.Item, null, createElement('a', { href: '/help', 'aria-current': 'page' }, createElement(HelpIcon), 'Help')))));
assert.match(bottomMarkup, /<main/);
assert.match(bottomMarkup, /<nav[^>]*aria-label="Primary"/);
assert.match(bottomMarkup, /aria-current="page"/);
assert.match(renderToString(createElement(HomeIcon)), /aria-hidden="true"/);
assert.match(renderToString(createElement(InboxIcon)), /aria-hidden="true"/);
for (const slug of ['bottom-navigation', 'app-shell', 'app-content']) {
  assert.ok(readFileSync(new URL(import.meta.resolve(`fletchstack-ui/${slug}.css`)), 'utf8').includes(`.fs-${slug}`));
}

const { Tabs } = library;
const tabsElement = createElement(Tabs, { label: 'Workspace', defaultValue: 'activity', items: [
  { id: 'overview', label: 'Overview', content: 'Overview content' },
  { id: 'activity', label: 'Activity', content: 'Activity content' },
] });
const tabsMarkup = renderToString(tabsElement);
assert.equal(tabsMarkup, renderToString(tabsElement));
assert.match(tabsMarkup, /role="tablist" aria-label="Workspace"/);
assert.match(tabsMarkup, /aria-controls="[^"]+-activity-panel" aria-selected="true"/);
assert.match(tabsMarkup, /hidden="" tabindex="-1"/);
assert.ok(readFileSync(new URL(import.meta.resolve('fletchstack-ui/tabs.css')), 'utf8').includes('--fs-tabs-indicator'));

const { Dialog } = library;
const dialogElement = createElement(Dialog, { open: true, onOpenChange() {}, heading: 'Review changes', description: 'Check the draft.' }, 'Draft content');
const dialogMarkup = renderToString(dialogElement);
assert.equal(dialogMarkup, renderToString(dialogElement));
assert.match(dialogMarkup, /<dialog[^>]*aria-labelledby=/);
assert.match(dialogMarkup, /aria-describedby=/);
assert.doesNotMatch(dialogMarkup, /\sopen=/);
assert.match(dialogMarkup, /Draft content/);
assert.ok(readFileSync(new URL(import.meta.resolve('fletchstack-ui/dialog.css')), 'utf8').includes('--fs-dialog-surface'));

const popoverElement = createElement(library.Popover, { triggerLabel: 'Details', heading: 'Project details' }, 'Draft content');
const popoverMarkup = renderToString(popoverElement);
assert.equal(popoverMarkup, renderToString(popoverElement));
assert.match(popoverMarkup, /aria-haspopup="dialog"/);
assert.match(popoverMarkup, /popover="manual"/);
assert.match(popoverMarkup, /hidden=""/);
assert.ok(readFileSync(new URL(import.meta.resolve('fletchstack-ui/popover.css')), 'utf8').includes('--fs-popover-surface'));
