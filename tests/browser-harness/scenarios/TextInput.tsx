import { TextInput } from '../../../src/components/text-input/TextInput';
import type { TextInputProps } from '../../../src/components/text-input/TextInput';
import type { Scenario } from '../gallery/types';
import '../../../src/components/text-input/text-input.css';
import '../../../src/components/field/field.css';

const Playground: Scenario<TextInputProps> = {  };

const Invalid: Scenario<TextInputProps> = { args: { error: 'Enter a project name.', required: true } };

const KeyboardAndReadOnly: Scenario<TextInputProps> = { render: () => <div className="stack"><TextInput label="Read-only project" readOnly defaultValue="Website refresh" /><TextInput label="Disabled project" disabled defaultValue="Unavailable" /><TextInput label="Editable project" /></div> };

const Descriptions: Scenario<TextInputProps> = { render: () => <div className="stack"><p id="website-context">Project settings.</p><TextInput id="website" label="Website" prefix="https://" suffix="/" aria-describedby="website-context" helperText="Enter a domain." error="Enter a website." /></div> };

const LongLabels: Scenario<TextInputProps> = { render: () => <div style={{ maxWidth: '320px' }}><TextInput label="Enter the website where your project and its shared components will live" prefix="https://" suffix=".example.test" defaultValue="projects" helperText="Labels, context, and descriptions wrap with enlarged text in narrow containers." /></div> };

export const component = TextInput;
export const defaults: TextInputProps = { label: 'Project name', placeholder: 'Enter a project name', helperText: 'Use a short, descriptive name.' };
export const scenarios = { KeyboardAndReadOnly, LongLabels, Invalid, Descriptions, Playground };
