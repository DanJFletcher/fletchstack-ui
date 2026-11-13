import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion } from '../../src/components/accordion/Accordion';
import { Spinner } from '../../src/components/spinner/Spinner';
import { teamQuestions } from '../../src/components/accordion/stories/accordion-examples';
import './motion.stories.css';

const meta = { title: 'Design System/Motion Examples', parameters: { a11y: { test: 'error' } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Replay a token-driven comparison on activation without automatic movement or extra focus stops.
 **/
function Comparison({ kind, roles }: { kind: 'duration' | 'easing'; roles: string[] }) {
  const [moved, setMoved] = useState(false);

  return <section className="motion-demo" aria-label={`${kind} comparison`}><h1>Compare {kind}</h1>
    <button type="button" aria-pressed={moved} onClick={() => setMoved(!moved)}>Replay {kind}</button>
    {roles.map(role => <div key={role} className="motion-row"><h2>{role}</h2><code>--fs-motion-{kind}-{role}</code>
      <div className="motion-track"><span className="motion-sample" data-moved={moved} aria-hidden="true" style={{ [`--motion-example-${kind}`]: `var(--fs-motion-${kind}-${role})` } as CSSProperties} /></div></div>)}
  </section>;
}

/**
 * Exercise existing animated components in explicit sibling and nested theme scopes.
 **/
function ComponentExamples() {
  return <div className="motion-demo"><h1>Disclosure and loading</h1><div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} data-theme={theme} className="theme-panel" aria-label={`${theme} motion`}>
    <h2>{theme === 'corporate' ? 'Corporate' : 'Luna'}</h2><Spinner label="Loading team…" />
    <Accordion label={`${theme} team FAQ`} panelMotion="expand" items={teamQuestions} />
    <section data-theme={theme === 'corporate' ? 'luna' : 'corporate'} className="theme-panel" aria-label="Nested theme"><h3>Nested theme</h3><Spinner label="Loading members…" /></section>
  </section>)}</div></div>;
}

export const Durations: Story = { render: () => <Comparison kind="duration" roles={['fast', 'standard', 'slow']} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const replay = canvas.getByRole('button', { name: 'Replay duration' });
    await userEvent.click(replay);
    await expect(replay).toHaveAttribute('aria-pressed', 'true');
  },
};
export const Easings: Story = { render: () => <Comparison kind="easing" roles={['standard', 'enter', 'exit']} /> };
export const Components: Story = { render: () => <ComponentExamples /> };
export const LunaDurations: Story = { ...Durations, globals: { theme: 'luna' } };
export const LunaEasings: Story = { ...Easings, globals: { theme: 'luna' } };
