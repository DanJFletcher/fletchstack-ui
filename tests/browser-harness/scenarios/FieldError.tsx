import { useId } from 'react';
import { FieldError, FieldLabel } from '../../../src/components/field/FieldPrimitives';
import type { FieldMessageProps } from '../../../src/components/field/FieldPrimitives';
import type { Scenario } from '../gallery/types';
import '../../../src/components/field/field.css';
import '../../../src/components/field/stories/field-atoms.css';

/**
 * Associate the atom with a native input and provide a following keyboard stop.
 **/
function Example(args: FieldMessageProps) {
  const id = `${args.id}-${useId()}`;

  return <div className="fs-field field-atom-demo"><FieldLabel htmlFor={`${id}-control`}>Project name</FieldLabel><input id={`${id}-control`} type="text" aria-invalid="true" aria-describedby={id} /><FieldError {...args} id={id} /><button type="button">Next action</button></div>;
}

/**
 * Render independent control and message IDs in both theme scopes.
 **/
function ThemeComparison() {
  const scope = useId();

  return <div className="theme-grid">{(['corporate', 'luna'] as const).map(theme => <section key={theme} className="theme-panel stack" data-theme={theme}><h2>{theme}</h2><div className="fs-field field-atom-demo"><FieldLabel htmlFor={`${scope}-invalid-${theme}`}>Project name</FieldLabel><input id={`${scope}-invalid-${theme}`} type="text" aria-invalid="true" aria-describedby={`${scope}-error-${theme}`} /><FieldError id={`${scope}-error-${theme}`}>Enter a project name.</FieldError></div></section>)}</div>;
}

const Playground: Scenario<FieldMessageProps> = { render: args => <Example {...args} /> };
const Inline: Scenario<FieldMessageProps> = { args: { as: 'span' }, render: args => <Example {...args} /> };

const BothThemes: Scenario<FieldMessageProps> = { render: () => <ThemeComparison /> };

export const component = FieldError;
export const defaults: FieldMessageProps = { id: 'project-error', children: 'Enter a project name.', as: 'p' };
export const scenarios = { Playground, Inline, BothThemes };
