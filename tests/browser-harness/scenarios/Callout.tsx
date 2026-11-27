import { Callout, type CalloutProps } from '../../../src/components/callout/Callout';
import {
  CalloutExample,
  CalloutOverrides,
  CalloutTones,
  NarrowCallout,
  PublishingWarning,
} from '../../../src/components/callout/stories/callout-examples';
import type { Scenario } from '../gallery/types';
import '../../../src/components/callout/callout.css';
import '../../../src/components/callout/stories/callout.stories.css';
import '../../../src/components/button/button.css';
import '../../../src/components/icon/icon.css';

const Playground: Scenario<CalloutProps> = {};
const Composition: Scenario<CalloutProps> = { render: () => <CalloutExample /> };
const Tones: Scenario<CalloutProps> = { render: () => <CalloutTones /> };
const Action: Scenario<CalloutProps> = { render: () => <PublishingWarning /> };
const Narrow: Scenario<CalloutProps> = { render: () => <NarrowCallout /> };
const Overrides: Scenario<CalloutProps> = { render: () => <CalloutOverrides /> };
const BodyOnly: Scenario<CalloutProps> = { args: { children: 'Drafts are visible to editors.' } };
const Nested: Scenario<CalloutProps> = {
  render: () => (
    <section data-theme="corporate">
      <Callout>Outer guidance</Callout>
      <section data-theme="luna">
        <Callout>Nested guidance</Callout>
      </section>
    </section>
  ),
};
export const component = Callout;
export const defaults: CalloutProps = { children: 'Your workspace is ready.' };
export const scenarios = {
  Playground,
  Composition,
  Tones,
  Action,
  Narrow,
  Overrides,
  BodyOnly,
  Nested,
};
