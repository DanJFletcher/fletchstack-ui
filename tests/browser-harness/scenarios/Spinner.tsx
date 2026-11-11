import { useState } from 'react';
import { Button } from '../../../src/components/button/Button';
import { Spinner } from '../../../src/components/spinner/Spinner';
import type { SpinnerProps } from '../../../src/components/spinner/Spinner';
import type { Scenario } from '../gallery/types';
import '../../../src/components/spinner/spinner.css';
import '../../../src/components/button/button.css';

/**
 * Keep a single persistent status outside the busy content and remove artwork on completion.
 **/
function ActivityExample() {
  const [pending, setPending] = useState(true);

  return <div className="stack"><div role="status" aria-live="polite" aria-atomic="true" className="actions">{pending && <Spinner decorative />}{pending ? 'Loading activity…' : 'Activity loaded.'}</div><section aria-label="Activity" aria-busy={pending}><h2>Project activity</h2><p>{pending ? 'Activity is being refreshed.' : 'Your project activity is up to date.'}</p></section><div className="actions"><Button disabled={!pending} onClick={() => setPending(false)}>Complete loading</Button><Button disabled={pending} onClick={() => setPending(true)} variant="secondary">Reload activity</Button></div></div>;
}

const Playground: Scenario<SpinnerProps> = {  };

const Sizes: Scenario<SpinnerProps> = { render: () => <div className="theme-grid">{(['small', 'medium', 'large'] as const).map(size => <section key={size} className="stack"><h2>{size}</h2><Spinner size={size} decorative /></section>)}</div> };

const Decorative: Scenario<SpinnerProps> = { render: () => <Button disabled aria-busy="true"><Spinner decorative size="small" />Saving…</Button> };

const ContentRegion: Scenario<SpinnerProps> = { render: () => <ActivityExample /> };

const LongLabel: Scenario<SpinnerProps> = { args: { label: 'LoadingProjectActivityForEverySharedWorkspaceAndComponentInThisLibrary…' } };

const Hidden: Scenario<SpinnerProps> = { args: { hidden: true }, render: args => <div><p>The native hidden attribute suppresses the complete loading widget.</p><Spinner {...args} /></div> };

export const component = Spinner;
export const defaults: SpinnerProps = { label: 'Loading projects…' };
export const scenarios = { Playground, Decorative, LongLabel, Sizes, ContentRegion, Hidden };
