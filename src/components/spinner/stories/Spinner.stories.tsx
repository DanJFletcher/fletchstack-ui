import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, Spinner } from '../../../index';

const meta = {
  id: 'components-spinner', title: 'Components/Feedback/Spinner', component: Spinner, tags: ['autodocs'],
  args: { label: 'Loading projects…' },
  parameters: { a11y: { test: 'error' }, docs: { description: { component: 'Indeterminate loading with 16/20/24px artwork, inherited color, and visible polite status text. Decorative mode omits duplicate announcements when a button or parent status already owns the message. Reduced motion stops rotation while keeping text. Consumers own pending state, busy regions, and removal on completion. Use Progress for measurable completion; Spinner has no percentage values or keyboard focus.' } } },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Keep a single persistent status outside the busy content and remove artwork on completion.
 **/
function ActivityExample() {
  const [pending, setPending] = useState(true);

  return <div className="stack"><div role="status" aria-live="polite" aria-atomic="true" className="actions">{pending && <Spinner decorative />}{pending ? 'Loading activity…' : 'Activity loaded.'}</div><section aria-label="Activity" aria-busy={pending}><h2>Project activity</h2><p>{pending ? 'Activity is being refreshed.' : 'Your project activity is up to date.'}</p></section><div className="actions"><Button disabled={!pending} onClick={() => setPending(false)}>Complete loading</Button><Button disabled={pending} onClick={() => setPending(true)} variant="secondary">Reload activity</Button></div></div>;
}

export const Playground: Story = {};
export const Sizes: Story = {
  render: () => <div className="theme-grid">{(['small', 'medium', 'large'] as const).map(size => <section key={size} className="stack"><h2>{size}</h2><Spinner size={size} decorative /></section>)}</div>,
};
export const LoadingPatterns: Story = {
  render: () => <div className="theme-grid"><section className="stack"><h2>Inline</h2><Spinner label="Loading projects…" /></section><section className="stack"><h2>Button</h2><Button disabled aria-busy="true"><Spinner decorative size="small" />Saving…</Button><p>Keep the button label visible.</p></section><section className="stack"><h2>Content region</h2><Spinner label="Loading activity…" /><section aria-label="Activity" aria-busy="true"><p>The content is being refreshed.</p></section></section></div>,
};
export const BothThemes: Story = {
  render: () => <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel stack"><h2>{theme}</h2><Spinner label="Loading projects…" style={{ color: 'var(--fs-spinner-accent)' }} /><Button disabled aria-busy="true"><Spinner decorative size="small" />Saving…</Button></section>)}</div>,
};
export const Decorative: Story = { render: () => <Button disabled aria-busy="true"><Spinner decorative size="small" />Saving…</Button> };
export const ContentRegion: Story = {
  render: () => <ActivityExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('status')).toHaveTextContent('Loading activity…');
    await userEvent.click(canvas.getByRole('button', { name: 'Complete loading' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Activity loaded.');
    await expect(canvas.getByRole('region', { name: 'Activity' })).toHaveAttribute('aria-busy', 'false');
    await userEvent.click(canvas.getByRole('button', { name: 'Reload activity' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading activity…');
  },
};
export const Customization: Story = { args: { size: 'large', className: 'custom-spinner', style: { '--fs-spinner-label-gap': '16px', '--fs-spinner-stroke-width': 3, '--fs-spinner-rotation-seconds': 2, color: 'var(--fs-spinner-accent)' } } };
export const ReducedMotion: Story = { args: { label: 'Loading activity…' }, parameters: { docs: { description: { story: 'Set the operating system or browser reduced-motion preference to stop rotation. Text remains visible. This story respects the actual preference rather than simulating it with a variant.' } } } };
export const BlankLabel: Story = { args: { label: '   ' } };
export const LongLabel: Story = { args: { label: 'LoadingProjectActivityForEverySharedWorkspaceAndComponentInThisLibrary…' } };

export const Hidden: Story = { args: { hidden: true }, render: args => <div><p>The native hidden attribute suppresses the complete loading widget.</p><Spinner {...args} /></div> };
