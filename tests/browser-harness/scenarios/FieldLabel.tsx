import { useId } from 'react';
import { FieldLabel } from '../../../src/components/field/FieldPrimitives';
import type { FieldLabelProps } from '../../../src/components/field/FieldPrimitives';
import type { Scenario } from '../gallery/types';
import '../../../src/components/field/field.css';
import '../../../src/components/field/stories/field-atoms.css';

/**
 * Associate the atom with a native input and provide a following keyboard stop.
 **/
function Example(args: FieldLabelProps) {
  const id = `${args.htmlFor}-${useId()}`;

  return <div className="fs-field field-atom-demo"><FieldLabel {...args} htmlFor={id} /><input id={id} type="text" /><button type="button">Next action</button></div>;
}

/**
 * Render independent control and message IDs in both theme scopes.
 **/
function ThemeComparison() {
  const scope = useId();

  return <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} className="theme-panel stack" data-theme={theme}><h2>{theme}</h2><div className="fs-field field-atom-demo"><FieldLabel htmlFor={`${scope}-name-${theme}`}>Project name</FieldLabel><input id={`${scope}-name-${theme}`} type="text" /></div></section>)}</div>;
}

const Playground: Scenario<FieldLabelProps> = { render: args => <Example {...args} /> };

const BothThemes: Scenario<FieldLabelProps> = { render: () => <ThemeComparison /> };

export const component = FieldLabel;
export const defaults: FieldLabelProps = { htmlFor: 'project-name', children: 'Project name' };
export const scenarios = { Playground, BothThemes };
