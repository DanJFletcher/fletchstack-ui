import { Fragment, forwardRef, useState, type ForwardRefExoticComponent, type RefAttributes } from 'react';
import { Link } from '../link/Link.js';
import { validateBreadcrumbs } from './breadcrumbs-policy.js';
import { useBreadcrumbBreakpoint } from './useBreadcrumbBreakpoint.js';
import type { BreadcrumbItem, BreadcrumbsProps } from './types.js';
export type { BreadcrumbItem, BreadcrumbAncestor, BreadcrumbCurrent, BreadcrumbsProps, BreadcrumbsStyle } from './types.js';

/**
 * Keep separators decorative and current-page text independent of the caller's routing system.
 **/
function BreadcrumbEntry({ item, separated }: { item: BreadcrumbItem; separated: boolean }) {
  return <li className="fs-breadcrumbs__entry">{separated && <span className="fs-breadcrumbs__separator" aria-hidden="true">/</span>}
    {item.current ? <span className="fs-breadcrumbs__current" aria-current="page">{item.label}</span> : <Link href={item.href}>{item.label}</Link>}
  </li>;
}

/**
 * Toggle intermediate levels through a persistent native button without moving keyboard focus.
 **/
function BreadcrumbDisclosure({ count, expanded, toggle }: { count: number; expanded: boolean; toggle: () => void }) {
  const levels = count === 1 ? 'level' : 'levels';
  const label = expanded ? 'Hide intermediate levels' : `Show ${count} hidden breadcrumb ${levels}`;

  return <li className="fs-breadcrumbs__entry"><span className="fs-breadcrumbs__separator" aria-hidden="true">/</span>
    <button type="button" className="fs-breadcrumbs__toggle" aria-label={label} aria-expanded={expanded} onClick={toggle}><span aria-hidden="true">…</span></button>
  </li>;
}

/**
 * Expose a native ordered trail with a viewport-driven, inline disclosure for intermediate ancestors.
 **/
export const Breadcrumbs: ForwardRefExoticComponent<BreadcrumbsProps & RefAttributes<HTMLElement>> = /* @__PURE__ */ forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, collapseAt = '40rem', className, 'aria-label': label = 'Breadcrumb', ...props }, ref,
) {
  validateBreadcrumbs(items);
  const narrow = useBreadcrumbBreakpoint(collapseAt);
  const compact = narrow && items.length > 2;
  const [expanded, setExpanded] = useState(false);

  return <nav {...props} ref={ref} role={undefined} aria-label={label} className={['fs-breadcrumbs', className].filter(Boolean).join(' ')}><ol className="fs-breadcrumbs__list">
    {items.map((item, index) => <Fragment key={index}>
      {index === 1 && compact && <BreadcrumbDisclosure count={items.length - 2} expanded={expanded} toggle={() => setExpanded(!expanded)} />}
      {(!compact || expanded || index === 0 || item.current) && <BreadcrumbEntry item={item} separated={index > 0} />}
    </Fragment>)}
  </ol></nav>;
});
