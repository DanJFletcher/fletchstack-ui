import { Breadcrumbs } from '../Breadcrumbs';
import type { BreadcrumbItem } from '../types';
import { Heading } from '../../typography/Heading';

export const projectBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Home', href: '#home' }, { label: 'Projects', href: '#projects' }, { label: 'Atlas', href: '#atlas' }, { label: 'Settings', current: true },
];
export const longBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Home', href: '#home' }, { label: 'Projects with long descriptive names', href: '#projects' },
  { label: 'AnExtraordinarilyLongUnbrokenProjectNameThatNeedsToWrap', href: '#atlas' },
  { label: 'A detailed current page name that remains readable on a narrow screen', current: true },
];

/**
 * Compare the same consumer-provided hierarchy through Corporate and Luna semantic colors.
 **/
export function BreadcrumbsExample() {
  return <main className="breadcrumbs-demo"><p>fletchstack-ui / Navigation</p><Heading as="h1" size="page">Breadcrumbs</Heading>
    {(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="breadcrumbs-demo__theme" aria-label={theme === 'corporate' ? 'Corporate' : 'Luna'}>
      <Heading as="h2" size="section">{theme === 'corporate' ? 'Corporate' : 'Luna'}</Heading><Breadcrumbs items={projectBreadcrumbs} /></section>)}
    <div className="breadcrumbs-demo__states"><section><Heading as="h2" size="section">Collapsed</Heading><Breadcrumbs items={projectBreadcrumbs} collapseAt="10000px" aria-label="Collapsed breadcrumb" /></section>
      <section><Heading as="h2" size="section">Expanded</Heading><Breadcrumbs items={projectBreadcrumbs} collapseAt="10000px" aria-label="Expanded breadcrumb" /></section></div>
  </main>;
}

/**
 * Keep a following control available for verifying native Tab order after inline expansion.
 **/
export function BreadcrumbsNavigation() {
  return <><Breadcrumbs items={projectBreadcrumbs} /><button type="button">Next control</button></>;
}

/**
 * Show that CSS-variable overrides affect one instance while the adjacent trail retains its theme.
 **/
export function BreadcrumbsOverrides() {
  return <div className="breadcrumbs-demo__stack"><Breadcrumbs aria-label="Custom breadcrumb" items={projectBreadcrumbs} style={{ '--fs-breadcrumbs-gap': '24px', '--fs-link-text': 'rgb(117, 31, 119)' }} />
    <Breadcrumbs aria-label="Neighbor breadcrumb" items={projectBreadcrumbs} /></div>;
}
