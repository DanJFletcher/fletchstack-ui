import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Callout } from '../Callout';
import { CalloutExample, CalloutOverrides, CalloutTones, NarrowCallout, PublishingWarning } from './callout-examples';
import './callout.stories.css';

const meta = {
  id: 'components-callout', title: 'Components/Feedback/Callout', component: Callout, tags: ['autodocs'],
  args: { children: 'Your workspace is ready.', title: 'Project created', tone: 'info' },
  argTypes: { tone: { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] }, role: { control: 'select', options: [undefined, 'note', 'status', 'alert'] }, icon: { control: false }, action: { control: false } },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Persistent in-flow guidance. Compose title, decorative icon and action nodes; children supplies the body. Defaults: tone="info", no role, no icon or action. Choose note, status or alert explicitly according to purpose, independently of tone. Actions retain native focus and leave removal to the parent. Use className or scoped --fs-callout-* style hooks; load tokens and callout.css (plus styles for composed actions/icons), or combined styles. See docs/callout.md for API and customization.' } } },
} satisfies Meta<typeof Callout>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Composition: Story = { render: () => <CalloutExample /> };
export const Tones: Story = { render: () => <CalloutTones /> };
export const BodyOnly: Story = { args: { title: undefined, children: 'Drafts are visible to editors.' } };
export const Narrow: Story = { render: () => <NarrowCallout /> };
export const ScopedOverrides: Story = { render: () => <CalloutOverrides /> };
export const ExplicitRole: Story = { args: { role: 'note', tone: 'warning', title: 'Draft page', children: 'Only editors can view this page.' } };
export const KeyboardAction: Story = { render: () => <PublishingWarning />, play: async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  canvas.getByRole('button', { name: 'Review pages' }).focus();
  await userEvent.keyboard('{Enter}');
  await expect(canvas.getByLabelText('Review requests')).toHaveTextContent('Review requested 1 time(s).');
  await expect(canvas.getByText('Two pages still need approval.')).toBeVisible();
  await userEvent.keyboard(' ');
  await expect(canvas.getByLabelText('Review requests')).toHaveTextContent('Review requested 2 time(s).');
} };

export const ThemeCoverage: Story = { render: () => <div className="callout-demo__stack">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} aria-label={theme}><CalloutTones /></section>)}</div> };
