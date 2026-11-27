import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Breadcrumbs } from '../Breadcrumbs';
import {
  BreadcrumbsExample,
  BreadcrumbsNavigation,
  BreadcrumbsOverrides,
  longBreadcrumbs,
  projectBreadcrumbs,
} from './breadcrumbs-examples';
import './breadcrumbs.stories.css';

const meta = {
  id: 'components-breadcrumbs',
  title: 'Components/Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  args: { items: projectBreadcrumbs },
  argTypes: { items: { control: false } },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'A named native navigation landmark with ordered ancestor links and a plain-text current page. Defaults: aria-label="Breadcrumb", collapseAt="40rem". At/below collapseAt, a count-aware native button toggles the intermediate links inline, preserving focus before them in Tab order. Wider viewports show the entire trail. Caller href values are used unchanged; no router dependency. Ancestors reuse Link colors, underlining and focus. Use className or scoped style hooks; import tokens, link.css and breadcrumbs.css, or combined styles. See docs/breadcrumbs.md for API and SSR behavior.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Composition: Story = {
  render: () => <BreadcrumbsExample />,
  play: async ({ canvasElement }) => {
    const expanded = within(
      within(canvasElement).getByRole('navigation', { name: 'Expanded breadcrumb' }),
    );
    await userEvent.click(
      expanded.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' }),
    );
    await expect(expanded.getByRole('link', { name: 'Projects' })).toBeVisible();
  },
};
export const Narrow: Story = {
  args: { collapseAt: '10000px' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export const CustomCollapseAt: Story = { args: { collapseAt: '56rem' } };
export const LongLabels: Story = {
  args: { items: longBreadcrumbs, collapseAt: '0px' },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export const TwoItems: Story = {
  args: {
    items: [
      { label: 'Home', href: '#home' },
      { label: 'Settings', current: true },
    ],
    collapseAt: '10000px',
  },
};
export const ScopedOverrides: Story = { render: () => <BreadcrumbsOverrides /> };
export const KeyboardDisclosure: Story = {
  render: () => <Breadcrumbs items={projectBreadcrumbs} collapseAt="10000px" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' }).focus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Hide intermediate levels' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: 'Projects' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await userEvent.keyboard(' ');
    await expect(canvas.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Show 2 hidden breadcrumb levels' }),
    ).toHaveFocus();
  },
};
export const NativeTabOrder: Story = { render: () => <BreadcrumbsNavigation /> };
