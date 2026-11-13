import { Combobox, type ComboboxProps } from '../../../src/components/combobox/Combobox';
import { baseCombobox, regions, ComboboxExample, ComboboxForm, ControlledCombobox } from '../../../src/components/combobox/stories/combobox-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/combobox/combobox.css';
import '../../../src/components/combobox/stories/combobox.stories.css';
import '../../../src/components/field/field.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/spinner/spinner.css';

const Playground: Scenario<ComboboxProps> = {};
const Composition: Scenario<ComboboxProps> = { render: () => <ComboboxExample /> };
const Form: Scenario<ComboboxProps> = { render: () => <ComboboxForm required /> };
const Controlled: Scenario<ComboboxProps> = { render: () => <ControlledCombobox /> };
const Loading: Scenario<ComboboxProps> = { args: { loading: true } };
const DisabledOptions: Scenario<ComboboxProps> = { args: { options: [...regions, { value: 'closed', label: 'Unavailable region', disabled: true }] } };
const LongLabels: Scenario<ComboboxProps> = { args: { options: [{ value: 'long', label: 'United Kingdom — Northern regional operations and international customer support headquarters' }] } };
export const component = Combobox;
export const defaults: ComboboxProps = baseCombobox;
export const scenarios = { Playground, Composition, Form, Controlled, Loading, DisabledOptions, LongLabels };
