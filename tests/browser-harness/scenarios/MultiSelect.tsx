import {
  MultiSelect,
  type MultiSelectProps,
} from '../../../src/components/multi-select/MultiSelect';
import { Select } from '../../../src/components/select/Select';
import {
  ControlledTopics,
  MultiSelectExample,
  MultiSelectForm,
  topicOptions,
} from '../../../src/components/multi-select/stories/multi-select-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/field/field.css';
import '../../../src/components/select/select.css';
import '../../../src/components/icon/icon.css';
import '../../../src/components/multi-select/multi-select.css';
import '../../../src/components/multi-select/stories/multi-select.stories.css';

const Playground: Scenario<MultiSelectProps> = {};
const ChevronComparison: Scenario<MultiSelectProps> = {
  render: () => (
    <div>
      {(['small', 'medium', 'large'] as const).map((size) => (
        <div key={size}>
          <Select label={`Single ${size}`} size={size}>
            <option>Example</option>
          </Select>
          <MultiSelect label={`Multiple ${size}`} size={size} options={topicOptions} />
        </div>
      ))}
    </div>
  ),
};
const Composition: Scenario<MultiSelectProps> = { render: () => <MultiSelectExample /> };
const Form: Scenario<MultiSelectProps> = { render: () => <MultiSelectForm /> };
const Controlled: Scenario<MultiSelectProps> = { render: () => <ControlledTopics /> };
const Limit: Scenario<MultiSelectProps> = { args: { maxSelections: 1, defaultValue: ['react'] } };
const Required: Scenario<MultiSelectProps> = {
  render: () => (
    <form>
      <MultiSelect
        label="Article topics"
        options={topicOptions}
        name="topics"
        minSelections={2}
        required
      />
      <button type="submit">Submit</button>
    </form>
  ),
};
const Loading: Scenario<MultiSelectProps> = { args: { loading: true, options: [] } };
const Disabled: Scenario<MultiSelectProps> = { args: { disabled: true, defaultValue: ['react'] } };
const LongOptions: Scenario<MultiSelectProps> = {
  args: {
    defaultValue: ['long'],
    options: [
      { value: 'long', label: 'LongUnbrokenTopicNameToDemonstrateWrappingInNarrowLayouts' },
      { value: 'other', label: 'AnotherLongTopicNameForPopupReflowVerification' },
    ],
  },
};
const LongList: Scenario<MultiSelectProps> = {
  args: {
    options: Array.from({ length: 30 }, (_, index) => ({
      value: `topic-${index}`,
      label: `Topic ${index + 1}`,
    })),
  },
};
const DisabledFieldset: Scenario<MultiSelectProps> = {
  render: () => (
    <form aria-label="Disabled editor">
      <fieldset disabled>
        <MultiSelect
          label="Article topics"
          options={topicOptions}
          name="topics"
          defaultValue={['react']}
        />
      </fieldset>
    </form>
  ),
};
export const component = MultiSelect;
export const defaults: MultiSelectProps = { label: 'Article topics', options: topicOptions };
export const scenarios = {
  Playground,
  ChevronComparison,
  Composition,
  Form,
  Controlled,
  Limit,
  Required,
  Loading,
  Disabled,
  LongOptions,
  LongList,
  DisabledFieldset,
};
