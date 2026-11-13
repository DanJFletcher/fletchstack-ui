import type { BreadcrumbItem } from './types.js';

/**
 * Require visible labels, native ancestor destinations and exactly one final current page.
 **/
export function validateBreadcrumbs(items: readonly BreadcrumbItem[]): void {
  if (!items.length || !items.at(-1)!.current || items.slice(0, -1).some(item => item.current)) { throw new Error('Breadcrumbs requires a single current page as the final item.'); }
  if (items.some(item => !item.label.trim() || !item.current && !item.href.trim())) { throw new Error('Breadcrumbs requires visible labels and non-empty ancestor href values.'); }
}
