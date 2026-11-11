import { Select } from '../../../src/components/select/Select';
import type { SelectProps } from '../../../src/components/select/Select';
import type { Scenario } from '../gallery/types';
import '../../../src/components/select/select.css';
import '../../../src/components/field/field.css';
import '../../../src/components/icon/icon.css';

/**
 * Synthetic workspace choices, including one unavailable option.
 **/
function Options() {
  return <><option value="personal">Personal</option><option value="design">Design team</option><option value="engineering">Engineering</option><option value="archived" disabled>Archived</option></>;
}

const Selected: Scenario<SelectProps> = { args: { defaultValue: 'personal' } };

const Invalid: Scenario<SelectProps> = { args: { error: 'Select a workspace.', required: true } };

const GroupsAndDescriptions: Scenario<SelectProps> = { render: () => <div className="stack"><p id="select-context">Only active workspaces can be selected.</p><Select id="grouped-workspace" label="Workspace" aria-describedby="select-context" helperText="Choose a team." error="Review your selection." defaultValue="personal"><optgroup label="Private"><option value="personal">Personal</option></optgroup><optgroup label="Teams"><option value="design">Design team</option><option disabled value="archived">Archived</option></optgroup></Select></div> };

const LongLabels: Scenario<SelectProps> = { render: () => <div style={{ maxWidth: '320px' }}><Select label="Choose the workspace where your project and its shared components will live" helperText="Labels and descriptions wrap in narrow containers and with enlarged text." placeholder="Choose a workspace"><option value="long">WorkspaceWithAnExtremelyLongUnbrokenNameThatMustNotWidenThePage</option></Select></div> };

export const component = Select;
export const defaults: SelectProps = { label: 'Workspace', placeholder: 'Choose a workspace', helperText: 'Choose where your project lives.', children: <Options /> };
export const scenarios = { LongLabels, Invalid, GroupsAndDescriptions, Selected };
