import { useId, useState } from 'react';
import { Button, type ButtonStyle } from '../../../src/components/button/Button';
import { CheckIcon } from '../../../src/components/icon/named/CheckIcon';
import type { Scenario } from '../gallery/types';
import '../../../src/components/button/button.css';
import '../../../src/components/icon/icon.css';
import '../../../stories/foundations/spatial.stories.css';

const scale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

/**
 * Keep external spacing in the parent while Button owns its internal label layout.
 **/
function ActionPair({ label, style }: { label: string; style?: ButtonStyle }) {
  return <div role="group" aria-label={label} className="spatial-actions" style={style}>
    <Button><CheckIcon /><span>Save</span></Button><Button variant="secondary">Cancel</Button>
  </div>;
}

/**
 * Let consumers compare semantic action gaps using an accessible native select.
 **/
function SpacingComposition() {
  const id = useId();
  const [spacing, setSpacing] = useState('actions');

  return <div className="spatial-demo spatial-stack"><h1>Parent-owned spacing</h1>
    <p>The wrapper owns the gap. Button keeps its 10px block padding, 16px inline padding, and 8px label/icon gap.</p>
    <label className="spatial-field" htmlFor={id}>Action spacing<select id={id} className="spatial-select" style={{ '--fs-space-inset': '8px' } as ButtonStyle} value={spacing} onChange={event => setSpacing(event.target.value)}>
      <option value="label">Label</option><option value="actions">Actions</option><option value="related">Related</option>
    </select></label>
    <ActionPair label="Adjustable actions" style={{ gap: `var(--fs-space-gap-${spacing})` }} />
    <p>Container inset: 24px. Group separation: 24px. The select retains native keyboard behavior and focus.</p>
  </div>;
}

const Scale: Scenario<Record<string, never>> = { render: () => <div className="spatial-demo spatial-stack"><h1>Preferred spacing scale</h1>
    <p>Chart values are measurements of the raw scale, not a public primitive CSS API. Choose semantic roles when composing UI.</p>
    <ul aria-label="Preferred spacing scale" className="spatial-scale">{scale.map(step => <li key={step}><span>{step}px</span><meter aria-label={`${step}px spacing`} min={0} max={96} value={step}>{step} of 96</meter></li>)}</ul>
    <p>4–12px: close relationships. 16–24px: related groups and insets. 32–96px: larger separation.</p>
    <p>10px Button padding is a documented precision adjustment. A 3px focus ring and 6px radius belong to geometry, not this scale.</p>
  </div> };

const Composition: Scenario<Record<string, never>> = { render: () => <SpacingComposition /> };

const ScopedOverrides: Scenario<Record<string, never>> = { render: () => <div className="spatial-demo spatial-stack"><h1>Scopes preserve intent</h1>
    <section aria-label="Outer scope" className="spatial-panel spatial-stack" style={{ '--fs-space-gap-actions': '32px' } as ButtonStyle}>
      <h2>Outer action gap: 32px</h2><ActionPair label="Outer actions" />
      <section data-theme="luna" aria-label="Nested Luna scope" className="theme-panel spatial-stack"><h2>Nested Luna resets the gap to 12px</h2><ActionPair label="Nested actions" /></section>
    </section>
    <section aria-label="Sibling scope" className="spatial-stack"><h2>Unaffected sibling: 12px</h2><ActionPair label="Sibling actions" /></section>
  </div> };

const ResponsiveSections: Scenario<Record<string, never>> = { render: () => <div className="spatial-demo spatial-stack"><h1>Responsive page sections</h1>
    <p>64px between sections normally; 32px at or below this example's 600px breakpoint. CSS controls the initial server-rendered layout.</p>
    <div role="group" aria-label="Page sections" className="spatial-responsive">
      <section className="spatial-stack"><h2>Account</h2><p>Related content uses a smaller group gap.</p><ActionPair label="Account actions" /></section>
      <section className="spatial-stack"><h2>Preferences</h2><p>Major sections have more separation than their contents.</p><ActionPair label="Preferences actions" /></section>
    </div>
  </div> };

export const component = SpacingComposition;
export const defaults = {};
export const scenarios = { Scale, Composition, ScopedOverrides, ResponsiveSections };
