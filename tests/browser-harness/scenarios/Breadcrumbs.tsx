import {
  Breadcrumbs,
  type BreadcrumbsProps,
} from '../../../src/components/breadcrumbs/Breadcrumbs';
import {
  BreadcrumbsExample,
  BreadcrumbsNavigation,
  BreadcrumbsOverrides,
  longBreadcrumbs,
  projectBreadcrumbs,
} from '../../../src/components/breadcrumbs/stories/breadcrumbs-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/breadcrumbs/breadcrumbs.css';
import '../../../src/components/link/link.css';
import '../../../src/components/typography/typography.css';
import '../../../src/components/breadcrumbs/stories/breadcrumbs.stories.css';

const Playground: Scenario<BreadcrumbsProps> = {};
const Composition: Scenario<BreadcrumbsProps> = { render: () => <BreadcrumbsExample /> };
const Navigation: Scenario<BreadcrumbsProps> = { render: () => <BreadcrumbsNavigation /> };
const Custom: Scenario<BreadcrumbsProps> = { args: { collapseAt: '800px' } };
const LongLabels: Scenario<BreadcrumbsProps> = {
  args: { items: longBreadcrumbs, collapseAt: '0px' },
};
const TwoItems: Scenario<BreadcrumbsProps> = {
  args: {
    items: [
      { label: 'Home', href: '#home' },
      { label: 'Settings', current: true },
    ],
  },
};
const Overrides: Scenario<BreadcrumbsProps> = { render: () => <BreadcrumbsOverrides /> };
export const component = Breadcrumbs;
export const defaults: BreadcrumbsProps = { items: projectBreadcrumbs };
export const scenarios = {
  Playground,
  Composition,
  Navigation,
  Custom,
  LongLabels,
  TwoItems,
  Overrides,
};
