import { Button } from '../../../src/components/button/Button';
import { Separator } from '../../../src/components/separator/Separator';
import { type SeparatorProps } from '../../../src/components/separator/Separator';
import type { Scenario } from '../gallery/types';
import '../../../src/components/button/button.css';
import '../../../src/components/separator/separator.css';
import '../../../src/components/separator/stories/separator.stories.css';

/**
 * Separate meaningful account sections and visually group independent actions.
 **/
function AccountExample() {
  return <section className="stack" aria-label="Account settings"><div><h2>Profile</h2><p>Your name and contact details.</p></div><Separator decorative={false} /><div><h2>Preferences</h2><p>Your display and notification settings.</p></div><div className="separator-actions"><Button variant="secondary">Edit</Button><Separator orientation="vertical" /><Button variant="secondary">Duplicate</Button></div></section>;
}

const Playground: Scenario<SeparatorProps> = {  };

const Semantic: Scenario<SeparatorProps> = { args: { decorative: false, 'aria-label': 'Section boundary' } };

const Vertical: Scenario<SeparatorProps> = { args: { decorative: false, orientation: 'vertical' }, render: args => <div className="separator-actions separator-height"><span>Overview</span><Separator {...args} /><span>Activity</span></div> };

const Composition: Scenario<SeparatorProps> = { render: () => <AccountExample /> };

const Customization: Scenario<SeparatorProps> = { args: { decorative: false, className: 'custom-separator', style: { '--fs-separator-thickness': '2px', '--fs-separator-color': 'var(--fs-text)' } } };

const Hidden: Scenario<SeparatorProps> = { args: { hidden: true, decorative: false }, render: args => <div><p>The native hidden attribute suppresses this separator.</p><Separator {...args} /></div> };

const PassiveSemantics: Scenario<SeparatorProps> = { render: () => <Separator {...({ role: 'slider', tabIndex: 0, 'aria-orientation': 'vertical', 'aria-hidden': true, 'aria-valuenow': 50, onClick: 'ignored', title: 'Imported boundary' } as unknown as SeparatorProps)} decorative={false} /> };

export const component = Separator;
export const defaults: SeparatorProps = { orientation: 'horizontal', decorative: true };
export const scenarios = { Semantic, Vertical, Composition, Playground, Customization, Hidden, PassiveSemantics };
